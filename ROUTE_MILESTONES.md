# VRChat MCP Route Milestones

This file tracks currently supported MCP tool routes and routes that are not yet implemented, so we can use it as a milestone checklist.

## Supported routes (implemented)

These routes are currently exposed by the MCP server in `src/tools/*`.

- `vrchat_get_current_user`
- `vrchat_search_users`
- `vrchat_get_user`
- `vrchat_send_friend_request`
- `vrchat_get_friends_list`
- `vrchat_get_friend_status`
- `vrchat_unfriend`
- `vrchat_get_mutual_friends`
- `vrchat_select_avatar`
- `vrchat_search_avatars`
- `vrchat_list_favorited_worlds`
- `vrchat_search_worlds`
- `vrchat_get_instance`
- `vrchat_create_instance`
- `vrchat_join_group`
- `vrchat_search_groups`
- `vrchat_list_favorite_groups`
- `vrchat_list_favorites`
- `vrchat_add_favorite`
- `vrchat_remove_favorite`
- `vrchat_get_favorited_avatars`
- `vrchat_list_invite_messages`
- `vrchat_request_invite`
- `vrchat_get_invite_message`
- `vrchat_list_notifications`
- `vrchat_get_notification`
- `vrchat_get_world`
- `vrchat_list_active_worlds`
- `vrchat_list_recent_worlds`
- `vrchat_get_instance_by_short_name`
- `vrchat_get_group`
- `vrchat_leave_group`

## Unsupported routes (yet)

These are high-value routes exposed by the installed `vrchat@2.21.7` SDK that are not currently wrapped in MCP tools.

### User / social
- `vrchat_get_blocked_groups` (list blocked groups)
- `vrchat_get_user_notes` (fetch notes attached to a user)
- `vrchat_get_user_inventory_item` (user inventory item lookup)
- `vrchat_get_user_groups` / `vrchat_get_invited_groups` / `vrchat_get_user_group_requests`
- `vrchat_get_user_all_group_permissions`
- `vrchat_get_user_feedback`
- `vrchat_get_user_credits_eligible`

### Friend / social
- `vrchat_delete_friend_request`
- `vrchat_get_friend_status` (already supported)
- `vrchat_get_mutual_groups`
- `vrchat_get_mutuals`

### Favorites
- `vrchat_get_favorite_group` / `vrchat_update_favorite_group`
- `vrchat_clear_favorite_group`

### Notifications / invites
- `vrchat_clear_notifications`
- `vrchat_mark_notification_as_read`
- `vrchat_respond_invite`
- `vrchat_invite_user`
- `vrchat_get_invite_message` (already supported)

### Worlds / instances
- `vrchat_get_world_metadata`
- `vrchat_get_world_publish_status`

### Groups
- `vrchat_get_group_members`
- `vrchat_get_group_invites`
- `vrchat_get_group_announcements`
- `vrchat_get_group_roles`
- `vrchat_get_group_transferability`

### Account / misc
- `vrchat_get_balance`
- `vrchat_get_economy_account`
- `vrchat_get_steam_transactions`
- `vrchat_get_system_time`
- `vrchat_get_tilia_status`

## Notes

- Supported routes are based on the current MCP tool registration in `src/main.ts` and `src/tools/*`.
- Unsupported routes are drawn from SDK endpoints visible in `node_modules/vrchat/dist/index.mjs` and `client-JjkmMGls.d.ts`.
- This file is intended to stay updated as we add more MCP tool wrappers.
