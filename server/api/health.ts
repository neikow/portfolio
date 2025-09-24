export default defineEventHandler(() => {
  return { status: 'ok', uptime: process.uptime(), timestamp: Date.now() }
})
