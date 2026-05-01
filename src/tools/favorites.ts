import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import type { AnySchema } from '@modelcontextprotocol/sdk/server/zod-compat'
import { VRChatClient } from '../VRChatClient'
import { z } from 'zod'

const favoriteGroupsParams: Record<string, AnySchema> = {
  n: z.number().min(1).max(100).optional().describe('Number of favorite groups to return, from 1 to 100'),
  offset: z.number().min(0).optional().describe('Offset for pagination, minimum 0'),
  ownerId: z.string().optional().describe('The owner ID of the favorite groups to list'),
}

const favoritesListParams: Record<string, AnySchema> = {
  n: z.number().min(1).max(100).optional().describe('Number of favorites to return, from 1 to 100'),
  offset: z.number().min(0).optional().describe('Offset for pagination, minimum 0'),
  type: z.enum(['world', 'friend', 'avatar']).optional().describe('Filter favorites by type'),
  tag: z.string().optional().describe('Filter favorites by tag/group'),
}

const addFavoriteParams: Record<string, AnySchema> = {
  type: z.enum(['world', 'friend', 'avatar']).describe('The type of favorite to add'),
  favoriteId: z.string().describe('The ID of the item to add as a favorite'),
  tags: z.array(z.string()).describe('Tags/groups to assign this favorite to'),
}

const removeFavoriteParams: Record<string, AnySchema> = {
  type: z.enum(['world', 'friend', 'avatar']).describe('The type of favorite to remove'),
  favoriteId: z.string().describe('The ID of the item to remove from favorites'),
}

export const createFavoritesTools = (server: McpServer, vrchatClient: VRChatClient) => {
  const toolServer = server as any
  // @ts-ignore: MCP tool overloads are too strict for this migration boundary
  toolServer.tool(
    'vrchat_list_favorite_groups',
    'List all favorite groups for the current user.',
    favoriteGroupsParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.getFavoriteGroups({
          query: {
            n: params.n,
            offset: params.offset,
            ownerId: params.ownerId,
          }
        })
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to list favorite groups: ' + error }] }
      }
    }
  )

  // @ts-ignore: MCP tool overloads are too strict for this migration boundary
  toolServer.tool(
    'vrchat_list_favorites',
    'List all favorites for the current user.',
    favoritesListParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.getFavorites({
          query: {
            n: params.n,
            offset: params.offset,
            type: params.type,
            tag: params.tag,
          }
        })
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to list favorites: ' + error }] }
      }
    }
  )

  // @ts-ignore: MCP tool overloads are too strict for this migration boundary
  toolServer.tool(
    'vrchat_add_favorite',
    'Add a new favorite (world, friend, or avatar) to your favorites list.',
    addFavoriteParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.addFavorite({
          body: {
            type: params.type,
            favoriteId: params.favoriteId,
            tags: params.tags,
          }
        })
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to add favorite: ' + error }] }
      }
    }
  )

  // @ts-ignore: MCP tool overloads are too strict for this migration boundary
  toolServer.tool(
    'vrchat_remove_favorite',
    'Remove a favorite (world, friend, or avatar) from your favorites list.',
    removeFavoriteParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.removeFavorite({
          body: {
            type: params.type,
            favoriteId: params.favoriteId,
          }
        })
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to remove favorite: ' + error }] }
      }
    }
  )

  // @ts-ignore: MCP tool overloads are too strict for this migration boundary
  toolServer.tool(
    'vrchat_get_favorited_avatars',
    'List favorited avatars.',
    { n: z.number().min(1).max(100).optional().describe('Number of results to return') } as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.getFavoritedAvatars({
          query: { n: params.n }
        })
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to get favorited avatars: ' + error }] }
      }
    }
  )
}
