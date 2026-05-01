import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import type { AnySchema } from '@modelcontextprotocol/sdk/server/zod-compat'
import { VRChatClient } from '../VRChatClient'
import { z } from 'zod'

const joinGroupParams: Record<string, AnySchema> = {
  groupId: z.string().min(1).describe('The group ID to join'),
}

const searchGroupsParams: Record<string, AnySchema> = {
  query: z.string().optional().describe('Search query string to find groups by name or shortCode'),
  offset: z.number().min(0).optional().describe('Offset for pagination, minimum 0'),
  n: z.number().min(1).max(100).optional().describe('Number of groups to return, from 1 to 100'),
}

const getGroupParams: Record<string, AnySchema> = {
  groupId: z.string().min(1).describe('The VRChat group ID to look up'),
}

const leaveGroupParams: Record<string, AnySchema> = {
  groupId: z.string().min(1).describe('The group ID to leave'),
}

export const createGroupsTools = (server: McpServer, vrchatClient: VRChatClient) => {
  const toolServer = server as any
  // @ts-ignore: MCP tool overloads are too strict for this migration boundary
  toolServer.tool(
    'vrchat_join_group',
    'Join a group by its ID.',
    joinGroupParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.joinGroup({ path: { groupId: params.groupId } })
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to join group: ' + error }] }
      }
    }
  )

  // @ts-ignore: MCP tool overloads are too strict for this migration boundary
  toolServer.tool(
    'vrchat_search_groups',
    'Search for groups by name or other filters.',
    searchGroupsParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.searchGroups({
          query: {
            query: params.query,
            offset: params.offset,
            n: params.n,
          }
        })
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to search groups: ' + error }] }
      }
    }
  )

  // @ts-ignore: MCP tool overloads are too strict for this migration boundary
  toolServer.tool(
    'vrchat_get_group',
    'Get information about a group by its ID.',
    getGroupParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.getGroup({
          path: { groupId: params.groupId }
        })
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to get group: ' + error }] }
      }
    }
  )

  // @ts-ignore: MCP tool overloads are too strict for this migration boundary
  toolServer.tool(
    'vrchat_leave_group',
    'Leave a group by its ID.',
    leaveGroupParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.leaveGroup({ path: { groupId: params.groupId } })
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to leave group: ' + error }] }
      }
    }
  )
}
