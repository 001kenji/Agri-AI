import {
    LOADING_USER,
    GroupListReducer,
    ChatLogReducer,
    FAIL_EVENT,
    SUCCESS_EVENT,
    ProfileAboutReducer,
    ProfilePostReducer,
    INTERCEPTER,
    FileListReducer,
    CommunityListReducer,
    ProfileAccountReducer
} from './types'
import Cookies from 'js-cookie'
import { useSelector } from 'react-redux'

export const UpdateProfile = (props) => async dispatch => {
    dispatch({
        type : LOADING_USER,
        payload : 'Saving...'
    })
    function AuthFunc(props) {
        const data = props != '' ? JSON.parse(props) : ''
        var status = data[0]
       //console.log('data :',data,'props:',props)
        if(!status.success ) {
            const val = JSON.parse(props)
           //console.log(val)
            dispatch({
                type : FAIL_EVENT,
                payload : val
            })
            
        }else {
            var val = data[1]
            var ProfileAbout = val[0]['ProfileAbout']
            ProfileAbout['ProfileCoverPhoto'] = val[0]['ProfileCoverPhoto']
            
            dispatch({
                type : ProfileAboutReducer,
                payload : ProfileAbout
            })
            dispatch({
                type : SUCCESS_EVENT,
                payload : 'Saved'
            })

        }
        
        

    }
    

    try{
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Accept', 'application/json')
    myHeaders.append('Authorization' , `JWT ${localStorage.getItem('access')}`)
    myHeaders.append("x-CSRFToken", `${Cookies.get('Inject')}`);
    myHeaders.append("Cookie", `Inject=${Cookies.get('Inject')}`);
 
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body : props
      };
    fetch(`${import.meta.env.VITE_APP_API_URL}/app/profile/`, requestOptions)
    .then(response => response.text())
    .then(result => AuthFunc(result))
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      
    });
         
     }catch(err) {
        console.log(err)
        
     }





}

export const FetchUserProfile = (props) => async dispatch => {
 
    function AuthFunc(props) {
        const data = props != '' ? JSON.parse(props) : ''
        var scope = data[0] ? data[0]['scope'] : data.scope ? data.scope : '' 
       //console.log('data :',data,'props:',props)
        if(data.failed ) {
            const val = JSON.parse(props)
       
            dispatch({
                type : FAIL_EVENT,
                payload : data.failed
            })

        }else if(scope == 'ReadProfile') {
            const val = JSON.parse(props)
            if(val[1]['ProfileAbout'] == null){
                dispatch({
                    type : ProfileAboutReducer,
                    payload : null
                })
            }else{
                var ProfileAbout = val[1]['ProfileAbout']            
                ProfileAbout['ProfileCoverPhoto'] = val[1]['ProfileCoverPhoto']
                
                dispatch({
                    type : ProfileAboutReducer,
                    payload : ProfileAbout
                })
            }
            
            
            
            var userdata = {
                'AccountEmail': val[1]['email'],
                'AccountName' : val[1]['name'],
                'AccountID' : val[1]['id'],
                'ProfilePic' : val[1]['ProfilePic'],
                'ProfileCoverPhoto' : val[1]['ProfileCoverPhoto'],
                'ProfilePost' : val[2]['ProfilePost'],
                'IsOwner' : val[3]['accountDetails']['IsOwner'],
                'following': val[3]['accountDetails']['following'],
                'followers': val[3]['accountDetails']['followers'],
                'IsFollowing' : val[3]['accountDetails']['IsFollowing']
            }
            
            dispatch({
                type : ProfileAccountReducer,
                payload : userdata
            })
            var postval = val[2]['ProfilePost'][0] ? val[2]['ProfilePost'] : []
            dispatch({
                type : ProfilePostReducer,
                payload : postval
            })
            
        }else if (scope == 'ReadProfilePost') {
            const val = JSON.parse(props)            
            dispatch({
                type : ProfilePostReducer,
                payload : val[1]
            })
        }else if (scope == 'DeletePost'){
            const val = JSON.parse(props)
            dispatch({
                type : SUCCESS_EVENT,
                payload : val[0]['result']
            })
            dispatch({
                type : ProfilePostReducer,
                payload : val[0]['posts']
            })
            
            return
        }else if (scope == 'MakePostPublic'){
            const val = JSON.parse(props)
            dispatch({
                type : SUCCESS_EVENT,
                payload : val[0]['result']
            })
            dispatch({
                type : ProfilePostReducer,
                payload : val[0]['posts']
            })
            
            return
        }else if(scope == 'FollowAccount') {
            const val = JSON.parse(props)
            var userdata = {
                'IsOwner' : val['IsOwner'],
                'following': val['following'],
                'followers': val['followers'],
                'IsFollowing' : val['IsFollowing'],
                'followerslist' : val['followerslist']
            }
            //console.log('dispatching:',userdata)
            dispatch({
                type : ProfileAccountReducer,
                payload : userdata
            })
            
            
        }else if (data.success) {
            const val = JSON.parse(props)
            dispatch({
                type : SUCCESS_EVENT,
                payload : val['success']
            })
        }
        
        

    }
    

    try{
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Accept', 'application/json')
    if(localStorage.getItem('access') != null){
       // console.log(localStorage.getItem('access') )
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
    fetch(`${import.meta.env.VITE_APP_API_URL}/app/profile/`, requestOptions)
    .then(response => response.text())
    .then(result => AuthFunc(result))
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      
    });
         
     }catch(err) {
        console.log(err)
        
     }





}

