import oauth2 from 'simple-oauth2'

const client = oauth2.create({
  client: {
    id: process.env.AUTH_CLIENT_ID,
    secret: process.env.AUTH_CLIENT_SECRET,
  },
  auth: {
    tokenHost: process.env.TOKEN_HOST,
    tokenPath: process.env.TOKEN_PATH,
    authorizePath: process.env.AUTHORIZE_PATH,
  },
})

export default () => {
  return async (ctx, next) => {
    const code = ctx.query.code
    const options = { code }

    try {
      const result = await client.authorizationCode.getToken(options)
      const { token } = client.accessToken.create(result)
      ctx.cookies.set('access_token', token.access_token, {
        domain: process.domain,
        signed: false,
        httpOnly: true,
        // TODO: set to true in production & staging
        // secure: true,
      })
      ctx.redirect(process.env.APP_URL)
    } catch (e) {
      console.error(e)
    }
  }
}
