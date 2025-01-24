import { useEffect } from 'react';
import Notifier from '../Components/notifier'
import {
    ChatListReducer,
    GroupListReducer,
    ChatLogReducer,
    CommunityListReducer,
    PendingRequestReducer,
    RequestsListReducer,
    MemberListReducer,
    RejectListReducer,
    BannedListReducer,
    SuggestedListReducer,
    NotePadlogsReducer,
    NoteChatLogReducer,
}from '../actions/types'

const initialState = {
    NotePadlogs : [],
    SuggestedList : [],
    ChatList : [],
    GroupList : [],
    CommunityList : [],
    ChatLog : [],
    PendingRequest : [],
    RequestList :[],
    MemeberList : [],
    RejectList : [],
    BannedList : [],
};

export default function (state = initialState, action) {

  
    const { type, payload} = action;
    
        //console.log('fired')
    switch (type) {
        
        case ChatLogReducer:
            //var chatlogVal = JSON.parse(payload)
            //console.log(payload,typeof(payload))
            //state.ChatLog.push(payload)
            return {
                ...state,
                ChatLog : payload
            }
        case GroupListReducer:
            return {
                ...state,
                GroupList : payload
            }
        case CommunityListReducer:
            var Communitylistval = JSON.parse(payload)
            return {
                ...state,
                CommunityList : Communitylistval
            }
        case ChatListReducer:
            return {
                ...state,
                ChatList : payload
            }
        case PendingRequestReducer:
            return {
                ...state,
                PendingRequest : payload
            }
        case RequestsListReducer:
            return {
                ...state,
                RequestList : payload
            }
        case MemberListReducer:
            return {
                ...state,
                MemeberList : payload
            }
        case RejectListReducer:
            return {
                ...state,
                RejectList : payload
            }    
        case BannedListReducer:
            return {
                ...state,
                BannedList : payload
            }
        case SuggestedListReducer:
            return {
                ...state,
                SuggestedList : payload
            }
        case NotePadlogsReducer:
            return {
                ...state,
                NotePadlogs : payload
            }  
        case 'ClearLists':
            return {
                ...state,
                GroupList : [],
                PendingRequest : [],
                RequestList :[],
                MemeberList : [],
                RejectList : [],
                BannedList : [],
                SuggestedList : [],
                NotePadlogs : [],
                ChatList : [],
                CommunityList : [],
                ChatLog : [],    
            }        
        default:
            return state
    }

   
}