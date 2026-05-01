import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import type { AnySchema } from '@modelcontextprotocol/sdk/server/zod-compat'
import { VRChatClient } from '../VRChatClient'
import { z } from 'zod'

const selectAvatarParams: Record<string, AnySchema> = {
  avatarId: z.string().describe('The ID of the avatar to select'),
}

const searchAvatarsParams: Record<string, AnySchema> = {
  featured: z.boolean().optional(),
  sort: z.enum(['popularity', 'heat', 'trust', 'shuffle', 'random', 'favorites', 'reportScore', 'reportCount', 'publicationDate', 'labsPublicationDate', 'created', '_created_at', 'updated', '_updated_at', 'order', 'relevance', 'magic', 'name']).optional(),
  user: z.enum(['me']).optional(),
  userId: z.string().optional(),
  n: z.number().min(1).max(100).optional(),
  order: z.enum(['ascending', 'descending']).optional(),
  offset: z.number().min(0).optional(),
  tag: z.string().optional(),
  notag: z.string().optional(),
  releaseStatus: z.enum(['public', 'private', 'hidden', 'all']).optional(),
  maxUnityVersion: z.string().optional(),
  minUnityVersion: z.string().optional(),
  platform: z.string().optional(),
}

export const createAvatarsTools = (server: McpServer, vrchatClient: VRChatClient) => {
  const toolServer = server as any
  // @ts-ignore: MCP tool overloads are too strict for this migration boundary
  toolServer.tool(
    'vrchat_select_avatar',
    'Select and switch to a specific avatar by its ID.',
    selectAvatarParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.selectAvatar({ path: { avatarId: params.avatarId } })
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to select avatar: ' + error }] }
      }
    }
  )

  // @ts-ignore: MCP tool overloads are too strict for this migration boundary
  toolServer.tool(
    'vrchat_search_avatars',
    'Search and list avatars by query filters. You can only search your own or featured avatars. It is not possible as a normal user to search other people\'s avatars.',
    searchAvatarsParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.searchAvatars({
          query: {
            featured: params.featured,
            sort: params.sort,
            user: params.user,
            userId: params.userId,
            n: params.n,
            order: params.order,
            offset: params.offset,
            tag: params.tag,
            notag: params.notag,
            releaseStatus: params.releaseStatus,
            maxUnityVersion: params.maxUnityVersion,
            minUnityVersion: params.minUnityVersion,
            platform: params.platform,
          }
        })
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to search avatars: ' + error }] }
      }
    }
  )
}
