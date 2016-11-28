import { combineReducers } from 'redux'
import MessageReducer from './message'

const reducers = {
  message: MessageReducer
}

export default combineReducers(reducers)
