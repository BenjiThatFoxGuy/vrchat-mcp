import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import type { AnySchema } from '@modelcontextprotocol/sdk/server/zod-compat'
import { VRChatClient } from '../VRChatClient'
import { z } from 'zod'

const createInstanceParams: Record<string, AnySchema> = {
  worldId: z.string().describe('The world ID to create an instance of'),
  type: z.enum(['public', 'hidden', 'friends', 'private', 'group']).describe('The type of instance to create'),
  region: z.enum(['us', 'use', 'eu', 'jp', 'unknown']).describe('The region of the instance'),
  ownerId: z.string().optional().describe('The owner ID for the instance (group or user)'),
  roleIds: z.array(z.string()).optional().describe('Group roleIds that are allowed to join if type is "group" and groupAccessType is "member"'),
  groupAccessType: z.enum(['members', 'plus', 'public']).optional().describe('The group access type for group instances'),
  queueEnabled: z.boolean().optional().describe('Whether the instance has a queue'),
  closedAt: z.string().optional().describe('The time after which users won\'t be allowed to join the instance'),
  canRequestInvite: z.boolean().optional().describe('Only applies to invite type instances to make them invite+'),
  hardClose: z.boolean().optional().describe('Whether the closing of the instance should kick people'),
  inviteOnly: z.boolean().optional().describe('Whether the instance is invite only'),
}

const getInstanceByShortNameParams: Record<string, AnySchema> = {
  shortName: z.string().min(1).describe('The short name of the instance (e.g. "abc123~hidden~friends~g")'),
}

export const createInstancesTools = (server: McpServer, vrchatClient: VRChatClient) => {
  const toolServer = server as any
  // @ts-ignore: MCP tool overloads are too strict for this migration boundary
  toolServer.tool(
    'vrchat_get_instance',
    'Get information about a specific instance. Note: Detailed information about instance members is only available if you are the instance owner.',
    {
      worldId: z.string().describe('Must be a valid world ID.'),
      instanceId: z.string().describe('Must be a valid instance ID.'),
    },
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const instance = await vrchatClient.vrchat.getInstance({
          path: {
            worldId: params.worldId,
            instanceId: params.instanceId,
          }
        })
        return {
          content: [{ type: 'text', text: JSON.stringify(instance.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to get instance: ' + error }] }
      }
    }
  )

  // @ts-ignore: MCP tool overloads are too strict for this migration boundary
  toolServer.tool(
    'vrchat_create_instance',
    'Create a new instance of a world.',
    createInstanceParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const instance = await vrchatClient.vrchat.createInstance({
          body: {
            worldId: params.worldId,
            type: params.type,
            region: params.region,
            ownerId: params.ownerId,
            roleIds: params.roleIds,
            groupAccessType: params.groupAccessType,
            queueEnabled: params.queueEnabled,
            closedAt: params.closedAt ? new Date(params.closedAt) : undefined,
            canRequestInvite: params.canRequestInvite,
            hardClose: params.hardClose,
            inviteOnly: params.inviteOnly,
          }
        })
        return {
          content: [{ type: 'text', text: JSON.stringify(instance.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to create instance: ' + error }] }
      }
    }
  )

  // @ts-ignore: MCP tool overloads are too strict for this migration boundary
  toolServer.tool(
    'vrchat_get_instance_by_short_name',
    'Get an instance by its short name (e.g. "abc123~hidden~friends~g").',
    getInstanceByShortNameParams as any,
    async (params: any) => {
      try {
        await vrchatClient.auth()
        const instance = await vrchatClient.vrchat.getInstanceByShortName({
          path: { shortName: params.shortName }
        })
        return {
          content: [{ type: 'text', text: JSON.stringify(instance.data, null, 2) }]
        }
      } catch (error) {
        return { content: [{ type: 'text', text: 'Failed to get instance by short name: ' + error }] }
      }
    }
  )
}
