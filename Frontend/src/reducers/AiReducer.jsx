
import {
    AiImageReducer
    
}from '../actions/types'

const initialState = {
    AiGeneratedImage : null,
    
};


export default function (state = initialState, action) {

  
    const { type, payload} = action;
    
        //console.log('fired')
    switch (type) {
        
        case AiImageReducer:
            return {
                ...state,
                AiGeneratedImage : payload
            }
        
        default:
            return state
    }

   
}