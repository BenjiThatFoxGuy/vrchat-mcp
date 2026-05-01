import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import type { AnySchema } from '@modelcontextprotocol/sdk/server/zod-compat'
import { VRChatClient } from '../VRChatClient'
import { z } from 'zod'

const sendFriendRequestSchema: any = z.object({
  userId: z.string().min(1),
})

const getFriendsListSchema: any = z.object({
  offset: z.number().min(0).optional(),
  n: z.number().min(1).max(100).optional(),
  offline: z.boolean().optional(),
})

const sendFriendRequestToolConfig: any = {
  title: 'Send a friend request to another user.',
  inputSchema: sendFriendRequestSchema,
}

const getFriendsListToolConfig: any = {
  title: 'Retrieve a list of VRChat friend information.',
  description: 'The following information can be retrieved:\n' +
    '- "bio"\n' +
    '- "bioLinks"\n' +
    '- "currentAvatarImageUrl"\n' +
    '- "currentAvatarThumbnailImageUrl"\n' +
    '- "currentAvatarTags"\n' +
    '- "developerType"\n' +
    '- "displayName"\n' +
    '- "fallbackAvatar"\n' +
    '- "id"\n' +
    '- "isFriend"\n' +
    '- "last_platform"\n' +
    '- "last_login"\n' +
    '- "profilePicOverride"\n' +
    '- "pronouns"\n' +
    '- "status"\n' +
    '- "statusDescription"\n' +
    '- "tags"\n' +
    '- "userIcon"\n' +
    '- "location"\n' +
    '- "friendKey"',
  inputSchema: getFriendsListSchema,
}

export const createFriendsTools = (server: McpServer, vrchatClient: VRChatClient) => {
  const toolServer = server as any
  toolServer.tool(
    'vrchat_send_friend_request',
    sendFriendRequestToolConfig,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.friend({ path: { userId: params.userId } })
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to send friend request: ' + error }] }
      }
    }
  )

  toolServer.tool(
    'vrchat_get_friends_list',
    getFriendsListToolConfig,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.getFriends({
          query: {
            offset: params.offset || 0,
            n: params.n || 10,
            offline: params.offline || false,
          }
        })
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to retrieve friends: ' + error }] }
      }
    }
  )
}
