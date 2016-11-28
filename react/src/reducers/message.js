export default (state = 'Default message for the banner', action) => {
  switch (action.type) {
    case 'UPDATE_MESSAGE':
      return action.payload

    default:
      return state
  }
}
