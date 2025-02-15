import {combineReducers} from 'redux'
import auth from './auth'
import chatReducer from './chatReducer';
import ProfileReducer from './profile';
import AiReducer from './aiReducer';
//combineReduxers creates a single object called 'rootReducer'
export default combineReducers({
    auth,
    AiReducer,
    chatReducer,
    ProfileReducer
});