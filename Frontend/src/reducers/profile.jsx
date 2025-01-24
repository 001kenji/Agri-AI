
import {
    PostCommentsReducer,
    ProfileAboutReducer,
    ProfilePostReducer,
    SavedProfilePostReducer,
    FolderListReducer,
    FileListReducer,
    ProfileAccountReducer,
    SelectedPageReducer
    
}from '../actions/types'

const initialState = {
    ProfileAbout : null,
    SelectedPage : null,
    ProfilePost : [],
    PostComments : [],
    SavedProfilePost : [],
    FolderList : [],
    FileList : [],
    ProfileAccount : {
        'AccountEmail' : '',
        'AccountID' : '',
        'AccountName' : 'Gest',
        'IsOwner' : false,
        'following' : 0,
        'followers' : 0,
        'IsFollowing' : false
    }
};


export default function (state = initialState, action) {

  
    const { type, payload} = action;
    
        //console.log('fired')
    switch (type) {
        
        case ProfileAboutReducer:
            return {
                ...state,
                ProfileAbout : payload
            }
        case ProfilePostReducer:
            return {
                ...state,
                ProfilePost : payload
            }
        case SavedProfilePostReducer:
            return {
                ...state,
                SavedProfilePost: payload
            }
        case PostCommentsReducer:
            return {
                ...state,
                PostComments : payload
            }
        case FolderListReducer:
            return {
                ...state,
                FolderList : payload
            }
        case ProfileAccountReducer:
            // var obj1 = payload
            // var obj2 = state.ProfileAccount
            // for (let key in obj1) {
            //     if (obj2.hasOwnProperty(key)) {
            //         obj2[key] = obj1[key]; // Update the value in obj2
            //     }
            // }
            return {
                ...state,
                ProfileAccount : payload
            }
        case FileListReducer:
            return {
                ...state,
                FileList : payload
            }
        case SelectedPageReducer:
            return {
                ...state,
                SelectedPage : payload
            }
        default:
            return state
    }

   
}