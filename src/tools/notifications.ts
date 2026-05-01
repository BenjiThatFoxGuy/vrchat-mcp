import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import type { AnySchema } from '@modelcontextprotocol/sdk/server/zod-compat'
import { VRChatClient } from '../VRChatClient'
import { z } from 'zod'

const listNotificationsParams: Record<string, AnySchema> = {
  type: z.enum(['friendRequest', 'invite', 'requestInvite', 'vote', 'transferOwnership', 'groupJoined', 'groupRequest', 'groupInvisible', 'groupVisible', 'groupMemberSet', 'groupRoleChange', 'groupAnnouncement', 'groupBan', 'groupKick', 'groupTransferOwnership', 'instanceQueueReady', 'instanceQueuePosition', 'instanceQueueDefault', 'report', 'moderationReport', 'moderationReview', 'ticket']).optional().describe('Filter notifications by type'),
  sent: z.boolean().optional().describe('Filter notifications by whether they have been sent'),
  hidden: z.boolean().optional().describe('Filter notifications by whether they are hidden'),
  after: z.string().optional().describe('Only return notifications after this date (ISO 8601 format)'),
  n: z.number().min(1).max(100).optional().describe('Number of notifications to return, from 1 to 100'),
  offset: z.number().min(0).optional().describe('Offset for pagination, minimum 0'),
}

export const createNotificationsTools = (server: McpServer, vrchatClient: VRChatClient) => {
  const toolServer = server as any
  // @ts-ignore: MCP tool overloads are too strict for this migration boundary
  toolServer.tool(
    'vrchat_list_notifications',
    'List all notifications for the current user.',
    listNotificationsParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.getNotifications({
          query: {
            type: params.type,
            sent: params.sent,
            hidden: params.hidden,
            after: params.after,
            n: params.n,
            offset: params.offset,
          }
        })
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to list notifications: ' + error }] }
      }
    }
  )
}