export const UploadProfileFile = (props) => async dispatch => {
    
    function AuthFunc(props) {
        const data = props != '' ? JSON.parse(props) : ''
       //console.log('data :',data,'props:',props)
        if(data.failed ) {
            const val = JSON.parse(props)
           //console.log(val)
           
            dispatch({
                type : FAIL_EVENT,
                payload : val
            })

        }else if(data.Scope == 'PostUpload' ) {
            
            const val = JSON.parse(props)
            dispatch({
                type : SUCCESS_EVENT,
                payload : data.success
            })
            dispatch({
                type : ProfilePostReducer,
                payload : val.PostData
            })
            // fetching users posts
        
            
        }else if(data.Scope == 'UploadRepositoryFile'){
            dispatch({
                type : SUCCESS_EVENT,
                payload : data.success
            })
            dispatch({
                type : FileListReducer,
                payload : data.FileList
            })
        }else if (data.Scope == 'CreateNewMesseger'){
            if(data.MessegerScope == 'Groups'){
                dispatch({
                    type : GroupListReducer,
                    payload : data.list
                })
            }else if(data.MessegerScope == 'Community'){
                dispatch({
                    type : CommunityListReducer,
                    payload : data.list
                })
            }
            if(data.status == 'error'){
                dispatch({
                    type : FAIL_EVENT,
                    payload : data.result
                })
            }else if(data.status == 'success'){
                dispatch({
                    type : SUCCESS_EVENT,
                    payload : data.result
                })
            }
        }      

    }
    

    try{
    
    var myHeaders = new Headers();
    //myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Accept', 'application/json')
    myHeaders.append('Authorization' , `JWT ${localStorage.getItem('access')}`)
    myHeaders.append("x-CSRFToken", `${Cookies.get('Inject')}`);
    myHeaders.append("Cookie", `Inject=${Cookies.get('Inject')}`);

    
    //console.log('fetching test 2')
    var requestOptions = {
        method: 'post',
        headers: myHeaders,
        redirect: 'follow',
        body : props
      };
    //const res = await axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/jwt/create/`,config, body );
    fetch(`${import.meta.env.VITE_APP_API_URL}/chat/profiledocs/`, requestOptions)
    .then(response => response.text())
    .then(result => AuthFunc(result))
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      
    });
         
     }catch(err) {
        console.log(err)
        
     }





}