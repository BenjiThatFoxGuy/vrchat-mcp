interface VRChatResponse {
  data?: unknown
  error?: unknown
}

// The VRChat SDK resolves (rather than throws) on a non-OK response, leaving
// `data` undefined. `JSON.stringify(undefined)` returns undefined rather than a
// string, which produced a `{ type: 'text', text: undefined }` block that failed
// MCP's content-block validation instead of reporting the API error.
export const toolResult = (response: VRChatResponse, failureMessage: string) => {
  if (response.error !== undefined) {
    return toolError(`${failureMessage}: ${describeError(response.error)}`)
  }

  return { content: [{ type: 'text' as const, text: stringify(response.data) }] }
}

export const toolError = (message: string) => ({
  content: [{ type: 'text' as const, text: message }],
  isError: true,
})

const stringify = (value: unknown) => JSON.stringify(value, null, 2) ?? String(value)

// Error subclasses keep `message` non-enumerable, so JSON.stringify would drop
// the only useful part of an SDK error.
const describeError = (error: unknown) =>
  error instanceof Error ? String(error) : stringify(error)
