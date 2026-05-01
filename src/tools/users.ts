import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import type { AnySchema } from '@modelcontextprotocol/sdk/server/zod-compat'
import { VRChatClient } from '../VRChatClient'
import { z } from 'zod'

const searchUsersParams: Record<string, AnySchema> = {
  search: z.string().min(1).describe('Search text to match display names'),
  n: z.number().min(1).max(100).optional().describe('Number of results to return'),
  offset: z.number().min(0).optional().describe('Offset for pagination'),
}

const getUserParams: Record<string, AnySchema> = {
  userId: z.string().min(1).describe('The VRChat user ID to look up'),
}

export const createUsersTools = (server: McpServer, vrchatClient: VRChatClient) => {
  server.tool(
    'vrchat_get_current_user',
    'Retrieve your own VRChat user information',
    {},
    async () => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.getCurrentUser()
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to retrieve user: ' + error }] }
      }
    }
  )

  server.tool(
    'vrchat_search_users',
    'Search for VRChat users by display name text query.',
    searchUsersParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.searchUsers({
          query: {
            search: params.search,
            n: params.n,
            offset: params.offset,
          }
        })
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to search users: ' + error }] }
      }
    }
  )

  server.tool(
    'vrchat_get_user',
    'Fetch public profile information for a VRChat user by ID.',
    getUserParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.getUser({
          path: {
            userId: params.userId,
          }
        })
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to get user info: ' + error }] }
      }
    }
  )
}
