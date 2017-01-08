const messages = [
  'A totally different random message',
  'This message maybe came from an async API call',
  'Wow this is another message',
  'Default message for the banner'
]

export function updateMessage() {
  const message = messages.shift()
  messages.push(message)

  return {
    type: 'UPDATE_MESSAGE',
    payload: message
  }
}
