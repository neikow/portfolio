import { eq } from 'drizzle-orm'
import type { Acquisition } from '#shared/schemas/acquisition'
import { acquisitionsTable } from '#shared/schemas/acquisition'

const CV_SYSTEM_PROMPT = `You are a professional CV/resume writer for Vitaly Lysen, a Full-Stack Software Engineer.
Your task is to generate a tailored, compelling CV based on the provided job description and Vitaly's background.

Guidelines:
- Tailor the CV to highlight the most relevant skills and experiences for the specific role
- Use clear, concise language that matches the requested tone
- Detect the language of the job description and write the CV in that same language
- Structure: Summary, Skills, Experience, Education (keep it clean and ATS-friendly)
- Do NOT invent experiences or skills not present in the provided background
- Format using markdown for readability`

const COLD_EMAIL_SYSTEM_PROMPT = `You are a professional outreach specialist writing on behalf of Vitaly Lysen, a Full-Stack Software Engineer.
Your task is to craft a compelling, personalized cold email or response to a recruiter message.

Guidelines:
- Detect the language of the input and write the email in that same language
- Keep it concise (3-5 short paragraphs max)
- Be genuine, not salesy — show real enthusiasm where appropriate
- Reference specific details from the input to show it's personalized
- End with a clear, low-friction call to action
- Match the requested tone (professional, casual, enthusiastic, or concise)
- Format using plain text (no markdown headers, just clean paragraphs)`

const TONE_DESCRIPTIONS: Record<string, string> = {
  professional: 'formal, polished, and business-appropriate',
  casual: 'friendly, conversational, and approachable',
  enthusiastic: 'energetic, positive, and passionate',
  concise: 'brief, direct, and to the point',
}

function buildUserMessage(acquisition: Acquisition, experiences: string): string {
  const toneDescription = TONE_DESCRIPTIONS[acquisition.tone] || 'professional'
  const typeLabel = acquisition.type === 'cv' ? 'CV/Resume' : 'Cold Email'

  return `Please generate a ${typeLabel} with a ${toneDescription} tone.

## My Background & Experiences
${experiences}

## Input (Job Description / Recruiter Message)
${acquisition.inputContent}

Remember to detect and use the language of the input above.`
}

function formatExperiences(experiences: Array<{
  name: string
  role: string
  company: string
  description: string
  startDate: string
  endDate: string | null
  technologies: string[]
}>): string {
  if (!experiences.length) return 'No experiences available.'

  return experiences.map((exp) => {
    const period = exp.endDate
      ? `${new Date(exp.startDate).getFullYear()} - ${new Date(exp.endDate).getFullYear()}`
      : `${new Date(exp.startDate).getFullYear()} - Present`
    const techs = exp.technologies.length ? `\n  Technologies: ${exp.technologies.map(t => t.split(':')[0]).join(', ')}` : ''
    return `### ${exp.role} at ${exp.company} (${period})
  ${exp.description}${techs}`
  }).join('\n\n')
}

export async function generateAcquisition(id: number): Promise<void> {
  const db = useDatabase()
  const client = useAnthropicClient()

  // Mark as processing
  await db.update(acquisitionsTable)
    .set({ status: 'processing', updatedAt: new Date().toISOString() })
    .where(eq(acquisitionsTable.id, id))

  wsBroadcast(id, { type: 'status', status: 'processing' })

  const [acquisition] = await db.select().from(acquisitionsTable).where(eq(acquisitionsTable.id, id))
  if (!acquisition) {
    wsBroadcast(id, { type: 'error', message: 'Acquisition not found' })
    return
  }

  try {
    // Fetch experiences from DB for context
    const { experiencesTable } = await import('#shared/schemas/experience')
    const experiences = await db.select().from(experiencesTable).orderBy(experiencesTable.startDate)
    const experiencesText = formatExperiences(experiences)

    const systemPrompt = acquisition.type === 'cv' ? CV_SYSTEM_PROMPT : COLD_EMAIL_SYSTEM_PROMPT
    const userMessage = buildUserMessage(acquisition, experiencesText)

    let generatedContent = ''

    // Stream generation with Claude Haiku
    const stream = client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{
        role: 'user', content: userMessage }],
    })

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        generatedContent += chunk.delta.text
        wsBroadcast(id, { type: 'chunk', text: chunk.delta.text })
      }
    }

    // Detect language from the generated content (simple heuristic: first few words)
    // Claude will write in the detected language, we just store 'auto'
    const language = 'auto'

    await db.update(acquisitionsTable)
      .set({
        status: 'done',
        generatedContent,
        language,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(acquisitionsTable.id, id))

    wsBroadcast(id, { type: 'done', generatedContent })
  }
  catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await db.update(acquisitionsTable)
      .set({ status: 'error', errorMessage: message, updatedAt: new Date().toISOString() })
      .where(eq(acquisitionsTable.id, id))

    wsBroadcast(id, { type: 'error', message })
  }
}
