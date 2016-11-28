const messages = [
  'Default message for the banner',
  'A totally different random message',
  'This message maybe came from an async API call',
  'Wow this is another message'
]

export default class MessageService {

  /**
   * Could be an async HTTP call here...
   */
  get() {
    const msg = messages.shift()
    messages.push(msg)
    return msg
  }
}
