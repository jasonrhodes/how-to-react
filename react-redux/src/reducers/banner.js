const defaultBanner = {
  message: 'Default message for the banner',
  buttonText: 'Update message'
}

export default (state = defaultBanner, action) => {
  switch (action.type) {
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        message: action.payload
      }

    default:
      return state
  }
}
