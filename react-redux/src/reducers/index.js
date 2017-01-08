import { combineReducers } from 'redux'
import BannerReducer from './banner'

const reducers = {
  banner: BannerReducer
}

export default combineReducers(reducers)
