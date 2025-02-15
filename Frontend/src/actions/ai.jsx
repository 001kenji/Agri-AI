import {
    FAIL_EVENT,
    SUCCESS_EVENT,
    AiImageReducer
} from './types'
import Cookies from 'js-cookie'

export const PromptImageAI = (props) => async dispatch => {
 
    function AuthFunc(data, imageBlob) {
        const parsedData = data ? JSON.parse(data) : {};
        if (parsedData.failed) {
            dispatch({
                type: FAIL_EVENT,
                payload: parsedData.failed
            });
        } else {
            // Convert blob to Base64
            const reader = new FileReader();
            reader.readAsDataURL(imageBlob);
            reader.onloadend = () => {
                const base64Image = reader.result;  // This is a Base64 encoded image string
                
                dispatch({
                    type: AiImageReducer,
                    payload:  base64Image  // Store Base64 image in Redux
                });
                
                // dispatch({
                //     type: SUCCESS_EVENT,
                //     payload:  'Your request is successful'  // Store Base64 image in Redux
                // });
            };
        }
    }
    

    try{
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Accept', 'application/json')
    if(localStorage.getItem('access') != null){
        myHeaders.append('Authorization' , `JWT ${localStorage.getItem('access')}`)
        myHeaders.append("x-CSRFToken", `${Cookies.get('Inject')}`);
    }
    
    myHeaders.append("Cookie", `Inject=${Cookies.get('Inject')}`);
 
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body : props
      };
    fetch(`${import.meta.env.VITE_APP_API_URL}/app/generate-ai-image/`, requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.blob();  // Get image as Blob
    })
    .then(imageBlob => {
        AuthFunc(imageBlob);
    })
    .catch(error => {
        console.error('Fetch error:', error);
        dispatch({
            type: FAIL_EVENT,
            payload: 'Failed to fetch AI-generated image'
        });
    });
         
     }catch(err) {
        console.log(err)
        
     }

}