export default defineOAuthGitHubEventHandler({
  config: {
    redirectURL: 'http://localhost:3000/api/auth/github',
    emailRequired: true,
  },
  async onSuccess(event, { user }) {
    const { authorizedEmail } = useRuntimeConfig()

    if (user.email !== authorizedEmail) {
      return sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthorized' }))
    }

    await setUserSession(event, { user })
    return sendRedirect(event, '/dashboard')
  },
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/')
  },
})
