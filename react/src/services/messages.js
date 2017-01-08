const messages = [
  'Default message for the banner',
  'A totally different random message',
  'This message maybe came from an async API call',
  'Wow this is another message'
]

export default {
  get() {
    const message = messages.shift()
    messages.push(message)
    return message
  }
}
