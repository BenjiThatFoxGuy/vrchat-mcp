import { VRChat } from 'vrchat'

interface Arguments {
  username: string
  password?: string
  totpSecret?: string
  authToken?: string
}

export class VRChatClient {
  vrchat: VRChat
  private _authed = false

  constructor({ username, password, totpSecret, authToken }: Arguments) {
    this.vrchat = new VRChat({
      application: {
        name: 'vrchat-mcp',
        version: '0.16.0',
        contact: 'https://github.com/sawa-zen/vrchat-mcp',
      },
      authentication: {
        credentials: {
          username,
          password: password || '',
          ...(totpSecret ? { totpSecret } : {}),
        },
        optimistic: false,
      },
      ...(authToken
        ? {
            client: {
              headers: {
                Cookie: `auth=${authToken}`,
              },
            },
          }
        : {}),
    })

    if (authToken) this._authed = true
  }

  async auth() {
    if (this._authed) return

    try {
      await this.vrchat.getCurrentUser({ throwOnError: true })
    } catch (error) {
      throw new Error('Failed to authenticate: ' + error)
    }

    this._authed = true
  }
}
