import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import type { AnySchema } from '@modelcontextprotocol/sdk/server/zod-compat'
import { VRChatClient } from '../VRChatClient'
import { toolResult, toolError } from '../toolResult'
import { z } from 'zod'

const userIdParams: Record<string, AnySchema> = {
  userId: z.string().min(1).describe('The VRChat user ID'),
}

const getFriendsListParams: Record<string, AnySchema> = {
  offset: z.number().min(0).optional().describe('Offset for pagination, minimum 0'),
  n: z.number().min(1).max(100).optional().describe('Number of friends to return, from 1 to 100'),
  offline: z.boolean().optional().describe('Return offline friends instead of online friends'),
}

const getFriendsListDescription = 'Retrieve a list of VRChat friend information.\n' +
  'The following information can be retrieved:\n' +
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
  '- "friendKey"'

export const createFriendsTools = (server: McpServer, vrchatClient: VRChatClient) => {
  const toolServer = server as any
  toolServer.tool(
    'vrchat_send_friend_request',
    'Send a friend request to another user.',
    userIdParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.friend({ path: { userId: params.userId } })
        return toolResult(response, 'Failed to send friend request')
      } catch (error) {
        return toolError('Failed to send friend request: ' + error)
      }
    }
  )

  toolServer.tool(
    'vrchat_get_friends_list',
    getFriendsListDescription,
    getFriendsListParams as any,
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
        return toolResult(response, 'Failed to retrieve friends')
      } catch (error) {
        return toolError('Failed to retrieve friends: ' + error)
      }
    }
  )

  toolServer.tool(
    'vrchat_get_friend_status',
    'Check the friend status with another user.',
    userIdParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.getFriendStatus({ path: { userId: params.userId } })
        return toolResult(response, 'Failed to retrieve friend status')
      } catch (error) {
        return toolError('Failed to retrieve friend status: ' + error)
      }
    }
  )

  toolServer.tool(
    'vrchat_unfriend',
    'Remove a friend by user ID.',
    userIdParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.unfriend({ path: { userId: params.userId } })
        return toolResult(response, 'Failed to unfriend user')
      } catch (error) {
        return toolError('Failed to unfriend user: ' + error)
      }
    }
  )

  toolServer.tool(
    'vrchat_get_mutual_friends',
    'List mutual friends with another user.',
    userIdParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.getMutualFriends({ path: { userId: params.userId } })
        return toolResult(response, 'Failed to get mutual friends')
      } catch (error) {
        return toolError('Failed to get mutual friends: ' + error)
      }
    }
  )
}
