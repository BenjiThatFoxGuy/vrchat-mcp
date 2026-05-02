import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import type { AnySchema } from '@modelcontextprotocol/sdk/server/zod-compat'
import { VRChatClient } from '../VRChatClient'
import { z } from 'zod'

const listInviteMessagesParams: Record<string, AnySchema> = {
  userId: z.string().describe('The user ID to list invite messages for'),
  messageType: z.enum(['message', 'response', 'request', 'requestResponse']).describe('The type of invite message to list'),
}

const requestInviteParams: Record<string, AnySchema> = {
  userId: z.string().describe('The user ID to request an invite from'),
  requestSlot: z.number().optional().describe('Slot number of the Request Message to use when requesting an invite'),
}

const getInviteMessageParams: Record<string, AnySchema> = {
  userId: z.string().describe('The user ID to get the invite message for'),
  messageType: z.enum(['message', 'response', 'request', 'requestResponse']).describe('The type of invite message'),
  slot: z.number().describe('The slot number of the invite message'),
}

const respondInviteParams: Record<string, AnySchema> = {
  notificationId: z.string().min(1).describe('The notification ID of the invite to respond to'),
  responseSlot: z.number().optional().describe('The slot number of the response message to use'),
}

const inviteUserParams: Record<string, AnySchema> = {
  userId: z.string().min(1).describe('The user ID to invite'),
  worldId: z.string().optional().describe('The world ID to invite the user to'),
  instanceId: z.string().optional().describe('The instance ID to invite the user to'),
}

export const createInvitesTools = (server: McpServer, vrchatClient: VRChatClient) => {
  const toolServer = server as any
  // @ts-ignore: MCP tool overloads are too strict for this migration boundary
  toolServer.tool(
    'vrchat_list_invite_messages',
    'List invite messages for a user.',
    listInviteMessagesParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.getInviteMessages({
          path: {
            userId: params.userId,
            messageType: params.messageType,
          }
        })
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to list invite messages: ' + error }] }
      }
    }
  )

  // @ts-ignore: MCP tool overloads are too strict for this migration boundary
  toolServer.tool(
    'vrchat_request_invite',
    'Request an invite to a user\'s instance.',
    requestInviteParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.requestInvite({
          path: {
            userId: params.userId,
          },
          body: {
            requestSlot: params.requestSlot,
          }
        })
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to request invite: ' + error }] }
      }
    }
  )

  // @ts-ignore: MCP tool overloads are too strict for this migration boundary
  toolServer.tool(
    'vrchat_get_invite_message',
    'Get a specific invite message for a user.',
    getInviteMessageParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.getInviteMessage({
          path: {
            userId: params.userId,
            messageType: params.messageType,
            slot: params.slot,
          }
        })
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to get invite message: ' + error }] }
      }
    }
  )

  // @ts-ignore: MCP tool overloads are too strict for this migration boundary
  toolServer.tool(
    'vrchat_respond_invite',
    'Respond to an invite or invite request.',
    respondInviteParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.respondInvite({
          path: { notificationId: params.notificationId },
          body: { responseSlot: params.responseSlot }
        })
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to respond to invite: ' + error }] }
      }
    }
  )

  // @ts-ignore: MCP tool overloads are too strict for this migration boundary
  toolServer.tool(
    'vrchat_invite_user',
    'Send an invite to a user to join your current instance.',
    inviteUserParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const response = await vrchatClient.vrchat.inviteUser({
          path: { userId: params.userId },
          body: {
            worldId: params.worldId,
            instanceId: params.instanceId,
          }
        })
        return {
          content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to invite user: ' + error }] }
      }
    }
  )
}
