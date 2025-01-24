import React, { useCallback,useEffect, useLayoutEffect, Suspense, useRef, useState } from "react";
import { UploadFile } from "../actions/Chat";
import {UploadProfileFile} from '../actions/profile'
import '../App.css'

import Navbar from "../Components/navbar";
import { v4 as uuid } from 'uuid';
import { Player } from '@lordicon/react'; 
import Lottie from "lottie-react";
import EmojiPicker from 'emoji-picker-react';
import {useDropzone} from 'react-dropzone'
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { Link, Navigate, generatePath, json } from "react-router-dom";
import {connect, useDispatch, useSelector} from 'react-redux'
import { login,CheckAuthenticated,logout,load_user } from "../actions/auth";
import { RiDeleteBinLine } from "react-icons/ri";
import {useForm} from 'react-hook-form'
import { CiSearch } from "react-icons/ci";
import { BsEmojiNeutral } from "react-icons/bs";
import { GoTrash } from "react-icons/go";
import { IoPersonAddOutline } from "react-icons/io5";
import { useVoiceVisualizer } from 'react-voice-visualizer';
import { LiaSearchengin } from "react-icons/lia";
import { CgDetailsLess } from "react-icons/cg";
import { AiOutlineMail } from "react-icons/ai";
import { CgDetailsMore } from "react-icons/cg";
import { IoMdAdd } from "react-icons/io";
import CryptoJS from "crypto-js";
import { CiUser } from "react-icons/ci";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { GiMoonClaws } from "react-icons/gi";
import { RxSun } from "react-icons/rx";
import { IoMdExit, IoMdMore } from "react-icons/io";
import { BannedListReducer, ChatListReducer, ChatLogReducer, CommunityListReducer, GroupListReducer, INTERCEPTER, LOADING_USER, MemberListReducer, NotePadlogsReducer, PendingRequestReducer, RejectListReducer, RequestsListReducer, SUCCESS_EVENT, SuggestedListReducer, ToogleTheme } from "../actions/types";
import TestImg from '../assets/images/hm4.jpeg'
import EmptyChatImg from '../assets/images/hm2.jpeg'
import { RiCheckDoubleFill } from "react-icons/ri";
import { FaCheckDouble, FaListCheck } from "react-icons/fa6";
import { toast, ToastContainer, useToast } from 'react-toastify';
import { MdExpand } from "react-icons/md";
import 'react-toastify/dist/ReactToastify.css';
import { VscRunErrors } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";
import { IoSendSharp } from "react-icons/io5";
import { FaPaste } from "react-icons/fa6";
import { TiMicrophone } from "react-icons/ti";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaLink } from "react-icons/fa6";
import { BsTrash3 } from "react-icons/bs";
import { MdOutlineAdd } from "react-icons/md";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { GoArrowLeft } from "react-icons/go";
import Cookies from 'js-cookie'
import { FaAngleLeft } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa6";
import { FaFileArrowUp } from "react-icons/fa6";
import { FaFileArrowDown } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import RejectImg from '../assets/images/rejected.png'
import {useInterval, useTimeout} from 'react-use'
const Chat = ({logout, UploadFile,UploadProfileFile, load_user,isAuthenticated}) => {
    const [Generaldata,SetGeneraldata] = useState({
        'searchVal': "",
        'chatMessage' : ''
        })
    const dispatch = useDispatch()
    const Theme = useSelector((state)=> state.auth.Theme)
    const User = useSelector((state) => state.auth.user)
    const DbData = useSelector((state) => state.chatReducer)
    const [RequestList,SetRequestList] = useState(useSelector((state) => state.chatReducer.RequestList))
    const [ChatsList,SetChatsList] = useState(useSelector((state) => state.chatReducer.ChatList))
    const [SuggestionsList,SetSuggestionsList] = useState(useSelector((state) => state.chatReducer.SuggestedList))
    const [GroupList,SetGroupList]= useState(useSelector((state) => state.chatReducer.GroupList))
    const [CommunityList,SetCommunityList]= useState(useSelector((state) => state.chatReducer.CommunityList))
    const [RoomName,SetRoomName] = useState('null')
    const [SenderIdVal,SetSenderIdVal] = useState([])
    const GlobalPage = useSelector((state)=> state.auth.Page)
    const [IsPrivate,SetIsPrivate] = useState(false)
    const [DispChoice,SetDispChoice] = useState('Chats')
    const ChatLog = useSelector((state) => state.chatReducer.ChatLog)
    const UserEmail = User != null ? User.email : 'gestuser@gmail.com'
    const UserName = User != null ? User.name : ''
    const UserId = User != null ? User.id : ''
    const [HeaderLogVal,SetHeaderLogVal] = useState({
        'group_name' : RoomName,
        'title' : 'Am Name',
        'about' : 'hey there am new in this chat app',
        'img' : 'null',
        'createdOn' : 'null',
        'description' : 'null',
        'ProfilePic' : 'null',
        'Creator' : '',
        'InboxId' : ''
        
        
    })
    const [HeaderLogValChats,SetHeaderLogValChats] = useState({
        'group_name' : 'null',
        'Name' : 'null',
        'about' : 'hey there am new in this chat app',
        'createdOn' : 'null',
        'ProfilePic' : 'null',
        'email' : '',
        'InboxId' : '',
        'isonline' : false,
        'EncryptionKey' : null
    })
    const [InboxScope,SetInboxScope] = useState(false)
    const [DeleteContainer,SetDeleteContainer] = useState({
        'scope' : '',
        'name' : '',
        'email' : '',
        'InboxId' : '',
        'show' : false,
    })
    const [MediaGallary,SetMediaGallary] = useState({
        'type' : '',
        'src' : '',
        'show' : false,
    })
    const [tooltipVal,SettooltipVal]= useState(null)
    const [ExpandUserList,SetExpandUserList] = useState(false)
    const [UsersList,SetUsersList] = useState([])
    const [DisplayMore,SetDisplayMore] = useState(false)
    const [disableBtns, setDisableBtns] = useState(false)
    const [ShowSearch,SetShowSearch] = useState(true)
    const LgEvent  = useSelector((state) => state.auth.notifierType)
    const WsEvent = useRef(null)
    const ChatlogContainer = useRef(null)
    const ChatListLoadingAnimation = useRef(null)
    const [Member,SetMember] = useState(useSelector((state) => state.chatReducer.MemeberList))
    const [Reject,SetReject] = useState(useSelector((state) => state.chatReducer.RejectList))
    const [Banned,SetBanned] = useState(useSelector((state) => state.chatReducer.BannedList))
    const PendingRequest =useSelector((e) => e.chatReducer.PendingRequest)
    const [PauseTimmer,SetPauseTimmer] = useState(false)
    const [OpenedInboxType,SetOpenedInboxType] = useState(null) 
    const [ShowSearchArrow,SetShowSearchArrow] = useState(false)
    const WsDataStream = useRef(null)
    const WsDataStreamOpened = WsDataStream.current != null ? WsDataStream.current.readyState == 1 ? true : false : false
    const UploaderFile = useRef(null)
    const [Show,SetShow] = useState({
        UploadedImg : false,
        UploadedVideo : false,
        UploadedFileName : null,
        UploadedAudio : false,
        VoiceNoteDot : false,
        UploadedFile :false,
        ReplyChatDiv : false,
        ReplyChat : 'null',
        ReplyChatName : 'null'
    })
   
    const NoteChatLogContainer = useRef(null)
    const [ShowNotePad, SetShowNotePad] = useState(false)
    const [ShowAddUserContainer, SetShowAddUserContainer] = useState({
        'show' : false,
        'UserDetails' : '',
        'scope' : 'Suggestions'
    })
    const [ShowCreateMessegerContainer, SetShowCreateMessegerContainer] = useState({
        'show' : false,
        'name' : '',
        'file' : null,
        'email' : '',
        'about' : '',
        'description' : '',
        'profilePic' : TestImg,
        'profilePicName' : '',
        'scope' : 'Groups'
    })
    const [NotePadComponents,SetNotePadComponents] = useState({
        'addNote' : false,
        'WriteNotes' : false,
        'NewNoteTitle' : '',
        'SelectedTitle' : '',
        'chatMessage' : '',
        'NoteList': true,
        'ShowNoteChatLog' : false
    })
    const [ShowMoreTools,SetShowMoreTools] = useState(false)
    const [ShowProfile,SetShowProfile] = useState(false)
    const [NotePadlogs,SetNotePadlogs] = useState(useSelector((state) => state.chatReducer.NotePadlogs))
    const [NoteChatLog,SetNoteChatLog] = useState([])
    const [UploadVal,SetUploadVal] = useState({
        'upload' : '',
        'src' : '',
        File : null
    })
    const [onlineData,SetonlineData] = useState([])
    const [offlineData,SetofflineData] = useState([])
    const UploaderProfilePic = useRef(null)
    const ShowCreateMessegerContainerRef = useRef(null)
    const [Profile,SetProfile] = useState({
        'edit' : false,
        'name' : User != null ? User.name : 'create account',
        'email' : UserEmail != 'gestuser@gmail.com' ? UserEmail :'create account',
        'About' : User != null ? User.about :'create account',
        'ProfilePic' : User != null ? User.ProfilePic : `${import.meta.env.VITE_WS_API}/media/fallback.jpeg`,
        'File' : null,
        'ProfilePicName' : 'null'
        
    })
    const [Count,SetCount] = useState(0)
    const ChatMessageRef = useRef(null)
    const onDrop = useCallback((acceptedFiles) => {
        Uploader(acceptedFiles[0])
        
      }, [])
    const {getRootProps, getInputProps} = useDropzone({onDrop})
    useEffect(() => {
        
        if(LgEvent != 'LOADING'){
          
            setDisableBtns(false)
        }else if(LgEvent == 'LOADING'){
            setDisableBtns(true)
            
        }
    },[LgEvent]) 
    useEffect(() => {
        if(ChatlogContainer.current){
            if(ChatlogContainer.current.scrollTop > ChatlogContainer.current.clientHeight){
                var Log = ChatlogContainer.current
                Log.scrollTo({
                    'top' : Log.scrollHeight ,
                    'behavior' : 'smooth',
                })
            }
            
        }
            
    },[ChatLog])
    useEffect(() => {
      
        SetProfile({
            'edit' : false,
            'name' : User != null ? User.name : 'create account',
            'email' : UserEmail != 'gestuser@gmail.com' ? UserEmail :'create account',
            'About' : User != null ? User.about :'create account',
            'ProfilePic' : User != null ? User.ProfilePic :`${import.meta.env.VITE_WS_API}/media/media unavailable ${Theme}.jpg`,
            'File' : null,
            'ProfilePicName' : 'null'
        })
        
    },[User])
    
    const [ShowChatDisp,SetShowChatDisp] = useState(HeaderLogVal.group_name != 'null' ? true : false)
    const [SearchContainer,SetSearchContainer] = useState({
        'storeChatSearch' : [],
        'SearchChatNumber' : 0

    })
    //isauthenticated ? redirect to home page
    // if (!isAuthenticated && localStorage.getItem('access') == 'undefined') {
    //    // console.log('your are authenticated in the login sect', isAuthenticated)

    //     return <Navigate to="/login" replace />;
    // }
    // if(localStorage.getItem('access') == null /*|| db == null*/) {
    //     logout;
    //     return <Navigate to="/login" replace />;
    // }
    const { startRecording, stopRecording, recordedBlob } = useVoiceVisualizer();
    const audioRef = useRef(null);

    useLayoutEffect(() => { 
        requestWsStream('open',null,null)
        // for restarting timmer of fetching online toast status
         
        setInterval(() => {
            StartRefresh('start',DispChoice)
         }, 10000);
         
     //
     },[User])
     
    useEffect(() => {
         if(!window.navigator.onLine){
           toast('You are currently offline !', {
           type: 'warning', 
           theme: Theme,
           position: 'top-right',
         });
         }else {
         //   toast('Online.', {
         //     type: 'success', 
         //     theme: Theme,
         //     position: 'top-right',
         //   });
         }
         
    },[window.navigator.onLine])
     
    useEffect(() => {
         if(ShowNotePad){
             requestWsStream('NotePadlogs',null,null)
         }
     },[ShowNotePad])

    useEffect(() => {
        if (recordedBlob && UserEmail != 'gestuser@gmail.com') {
          const audioElement = audioRef.current;
          const url = URL.createObjectURL(recordedBlob);
          audioElement.src = url;
          var val = Math.floor(Math.random() * 100)
          var name = `${User != null ? UserEmail : 'null'}voicenote${val}.mp3`
          SetUploadVal((e) => {
            return {
                ...e,
                'upload' : 'audio',
                'src' : name,
                File : recordedBlob
            }
            
          })
          SetShow((e) => {
            return {
                ...e,
                UploadedImg : false,
                UploadedVideo : false,
                UploadedAudio : true,
                UploadedFileName : name,
            }
        })
          audioElement.play();
        }else {
            SetShow((e) => {
                return {
                    ...e,
                    UploadedAudio : false,
                    UploadedFileName : null,
                    
                }
            })
        }
    }, [recordedBlob]);
    
    useEffect(() => {
        MapperGroupList
    },[PendingRequest])

    useEffect(() => {
        RoomName != 'null' ? CreateChatRoom() : ''
        
    },[RoomName])
    useEffect(() => {
        // if(GlobalPage != 'messeger'){
        //     ClearPageData('clear')
        //     dispatch({
        //         type : 'ClearLists'
        //     })
        //     requestWsStream('close')
        // }
    },[GlobalPage])
    function ClearPageData (props){
        if ( props != null){
            SetChatsList([])
            SetGroupList([])
            SetCommunityList([])
            SetNotePadlogs([])
            SetBanned([])
            SetReject([])
            SetMember([])
            SetNoteChatLog([])
            SetRequestList([])
            SetSuggestionsList([])
            SetUsersList([])

            dispatch({
                type : ChatLogReducer,
                payload : []
            })
        }
    }
    function UpdateRequest (email,roomval,choice,id) {
        if(UserEmail != 'gestuser@gmail.com'){
            toast('Submitting please wait', {
                type: 'info',
                theme: Theme,
                position: 'top-center'
            })
            var dt = {
            'message' : 'UpdateRequest', 
            'email' : email,
            'roomName' : roomval,
            'choice' :choice, 
            'id' : id,
            'name' : UserName
            }
            requestWsStream('UpdateRequest',null,dt)
        }else{
            toast('Sign up to manage chats', {
                type: 'warning',
                theme: Theme,
                position: 'top-center'
            })
        }        
       
    }
    function RemoveRequest (roomval) {
        if (UserEmail == '' || UserEmail == 'gestuser@gmail.com'){
            toast('Sign Up to manage chats',{
                position : 'top-right',
                theme : Theme,
                type : 'warning'
            })
        }else {
            toast('Submitting please wait', {
                type: 'info',
                theme: Theme,
                position: 'top-center'
            })
            var dt = {
            'message' : 'RemoveRequest',
            'roomName' : roomval,
            'id' : User.id,
            'userEmail' : UserEmail
            }
            requestWsStream('RemoveRequest',null,dt)
        }
        
       
    }
 
    function CreateFriend(roomVal,user){
        if(UserEmail != 'gestuser@gmail.com'){
            var emailVal = UserEmail
            var obj = {
                [emailVal] : {
                    'name' : User.name,
                    'about' : User.about,
                    'id' : User.id,
                    'ProfilePic' : User.ProfilePic
                }
            }

            //requestWsStream('CreateFriend',null)
            var detail = {...user,...obj}
            var room = `${roomVal}${User.id}`
            var body = [room,detail]
           
            requestWsStream('CreateFriend',null,[roomVal,body])
        }else if(UserEmail == 'gestuser@gmail.com'){
            
            toast('Sign Up to create friends',{
                position : 'top-right',
                theme : Theme,
                type : 'warning'
            })
        }
    }

     const GetName = (props) => {
        if (props){
            var email = User != null && UserEmail != 'gestuser@gmail.com' ? UserEmail : 'null'
            for (const key in props) {
                // Check if the key is not 2
                
                if (key != email ) {
                  return key;
                }
        }
        }
    }  
    const GetNameChats = (props) => {
        if (props){
        var email = User != null ? UserEmail : 'null'
            for (const key in props) {
                if (key !== email ) {
                  return key;
                }
        }
        }
    }   

    function CallCreateChatRoom (room,sender,reciever,recieverindex,encryptionKey) {
        SetIsPrivate(true)
        dispatch({
            type : ChatLogReducer,
            payload : []
        })
        SetRoomName(room)
        SetSenderIdVal([sender,reciever])
        SetHeaderLogValChats((e) => {
            return {
                ...e,
                'isonline' : false,
                'email' : recieverindex,
                'EncryptionKey' : encryptionKey
            }
        })

        
    }
    const ChatsListTimeUpdater = ({lastseenTextval,isonlineval}) => {
        if(lastseenTextval == 'online'){
            return <small   className={`font-semibold font-[PoppinsN] ${lastseenTextval == 'online' ? 'text-green-500 dark:text-green-400 ' : 'text-red-500  font-semibold'} ${isonlineval == false ? 'flex' : 'hidden'} cursor-pointer outline-none italic bg-transparent text-left w-fit my-auto ml-auto border-none text-[12px] text-ellipsis`} readOnly >{lastseenTextval}</small>
        }
        const date = new Date(lastseenTextval); // Convert 'DD-MM-YYYY' to 'YYYY-MM-DD'
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'week', seconds: 604800 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 }
        ];
        
        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count > 0) {
                var val = count === 1 ? `1 ${interval.label} ago` : `${count} ${interval.label}s ago`

                return   <small   className={`font-[PoppinsN] font-semibold ${lastseenTextval == 'online' ? 'text-green-500 dark:text-green-400 ' : 'text-red-500  font-semibold'} ${isonlineval == false ? 'flex' : 'hidden'} cursor-pointer outline-none italic bg-transparent text-left w-fit my-auto ml-auto border-none text-[12px] text-ellipsis`} readOnly >{val}</small>

            }
        }

        return <small   className={`font-[PoppinsN] font-semibold ${lastseenTextval == 'online' ? 'text-green-500 dark:text-green-400 ' : 'text-red-500  font-semibold'} ${isonlineval == false ? 'flex' : 'hidden'} cursor-pointer outline-none italic bg-transparent text-left w-fit my-auto ml-auto border-none text-[12px] text-ellipsis`} readOnly >{lastseenTextval}</small>
        //return 'just now';
    }
    const MapperChatList = ChatsList.map((items,i) => {
        
        var recieverindex = GetNameChats(items.Details)
        var img = items.Details[recieverindex].ProfilePic
        var name = items.Details[recieverindex].name
        var about = items.Details[recieverindex].about
        var isonline = UserEmail != 'gestuser@gmail.com' && UserEmail != 'null' ? onlineData.includes(recieverindex) : false
        var lastseenText = 'offline'
        //console.log(isonline,offlineData)
        if(isonline == false){
            for (let pos = 0; pos <= offlineData.length; pos++) {
                var dt = offlineData[pos]
                if(dt){
                    if(dt['email'] == recieverindex){
                    var lastseenText = dt['time']
                }
                }                       
                
            }
        }
        return (
            <div key={i}  onClick={() => CallCreateChatRoom(items.group_name,items.SenderId,items.RecieverId,recieverindex,items.encryptionKey)}  className="tooltip bg-gray-200 dark:bg-transparent group tooltip-top lg:tooltip-left text-slate-800 dark:text-slate-50 min-w-[200px] justify-around  tooltip-info cursor-pointer md:mx-auto md:align-middle hover:shadow-md hover:shadow-sky-500 rounded-md border-slate-600 dark:border-slate-500 w-[300px] md:w-[200px]  flex flex-row px-2 border-[1px] my-1 gap-1" >
                    <div className={`my-2 avatar w-12 mr-auto h-12 min-w-[20%]  ${isonline ? 'online  ' : ' offline  '} `} >
                            <img loading="lazy"  src={`${img}`}  className=" cursor-pointer rounded-full m-auto w-10 border-[1px]ss  h-10 "  alt="" />

                    </div>
                    <div className={` flex flex-col gap-1 w-[60%] md:w-[70%] justify-around `} >
                        <p  className="cursor-pointer font-mono outline-none bg-transparent text-left w-fit my-auto mr-auto border-none text-ellipsis" readOnly >{name}</p>
                        <ChatsListTimeUpdater lastseenTextval={lastseenText} isonlineval={isonline} />
                        <small   className={`font-[PoppinsN] font-semibold ${lastseenText == 'online' ? 'text-green-500 dark:text-green-400 ' : 'text-red-500  font-semibold'} ${isonline == false ? 'flex' : 'hidden'} hidden cursor-pointer outline-none italic bg-transparent text-left w-fit my-auto ml-auto border-none text-[12px] text-ellipsis`} readOnly >{lastseenText}</small>
                        <small   className={`font-[PoppinsN]  ${isonline == true ? 'flex' : 'hidden'} cursor-pointer outline-none italic bg-transparent text-left w-fit my-auto ml-auto border-none text-green-500 dark:text-green-400 text-ellipsis`} readOnly >online</small>
                    </div>
                
            </div>
        )
    })
    //console.log(ChatsList)
    const MapperNoList = ({messege}) => {
        if(messege != null){
            return (
                <div className= {`card  mx-auto bg-base-100 max-h-[100px] image-full min-w-[200px] w-[300px] md:w-[200px]  shadow-xl `}>
                    <figure className=" opacity-100 w-full min-w-full "  >
                        <img loading="lazy"
                        className=" opacity-100 w-full min-w-full"
                        src={Profile.ProfilePic}
                        alt="Shoes" />
                    </figure>
                    <div className="card-body align-middle">
                        <h1 className=" font-[button] text-center text-2xl m-auto " >No {messege}</h1>                            
                    </div>
                </div> 
            )
        }
    }
    
    const MapperSuggestions = () =>{
        if(SuggestionsList[0]){
            const responseval= SuggestionsList.map((items,i) => {
                var index = GetName(items.Details)
                var user = items.Details[index]
                var id =    user ? user.id : ''
                var name =  user ? user.name : ''
                var image = user  ? user.ProfilePic   : '/media/fallback.jpeg'

                var isonline = UserEmail != 'gestuser@gmail.com' && UserEmail != 'null' ? onlineData.includes(index) : false

                return (
                <div key={i}   className={`  tooltip  md:mx-auto max-w-[200px]  text-slate-800 dark:text-slate-50  tooltip-info  ${user ? 'flex' : 'hidden'} flex flex-col gap-3`}>
                    <div key={i} className= {` cursor-pointer bg-gray-200 dark:bg-transparent md:mx-auto md:align-middle hover:shadow-md hover:shadow-sky-500 rounded-md border-slate-600 dark:border-slate-500 w-[200px]  max-h-[200px]  flex flex-row px-2 border-[1px] my-1 min-h-[90px] gap-1 `} >
                            <div className={`my-2 avatar w-12 mr-auto  min-w-[20%]   h-12  ${isonline ? 'online  ' : ' offline  '} `} >
                                <img loading="lazy" onClick={() => OpenImagePrivate(image)} src={`${image}`}  className=" cursor-pointer rounded-full  mx-auto w-10   h-10  border-[1px]ss"  alt="" />

                            </div>
                            <div className={` flex flex-col gap-1 w-[60%] md:w-[70%] justify-around `} >
                                <p  className="cursor-pointer font-mono outline-none bg-transparent text-left w-fit my-auto mr-auto border-none text-ellipsis" readOnly >{name}</p>
                                <button   onClick={() => CreateFriend(id,items.Details)} title="Add friend" className={`  w-fit font-semibold rounded-sm my-auto ml-auto bg-transparent border-slate-600 transition-all duration-300 text-sm  dark:hover:border-sky-500 border-[1px] hover:border-orange-500 hover:text-slate-900 dark:bg-transparent dark:text-slate-200 dark:border-slate-500  text-sky-500 px-2 py-1 `} >Add Friend</button>
                            </div>
                    </div>

                </div>

                )
            })
            return responseval
        }else {
            return (
                <div className= {`card  mx-auto bg-base-100 max-h-[100px] image-full min-w-[200px] w-[300px] md:w-[200px]  shadow-xl `}>
                        <figure className=" opacity-100 w-full min-w-full "  >
                            <img loading="lazy"
                            className=" opacity-100 w-full min-w-full"
                            src={Profile.ProfilePic}
                            alt="Shoes" />
                        </figure>
                        <div className="card-body align-middle">
                            <h1 className=" font-[button] text-center text-2xl m-auto " >No Suggestions</h1>                            
                        </div>
                    </div> 
            )
        }
    }
   function OpenGroupsInbox (room,list){
        if(room != null ){
            SetRoomName(room)
            SetUsersList(list)
            dispatch({
                type : ChatLogReducer,
                payload : []
            })
        }
   }
   function OpenComunityInbox (room){
        if(room != null) {
            SetRoomName(room)
            dispatch({
                type : ChatLogReducer,
                payload : []
            })
        }    
    }
    function RequestJoinGroup(group_nameval,grouptitle){
        if (UserEmail == '' || UserEmail == 'gestuser@gmail.com'){
            toast('Sign Up to manage chats',{
                position : 'top-right',
                theme : Theme,
                type : 'warning'
            })
        }else {
            requestWsStream('JoinRequest',group_nameval,grouptitle)
        }        
       
    }
        
    const MapperGroupList = () => {
        if(GroupList[0]){
            const responseval = GroupList.map((items,i) => {
                var Pending = false         
                Pending = PendingRequest.includes(items.group_name);
                var memberval = Member.includes(items.group_name)
                var rejectval = Reject.includes(items.group_name)
                var bannedval = Banned.includes(items.group_name)
               
               return (
                   <div key={i} onClick={() => memberval ? OpenGroupsInbox(items.group_name,items.UsersList): ''}  className="tooltip min-w-[200px] tooltip-info bg-gray-200 dark:bg-transparent text-slate-800 dark:text-slate-50 tooltip-top flex relative gap-0 w-[200px] flex-col h-fit m-auto md:my-0 border-[1px] rounded-md border-slate-600 dark:border-slate-500   hover:shadow-md hover:shadow-sky-500 " >
                           <div  key={i} className=" z-30 cursor-pointer md:mx-auto w-full max-h-[200px] h-fit  flex flex-row justify-between px-2 gap-1" >
                               <img loading="lazy"  src={`${import.meta.env.VITE_WS_API}${items.ProfilePic}`} className="  cursor-pointer rounded-full mx-auto my-2 w-12 border-[1px]ss  h-12  "  alt="" />
                               <p  className=" font-mono outline-none cursor-pointer bg-transparent text-center w-fit max-w-[50%] mx-auto border-none text-ellipsis hidden" >{items.group_name}</p>
                               <p   className=" font-[PoppinsN] outline-none ring-0 cursor-pointer bg-transparent text-left w-fit mt-2 mb-auto min-w-[70%] max-w-[70%] border-none text-ellipsis mr-auto" disabled >{items.title}</p>
       
                           </div>
                       <img loading="lazy" data-tip='You are rejected to join the group' className={` bg-transparent opacity-80 absolute -translate-x-12 left-full rounded-full h-12 tooltip tooltip-left ml-auto mr-2 mb-2 w-fit  z-20  ${rejectval && !bannedval && !memberval ? 'flex' : 'hidden'} `} src={RejectImg} alt="" />
       
                       <span title="Waiting Approval" className={` ${ memberval == false && Pending == true && !bannedval  ? 'flex' : ' hidden'} w-fit font-semibold rounded-sm my-1  transition-all duration-300  text-orange-500 px-2 text-sm text-right py-1 mr-2 ml-auto`} >Pending Approval</span>
                       <button onClick={() =>RemoveRequest(items.group_name)} title="Withdraw Request" className={`  ${ !memberval && !rejectval && !bannedval && Pending ? ' flex' : 'hidden'} flex    w-fit font-semibold rounded-sm my-auto ml-auto bg-transparent border-slate-600 transition-all duration-300 text-sm  dark:hover:border-sky-500 border-[1px] hover:border-orange-500 hover:text-slate-900 dark:bg-transparent dark:text-slate-200 dark:border-orange-500  text-sky-500 px-2 py-1 mr-2 mb-2`} >Withdraw Request</button>
                       <button onClick={() => RequestJoinGroup(items.group_name,items.title)} title="Send Join Request" className={` ${memberval == true || Pending == true || bannedval || rejectval  ? 'hidden' : ' flex'}   w-fit font-semibold rounded-sm my-auto ml-auto bg-transparent border-slate-600 transition-all duration-300 text-sm  dark:hover:border-sky-500 border-[1px] hover:border-orange-500 hover:text-slate-900 dark:bg-transparent dark:text-slate-200 dark:border-slate-500  text-sky-500 px-2 py-1 mr-2 mb-2`} >Join Request</button>
                    </div>
                   
               )
           })
           return responseval
        }else {
            return (
                <div className= {`card  mx-auto bg-base-100 max-h-[100px] image-full min-w-[200px] w-[300px] md:w-[200px]  shadow-xl `}>
                        <figure className=" opacity-100 w-full min-w-full "  >
                            <img loading="lazy"
                            className=" opacity-100 w-full min-w-full"
                            src={Profile.ProfilePic}
                            alt="Shoes" />
                        </figure>
                        <div className="card-body align-middle">
                            <h1 className=" font-[button] text-center text-2xl m-auto " >No Groups</h1>                            
                        </div>
                    </div> 
            )
        }
    }
    
    const MapperRequests = () => {
        if(RequestList[0]){
            const responseval = RequestList.map((items,i) => {
                return (
                    <div key={i} className="   relative cursor-pointer min-w-[280px] md:mx-auto hover:shadow-md hover:shadow-sky-500  rounded-sm text-slate-800 dark:text-slate-50 bg-gray-200 dark:bg-transparent border-slate-600 dark:border-slate-500 w-fit max-w-[260px]   flex flex-col px-2 border-[1px] my-auto gap-1" >
                            <button onClick={() => UpdateRequest(items.UserDetails[0].email,items.RoomName,'Delete',items.id)} data-tip='Delete Request' className=" ml-auto hover:text-red-600  mt-1 mr-1 tooltip tooltip-left" >
                                <GoTrash className="" />
                            </button>
                            <span className={` hover:text-sm absolute w-fit h-fit font-bold my-2 dark:bg-slate-600 dark:text-lime-500 bg-lime-500 text-slate-100 p-1 rounded-sm z-30 text-[x-small] transition-all duration-300 `} >Group Request</span>
                            <span className={` ${items.status == 'Reject' ? ' absolute' : 'hidden'} hover:text-sm  w-fit h-fit font-bold mt-10 dark:bg-slate-600 dark:text-amber-500 bg-red-500 text-slate-900 p-1 rounded-sm z-30 text-[x-small] transition-all duration-300`} >Rejected Request</span>
                            <div className=" w-full min-w-full   flex flex-col gap-1 text-sm">
                                <img loading="lazy" onClick={() => OpenImage(items.ProfilePic)} src={`${items.UserDetails[0].UserPic}`} className=" cursor-pointer rounded-full mx-auto my-2 w-20 border-[1px]ss  h-20 "  alt="" />
                                <input  className="  font-mono outline-none bg-transparent text-left w-full  border-none text-ellipsis " disabled value={`Name: ${items.UserDetails[0].name}`}/>
                                <input  className=" font-mono outline-none bg-transparent text-left w-full  border-none text-ellipsis " disabled value={`Emial: ${items.UserDetails[0].email}`}/>
                                <input  className=" font-mono outline-none bg-transparent text-left w-full  border-none text-ellipsis" disabled value={`Group: ${items.groupname}`}/>
                                <p  className=" font-mono outline-none bg-transparent text-left w-full  border-none"  >Requested: {<RequestListTimeUpdater dateString={items.dateRequested}  />}</p>
                            
                            </div>
                            
                            <div className=" flex flex-row gap-3 align-middle text-sm mb-3 " >
                                <button onClick={() => UpdateRequest(items.UserDetails[0].email,items.RoomName,'Accept',items.id)} title="Accept" className={` flex w-fit font-semibold rounded-sm my-1 bg-slate-600 transition-all duration-300 hover:shadow-md dark:hover:shadow-orange-500 hover:shadow-sky-600 dark:bg-slate-600 dark:text-lime-500   text-cyan-400 px-2 py-1 mx-auto`} >Accept</button>
                                <button onClick={() => UpdateRequest(items.UserDetails[0].email,items.RoomName,'Reject',items.id)} title="Reject" className={` ${items.status != 'Reject'  ? ' flex' : 'hidden'} flex w-fit font-semibold rounded-sm my-1 bg-slate-600 transition-all duration-300 hover:shadow-md dark:hover:shadow-orange-500 hover:shadow-sky-600 dark:bg-slate-600 dark:text-yellow-300  text-red-400 px-2 py-1 mx-auto`} >Reject</button>
                            </div>

                    </div>
                )
            })
            return responseval
        }else {
            return (
                <div className= {`card  mx-auto bg-base-100 max-h-[100px] image-full min-w-[200px] w-[300px] md:w-[200px]  shadow-xl `}>
                        <figure className=" opacity-100 w-full min-w-full "  >
                            <img loading="lazy"
                            className=" opacity-100 w-full min-w-full"
                            src={Profile.ProfilePic}
                            alt="Shoes" />
                        </figure>
                        <div className="card-body align-middle">
                            <h1 className=" font-[button] text-2xl text-center m-auto " >No Requests</h1>                            
                        </div>
                    </div> 
            )
        }
    }
    
    const MapperCommunityList = () => {
        if(CommunityList[0]) {
            const responseval = CommunityList.map((items,i) => {

                return (
                    <div data-tip="Inbox" onClick={() => OpenComunityInbox(items.group_name)} key={i} className="tooltip bg-gray-200 min-w-[200px] lg:min-w-[300px] dark:bg-transparent tooltip-left tooltip-info min-h-[80px] text-slate-800 dark:text-slate-50 cursor-pointer md:mx-auto md:my-0 hover:shadow-md hover:shadow-sky-500 hover:dark:shadow-orange-500 rounded-md border-slate-600 dark:border-slate-500 w-[250px] max-w-[250px] max-h-[200px] overflow-hidden  flex flex-row px-2 border-[1px] my-auto gap-1" >
                            <img loading="lazy" src={`${import.meta.env.VITE_WS_API}${items.ProfilePic}`} className=" cursor-pointer rounded-full mx-auto my-2 w-12  border-[1px]ss  h-12 "  alt="" />
                            <div className={` flex flex-col gap-1 w-[60%] md:w-[70%] justify-around `} >
                                {/* <p className="font-[PoppinsN] outline-none ring-0 cursor-pointer bg-transparent text-left w-fit mt-2 mb-auto min-w-[70%] max-w-[70%] border-none text-ellipsis mr-auto" disabled >{items.title}</p> */}
                                <input className="font-[PoppinsN] outline-none ring-0 max-h-20 break-words cursor-pointer bg-transparent text-left w-fit max-w-full mt-2 mb-auto border-none text-ellipsis mr-auto" disabled value={items.title} />
                                <input className="font-[PoppinsN] outline-none ring-0 max-h-20 break-words cursor-pointer bg-transparent text-left w-fit max-w-full mt-2 mb-auto border-none text-ellipsis mr-auto" disabled value={items.description} />
                            </div>
                    </div>
                )
            })
            return responseval
        }else {
            return (
                <div className= {`card  mx-auto bg-base-100 max-h-[100px] image-full min-w-[200px] w-[300px] md:w-[200px]  shadow-xl `}>
                        <figure className=" opacity-100 w-full min-w-full "  >
                            <img loading="lazy"
                            className=" opacity-100 w-full min-w-full"
                            src={Profile.ProfilePic}
                            alt="Shoes" />
                        </figure>
                        <div className="card-body align-middle">
                            <h1 className=" font-[button] text-center text-2xl m-auto " >No Communities</h1>                            
                        </div>
                    </div> 
            )
        }
    }
    

    function CreateChatRoom (msg = null ) {
        if(WsEvent.current != null ){
            //console.log('wsEvent current',WsEvent.current,typeof(WsEvent.current))
            WsEvent.current.close(1000,'Opening another socket for less ws jam')
        }
       //var randomVal = `${RoomName}${Math.floor(Math.random() * 100)}`
        WsEvent.current = new WebSocket(`ws:/${import.meta.env.VITE_WS_API}/ws/chat/${RoomName}/`) 
            // toast('Fetching please wait', {
            //     type: 'info',
            //     theme: Theme,
            //     position: 'top-center'
            // }) 
         WsEvent.current.onmessage = function (e) {
            var data = JSON.parse(e.data)
            //console.log(data)
            if(data.message.status){
                if(data.message.status == 'error'){
                    toast(data.message.message, {
                        type: 'error',
                        theme: Theme,
                        position: 'top-center',
                    })
                }
                
            }else{
                if(typeof(data.message == Object) && data.message != ''){
                    dispatch({
                        type : ChatLogReducer,
                        payload : data.message
                        }
                    ) 
                }else {
                   toast('There is an issue with the connection',{
                    type : 'warning',
                    theme : Theme,
                    position : 'top-right'
                   })
                }
                
            }
             
            
          };
        WsEvent.current.onopen = (e) => {
            //console.log('Socket opened..')
            SetShowChatDisp(true)
            if(WsDataStream.current.readyState === WsDataStream.current.OPEN){
                //console.log('sending request for all data')
                if(DispChoice == 'Chats'){
                    SetOpenedInboxType('Chats')
                    WsDataStream.current.send(
                        JSON.stringify({
                            'message' : 'AllChatLog',
                            'scope' : 'Chats',
                            'RecieverId' : SenderIdVal[1],
                            'SenderId' : SenderIdVal[0]
                        })
                        )
                }else {
                    SetOpenedInboxType(DispChoice)
                    WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'AllChatLog',
                        'scope' : DispChoice,
                        'roomName' : RoomName
                    })
                    )
                }
                
            }
            // toast('Success', {
            //     type: 'success',
            //     theme: Theme,
            //     position: 'top-center',
            // })
          
            if(msg != null){
              WsEvent.current.send(
                  JSON.stringify({
                      'message' : String(msg)
                  })
                  )
          }
          }
        WsEvent.current.onclose = function (e) {
            //console.log('closing due to :',e)
            if (e.code != 1000) {
                // Error code 1000 means that the connection was closed normally.
                // Try to reconnect.		
                    toast('Network Error', {
                            type: 'warning',
                            theme: Theme,
                            position: 'top-right',
                    })
                }
        
        
        }
        if(WsEvent.current.readyState === WsEvent.current.OPEN){
            WsEvent.current.send(
                JSON.stringify({
                    'message' : String(msg)
                })
                )
        }
        
       
    }
    function CloseChat () {
        SetShowChatDisp(false)
        if(IsPrivate == true){
            dispatch({
                type : ChatLogReducer,
                payload : []
            })
            SetHeaderLogValChats((e) => {
                return {
                    ...e,
                    'EncryptionKey' : ''
                }
            })
        }
        SetIsPrivate(false)
        if(WsEvent.current != null ){
            //console.log('wsEvent current',WsEvent.current,typeof(WsEvent.current))
            WsEvent.current.close(1000,'Closing Chat')
              
        }
        SetRoomName('null')
        SetInboxScope(false)
        SetDisplayMore(false)
    }
   
    function ToogleDispChoice(props) {
        SetDispChoice(props)
        
        if(props == 'Community'){
            requestWsStream(props,false,false)
        }else{
            requestWsStream(props)
        }
    }
   

    const OpenImagePrivate = (props) => {
    window.open(`${props}`,'_blank')
    }

    function DownloadFunc (props) {
        const url = `${import.meta.env.VITE_WS_API}/media/${props}`
        const a = document.createElement('a');
        a.href = props;
        a.download =  props;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(props);
        toast('Successfully Downloaded', {
            type: 'success',
            theme: Theme,
            position: 'top-right'
        })
    }
    function CopyChat(props,i) {
        if(props){

            navigator.clipboard.writeText(props).then(() => {
            }).catch(err => {
                console.error('Error:', err);
            });
            SettooltipVal(i)
            setTimeout(() => {
                SettooltipVal(null)
            }, 2000);
        }else {
            return false   
        }
        
    }
    function SetReply(action,msg,name){
        if(action == 'show'){
            var decryptedMessege = decryptData('decrypt',msg)
            SetShow((e) => {
                return {
                ...e,
                'ReplyChat' : decryptedMessege,
                'ReplyChatDiv' : true,
                'ReplyChatName' : name
                }
            })
        }else if(action == 'close'){
            SetShow((e) => {
                return {
                ...e,
                'ReplyChat' : '',
                'ReplyChatDiv' : false,
                'ReplyChatName' : ''
                }
            })
        }
        
    }
    const RequestListTimeUpdater = ({dateString}) => {
        const date = new Date(dateString); // Convert 'DD-MM-YYYY' to 'YYYY-MM-DD'
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'week', seconds: 604800 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 }
        ];
        
        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count > 0) {
                var val = count === 1 ? `1 ${interval.label} ago` : `${count} ${interval.label}s ago`

                return val
            }
        }

        return 'just now'
        //return 'just now';
    }
    const TimePostUpdater = ({dateString,emailval}) => {
        const date = new Date(dateString); // Convert 'DD-MM-YYYY' to 'YYYY-MM-DD'
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'week', seconds: 604800 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 }
        ];
        
        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count > 0) {
                var val = count === 1 ? `1 ${interval.label} ago` : `${count} ${interval.label}s ago`

                return <small data-tip={date.toDateString()}  className={` tooltip tooltip-top cursor-pointer text-[12px] italic font-semibold font-mono text-slate-500 dark:text-slate-400 w-full ${emailval == UserEmail ? ' text-left pr-3':'text-right'}  `}>{val}</small>
            }
        }

        return <small data-tip={date.toDateString()}  className={` tooltip tooltip-top cursor-pointer text-[12px] italic font-semibold font-mono text-slate-500 dark:text-slate-400 w-full ${emailval == UserEmail ? ' text-left pr-3':'text-right'}  `}>just now</small>
        //return 'just now';
    }
    const ChatLogMapper = ChatLog.map((items,i) => {
        var x = JSON.stringify(items.DelList)
        var y = JSON.parse(x)
        var userDel = y != null && UserEmail != 'gestuser@gmail.com' ? y.includes(UserEmail) : false
        var Isfilename = items.src != '' && items.src != 'null' ? true : false
        var fileNameSplit = Isfilename ? String(items.src).split('/') : ''
        var fileName = Isfilename ? fileNameSplit[fileNameSplit.length -1] : ''
        var decryptedMessege = IsPrivate ? decryptData('decrypt',items.text) :  items.text
        //var userDel = typeof(items.DelList) == 'objecta' ? items.DelList.includes(UserEmail) : false
        
        return (
            <div  key={i} id={i}  className={`dropdown ${DisplayMore ? ' z-20' : ' z-40'}  bg-transparent relative flex px-2 min-w-fit max-w-[280px] sm:max-w-fit  bg-opacity-90 w-fit my-1 mx-2 ${items.email == UserEmail ? 'chat chat-end  sm:dropdown-left float-right ml-auto' : 'chat chat-start sm:dropdown-right  mr-auto '}  flex-col gap-1`}>
                <span className={` ${items.email == UserEmail ? 'text-sky-700 dark:text-slate-100': ' text-red-700 dark:text-yellow-500'} chat-header text-[x-small]  font-semibold`}>{items.name}</span>
                <button tabIndex={i} className= {` overflow-hidden absolute  z-[100%] ${items.email == UserEmail ?  'right-full' : ' left-full'}  top-8 self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-slate-200 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600 `} type="button">
                <IoMdMore  title="more" className={` text-base  cursor-pointer my-auto  sm:text-xl`} />

                </button>
              
                <div id={`ChatMesseger-${i}`} className={`chat-bubble bg-slate-200 dark:bg-slate-700  min-w-fit  shadow-md  flex-col gap-2 w-full flex `}>
                    <div className= {` border-[1px] rounded-sm p-2 border-slate-600 ${items.ReplyChat != 'null' && userDel == false && items.ReplyChatName !='null' && items.ReplyChat && items.Status != 'deleted' ? ' flex' : 'hidden'}  flex flex-col max-w-[200px] sm:max-w-[300px]  w-fit justify-start gap-1 my-3 `}   >
                        <span className={` ${items.email == UserEmail ? 'text-sky-600 dark:text-slate-100': ' text-red-500 dark:text-yellow-500'} chat-header  font-semibold flex flex-row opacity-90 gap-3`}>{items.ReplyChatName} : <p className=" italic text-orange-500 dark:text-orange-300 opacity-80 text-[x-small] ">Reply</p></span>
                        <textarea className={` border-none bg-transparent ${items.email == UserEmail ? ' mr-auto' : ' ml-auto'} w-full text-left  break-words text-slate-900 dark:text-slate-100   h-fit max-h-[50px] min-h-[30px] sm:max-h-[100px] min-w-full  rounded-sm font-mono text-sm p-2 resize-y cursor-text`} disabled value={items.ReplyChat} ></textarea>
                    </div>
                    <span className={` ${items.upload == 'file' && items.src != 'null' && userDel == false ? 'flex align-middle gap-2 flex-row' : ' hidden' } `}>
                        <FaFileArrowDown title="Download File" onClick={() => DownloadFunc(items.src)} className={` text-red-600 min-h-6  sm:min-h-8 cursor-pointer ${items.upload == 'file' && items.src != 'null' ? 'flex' : 'hidden'} sm:text-xl ml-3 rounded-sm `}   />
                        <small className=" dark:text-amber-200 italic font-mono w-fit my-auto">{fileName}</small>
                    </span>
                    <video loading="lazy" onClick={() =>OpenImage(`${import.meta.env.VITE_WS_API}/media/${items.src}`,'image')} src={`${import.meta.env.VITE_WS_API}/media/${items.src}`} controls title="Uploaded Video"  className={`   cursor-pointer ${items.upload == 'video' && items.src != 'null' && userDel == false ? 'flex' : 'hidden'} max-h-[70px] sm:max-h-[90px] md:min-h-[200px] ml-3 rounded-sm  w-fit h-fit`} ></video>                                            
                    <audio loading="lazy"  src={`${import.meta.env.VITE_WS_API}/media/${items.src}`}  controls title="Uploaded Audio"  className={`cursor-pointer ${items.email == UserEmail ? ' mr-2' : ' ml-2'} px-2  ${items.upload == 'audio' && items.src != 'null' && userDel == false ? 'flex' : ' hidden'} border-slate-800 min-h-[40px] min-w-[200px] overflow-hidden  w-[90%] sm:min-w-[300px]  h-fit`} ></audio>
                    <img loading="lazy" onClick={() =>OpenImage(`${import.meta.env.VITE_WS_API}/media/${items.src}`,'image')} src={`${import.meta.env.VITE_WS_API}/media/${items.src}`}  title="Uploaded image"   className={`cursor-pointer ${items.email == UserEmail ? ' mr-3' : ' ml-3'}  ${items.upload == 'image' && items.src != 'null' && userDel == false ? ' flex' : 'hidden'}  rounded-sm  min-w-fit border-none my-auto w-fit h-fit  max-h-[50px] xs:max-h-[100px] lg:max-h-[150px] `}  alt="" />
                    
                    <blockquote className={` max-w-[200px]  sm:max-w-[300px]  break-words ${userDel && items.action == 'deleted from me' || items.action == 'deleted from all'   ? 'text-red-500 dark:text-red-400' : ' text-slate-900 dark:text-slate-100' } font-mono text-sm `} > 
                        {items.action == 'delete from all' ? 'This message was deleted!' : items.action == 'deleted from me' && userDel  ? 'This message was deleted!' : decryptedMessege} 
                    </blockquote>
                    <div className={` ${items.email == UserEmail ? ' flex-row' : ' flex-row-reverse'} gap-2 sm:gap-3 md:gap-4 w-full flex `}>
                        <TimePostUpdater emailval={items.email} dateString={items.time} />
                        { items.action != 'deleted from all' && !userDel || items.Status == 'send' ? 
                        <RiCheckDoubleFill  className={` ${items.email == UserEmail ? 'text-lime-500 dark:text-green-500' : ' hidden'}  text-xl`}/> :
                        <RiDeleteBinLine className={` text-yellow-400 md:text-lg -p-2 rounded-sm cursor-not-allowed  text-base`}/>
                        }
                    </div>
                    
                </div>
                
                <div tabIndex={i}  className=" dropdown-content max-h-[100px] overflow-y-auto z-50 opacity-100 font-semibold bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                        <li className={` ${items.text != '' ? 'flex w-full' : 'hidden'} `} >
                            <span onClick={() => SetReply('show',items.text,items.name)} className="block w-full cursor-pointer px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white">Reply</span>
                        </li>
                        <li>
                            <span data-tip="Copied" onClick={() => CopyChat(items.text,i)} className= {` w-full ${tooltipVal == i ? 'tooltip tooltip-open' : ''} text-left  ${items.email == UserEmail ?'tooltip-left' : 'tooltip-right'}  block cursor-pointer px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white `}>Copy</span>
                        </li>
                        <li className={` z-50 ${items.action != 'deleted from all' && !userDel ? ' w-full flex' : ' hidden'} `} >
                            <span onClick={()=> SendChat('delete from me',items.id)} className="block w-full cursor-pointer px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white">Delete From me</span>
                        </li>
                        <li className={` z-50 ${items.email == UserEmail && items.action != 'deleted from me' && items.action != 'deleted from all' ? ' w-full flex' : ' hidden'} `} >
                            <span onClick={()=> SendChat('delete from all',items.id)} className="block w-full cursor-pointer px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white">Delete From all</span>
                        </li>
                    </ul>
                </div>
            </div>
        )
    })
    const OpenImage = (src,type) => {
        if(src != null) {
            SetMediaGallary((e) => {
                return {
                    ...e,
                    'show' : true,
                    'src' : src,
                    'type' : type
                }
            })
        }
        
    }
    function SearchFunc () {

        if(SuggestionsList[0]  && DispChoice == 'Suggestions'){
            var x = []
            var custom = DbData.SuggestedList
            const Filter = (props,val) => {
                
                for (let keyval in props.Details){
                  var index = keyval
                    break
                }
                var user = props.Details[index]
                var groupName = String(user.name).toLocaleLowerCase()         
                
                if(Generaldata.searchVal == ''){
                    SetSuggestionsList(DbData.ChatList)
                    return
                }else if(String(groupName).match(String(Generaldata.searchVal).toLocaleLowerCase()) ){
                                     
                    x.unshift(props)
                    SetSuggestionsList(x)        
                    return 
                }
            }
             custom.forEach((e,i) => Filter(e,i)) 

        }else if(ChatsList[0]  && DispChoice == 'Chats'){
            var x = []
            var custom = DbData.ChatList
            const Filter = (props,val) => {
                
                var index = GetNameChats(props.Details)
                var user = props.Details[index]
                var groupName = String(user.name).toLocaleLowerCase()
                var TitleVal = String(user.about).toLocaleLowerCase()
                
                

                if(Generaldata.searchVal == ''){
                    SetChatsList(DbData.ChatList)
                    return
                }else if(String(groupName).match(String(Generaldata.searchVal).toLocaleLowerCase()) || String(TitleVal).match(String(Generaldata.searchVal).toLocaleLowerCase())   ){
                                     
                    x.unshift(props)
                    SetChatsList(x)                    
                    //console.log(x)
                    return 
                }
            }
            //console.log(custom)
             custom.forEach((e,i) => Filter(e,i)) 

        }else if(ChatsList[0]  && DispChoice == 'Groups'){
          
            var x = []
            var custom = DbData.GroupList
            const Filter = (props,val) => {
                var groupName = String(props.group_name).toLocaleLowerCase()
                var TitleVal = String(props.title).toLocaleLowerCase()
                //console.log(groupName,String(TitleVal))
               //console.log(props,val,Generaldata.searchVal)
                if(Generaldata.searchVal == ''){
                    SetGroupList(DbData.GroupList)
                    return
                }else if(String(groupName).match(String(Generaldata.searchVal).toLocaleLowerCase()) || String(TitleVal).match(String(Generaldata.searchVal).toLocaleLowerCase())   ){
                    x.unshift(props)
                    SetGroupList(x)
                    
                    return 
                }
                 
            }

             custom.forEach((e,i) => Filter(e,i)) 

        }
        else if(ChatsList[0]  && DispChoice == 'Community'){
            
            var x = []
            var custom = DbData.CommunityList
            const Filter = (props,val) => {
                var groupName = String(props.group_name).toLocaleLowerCase()
                var TitleVal = String(props.title).toLocaleLowerCase()
                //console.log(groupName,String(TitleVal))
               //console.log(props,val,Generaldata.searchVal)
                if(Generaldata.searchVal == ''){
                    SetCommunityList(DbData.CommunityList)
                    return
                }else if(String(groupName).match(String(Generaldata.searchVal).toLocaleLowerCase()) || String(TitleVal).match(String(Generaldata.searchVal).toLocaleLowerCase())   ){
                    console.log('called i')
                    x.unshift(props)
                    SetCommunityList(x)
                    
                    return 
                }
                 
            }

             custom.forEach((e,i) => Filter(e,i)) 

        }
    }    
    const WriteGeneraldata = (event) => {
        const {value,name} = event.target 
        
        SetGeneraldata((e) => {
            return {
                ...e,
                [name] : value
            }
        })
        if(DbData.GroupList.length != GroupList.length ){
            SetGroupList(DbData.GroupList)
           
        }
        if(DbData.CommunityList.length != CommunityList.length ){
            SetCommunityList(DbData.CommunityList)
           
        }
        if(DbData.ChatList.length != ChatsList.length ){
            SetChatsList(DbData.ChatList)
           
        }
        if(DbData.SuggestedList.length != SuggestionsList.length ){
            SetSuggestionsList(DbData.SuggestedList)
           
        }
        //console.log(ChatsList.length)
    }
    const WriteAddnewUserDetails = (event) => {
        const {value,name} = event.target 
        
        SetShowAddUserContainer((e) => {
            return {
                ...e,
                [name] : value
            }
        })
    }
    const requestWsStream = (msg = null,room = null,body = null,aditional = null) => {    
       
        if(msg =='open'){
            
            if(WsDataStream.current != null ){
                WsDataStream.current.close(1000,'Opening another socket for less ws jam')

            }
            WsDataStream.current =  new WebSocket(`ws:/${import.meta.env.VITE_WS_API}/ws/chatList/${UserEmail}/`);

        }
        if(msg == 'close'){
            
            if(WsDataStream.current != null ){
                WsDataStream.current.close(1000,'usefull eminent')

            }
        }
        WsDataStream.current.onmessage = function (e) {
          var data = JSON.parse(e.data)
            if(data.type == 'Groups'){
                SetBanned([])
                for( var x in data.message){
                    if(data.message[x].UsersList != 'null' && data.message[x].UsersList != null){
                        const hasValue = data.message[x].UsersList.includes(UserEmail);
                        if(hasValue){
                            var val = Member
                            val.push(data.message[x].group_name)
                            dispatch({
                                type : MemberListReducer,
                                payload : val
                            })
                            continue
                        }
                    }else {
                        continue
                    }
                    
                }                
                
                SetGroupList(data.message)
                dispatch({
                    type : GroupListReducer,
                    payload :data.message
                }
                )
            }else if(data.type == 'Community'){
                if(data.message.status == 'error'){

                }else{
                    if(data.message.IsContinue == 'True'){
                        var existingData = CommunityList
                        var newdata = data.message.data == null ?  CommunityList : existingData.concat(data.message.data)
                        
                        SetCommunityList(newdata)
                        dispatch({
                            type : SuggestedListReducer,
                            payload :newdata
                        }
                        )
                    }else {
                        SetCommunityList(data.message.data)
                        dispatch({
                            type : CommunityListReducer,
                            payload : JSON.stringify(data.message.data)
                            }
                        )
                    }
                }
                
                
            }else if (data.type == 'AllChatLog'){
                if(data.message.status == 'success'){                  
                    SetIsPrivate(false)
                    var messegeDetails = data.message['InboxDetails']
                    if(messegeDetails[0]){
                        var dateval = new Date(messegeDetails[0].DateCreated).toLocaleDateString()
                        SetHeaderLogVal((e) => {
                            return {
                                ...e,
                                'group_name' : messegeDetails[0].group_name,
                                'img' : messegeDetails[0].ProfilePic,
                                'title' : messegeDetails[0].title,
                                'createdOn' : dateval,
                                'description' : messegeDetails[0].description,
                                'about' : messegeDetails[0].about,
                                'ProfilePic' : messegeDetails[0].ProfilePic,
                                'Creator' : messegeDetails[0].Creator,
                                'InboxId' : messegeDetails[0].id
                            }
                        })
                        SetInboxScope(data.message['scope'])
                        ///console.log(data.message[0].ChatLogs)
                        dispatch({
                            type : ChatLogReducer,
                            payload : data.message['MessegeList']
                        }
                        )
                        ChatlogContainer.current.scrollTop = ChatlogContainer.current.scrollHeight;
                    
                    }    
                }
            }else if(data.type == 'AllChatLogChats'){
                if(data.message.status == 'success'){                
                    SetIsPrivate(true)
                    var messegeDetails = data.message['InboxDetails']
                    var index = GetNameChats(messegeDetails[0].Details)
                    var dateval = new Date(messegeDetails[0].DateCreated).toLocaleDateString()
                    //var isonline = onlineData.includes(index)
                    SetHeaderLogValChats((e) => {
                        return {
                            ...e,
                            'group_name' : messegeDetails[0].group_name,
                            'Name' : messegeDetails[0].Details[index].name,
                            'ProfilePic' : messegeDetails[0].Details[index].ProfilePic,
                            'about': messegeDetails[0].Details[index].about,
                            'createdOn' : dateval,
                            'email' : index,
                            'InboxId' : UserId == messegeDetails[0].SenderId ? messegeDetails[0].RecieverId : messegeDetails[0].SenderId 
                        }
                    })
                    SetInboxScope('Chats')
                    ///console.log(data.message[0].ChatLogs)
                    dispatch({
                        type : ChatLogReducer,
                        payload : data.message['MessegeList']
                    }
                    )
                    ChatlogContainer.current.scrollTop = ChatlogContainer.current.scrollHeight;
                }
            }else if(data.type == 'RequestMoreChatsLog'){
                if(data.message.type == 'success'){
                    var chatdata = ChatLog
                    chatdata.unshift(...data.message['ChatMessege'])
                    
                    dispatch({
                        type : ChatLogReducer,
                        payload : chatdata
                        }
                    )
                    
                }
                setTimeout(() => {
                    ChatListLoadingAnimation.current.style.display = 'none'
                }, 1000);   
            }else if(data.type == 'JoinRequest'){

                toast(data.message.message, {
                    type: data.message.status ,
                    theme: Theme,
                    position: 'top-center'
                }) 
                if(data.message.status != 'error'){
                    WsDataStream.current.send(
                        JSON.stringify({
                            'message' : 'GetRequestMade',
                            'id' :  User != null && UserEmail != 'gestuser@gmail.com' ? User.id : 'null'
                        })
                    )
                }
                
            }else if(data.type == 'RemoveRequest'){
                toast(data.message.message, {
                    type: data.message.status ,
                    theme: Theme,
                    position: 'top-center'
                }) 
               requestWsStream('Groups')
            }else if (data.type == 'GetRequestMade'){
                var val = []
                var valReject = []
                var valBanned = []
                for(var x = 0; x <= (data.message.length - 1); x++){
                        //console.log(data.message[x])
                    if(data.message[x].status == "False"){   
                                             
                         val.push(data.message[x].RoomName)
                        dispatch({
                            type :PendingRequestReducer,
                            payload : val
                        })
                        continue
                    }else if(data.message[x].status == 'Reject'){
                        SetReject(valReject)
                        valReject.push(data.message[x].RoomName)
                        dispatch({
                            type :RejectListReducer,
                            payload : valReject
                        })
                        continue
                    }else if(data.message[x].status == 'Banned'){
                        valBanned.push(data.message[x].RoomName)
                        SetBanned(valBanned)
                        dispatch({
                            type :BannedListReducer,
                            payload : valBanned
                        })
                        continue
                }
                   
                }
            }else if (data.type == 'RequestsList'){
                var val = data.message
                if(val.type == 'success'){
                    SetRequestList(val.data)
                    dispatch({
                            type : RequestsListReducer,
                            payload : val.data
                        }
                    )
                }else if(val.type == 'error'){
                    toast(val.result,{
                        theme : Theme,
                        position : 'top-right',
                        type : val.status
                    })
                }
                
            }else if (data.type == 'UpdateRequest'){
                toast(data.message.message, {
                    type: data.message.status ,
                    theme: Theme,
                    position: 'top-center'
                })
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'RequestsList',
                        'email' :  UserEmail
                    })
                    )

                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'GetRequestMade',
                        'id' :  UserEmail
                    })
                    )
                
            }else if (data.type == 'Chats'){
                if(data.message){
                    
                    SetChatsList(data.message)
                    SetonlineData(data.Ioss13_32kjb[0])
                    SetofflineData(data.Ioss13_32kjb[1])
                    dispatch({
                        type : ChatListReducer,
                        payload :data.message
                    }
                    ) 
                }
                
                //console.log('running ',HeaderLogValChats.email )
                // if(HeaderLogValChats.email != ''){
                //     var isonline = data.Ioss13_32kjb[0].includes(HeaderLogValChats.email)
                //     if(isonline == true && HeaderLogValChats.isonline == false){
                //         //console.log('found: ',isonline)
                //         SetHeaderLogValChats((e) => {
                //             return {
                //                 ...e,
                //                 'isonline' : isonline
                //             }
                //         })
                //     }
                    
                // }
                
                
                
            }else if (data.type == 'Suggestions'){
                if(data.message.status == 'error'){
                    // an errror occured
                }else if(data.message.IsContinue == 'True'){
                    var existingData = SuggestionsList
                    var newdata = data.message.data == null ?  SuggestionsList : existingData.concat(data.message.data)
                    
                    SetSuggestionsList(newdata)
                    SetDispChoice('Suggestions')
                    dispatch({
                        type : SuggestedListReducer,
                        payload :newdata
                    }
                    )
                }else {
                    SetSuggestionsList(data.message.data)
                    SetDispChoice('Suggestions')
                    dispatch({
                        type : SuggestedListReducer,
                        payload :data.message.data
                    }
                    )
                }
                
            }else if (data.type == 'SuggestionsGroups'){
                if(data.message.status == 'error'){
                    // an error occured
                }else if(data.message.IsContinue == 'True'){
                    var existingData = GroupList
                    var newdata = data.message.data == null ?  GroupList : existingData.concat(data.message.data)
                    
                    SetGroupList(newdata)
                    dispatch({
                        type : GroupListReducer,
                        payload :newdata
                    }
                    )
                    SetDispChoice('Groups')
                }else {
                    SetGroupList(data.message.data)
                    SetDispChoice('Groups')
                    dispatch({
                        type : GroupListReducer,
                        payload :data.message.data
                    }
                    )
                }
                
            }else if (data.type == 'CreateFriend'){
                toast(data.message.message, {
                    type: data.message.status ,
                    theme: Theme,
                    position: 'top-center'
                })
            }else if(data.type == 'NotePadlogs') {
                if(!data.message.status){
                    SetNotePadlogs(data.message)
                    dispatch({
                        type : NotePadlogsReducer,
                        payload : data.message
                        }
                    )
                }else{
                    toast(data.message.message, {
                        type: data.message.status ,
                        theme: Theme,
                        position: 'top-center'
                    }) 
                }
                
            }else if (data.type == 'AddNote'){
                if(!data.message.status){
                    SetNotePadlogs(data.message)
                    dispatch({
                        type : NotePadlogsReducer,
                        payload : data.message
                    }
                    )
                    toast('Added Successfuly', {
                        type: 'success',
                        theme: Theme,
                        position: 'top-center'
                    })
                }else{
                    toast(data.message.message, {
                        type: data.message.status ,
                        theme: Theme,
                        position: 'top-center'
                    }) 
                }
            }else if (data.type == 'SubmitNoteChat'){
                if(!data.message.status){
                    SetNoteChatLog(data.message)                   
                    
                }else{
                    toast(data.message.message, {
                        type: data.message.status ,
                        theme: Theme,
                        position: 'top-center'
                    }) 
                }
            }else if (data.type == 'NotePadlogsDelete'){
                if(!data.message.status){
                    SetNotePadlogs(data.message)
                    dispatch({
                        type : NotePadlogsReducer,
                        payload : data.message
                    }
                    )
                    toast('Deleted Successfuly', {
                        type: 'success',
                        theme: Theme,
                        position: 'top-center'
                    })                  
                    
                }else{
                    toast(data.message.message, {
                        type: data.message.status ,
                        theme: Theme,
                        position: 'top-center'
                    }) 
                }
            }else if (data.type == 'EditProfile'){
                toast(data.message.message, {
                    type: data.message.status ,
                    theme: Theme,
                    position: 'top-center'
                })
                //load_user()
            }else if (data.type == 'RequestDeleteInbox'){
                var val = data.message
                if(val.type == 'success'){
                    if (val.scope == 'Chats'){
                        SetChatsList(val.list)                        
                        dispatch({
                                type : ChatListReducer,
                                payload :val.list
                            }
                        )
                    }else if(val.scope == 'Groups'){
                        SetGroupList(val.list)
                        dispatch({
                            type : GroupListReducer,
                            payload :val.list
                            }
                        )
                    }else if(val.scope == 'Community'){
                        SetCommunityList(val.list)
                        dispatch({
                            type : CommunityListReducer,
                            payload : JSON.stringify(val.list)
                            }
                        )
                    }


                    toast(val.result, {
                        type: val.type ,
                        theme: Theme,
                        position: 'top-right'
                    })
                }else if (val.type == 'error'){
                    toast(val.result, {
                        type: val.type ,
                        theme: Theme,
                        position: 'top-right'
                    })
                }
            }
        };
        WsDataStream.current.onopen = (e) => {
            //SetDispChoice('Suggestions')
            // toast('Connection Established', {
            //     type: 'success',
            //     theme: Theme,
            //     position: 'top-right',
            // })
            if(msg == null){            
                dispatch({
                    type : 'ClearLists'
                })
                    
                }
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'Chats',
                        'RecieverId' : UserId,
                        'email' : UserEmail,
                    })
                    )
            SetPauseTimmer(false)
        }
         
        WsDataStream.current.onclose = function (e) {
          //console.log('closing due to :',e)
        //   toast('Connection Closed', {
        //       type: 'error',
        //       theme: Theme,
        //       position: 'top-right',
        //   })
          
        }
        if(WsDataStream.current.readyState === WsDataStream.current.OPEN){
            if(msg == 'EditProfile') {
                SetProfile((e) => {
                    return {
                        ...e,
                        'edit' : false
                    }
                })
                // const formData = new FormData();
                // formData.append('file', Profile.File);                    
                // formData.append('name',Profile.ProfilePicName)
                // Profile.File != null ? UploadFile(formData) : ''
                // WsDataStream.current.send(
                //     JSON.stringify({
                //         'message' : 'EditProfile',
                //         'name' : Profile.name,
                //         'ProfilePic' :  Profile.ProfilePicName,
                //         'email' : UserEmail,
                //         'about' : Profile.About
                //     })
                // )
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'EditProfile',
                        'name' : Profile.name,
                        'email' : UserEmail,
                        'about' : Profile.About
                    })
                )
            }else if(msg == 'SubmitNoteChat') {
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'SubmitNoteChat',
                        'title' : NotePadComponents.SelectedTitle,
                        'email' : UserEmail,
                        'text' : NotePadComponents.chatMessage
                    })
                    )
            }else if(msg == 'NotePadlogsDelete') {
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'NotePadlogsDelete',
                        'email' : UserEmail,
                        'title' : body
                    })
                    )
            }else if(msg == 'AddNote') {
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'AddNote',
                        'email' : UserEmail,
                        'title' : NotePadComponents.NewNoteTitle
                    })
                    )
            }else if(msg == 'NotePadlogs') {
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'NotePadlogs',
                        'email' : UserEmail
                    })
                    )
            }else if(msg == 'CreateFriend') {

                WsDataStream.current.send(
                    JSON.stringify({
                        'detailval' : body[1],
                        'SenderId' :  body[0],
                        'RecieverId' : User.id,
                        'message' : 'CreateFriend'
                    })
                )
            
            }else if(msg == 'JoinRequest'){
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'JoinRequest',
                        'email' :  UserEmail,
                        'name' : User != null ? User.name : '',
                        'id' :  User != null ? User.id : 'null',
                        'roomName' : room,
                        'GroupName' : body,
                        'profilePic' :  User != null ? User.ProfilePic : 'null'
                    })
                    )
                // WsDataStream.current.send(
                //     JSON.stringify({
                //         'message' : 'Groups',
                //         'email' : UserEmail
                //     })
                //     )
            }else if(msg == 'RemoveRequest'){
                WsDataStream.current.send(
                    JSON.stringify(body)
                    )
            }else if(msg == 'UpdateRequest'){
                    WsDataStream.current.send(
                    JSON.stringify(body)
                    )
            }else if (msg == 'Suggestions'){
                
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'Suggestions',
                        'SearchUser' : body,
                        'email' : UserEmail,
                        'RecieverId' : User != null ? User.id : 'null',
                        'IsContinue' : aditional ? aditional[0] : false,
                        'ContinuetionId' : aditional ? aditional[1] : false
                    })
                )
            }else if (msg == 'SuggestionsGroups'){
               
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'SuggestionsGroups',
                        'SearchUser' : body,
                        'email' : UserEmail,
                        'IsContinue' : aditional ? aditional[0] : false,
                        'ContinuetionId' : aditional ? aditional[1] : false
                    })
                )
            }else if(msg == 'Chats'){
                if(UserEmail != 'null' && UserEmail != 'gestuser@gmail.com'){
                    WsDataStream.current.send(
                        JSON.stringify({
                            'message' : 'Chats',
                            'RecieverId' : UserId,
                            'email' : UserEmail,
                        })
                    )
                }                
            }else if(msg == 'Groups'){
                    SetReject([])
                    SetBanned([])
                    dispatch({
                        type : 'ClearLists'
                    })
                    WsDataStream.current.send(
                        JSON.stringify({
                            'message' : String(msg),
                            'email' : UserEmail
                        })
                        )

                   dispatch({
                    type : PendingRequestReducer,
                    payload : []
                   })
                    WsDataStream.current.send(
                        JSON.stringify({
                            'message' : 'GetRequestMade',
                            'id' :  User != null ? User.id : 'null',
                        })
                        )
            }else if(msg == 'RequestsList'){
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'RequestsList',
                        'email' :  UserEmail
                    })
                )
            }else if(msg == 'RequestMoreChatsLog'){
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'RequestMoreChatsLog',
                        'scope' : OpenedInboxType,
                        'email' :  UserEmail,
                        'data': body
                    })
                )
            }else if(msg == 'RequestDeleteInbox'){
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'RequestDeleteInbox',
                        'data': body
                    })
                )
            }else if(msg == 'Community'){
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'Community',
                        'SearchUser' : body,
                        'IsContinue' : aditional ? aditional[0] : false,
                        'ContinuetionId' : aditional ? aditional[1] : false 
                    })
                )
            }else {
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : String(msg)
                    })
                    )
            }
            
        }
        
    }  
    function StartRefresh(props,val){
        
         if(props){   
            if(val == 'Chats'){
                requestWsStream('Chats')
            }
        }
    }
  
    const Uploader = (props) => {
        var File =  UploaderFile.current.files[0] ?  UploaderFile.current.files[0] : props

        if(File ){
            var Types = String(File.type).split('/')
            
            if(Types[0] == 'image'){
                var imgDis = document.getElementById('UploadedPic')     
                const render = new FileReader()
                    render.onload = function (e) {
                            imgDis.src = e.target.result
                            SetUploadVal({
                                'src' : e.target.result,
                                'upload' : 'image',
                                File : File
                            })
                        }            
                    render.readAsDataURL(File)
                    SetShow((e) => {
                        return {
                            ...e,
                            UploadedImg : true,
                            UploadedFile : false,
                            UploadedAudio : false,
                            UploadedVideo : false,
                            UploadedFileName : File.name
                        }
                    })
                    
            }else if(Types[0] == 'video'){
                var videoDis = document.getElementById('UploadedVideo')
                const render = new FileReader()
                render.onload = function (e) {
                        videoDis.src = e.target.result
                        SetUploadVal({
                            'src' : e.target.result,
                            'upload' : 'video',
                            File : File
                        })
                    }            
                render.readAsDataURL(File)
                SetShow((e) => {
                    return {
                        ...e,
                        UploadedImg : false,
                        UploadedAudio :false,
                        UploadedVideo : true,
                        UploadedFile : false,
                        UploadedFileName : File.name
                    }
                })
            }else if(Types[0] == 'audio'){
                var AudioDis = document.getElementById('UploadedAudio')
                const render = new FileReader()
                render.onload = function (e) {
                        AudioDis.src = e.target.result
                        SetUploadVal({
                            'src' : e.target.result,
                            'upload' : 'audio',
                            File : File
                        })
                    }            
                render.readAsDataURL(File)
                SetShow((e) => {
                    return {
                        ...e,
                        UploadedImg : false,
                        UploadedVideo : false,
                        UploadedFile : false,
                        UploadedAudio :true,
                        UploadedFileName : File.name
                    }
                })
            }else {
                const render = new FileReader()
                render.onload = function (e) {                        
                        SetUploadVal({
                            'src' : e.target.result,
                            'upload' : 'file',
                            File : File
                        })
                        SetShow((e) => {
                            return {
                                ...e,
                                UploadedImg : false,
                                UploadedVideo : false,
                                UploadedAudio :false,
                                UploadedFile : true,
                                UploadedFileName : File.name
                            }
                        })
                }                
                render.readAsDataURL(File)
            }
            
        }

       
    }
   
    const TriggerUpload = () => {

        UploaderFile.current.click()
    }
    const TriggerProfilePicUpload = () => {
        
        UploaderProfilePic.current.click()
    }
    const TriggerShowCreateMessegerContainerRef = () => {
        
        ShowCreateMessegerContainerRef.current.click()
    }
    function encryptData(propsval,data) {
        if(propsval != null){
            return CryptoJS.AES.encrypt(data, HeaderLogValChats.EncryptionKey).toString();
        }
    }
    function decryptData(propsval,ciphertext) {
        if(propsval){
            const bytes = CryptoJS.AES.decrypt(ciphertext, HeaderLogValChats.EncryptionKey);
            return bytes.toString(CryptoJS.enc.Utf8);
        }
      }
    const SendChat =(action='null',delId = 'null') => {
        
        
        if( (ChatMessageRef.current != null && Generaldata.chatMessage != '' || UploadVal.File != null || action != 'null') && (UserEmail != 'gestuser@gmail.com' && UserEmail != 'null' ) ){
            ChatMessageRef.current.value = null
            
            
            if(WsEvent.current.readyState === WsEvent.current.OPEN){
                var TopMessegeId = ChatLog[0] ? ChatLog[0].id : null
                if(UploadVal.File){
                    // const uniqueId = uuid();
                    // const smallId = uniqueId.slice(0, 18);
                    // const date = new Date()
                    // const valDate = date.toLocaleTimeString()
                    // var xName =  `${valDate}-${smallId}`.replace(/ /g, "")
                    // var YName = `${xName}${Show.UploadedFileName}`.replace(/ /g, "")
                    //console.log(YName)
                    const formData = new FormData();
                    const reader = new FileReader();
                   var inboxEmail = InboxScope == 'Chats' ? HeaderLogValChats.email : HeaderLogVal.Creator
                   var inboxRefId =  InboxScope != 'Chats' ? HeaderLogVal.InboxId : ''
                   reader.readAsArrayBuffer(UploadVal.File);
                    formData.append('file', UploadVal.File);
                    
                    formData.append('name',Show.UploadedFileName)
                    formData.append('email',UserEmail)
                    formData.append('InboxType',InboxScope)
                    formData.append('inboxRef',inboxEmail)
                    formData.append('inboxRefId',inboxRefId)
                    formData.append('scope','UploadChatFile')
                    UploadProfileFile(formData)
                   
                    UploaderFile.current.value = ""
                    SetShow((e) => {
                        return {
                            UploadedImg : false,
                            UploadedVideo : false,
                            UploadedFileName : null,
                            UploadedAudio : false,
                            VoiceNoteDot : false
                        }
                    })
                    
                }
                if(!IsPrivate){
                    WsEvent.current.send(
                    JSON.stringify({
                        'group_name' : HeaderLogVal.group_name, 
                        'scope' : InboxScope,
                        'sender' : User != null ? User.name : 'null',
                        'email' :  UserEmail,  
                        'reciever' : '',
                        'message' : Generaldata.chatMessage,
                        'upload' : UploadVal.upload,
                        'src' : UploadVal.File ? Show.UploadedFileName : 'null',
                        'action' : action,
                        'ReplyChat' : Show.ReplyChat ,
                        'ReplyChatName' : Show.ReplyChatName, 
                        'delId' : delId,
                        'inboxId' : HeaderLogVal.InboxId,
                        'InboxType':InboxScope,
                        'TopMessegeId' : TopMessegeId
                        })
                    )
                }else if(IsPrivate){
                    var messegeEncrypted = encryptData('encrypt',Generaldata.chatMessage)
                    
                    WsEvent.current.send(
                        JSON.stringify({
                            'group_name' : HeaderLogValChats.group_name, 
                            'scope' : 'Chats',
                            'email' : UserEmail,  
                            'name' :  User != null ? User.name : 'null',  
                            'SenderId' : SenderIdVal[0],
                            'RecieverId' :  SenderIdVal[1],                                
                            'message' :messegeEncrypted, //Generaldata.chatMessage,
                            'upload' : UploadVal.upload,
                            'src' : UploadVal.File ? Show.UploadedFileName : 'null',
                            'action' : action,
                            'delId' : delId,
                            'ReplyChat' : Show.ReplyChat,
                            'ReplyChatName' : Show.ReplyChatName,
                            'inboxEmail' : HeaderLogValChats.email,
                            'TopMessegeId' : TopMessegeId
                            })
                        )
                }
                

                SetUploadVal((e) => {
                    return {
                        ...e,
                        'File' : null,
                        'upload' : '',
                        'src' : ''
                    }
                })
                SetShow((e) => {
                    return {
                        ...e,
                        UploadedImg : false,
                        UploadedFile : false,
                        UploadedAudio : false,
                        UploadedVideo : false,
                        UploadedFileName :null,
                        ReplyChatDiv : false,
                        ReplyChat : '',
                        ReplyChatName : ''
                    }
                })
                SetGeneraldata((e) => {
                    return {
                        ...e,
                        'chatMessage' : ''
                    }
                })

            }else {
                if(!navigator.onLine){
                    toast('You are currently offline !', {
                    type: 'warning', 
                    theme: Theme,
                    position: 'top-right',
                    });
                }else {
                toast('Online.', {
                    type: 'success', 
                    theme: Theme,
                    position: 'top-right',
                });
                }
            }
        }else if(UserEmail == 'gestuser@gmail.com'){
            SetUploadVal((e) => {
                return {
                    ...e,
                    'File' : null,
                    'upload' : '',
                    'src' : ''
                }
            })
            SetShow((e) => {
                return {
                    ...e,
                    UploadedImg : false,
                    UploadedFile : false,
                    UploadedAudio : false,
                    UploadedVideo : false,
                    UploadedFileName :null,
                    ReplyChatDiv : false,
                    ReplyChat : '',
                    ReplyChatName : ''
                }
            })
            SetGeneraldata({
                'searchVal': "",
                'chatMessage' : ''
                })
            document.getElementById('chatMessage').value = ''
            toast('Sign Up to chat',{
                position : 'top-right',
                theme : Theme,
                type : 'warning'
            })
        }else {
            toast('Cannot send an empty chat !', {
                type: 'warning', 
                theme: Theme,
                position: 'top-right',
              });
            return
        }
       
        
    }
    
   async function PastDataText(props) {
    //ChatMessageRef.current.value = props
    
    try {
        const clipboardData = await navigator.clipboard.readText();
        console.log('Clipboard data:', clipboardData);
        ChatMessageRef.current.value = clipboardData
          SetGeneraldata((e) => {
                return {
                    ...e,
                    'chatMessage' : clipboardData
                }
            })
      } catch (error) {
        console.error('Failed to read clipboard data:', error);
      }
  

   }

   function SplitChatLogRegularExpression (props){
        if (props != null){
            const excludeList = ['seconds ago', 'minute ago','minutes ago','hour ago', 'hours ago', 'day ago','days ago', 'month ago', 'months ago', 'year ago', 'years ago', 'just now'];
            // Build a regular expression dynamically from the list
            const excludeRegex = new RegExp(`\\b(${excludeList.join('|')})\\b`, 'i');
            var x = String(props).toLocaleLowerCase()
            var array = x.split('\n').filter(line => !excludeRegex.test(line));
            return array
        }
   }
  
   const SearchChat = (event) => {
    const {value} = event.target
    if(value != ''){
        SetShowSearchArrow(true) 
        const ValueSub = String(value).toLocaleLowerCase()
        var val  = ChatlogContainer.current.innerText
        var array = SplitChatLogRegularExpression(val)
       
        var NumberCount = 0
        var previousechatSeach = SearchContainer.storeChatSearch
        var SetVariable = new Set(previousechatSeach)
        //console.log(SearchContainer)
        for (let pos = 0; pos < array.length; pos++) {
            var obj = array[pos]
            var text = String(obj).toLocaleLowerCase()
            
            if(String(text).match(ValueSub)){
                NumberCount += 1
                
                SetVariable.add(obj)
                var uniqueArray = Array.from(SetVariable)
                //console.log(SetVariable)
                SetSearchContainer((e) => {
                    return {
                        ...e,
                        'storeChatSearch' : uniqueArray
                    }
                })
                
                
            }            
        }
        SetSearchContainer((e) => {
            return {
                ...e,
                'SearchChatNumber' : NumberCount
            }
        })
        
        //console.log(SearchContainer)
    }else {
        SetSearchContainer((e) => {
            return {
                'storeChatSearch' : [],
                'SearchChatNumber' : 'null'
            }
        })
        SetShowSearchArrow(false)
    }
    

    
   }
  
   const NextSearch = (props) => {
       
        const Container = document.getElementById('ChatlogContainer')
        //console.log(Container.clientHeight,Container.scrollHeight,Container.offsetHeight)
        const Movement= (position) => {
            var Child = Container.childNodes
            
            var x = Child.length - 1
            outerloop: for(var i = 0; i <= x; i ++){
                var y = Container.childNodes[i].innerText
                var yList = SplitChatLogRegularExpression(y)
               for (let xx = 0; xx < yList.length; xx++) {
                if(yList[xx] == SearchContainer.storeChatSearch[position]) {
                    var y = Container.childNodes[i]
                    var screen = window.innerWidth <= 425 ? 550 : 266
                    var chatmessege = document.getElementById(`ChatMesseger-${y.id}`)
                    Container.scrollTo({
                        'top' : y.offsetTop - screen,
                        'behavior' : 'smooth',
                    })
                    chatmessege.style.boxShadow = '0 4px 6px -1px  #e11d48'
                    
                    setTimeout(() => {
                       chatmessege.style.boxShadow = '0 4px 6px -1px transparent'
                    }, 2000);
                    break outerloop
                } 
                
               }

            }
        }
        if(props == 'up'){
            var len = SearchContainer.storeChatSearch.length
            var position = Count >= len ? 0 : Count + 1  
            SetCount(position)
            
            Movement(position)
            
            
        }else if(props == 'down'){  
            var len = SearchContainer.storeChatSearch.length
            var position =  Count != 0 ?  Count - 1 : len  
            SetCount(position)
            Movement(position)
        }
   }

   const TriggerVoiceNote = (props) => {
        if(props == 'down') {
            SetShow((e) => {
                return {
                    ...e,
                    VoiceNoteDot : true
                }
            })
            startRecording()
        }else if (props == 'up'){
            SetShow((e) => {
                return {
                    ...e,
                    VoiceNoteDot : false
                }
            })
            stopRecording()
        }
   }

   function EmojisFunc(e) {
        if(ChatMessageRef.current){
            var chat = document.querySelector('#chatMessage')
            //ChatMessageRef.current.innerText = chat + e.emoji
            chat.value = chat.value + e.emoji
            SetGeneraldata((e) => {
                return {
                    ...e,
                    'chatMessage' : chat.value 
                }
            })
        }
   }
   const MapUSerList = UsersList.map((items,i) => {
        return (
            <p className=" hover:text-amber-500" key={i}>{items}</p>
        )
    })

    function Addnote (event) {
        
        const {value,name} = event.target
        SetNotePadComponents((e) => {
            return {
            ...e,
            [name] : value
            }
        })
        
    }
    function AddNoteFunc(props) {
        if(props == 'show'){
            SetNotePadComponents((e) => {
                    return {
                    ...e,
                    'addNote' : true,
                    'NoteList' : false,
                    'ShowNoteChatLog' : false
                    }
                })
        }else if(props == 'Add'){
            if(User != null && UserEmail != 'gestuser@gmail.com' && UserEmail != ''){
                    requestWsStream('AddNote',null,null)
                    toast('Processing', {
                        type: 'info',
                        theme: Theme,
                        position: 'top-center'
                    })
                    SetNotePadComponents((e) => {
                        return {
                        ...e,
                        'addNote' : false,
                        'NoteList' : true,
                        'ShowNoteChatLog' : false
                        }
                    }) 
                    document.getElementById('NewNoteTitle').value = ''
            }else{
                toast('Sign Up to manage notes',{
                    position : 'top-right',
                    theme : Theme,
                    type : 'warning'
                })
            
            }
        }
        
    }
    function OpenNoteChat(props,title = null) {
    
        if(props != null && props != 'null') {
            SetNotePadComponents((e) => {
                return {
                ...e,
                'addNote' : false,
                'NoteList' : false,
                'ShowNoteChatLog' : true,
                'SelectedTitle' : title,
                }
            })

             
            
            var val = NotePadlogs[props].NoteLog
            val ? SetNoteChatLog(val) : SetNoteChatLog([])
            
        }

    }
    function FetchNotes () {

        requestWsStream('NotePadlogs')
        SetShowNotePad(true)

    }
    function ClearUpload (props) {
        if(props){
            SetShow((e) => {
                return {
                    ...e,
                    UploadedImg : false,
                    UploadedFile : false,
                    UploadedAudio : false,
                    UploadedVideo : false,
                    UploadedFileName :null,
                    ReplyChatDiv : false,
                    ReplyChat : '',
                    ReplyChatName : ''
                }
            })
            SetUploadVal((e) => {
                return {
                    ...e,
                    'File' : null,
                    'upload' : '',
                    'src' : ''
                }
            })
        }
    }
    function SubmitNoteChatFunc() {
        if(User != null && UserEmail != '' && UserEmail != 'gestuser@gmail.com' && NotePadComponents.chatMessage != ''){
            var chat = document.querySelector('#NotePadChatBox')
            chat.value = ''
            requestWsStream('SubmitNoteChat',null,null)
        }else if(NotePadComponents.chatMessage == ''){
            toast('Note down a text',{
                position : 'top-right',
                theme : Theme,
                type : 'warning'
            })
        }else{
            toast('Sign Up to manage notes',{
                position : 'top-right',
                theme : Theme,
                type : 'warning'
            })
    
    }
    }
    function CloseNoteChat(props) {
        SetNotePadComponents((e) => {
            return {
            ...e,
            'addNote' : false,
            'NoteList' : true,
            'ShowNoteChatLog' : false
            }
        })    
        requestWsStream('NotePadlogs')
    }

    function ScrollingChatListContainer (propsval) {
        if(propsval != null){
            if(ChatlogContainer.current != null && ChatLog[0]) {
                
                var commentContainer = ChatlogContainer.current
                var ChatListLoadingAnimationContainer = ChatListLoadingAnimation.current
                
                if (commentContainer.scrollTop == 0) {
                    var TopMessegeId = ChatLog[0] ? ChatLog[0].id : null
                    ChatListLoadingAnimationContainer.style = 'flex'
                    if(IsPrivate == true && TopMessegeId != null){
                        var bodyval = {
                            'SenderId' : SenderIdVal[0],
                            'RecieverId' :  SenderIdVal[1], 
                            'TopMessegeId' : TopMessegeId,
                            'group_name' : '',
                        }
                        
                       requestWsStream('RequestMoreChatsLog',null,bodyval) 
                    }else if(!IsPrivate && TopMessegeId != null) {
                        var bodyval = {
                            'SenderId' : '',
                            'RecieverId' :  '', 
                            'group_name' : HeaderLogVal.group_name,
                            'TopMessegeId' : TopMessegeId,

                        }
                        requestWsStream('RequestMoreChatsLog',null,bodyval) 
                    }
                    
                    
                }
            }
        }
    }
    useEffect(() => {
        if(NoteChatLogContainer.current){
            var Log = NoteChatLogContainer.current
            Log.scrollTo({
                'top' : Log.scrollHeight ,
                'behavior' : 'smooth',
            })
        }
            
    },[NoteChatLog])
    const NotePadTimeUpdater = ({dateString}) => {
        const date = new Date(dateString); // Convert 'DD-MM-YYYY' to 'YYYY-MM-DD'
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'week', seconds: 604800 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 }
        ];
        
        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count > 0) {
                var val = count === 1 ? `1 ${interval.label} ago` : `${count} ${interval.label}s ago`

                return val
            }
        }

        return 'just now';
    }
    const NotePadlogsMapper = NotePadlogs.map((items,i) => {

        return (
            <div  key={i} className=" cursor-pointer hover:shadow-md hover:shadow-slate-500 dark:hover:shadow-slate-600 rounded-md border-[1px] border-gray-400 text-slate-800 flex flex-col w-full gap-1 text-left  tooltip-info tooltip tooltip-top" >
                <div className=" flex flex-row justify-between px-2 align-middle w-full">
                    <big onClick={() => OpenNoteChat(i,items.title)} className=" w-[90%] text-ellipsis max-w-[90%]  overflow-hidden  " >{i + 1}{`)`} {items.title}</big>
                    <button onClick={() => requestWsStream('NotePadlogsDelete',null,items.title)} data-tip='Delete' className="tooltip min-w-[10px]  tooltip-left" >
                    <RiDeleteBinLine className=' hover:text-red-600 text-lg opacity-40 hover:opacity-100 rounded-full bg-transparent cursor-pointer my-auto'  />
                    </button>
                </div>
                <div onClick={() => OpenNoteChat(i,items.title)} className=" flex flex-row justify-between w-full">
                    <input className=" cursor-pointer text-ellipsis max-w-[60%] align-middle my-auto bg-transparent text-gray-500 italic border-none "  readOnly value={items.LastText} type="text" />
                    
                    <small className=" overflow-hidden text-ellipsis text-sm my-auto ml-auto font-mono italic"><NotePadTimeUpdater dateString={items.DateCreated} /></small>
                </div>
            </div>
        )
    })

    const NotePadChatLogMapper = NoteChatLog.map((items,i) => {

        return (
            <div  key={i} className={`chat chat-start  bg-transparent flex px-2 w-[95%] max-w-[98%] bg-opacity-90 my-1 mx-2 rounded-sm  mr-auto  flex-col gap-1`}>
                <div className={`chat-bubble bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100 shadow-md shadow-slate-400 dark:shadow-slate-50 flex-col gap-2 w-full flex rounded-md p-3 `}>
                                        
                    <blockquote className={` max-w-[250px] break-words  font-mono text-sm `} >{items.text}</blockquote>
                    <div className={` flex-row justify-end gap-2 sm:gap-3 md:gap-4 w-full flex `}>
                        <small className={`  italic font-semibold font-mono w-full text-right dark:text-cyan-500 pr-3' `}><NotePadTimeUpdater dateString={items.time} /></small>                       
                    </div>                    
                </div>
            </div>
        )
    })
    function EditProfile () {
        if(Profile.edit && UserEmail != 'gestuser@gmail.com'){
            SetProfile((e) => {
                return {
                    ...e,
                    'edit' : false,
                    'About' : User != null ? User.about : '',
                    'name' : User != null ? User.name : '',
                    'email': UserEmail,
                    'ProfilePic' : User != null ? User.ProfilePic : ''
                }
            })
        }else if(UserEmail == 'gestuser@gmail.com'){
            
            toast('Sign Up to mange account',{
                position : 'top-right',
                theme : Theme,
                type : 'warning'
            })
        }else{
            SetProfile((e) => {
                return {
                    ...e,
                    'edit' : !e.edit
                }
            })
        }
        
    }
    const OnProfileChange = (event) => {
        const {value, name} = event.target
        SetProfile((e) => {
            return {
                ...e,
                [name] : value
            }
        })
    }
    function UploadProfilePicFunc () {
        var File =  UploaderProfilePic.current.files[0] ?  UploaderProfilePic.current.files[0] : null
        if(File != null){
            const render = new FileReader()
            render.onload = function (e) {
                var imageurl = e.target.result
                document.getElementById('ProfileProfilePicImage').src= imageurl
                SetProfile((e) => {
                    return {
                        ...e,
                        'File' : imageurl,
                        'ProfilePicName' : File.name
                    }
                })
            }            
            render.readAsDataURL(File)
        }
        
    }
    function UploadNewMessegePicFunc () {
        var File =  ShowCreateMessegerContainerRef.current.files[0] ?  ShowCreateMessegerContainerRef.current.files[0] : null
        if(File != null){
            const render = new FileReader()
            render.onload = function (e) {
                var imageurl = e.target.result
                //document.getElementById('ShowCreateMessegerContainerImgDisp').src= imageurl
                SetShowCreateMessegerContainer((e) => {
                    return {
                        ...e,
                        'profilePic': imageurl,
                        'file' : File,
                        'profilePicName' : File.name
                    }
                })
            }            
            render.readAsDataURL(File)
        }
        
    }
    useLayoutEffect(() => {
        if(WsDataStream == null){
            SetDispChoice('Chats')
        }
    },[WsDataStream])
    const SkeletonArray = [1,2,3,4,5,6,7,8,9,10]
    const SkeletonDiv = SkeletonArray.map((items,i) => {
        return (
            <div key={i} className="flex w-52 p-2 rounded-md md:mx-auto md:my-0 my-auto min-w-[200px] max-w-[200px] max-h-[100px] bg-transparent cursor-pointer transition-all duration-300 flex-col gap-4">
                <div className="skeleton transition-all duration-300 dark:bg-slate-600 h-32 w-full"></div>
            </div>
        )
    })
    
    function ToogleShowAddUserContainer (props,scopeval) {
        if (props == 'show'){
            SetShowAddUserContainer((e) => {
                return {
                    ...e,
                    'show' : true
                }
            })
            SetDispChoice('')
        }else if(props == 'hide'){
            SetShowAddUserContainer((e) => {
                return {
                    ...e,
                    'show' : false,
                    'UserDetails' : '',
                    'scope' : 'Suggestions'
                }
            })
            SetSuggestionsList([])
            SetDispChoice('Chats')
        }else if(props == 'more'){
            var val = ShowAddUserContainer.UserDetails
            var position  = SuggestionsList[0] ? SuggestionsList[SuggestionsList.length - 1].id : false
            var Groupposition  = GroupList[0] ? GroupList[GroupList.length - 1].id : false
            var Communityposition  = CommunityList[0] ? CommunityList[CommunityList.length - 1].id : false
            //requestWsStream('Suggestions',null,val,[true,position])
            if(ShowAddUserContainer.scope == 'Suggestions'){
                requestWsStream('Suggestions',null,val,[true,position])
            }else if(ShowAddUserContainer.scope == 'Groups'){
                var val = ShowAddUserContainer.UserDetails
                requestWsStream('SuggestionsGroups',null,val,[true,Groupposition])
            }else if(ShowAddUserContainer.scope == 'Community'){
                var val = ShowAddUserContainer.UserDetails
                requestWsStream('Community',null,val,[true,Communityposition])
            }
        }else if (props == 'scope') {
            SetShowAddUserContainer((e) => {
                return {
                    ...e,
                    'scope' : scopeval
                }
            })
            SetDispChoice(scopeval)
        }else if (props == 'submit' && UserEmail != 'gestuser@gmail.com'){
            var val = ShowAddUserContainer.UserDetails
            if(ShowAddUserContainer.scope == 'Suggestions'){
                requestWsStream('Suggestions',null,val,false)
            }else if(ShowAddUserContainer.scope == 'Groups'){
                var val = ShowAddUserContainer.UserDetails
                requestWsStream('SuggestionsGroups',null,val,false)
            }else if(ShowAddUserContainer.scope == 'Community'){
                var val = ShowAddUserContainer.UserDetails
                requestWsStream('Community',null,val,false)
            }
            
        }else if (UserEmail == 'gestuser@gmail.com'){
            toast('Sign up to manage chats',{
                theme : Theme,
                position : 'top-right',
                type : 'warning'
            })
        }
    }
    
    function ToogleDeleteContainer(props) {
        if(props == 'show' && UserEmail != 'gestuser@gmail.com'){
            var emailval = InboxScope == 'Chats' ? HeaderLogValChats.email : HeaderLogVal.Creator
            var nameval = InboxScope == 'Chats' ? HeaderLogValChats.Name : ''
            var inboxid = InboxScope == 'Chats' ? HeaderLogValChats.InboxId : HeaderLogVal.InboxId
            SetDeleteContainer((e) => {
                return {
                    ...e,
                    'email' : emailval,
                    'scope' : InboxScope,
                    'name' : nameval,
                    'InboxId' : inboxid,
                    'show' : true
                }
            })
            SetDisplayMore(false)
        }else if(props == 'hide' && UserEmail != 'gestuser@gmail.com'){
            SetDeleteContainer((e) => {
                return {
                    ...e,
                    'email' : '',
                    'name': '',
                    'show' : false
                }
            })
        }else if(props == 'delete' && UserEmail != 'gestuser@gmail.com'){
            
            toast('Processing, please wait.',{
                position : 'top-right',
                theme : Theme,
                type : 'info'
            })
            var bodyval = {
                'inboxEmail' : InboxScope == 'Chats' ? DeleteContainer.email : '',
                'inboxId' : DeleteContainer.InboxId,
                'id' : User != null ? User.id : '',
                'email' : UserEmail,
                'scope' : InboxScope
            }
            requestWsStream('RequestDeleteInbox',null,bodyval)
            SetDeleteContainer((e) => {
                return {
                    ...e,
                    'email' : '',
                    'name': '',
                    'show' : false,
                    'scope' : ''
                }
            })
            CloseChat()
        }else if (UserEmail == 'gestuser@gmail.com'){
            toast('Sign up to manage chats',{
                position : 'top-right',
                theme : Theme,
                type : 'warning'
            })
        }
    }
    function ToogleAddMessegerContainer(props,body = null) {
        if(props == 'show' && UserEmail != 'gestuser@gmail.com'){
             SetShowCreateMessegerContainer((e) => {
                return {
                    ...e,
                    'email' : UserEmail,
                    'scope' : body,
                    'show' : true
                }
            })
        }else if(props == 'hide' && UserEmail != 'gestuser@gmail.com'){
            SetShowCreateMessegerContainer((e) => {
                return {
                    ...e,
                    'email' : '',
                    'scope' : '',
                    'show' : false
                }
            })
        }else if(props == 'submit' && UserEmail != 'gestuser@gmail.com'){
            
            toast('Processing, please wait.',{
                position : 'top-right',
                theme : Theme,
                type : 'info'
            })
            dispatch({
                type : SUCCESS_EVENT,
                payload : 'ok'
            })
            
            const formData = new FormData();
            formData.append('file', ShowCreateMessegerContainer.file);  
            var data = {
                'email' : ShowCreateMessegerContainer.email,
                'name': ShowCreateMessegerContainer.name,
                'username' :UserName,
                'scope' : ShowCreateMessegerContainer.scope,
                'about' : ShowCreateMessegerContainer.about,
                'description' : ShowCreateMessegerContainer.description,
                'profilePicName' : ShowCreateMessegerContainer.profilePicName,
            }                  
            formData.append('data',JSON.stringify(data))
            formData.append('scope', 'CreateNewMesseger')
            UploadProfileFile(formData)
            SetShowCreateMessegerContainer((e) => {
                return {
                    ...e,
                    'email' : '',
                    'name': '',
                    'show' : false,
                    'file' : null,
                    'scope' : '',
                    'about' : '',
                    'description' : '',
                    'profilePic' : null,
                    'profilePicName' : '',
                }
            })
            SetDispChoice('Chats')
            ShowCreateMessegerContainerRef.current.value = null
        }else if (UserEmail == 'gestuser@gmail.com'){
            toast('Sign up to manage chats',{
                position : 'top-right',
                theme : Theme,
                type : 'warning'
            })
        }
    }
    const ShowCreateMessegerContainerChange = (event) => {
        const {name,value}= event.target
        SetShowCreateMessegerContainer((e) => {
            return {
                ...e,
                [name] : value
            }
        })
    }
    function ClearNewMessegerImage (props){
        if (props){
            SetShowCreateMessegerContainer((e) => {
                return {
                    ...e,
                    'profilePic' : null,
                    'profilePicName' : ''
                }
            })
        }
    }
    function RequestMoreCommunities (props){
        if(props != null && UserEmail != 'gestuser@gmail.com'){
            var id = CommunityList[0] ? CommunityList[CommunityList.length -1].id : ''
           
            if (id != ''){
                requestWsStream('Community',null,null,[true,id])
            }
        }else if(UserEmail == 'gestuser@gmail.com'){
            toast('Sign up to access more communities',{
                position : 'top-right',
                theme : Theme,
                type : 'warning'
            })
        }
    }
    function CloseNotepadApp (props){
        if(props != null){
            SetShowNotePad(false)
            SetNotePadlogs([])
            SetNoteChatLog([])
            dispatch({
                type : NotePadlogsReducer,
                payload : []
                }
            )
        }
    }
    function CloseMediaGallary (props) {
        if(props != null){
            SetMediaGallary((e) => {
                return {
                    'src' : '',
                    'show' : false,
                    'type' : ''
                }
            })
        }
    }
    return(
        <div className={` w-full md:h-full h-full ${Theme}`}>
            <div className=" overflow-hidden  w-full h-full  min-h-full">
                 {/*media galary displayer */}
                <div className={` ${MediaGallary.show ? 'fixed flex flex-row' : 'hidden'}  z-50 w-full bg-transparent dark:bg-slate-800 bg-slate-300 bg-opacity-30 dark:bg-opacity-30 `} >
                    <div className={` flex flex-col px-2 py-4 w-fit max-w-[95%] justify-start mx-auto mt-10 dark:bg-slate-800 bg-slate-300 bg-opacity-70 border-slate-500 dark:border-slate-500 border-[1px] dark:bg-opacity-70 h-fit max-h-[80vh]  sm:w-[90%] sm:max-w-[600px] rounded-md pt-2  `} >
                        <button onClick={() => CloseMediaGallary('close')} data-tip='close' className=" tooltip tooltip-bottom my-auto ml-auto mr-2 mt-1 w-fit " >
                            <MdOutlineAdd className={`rotate-45 cursor-pointer text-lg xs:text-2xl  text-slate-600  dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 z-30 transition-all duration-30  lg:text-2xl `} />
                        </button>
                        {/* container for image */}
                        <div className={` ${MediaGallary.type == 'image' ? '' : 'hidden'} m-auto w-full min-w-full h-full min-h-full `} >
                            <img loading="lazy"
                                className= {` ${MediaGallary.type == 'image' ? ' h-fit m-auto max-h-[500px]  mask-square rounded-b-md ' : ' hidden'} `}
                                src={MediaGallary.src} 
                            />
                        </div>
                        {/* container for video */}
                        <div className={` ${MediaGallary.type == 'video' ? '' : 'hidden'} m-auto w-full min-w-full h-fit`} >
                            <video 
                                loading="lazy" 
                                preload="auto" 
                                controlsList="nodownload" data-no-fullscreen="true" 
                                src={MediaGallary.src} 
                                className={` ${MediaGallary.type == 'video' ? 'flex' : 'hidden'} w-full m-auto h-fit p-0 border-none rounded-b-md min-h-[400px] `} width="320" height="240" type="video/*" controls>
                                    Your browser does not support the video tag.
                            </video>
                        </div>
                        
                    </div>
                </div>
                {/* top tools */}
                <div className=" mb-[1px] z-40 bg-transparent transition-all duration-700 flex flex-row w-full justify-between px-4 sm:px-8 ">
                    <div className=" w-fit flex py-2 flex-row">
                        {/* search bar */}
                        <div className="input max-h-[40px] w-[80%] rounded-sm  px-1 xs:px-2 max-w-[500px] border-[1px] border-slate-600 bg-transparent dark:bg-transparent flex justify-start items-center ">
                            <CiSearch  onClick={SearchFunc}  className=" cursor-pointer text-lg xs:text-2xl min-w-[20px] xs:min-w-[30px] text-slate-800 dark:text-slate-300" />
                            <input id='postTitle' 
                                onChange={WriteGeneraldata}
                                onMouseEnter={() => SetShowSearch(false)}
                                onMouseLeave={() => SetShowSearch(true)}
                                onKeyUp={(e) => {
                                    if (e.key === 'Enter') {
                                        SearchFunc() // Call your function here
                                    }
                                  }}
                                name="searchVal" 
                                className='mx-auto text-slate-900 dark:text-slate-100 focus:outline-none ring-0 max-h-[35px] placeholder:text-slate-500 dark:placeholder:text-slate-300 bg-slate-100 bg-opacity-20 outline-1 outline-none   border-none placeholder:text-left border-slate-900  rounded-sm px-2 w-[80%] sg:w-full'  
                                placeholder="search" 
                                type="text"  />
                            <IoPersonAddOutline onClick={() => ToogleShowAddUserContainer('show')} className=" text-lg cursor-pointer hover:text-rose-500 dark:hover:text-sky-400  ml-2 min-w-[20px] xs:min-w-[30px] text-slate-800 dark:text-slate-300" />

                        </div>

                    </div>
                   
                    <div className=" relative flex">
                        <div onClick={() => SetShowProfile((e) => !e)} className={` ${navigator.onLine ? 'avatar online' : 'avatar offline'} cursor-pointer z-40 dark:border-slate-600 dark:text-slate-100 hover:dark:shadow-slate-200 shadow-md hover:shadow-slate-800  flex justify-center align-middle text-center my-auto min-w-[50px] max-w-[100px] border-[1px] border-slate-800 rounded-sm py-3 `}>
                            <CgProfile  className=" hover:text-sky-400 text-lg cursor-pointer" />
                        </div>
                        <div className={` right-full absolute translate-x-12 sm:translate-x-0  border-[1px] border-slate-950 dark:border-slate-600 rounded-sm bg-slate-900 bg-opacity-90 min-w-[300px]  transition-all duration-500 h-fit min-h-[100px]  flex flex-row  ${ShowProfile ? 'z-50 visible opacity-100' : ' z-0 invisible opacity-0'}`}>
                                <div className=" my-2 flex flex-col gap-0 h-full w-[95%] text-center align-middle">
                                    <img loading="lazy" id="ProfileProfilePicImage" onClick={() => !Profile.edit ? OpenImage(Profile.ProfilePic,'image') : 'null'  } src={`${Profile.ProfilePic}`}  className={`  cursor-pointer rounded-md mx-auto my-auto w-16 h-16 sm:min-h-fit sm:max-h-32 sm:max-w-32 sm:min-w-fit  `}  alt="" />
                                    < MdOutlineFileUpload onClick={TriggerProfilePicUpload} title="upload" className= {` ${Profile.edit ? 'flex mx-auto' : 'hidden'} hidden hover:text-xl transition-all duration-300 dark:hover:text-lime-500 text-slate-100 mx-auto mt-2 mb-3 hover:text-blue-600 cursor-pointer text-lg   my-auto `}/>
                                    <input  ref={UploaderProfilePic} accept="image/*" onChange={UploadProfilePicFunc} className=" hidden text-sm h-fit my-auto" type="file" />
                                    <span className=" mb-1 w-full mt-1 justify-around gap-3 pl-2  flex flex-row align-middle">
                                        <p  className=" min-w-[50px] font-[PoppinsN] sm:min-w-[100px] w-fit text-slate-200 my-auto text-left mr-auto align-middle">Name: </p>
                                        <input onChange={OnProfileChange} name='name'   className="h-fit font-[PoppinsN] my-auto text-slate-200 text-sm outline-sky-600 disabled:outline-none bg-transparent text-left w-fit border-sky-600  disabled:border-none text-ellipsis" disabled={!Profile.edit} type="text" value={`${Profile.name}`} />

                                    </span>
                                    <span className=" mb-1 w-full justify-around gap-3 pl-2  flex flex-row align-middle">
                                        <p className=" font-[PoppinsN] min-w-[50px] sm:min-w-[100px] w-fit  text-slate-200 my-auto text-left mr-auto align-middle">Email: </p>
                                        <input name='email'   className="font-[PoppinsN] h-fit my-auto text-slate-200 text-sm outline-none bg-transparent text-left w-fit  border-sky-600  disabled:border-none  text-ellipsis" disabled type="text" value={`${Profile.email}`} />
                                    </span>
                                    <span className=" mb-1 w-full justify-around gap-3 pl-2  flex flex-row align-middle">
                                        <p className=" font-[PoppinsN] min-w-[50px] sm:min-w-[*0px] w-fit  text-slate-200 my-auto text-left mr-auto align-middle">About: </p>
                                        <textarea onChange={OnProfileChange} maxLength={80} name='About' disabled={!Profile.edit}   className="h-fit font-[PoppinsN] my-auto text-slate-200 text-sm outline-none bg-transparent text-left w-fit min-w-fit max-h-[100px] min-h-[50px]  border-sky-600  disabled:border-none  text-ellipsis" value={Profile.About} />
                                    </span>
                                    <span className= {` ${UserEmail != 'gestuser@gmail.com' ? '' : 'hidden'} mb-1 w-full justify-around gap-3 pl-2 py-2 flex flex-row align-middle overflow-hidden `}>
                                        <button onClick={EditProfile}  className="font-[PoppinsN] min-w-[50px] sm:min-w-[60px] px-2  text-slate-100 py-1 hover:bg-orange-600 transition-all duration-300 m-auto text-sm rounded-sm mr-auto align-middle bg-sky-600 text-center  w-fit">{Profile.edit ? 'Cancel' : 'Edit'}</button>
                                        <button onClick={() => requestWsStream('EditProfile')}  className= {`font-[PoppinsN] px-2 ${Profile.edit ? 'flex justify-center' : ' translate-y-[300%]'} min-w-[50px] sm:min-w-[80px]  text-slate-100 py-1 hover:bg-yellow-400 hover:text-slate-900 transition-all duration-300 m-auto text-sm rounded-sm mr-auto align-middle bg-orange-600 text-center  w-fit `}>Submit</button>
                                    </span>
                                </div>
                                <span onClick={() => SetShowProfile(false)} className={` cursor-pointer w-fit h-fit text-lg hover:text-amber-500 text-slate-100 px-2  mb-auto ml-auto text-center`}>&times;</span>
                        </div>
                    </div>

                </div>

                <div className="dark:bg-slate-900 z-40 bg-slate-300 dark:text-slate-100  flex flex-col  md:flex-row-reverse gap-3 w-full h-full">

                    <div className=" flex flex-col  gap-1 w-full md:w-[25%] md:min-w-fit lg:w-[20%]">
                        <div className=" flex flex-row z-40 md:w-[80%] text-slate-800 dark:text-slate-100 xl:max-w-[300px] md:mx-auto flex-wrap justify-around p-2  gap-2 text-sm font-semibold md:text-base">
                                <p className={`hover:text-orange-500 hidden my-auto cursor-pointer transition-all md:mx-auto w-fit duration-300 ${DispChoice == 'Suggestions' ? '       dark:border-orange-500 text-sky-400' : ''} `} onClick={() => ToogleDispChoice('Suggestions')} >Suggestions </p>
                                <p className={` hover:underline-offset-4 hover:underline hover:decoration-green-500 dark:hover:decoration-sky-400 transition-all duration-300 cursor-pointer md:mx-auto my-auto w-fit ${DispChoice == 'Chats' ? '     dark:border-sky-400 text-sky-500' : ''} `} onClick={() => ToogleDispChoice('Chats')}>Chats</p>                            
                                <p className={`hover:underline-offset-4 hover:underline hover:decoration-green-500 dark:hover:decoration-sky-400 transition-all md:mx-auto w-fit duration-300 cursor-pointer ${DispChoice == 'Groups' ? '       dark:border-sky-400 text-sky-500' : ''} `} onClick={() => ToogleDispChoice('Groups')} >Groups</p>
                                <p className={`hover:underline-offset-4 hover:underline hover:decoration-green-500 dark:hover:decoration-sky-400 transition-all md:mx-auto w-fit duration-300 cursor-pointer ${DispChoice == 'Community' ? '       dark:border-sky-400 text-sky-500' : ''} `} onClick={() => ToogleDispChoice('Community')} >Community</p>
                                <p className={`hover:underline-offset-4 hover:underline hover:decoration-green-500 dark:hover:decoration-sky-400 transition-all md:mx-auto w-fit duration-300 cursor-pointer ${DispChoice == 'RequestsList'   ? '     dark:border-sky-400 text-sky-500' : ''} `} onClick={() => ToogleDispChoice('RequestsList')} >Requests</p>
                           
                        </div>
                        {/* add new user container */}
                        <div className={` ${ShowAddUserContainer.show ? 'flex flex-col' : 'hidden'} justify-start  rounded-md border-slate-600 dark:border-slate-500 w-[90%] xs:w-[300px] min-h-[150px] md:w-[250px] gap-3 py-2 md:mr-2 px-2 border-[1px] mx-auto `} >
                            <div className=" w-full min-w-full flex flex-row justify-around" >
                                <div className="flex text-sm gap-4 ml-1 text-slate-800 dark:text-slate-200 flex-row py-3 sm:py-1 overflow-x-auto" >
                                    <button onClick={() => ToogleShowAddUserContainer('scope','Suggestions')} className={` ${ShowAddUserContainer.scope == 'Suggestions' ? ' opacity-100 underline underline-offset-4 text-green-600 dark:text-sky-400 ' : 'opacity-50 hover:opacity-80 '} `}  >Chats</button>
                                    <button onClick={() => ToogleShowAddUserContainer('scope','Groups')} className={` ${ShowAddUserContainer.scope == 'Groups' ? ' opacity-100 underline underline-offset-4 text-green-600 dark:text-sky-400 ' : 'opacity-50 hover:opacity-80 '} `} >Groups</button>
                                    <button onClick={() => ToogleShowAddUserContainer('scope','Community')} className={` ${ShowAddUserContainer.scope == 'Community' ? ' opacity-100 underline underline-offset-4 text-green-600 dark:text-sky-400 ' : 'opacity-50 hover:opacity-80 '} `} >Community</button>
                                </div>
                                <IoMdAdd onClick={() => ToogleShowAddUserContainer('hide')} className= {` cursor-pointer dark:text-rose-300 rotate-45  ml-auto mr-1 mt-1  text-lg `} />
                            </div>
                            <p className=" text-sm text-slate-600 dark:text-slate-100 pr-2 md:pl-0 md:pr-2" >
                                Enter {ShowAddUserContainer.scope == 'Suggestions' ? 'user name or email to start a chat': 
                                ShowAddUserContainer.scope == 'Community'? 'community name to search communities' :
                                 'group name to search groups'}
                             </p>
                            <label className="input max-h-[40px] w-full mt-2 rounded-sm  px-1 xs:px-2 max-w-[500px] border-[1px] border-slate-600 bg-transparent dark:bg-transparent flex justify-start items-center ">
                                <CiUser   className=" cursor-pointer text-lg xs:text-2xl min-w-[20px] xs:min-w-[30px] text-slate-800 dark:text-slate-300" />
                                <input id='UserDetails' 
                                    onChange={WriteAddnewUserDetails}
                                    onKeyUp={(e) => {
                                        if (e.key === 'Enter') {
                                            // Call your function here
                                        }
                                    }}
                                    name="UserDetails" 
                                    value={ShowAddUserContainer.UserDetails}
                                    className='mx-auto text-slate-900 dark:text-slate-100 focus:outline-none ring-0 max-h-[35px] placeholder:text-slate-500 dark:placeholder:text-slate-300 bg-slate-100 bg-opacity-20 outline-1 outline-none   border-none placeholder:text-left border-slate-900  rounded-sm px-2 w-full'  
                                    placeholder="name" 
                                    type="email"  />
                            </label>
                            <div className="flex flex-row justify-around w-full min-w-full" >
                                <button onClick={() => ToogleShowAddUserContainer('submit')}  data-tip="Search" className={`  ${ShowAddUserContainer.UserDetails != '' ? 'flex md:flex' : 'hidden' } tooltip rounded-sm py-2 px-4 text-sm font-[PoppinsN] text-slate-950 border-[1px] w-fit mx-auto hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 bg-transparent bg-opacity-35 hover:bg-sky-700 transition-all duration-500 hover:bg-opacity-40 dark:text-slate-300  border-sky-600 `}>Submit</button>
                                <button onClick={() => ToogleShowAddUserContainer('more')}  data-tip="more users" className={`  ${ShowAddUserContainer.UserDetails != '' && SuggestionsList[0] ? 'flex md:flex' : ShowAddUserContainer.scope == 'Community' && CommunityList[0] ? 'flex md:flex' : 'hidden' } tooltip rounded-sm py-2 px-4 text-sm font-[PoppinsN] text-slate-950 border-[1px] w-fit mx-auto hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 bg-transparent bg-opacity-35 hover:bg-sky-700 transition-all duration-500 hover:bg-opacity-40 dark:text-slate-300  border-sky-600 `}>more</button>
                            </div>

                        </div>          
                        <Suspense fallback={SkeletonDiv}>
                            <div className=" z-40  min-h-[130px] md:overflow-x-hidden md:h-[80%]  justify-around md:justify-start  align-middle md:overflow-y-auto flex flex-row md:max-h-[550px]   overflow-auto w-full py-3 px-4 sm:gap-2 gap-3 md:flex-col">
                                {DispChoice == 'Chats' ? WsDataStreamOpened ? ChatsList[0] ? MapperChatList : <MapperNoList messege={'Chats'} /> : SkeletonDiv 
                                : DispChoice == 'Groups' ? WsDataStreamOpened ? <MapperGroupList /> 
                                : SkeletonDiv : DispChoice == 'Community' ? WsDataStreamOpened ?  <MapperCommunityList />
                                : SkeletonDiv : DispChoice == 'RequestsList' ? WsDataStreamOpened ? <MapperRequests />
                                : SkeletonDiv : DispChoice == 'Suggestions' ? WsDataStreamOpened ? <MapperSuggestions /> 
                                : SkeletonDiv : SkeletonDiv } 
                                <button onClick={() => RequestMoreCommunities('more')} data-tip="More Communities" className={`  ${DispChoice == 'Community' && CommunityList[0] ? ' hidden ' : 'hidden' } tooltip rounded-sm tooltip-left md:tooltip-top py-2 px-4 text-sm my-auto font-[PoppinsN] text-slate-950 border-[1px] w-fit mx-auto hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 bg-transparent bg-opacity-35 hover:bg-sky-700 transition-all duration-500 hover:bg-opacity-40 dark:text-slate-300  border-sky-600 `}>More</button>
                            </div>
                        </Suspense>
                       
                    </div>
                
                    <div className=" w-full md:w-[80%] min-h-[400px] h-screen">
                        
                        <section className={` overflow-x-hidden  mt-5 w-[98%] md:w-[90%] rounded-md border-slate-500 border-[1px] ${ShowChatDisp ? 'flex flex-col justify-between' : 'hidden'}   m-auto md:mx-auto bg-transparent dark:text-slate-100  h-[90%]`}>
                                {/* top sticky header */}
                                <div className=" bg-transparent top-0 m-2 sticky z-40 scroll-mt-4  min-h-[40px] flex flex-row  max-h-[50px]">
                                    <div className={` ${!DisplayMore ? 'z-30' : ' z-20' } flex flex-row justify-around  h-full gap-0 w-[90%] mr-auto py-1`} >
                                        <div className={` ${ HeaderLogValChats.isonline == true && IsPrivate == true ? 'avatar online' : IsPrivate == false ? '': 'avatar offline'} `} >
                                           <img loading="lazy" onClick={() => {OpenImage(HeaderLogVal.ProfilePic)}} src={`${import.meta.env.VITE_WS_API}${HeaderLogVal.ProfilePic}`}  className={` ${!IsPrivate ? ' flex' : 'hidden'} cursor-pointer rounded-full mr-auto ml-[3px] my-auto w-10   h-10 `}  alt="" />
                                            <img loading="lazy" onClick={() => {OpenImagePrivate(HeaderLogValChats.ProfilePic)}} src={`${HeaderLogValChats.ProfilePic}`}  className={` ${IsPrivate ? 'flex' : 'hidden'} cursor-pointer rounded-full mr-auto ml-[3px] my-auto w-10   h-10 `}  alt="" />
                                          
                                        </div>
                                       <div className=" px-2 mr-auto flex flex-col h-full text-slate-900 dark:text-slate-200 justify-center gap-1 w-[90%]">
                                           <div className={` ${ !IsPrivate ? 'flex flex-row gap-2' : ' hidden'} align-middle w-fit`}>
                                                <input  className=" font-[PoppinsN] h-fit my-auto text-sm outline-none bg-transparent text-left w-full max-w-full  border-none text-ellipsis" readOnly type="text" value={`${HeaderLogVal.title}`} />
                                           </div>
                                           <div className={` ${IsPrivate ? 'flex flex-row' : 'hidden'}   gap-2 align-middle w-fit`}>
                                                <input  className=" font-[PoppinsN] flex h-fit my-auto text-sm outline-none bg-transparent text-left w-full max-w-full  border-none text-ellipsis" readOnly type="text" value={`${HeaderLogValChats.Name}`} />
                                           </div>
                                            <input  className={`font-[PoppinsN]  ${!IsPrivate ? 'flex' : 'hidden'} h-fit text-sm my-auto outline-none bg-transparent text-left w-full max-w-full  border-none text-ellipsis`} readOnly type="text" value={`${HeaderLogVal.about}`} />
                                            <input  className={`font-[PoppinsN]  ${IsPrivate ? 'flex' : 'hidden'} h-fit text-sm my-auto outline-none bg-transparent text-left w-full max-w-full  border-none text-ellipsis`} readOnly type="text" value={`${HeaderLogValChats.about}`} />
                                        </div>                                        
                                    </div>
                                    <div className=" dark:text-slate-100 text-slate-800 w-[10%] flex align-middle justify-center">
                                            <IoMdMore onClick={() => SetDisplayMore((e) => !e )} title="more" className={` text-base ${DisplayMore ? '' : ' z-20'}  cursor-pointer hover:text-3xl hover:md:text-4xl my-auto text-2xl md:text-3xl`} />
                                            <div className={` absolute mr-[90%] sm:mr-[70%] xl:mr-[50%] 2xl:mr-[25%] bg-slate-900 bg-opacity-80 border-[1px] border-slate-950 dark:border-slate-600 rounded-sm  dark:bg-slate-900 dark:bg-opacity-90 min-w-[300px] transition-all duration-500 h-fit min-h-[100px]  ${DisplayMore ? ' flex flex-row z-30 opacity-100' : ' z-0 opacity-0 hidden '}`}>
                                                    <div className=" my-2 flex flex-col gap-0 h-full w-[95%] text-center align-middle">
                                                        <img loading="lazy" onClick={() => OpenImage(HeaderLogVal.ProfilePic)} title="profile pic" src={`${import.meta.env.VITE_WS_API}${HeaderLogVal.ProfilePic}`} className={` ${!IsPrivate ? 'flex' : 'hidden'} cursor-pointer rounded-md mx-auto my-auto w-16 h-16 sm:min-h-fit sm:max-h-24 sm:max-w-24 sm:min-w-fit `}  alt="" />
                                                        <img loading="lazy" onClick={() => {OpenImagePrivate(HeaderLogValChats.ProfilePic)}} src={`${HeaderLogValChats.ProfilePic}`}  className={` ${IsPrivate ? 'flex' : 'hidden'} cursor-pointer rounded-md mx-auto my-auto w-16 h-16 sm:min-h-fit sm:max-h-24 sm:max-w-24 sm:min-w-fit  `}  alt="" />
                                                        <span className=" mb-1 w-full justify-between gap-3 pl-2  flex flex-row align-middle">
                                                            <p  className=" font-[PoppinsN] min-w-[50px] sm:min-w-[100px] w-fit text-slate-200 my-auto text-left mr-auto align-middle">Name: </p>
                                                            <input   className="font-[PoppinsN] h-fit my-auto text-slate-200 text-sm outline-none bg-transparent text-left w-fit  border-none text-ellipsis" disabled type="text" value={`${!IsPrivate ? HeaderLogVal.title : HeaderLogValChats.Name}`} />
                                                        </span>
                                                        <span className=" mb-1 w-full justify-between gap-3 pl-2  flex flex-row align-middle">
                                                            <p  className=" font-[PoppinsN] sm:min-w-[100px] w-fit  text-slate-200 my-auto min-w-fit text-left mr-auto align-middle">Created On: </p>
                                                            <input   className="font-[PoppinsN] h-fit my-auto text-slate-200 max-w-full text-sm outline-none bg-transparent text-left w-fit  border-none text-ellipsis" disabled type="text" value={`${!IsPrivate ?  HeaderLogVal.createdOn : HeaderLogValChats.createdOn}`} />
                                                        </span>
                                                        <span className=" mb-1 w-full justify-between gap-0 pl-2  flex flex-rowbg-red-700 align-middle">
                                                            <p  className=" font-[PoppinsN] w-fit max-w-[110px] min-w-[110px] text-slate-200  mt-0 mr-auto pt-1 text-left align-middle">{!IsPrivate ? 'Description:' : 'About:' } </p>
                                                            <textarea disabled   className="font-[PoppinsN] h-fit  text-slate-200 text-sm outline-none bg-transparent min-w-[50%] text-left w-full mt-0 border-none min-h-[50px] max-h-[100px] max-w-[300px]: text-ellipsis" value={ !IsPrivate ? HeaderLogVal.description : HeaderLogValChats.about} />
                                                        </span>
                                                       <span className=" my-2 w-full justify-between gap-3 pl-2  flex flex-row align-middle">
                                                            <p  className=" font-[PoppinsN] w-fit min-w-[50px] sm:min-w-[80px]  text-slate-200 my-auto text-left mr-auto align-middle">Search: </p>
                                                            <input onChange={SearchChat} className="h-fit font-[PoppinsN] my-auto text-slate-200 text-sm outline-none bg-transparent text-left w-fit  border-[1px] focus:ring-2 focus:border-none focus:ring-purple-700 border-dotted border-gray-400  max-w-[130px] mr-auto  text-ellipsis"  type="text" />
                                                            <small className={` text-slate-900 bg-slate-400 font-semibold h-fit m-auto rounded-sm px-1 ${SearchContainer.SearchChatNumber != 'null' && ShowSearchArrow ?'flex' : 'hidden'}`} >{SearchContainer.SearchChatNumber}</small>
                                                            <FaAngleLeft  onClick={() =>NextSearch('up')} className={` ${ShowSearchArrow ? 'flex' : 'hidden'} text-slate-200 cursor-pointer hover:bg-slate-100 hover:px-1 rounded-sm hover:text-xl rotate-90 text-lg hover:text-purple-700`} />
                                                            <FaAngleLeft  onClick={() =>NextSearch('down')}  className={` ${ShowSearchArrow ? 'flex' : 'hidden'} text-slate-200 cursor-pointer hover:bg-slate-100 hover:px-1 rounded-sm hover:text-xl rotate-[270deg] text-lg hover:text-purple-700`} />
                                                        </span> 
                                                        <span className={` ${!IsPrivate && UserEmail != 'gestuser@gmail.com' ?'flex flex-row' : 'hidden'} my-2 w-full justify-between gap-3 pl-2 relative align-middle`}>
                                                            <p  className=" font-[PoppinsN] w-fit sm:min-w-[100px] text-slate-200 my-auto min-w-fit text-left mr-auto align-middle">Members: </p>
                                                            <input   className="font-[PoppinsN] h-fit my-auto text-slate-200 max-w-full text-sm outline-none bg-transparent text-left w-fit  border-none text-ellipsis" disabled type="text" value={UsersList[0] ? UsersList.length : ''} />
                                                        </span>
                                                        <span className= {` ${ UserEmail!= 'gestuser@gmail.com' && InboxScope == 'Chats' ? 'flex flex-row ' : UserEmail!= 'gestuser@gmail.com' && HeaderLogVal.Creator == UserEmail && InboxScope != 'Chats' ? 'flex flex-row ' : 'hidden'} mb-1 w-full justify-start gap-3 pl-2  align-middle `}>
                                                            <p  className=" font-[PoppinsN] w-fit min-w-[50px] sm:min-w-[110px]  text-slate-200 my-auto text-left  align-middle">Delete Chat: </p>
                                                            <button onClick={() => ToogleDeleteContainer('show')}  className="h-fit font-[PoppinsN] bg-rose-500 my-auto hover:text-slate-100 hover:bg-black font-semibold text-sm   px-1 py-1 rounded-sm text-slate-800 outline-none text-left w-fit  border-none text-ellipsis"  >Delete</button>
                                                        </span>
                                                        <span className=" mb-1 w-full justify-start gap-3 pl-2  flex flex-row align-middle">
                                                            <p  className=" font-[PoppinsN] w-fit min-w-[50px] sm:min-w-[110px]  text-slate-200 my-auto text-left  align-middle">Close Chat: </p>
                                                            <button   className="font-[PoppinsN] h-fit bg-slate-300 my-auto hover:text-slate-900 hover:bg-slate-50 font-semibold text-sm   px-1 py-1 rounded-sm text-slate-800 outline-none text-left w-fit  border-none text-ellipsis" onClick={CloseChat} >Close</button>
                                                        </span>
                                                    </div>
                                                    <span onClick={() => SetDisplayMore(false)} className={` cursor-pointer w-fit h-fit text-lg hover:text-amber-500 text-slate-100 px-2  mb-auto ml-auto text-center`}>&times;</span>
                                            </div>
                                            <div className={` absolute mr-[90%] sm:mr-[70%] xl:mr-[50%] 2xl:mr-[25%] text-slate-100 bg-slate-900 bg-opacity-80 border-[1px] border-slate-950 dark:border-slate-600 rounded-sm  dark:bg-slate-900 dark:bg-opacity-90 min-w-[300px] transition-all duration-500 h-fit min-h-[100px]  ${DeleteContainer.show ? ' flex flex-col z-30 opacity-100' : ' z-0 opacity-0 hidden '}`}>
                                                <progress className="progress w-[80%] mx-auto mt-2 progress-error opacity-80 "></progress>
                                                <p className=" px-2 text-center" >Once deleted, this {InboxScope == 'Chats' ? `Inbox cannot be recovered and will also be deleted from ${DeleteContainer.name}.` : `${InboxScope} cannot be recovered.` }</p>
                                                <div className=" flex flex-row flex-wrap w-full justify-around my-2 min-w-full" >
                                                    <button  onClick={() => ToogleDeleteContainer('hide')} data-tip='Return'   className="h-fit  font-[PoppinsN] tooltip tooltip-top tooltip-secondary bg-slate-300 my-auto hover:text-slate-900 hover:bg-slate-50 font-semibold text-sm   px-1 py-1 rounded-sm text-slate-800 outline-none text-left w-fit  border-none text-ellipsis"  >Cancel</button>
                                                    <button  onClick={() => ToogleDeleteContainer('delete')} data-tip='Proceed' className="h-fit font-[PoppinsN]  tooltip tooltip-secondary tooltip-top bg-rose-500 my-auto hover:text-slate-100 hover:bg-black font-semibold text-sm   px-1 py-1 rounded-sm text-slate-800 outline-none text-left w-fit  border-none text-ellipsis"  >Delete</button>

                                                </div>
                                            </div>
                                    </div>

                                </div>
                                {/* chat log */}
                                <div onScroll={() =>ScrollingChatListContainer('scroll')}  id="ChatlogContainer" ref={ChatlogContainer} className={` z-20 bg-transparent flex flex-col overflow-auto w-full gap-1 border-y-[1px] overflow-x-hidden dark:border-slate-500 border-slate-800 h-[85%]  `}>
                                    <span ref={ChatListLoadingAnimation} style={{display :'none'}} className={` ${DisplayMore ? ' z-20' : ' z-50'} loading sticky top-0 z-40 mx-auto loading-dots loading-lg bg-slate-600 dark:bg-slate-300 `}></span>
                                    {ChatLogMapper}
                                </div>
                                {/* text bar */}
                                <div className="  bg-transparent w-full flex relative flex-col py-2 justify-between h-fit min-h-fit z-30" >
                                        <div className=" w-full flex flex-col justify-start">
                                            <video loading="lazy" controlsList="nodownload" controls title="Uploaded Video" id="UploadedVideo" className={` ${Show.UploadedVideo ? 'flex' : 'hidden'} max-h-[100px] w-[200px] sm:max-h-[90px] ml-3 rounded-sm border-[1px]  h-fit`} src=""></video>
                                            <FaFileArrowUp className={` w-fit mr-auto text-amber-500 ${Show.UploadedFile ? 'flex' : ' hidden'} border-slate-800 min-h-[30px] max-h-10 w-[90%] md:max-w-[600px] ml-3 rounded-sm   h-fit`}  />
                                            <audio loading="lazy" controlsList="nodownload" ref={audioRef} controls title="Uploaded Audio" id="UploadedAudio" className={` ${Show.UploadedAudio ? 'flex' : ' hidden'} border-slate-800 min-h-[30px] w-[70%] md:max-w-[400px] ml-3 rounded-sm  h-fit`} src=""></audio>
                                            <img loading="lazy"  title="Uploaded image" id="UploadedPic" src={TestImg} className={` ${Show.UploadedImg ? ' flex' : 'hidden'} rounded-md ml-3 min-w-fit my-auto w-16 h-16 `}  alt="" />
                                            <small className=" my-auto px-2 text-[x-small] lg:text-sm ">{Show.UploadedFileName}</small>
                                            <div className= {` ${Show.ReplyChatDiv ? ' flex' : 'hidden'} flex-row max-w-[80%] mr-auto w-fit justify-start gap-1 `}   >
                                                <textarea className={`max-w-[250px] text-left break-words text-slate-800 dark:text-slate-100 border-slate-500 bg-transparent ml-2 h-fit max-h-[50px] min-h-fit sm:max-h-[100px] rounded-md font-mono text-sm w-[90%] p-3 tooltip textarea focus:border-slate-500 focus:outline-none ring-0 tooltip-info`} readOnly data-tip="Reply Chat"  value={Show.ReplyChat} ></textarea>
                                                <IoMdClose onClick={() => SetReply('close',null)} className="cursor-pointer mb-auto text-slate-500 hover:text-red-600 dark:hover:text-red-400  text-lg" />
                                            </div>
                                                <IoMdClose onClick={() => ClearUpload('clear')} className= {` ${UploadVal.File != null && UploadVal.upload != '' ? ' absolute top-0 left-[90%] ' : 'hidden'} cursor-pointer mb-auto text-red-600 hover:text-purple-500 mt-2 sm:mt-3 text-lg `} />
                                        </div>
                                        <div className=" ml-2 w-fit mr-auto" {...getRootProps()} >
                                            <input disabled {...getInputProps()} /> 
                                            <p className=" text-[x-small] text-slate-500 dark:text-slate-400 font-semibold cursor-pointer ">Drag and drop some files here, or click to select files</p>
                                        </div>
                                        <div  className="  bg-transparent w-full flex  gap-0 flex-row py-2 justify-between h-fit min-h-fit z-30">
                                            <textarea 
                                                ref={ChatMessageRef}
                                                onChange={WriteGeneraldata}
                                                placeholder="Type a messege" 
                                                className=" ml-2  pr-5 w-[100%] bg-transparent dark:placeholder:text-slate-500 break-words text-slate-900 outline-none min-h-[50px] max-h-[80px] dark:text-slate-300 sm:w-[100%] max-w-[800px]  rounded-md border-[1px] border-slate-500 dark:border-slate-500 my-auto  py-2"
                                                name="chatMessage" id="chatMessage">

                                            </textarea>
                                            <div className="dropdown  mb-auto mt-1 dropdown-top -translate-x-6 dropdown-left ">
                                                <BsEmojiNeutral tabIndex={0} role='button' className=" text-xl dark:hover:text-yellow-400 hover:text-opacity-100 text-yellow-500 dark:text-yellow-300 dark:text-opacity-70 transition-all duration-300 " />
                                                <div tabIndex={0} className="dropdown-content menu absolute bg-transparent -translate-x-6 z-40 w-40 xs:w-52 p-2 shadow">
                                                    {/* <EmojiPicker loading="lazy" onEmojiClick={EmojisFunc} className=" mx-auto " height={400} width={300} /> */}
                                                </div>
                                            </div>
                                            <div className=" text-right   grid sm:flex sm:flex-row sm:mr-1 sm:justify-around sm:gap-4 grid-cols-2 gap-0 justify-end mr-2 ml-auto dark:text-slate-400 text-slate-600  w-[40%] sm:max-w-[150px] md:max-w-[200px] max-w-[300px]">
                                                
                                                <input  ref={UploaderFile} onChange={Uploader} className=" hidden text-sm h-fit my-auto" type="file" />
                                                < MdOutlineFileUpload onClick={TriggerUpload} title="upload" className=" hover:text-xl transition-all duration-300 dark:hover:text-lime-500 hover:text-green-500 cursor-pointer text-lg   my-auto"/>
                                                < FaPaste onClick={PastDataText} title="Past" className=" hover:text-xl transition-all duration-300 hover:text-blue-600 cursor-pointer text-lg  my-auto"/>
                                                <span className=" relative flex flex-col h-fit my-auto align-middle w-fit justify-center gap-0">
                                                    <FaSpinner  className={` absolute mb-[150%] ml-[50%] ${Show.VoiceNoteDot ? 'flex' : 'hidden'} animate-spin h-3 w-3 text-red-500`} />
                                                     < TiMicrophone title='hold to voice record' onMouseDown={() => TriggerVoiceNote('down')} onMouseUp={() => TriggerVoiceNote('up') } className=" h-[70%] hover:text-xl  transition-all duration-300 hover:text-rose-600 cursor-pointer text-lg  my-auto"/>
                                       
                                                </span>
                                                < IoSendSharp disabled={Generaldata.chatMessage == '' || UploadVal.File ==null} onClick={() => SendChat('null','null')} title="send" className= {` ${Generaldata.chatMessage != '' || UploadVal.File !=null ? " translate-x-0 z-30" : ' translate-x-[1000%] z-0 '} hover:text-xl hover:text-red-600 duration-300 transition-all cursor-pointer text-lg  my-auto `}/>
                                            </div>
                                        </div>
                                        
                                </div>
                        </section>
                        <section  className={`  relative opacity-70 hover:opacity-80 transition-all duration-300 cursor-pointer overflow-x-hidden mt-5 w-[98%] sm:w-[80%] max-w-[700px]  rounded-md border-green-800 border-[1px] ${!ShowChatDisp && !ShowCreateMessegerContainer.show ? 'flex flex-col justify-between' : 'hidden'}   m-auto md:mx-auto bg-transparent dark:text-slate-100  h-fit`} >
                            <img loading="lazy" data-tip='No inbox selected' className=" tooltip w-full h-full sm:h-fit sm:w-fit"  src={EmptyChatImg} alt="" />
                            <span className=" text-slate-900 transition-all dark:text-slate-100 dark:bg-slate-900 absolute font-semibold font-mono w-full duration-700 mt-[20%] bg-gray-400 bg-opacity-70  text-center flex flex-row gap-0">
                               <p className=" w-full text-center duration-500 transition-all animate-none">Select any Inbox to start a chat</p> 
                            
                            </span>
                            
                        </section>
                        <section  className={` text-slate-900 relative opacity-70 py-4 px-2 gap-3 hover:opacity-80 transition-all duration-300 cursor-pointer overflow-x-hidden mt-5 w-[98%] sm:w-[80%] max-w-[400px] sm:max-w-[500px]  rounded-md border-green-800 border-[1px] ${!ShowChatDisp && ShowCreateMessegerContainer.show ? 'flex flex-col justify-between' : 'hidden'}   m-auto md:mx-auto bg-transparent overflow-visible dark:text-slate-100 min-h-fit  h-fit`} >
                            <div className="flex flex-row mb-2 justify-around gap-3 sm:justify-start sm:gap-4 w-full min-w-full" >
                                <input  ref={ShowCreateMessegerContainerRef} accept="image/*" onChange={UploadNewMessegePicFunc} className=" hidden text-sm h-fit my-auto" type="file" />
                                <img loading="lazy" id="ShowCreateMessegerContainerImgDisp" src={ShowCreateMessegerContainer.profilePic} className=" mask mask-square rounded-md min-w-fit my-auto w-16 h-16" alt="" />
                                <button onClick={TriggerShowCreateMessegerContainerRef} data-tip='Upload image' className=" tooltip tooltip-bottom mb-auto "  >
                                    < MdOutlineFileUpload title="upload" className= {`flex hover:text-xl transition-all duration-300 dark:hover:text-lime-500 text-slate-700 dark:text-slate-100 mt-2 mb-auto hover:text-blue-600 cursor-pointer text-lg   my-auto `}/>
                                </button>
                                <button data-tip='Remove image' className=" tooltip tooltip-bottom mr-auto mb-auto " >
                                    <IoMdAdd onClick={() => ClearNewMessegerImage('clear')}  className= {` cursor-pointer dark:text-rose-300 mt-2 rotate-45  text-lg `} />
                                </button>
                            </div>
                            {/* name */}
                            <label className=" font-semibold dark:text-slate-300  text-sm" htmlFor="NewMEssegerName">Name</label>
                            <label className={` input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] input-bordered border-[1px] border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-transparent flex items-center gap-2  `}>
                                <AiOutlineUsergroupAdd  className=" text-lg text-slate-800 dark:text-slate-100 " />
                                <input id="NewMEssegerName"
                                    onChange={ShowCreateMessegerContainerChange}
                                    value={ShowCreateMessegerContainer.name}
                                    placeholder={`${ShowCreateMessegerContainer.scope} name`}
                                    name="name"
                                    className='mx-auto text-slate-900 dark:text-slate-50 focus:outline-none  ring-0 placeholder:dark:text-slate-300 placeholder:text-slate-700 bg-transparent outline-1 outline-none   border-none placeholder:text-left placeholder:text-sm  border-slate-900  rounded-sm px-2 w-full' 
                                    type="text"  
                                />
                            </label>
                            {/* about */}
                            <label className=" font-semibold dark:text-slate-300  text-sm" htmlFor="NewMEssegerAbout">About</label>
                            <label className={` input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] input-bordered border-[1px] border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-transparent flex items-center gap-2  `}>
                                <CgDetailsLess   className=" text-lg text-slate-800 dark:text-slate-100 " />
                                <input id="NewMEssegerAbout"
                                onChange={ShowCreateMessegerContainerChange}
                                value={ShowCreateMessegerContainer.about}
                                    placeholder={`${ShowCreateMessegerContainer.scope} about`}
                                    name="about"
                                    className='mx-auto text-slate-900 dark:text-slate-50 focus:outline-none  ring-0 placeholder:dark:text-slate-300 placeholder:text-slate-700 bg-transparent outline-1 outline-none   border-none placeholder:text-left placeholder:text-sm  border-slate-900  rounded-sm px-2 w-full' 
                                    type="text"  
                                />
                            </label>
                            {/* description */}
                            <label className=" font-semibold dark:text-slate-300  text-sm" htmlFor="NewMEssegerDesc">Description</label>
                            <label className={` input min-h-fit w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] input-bordered border-[1px] border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-transparent flex items-center gap-2  `}>
                                <CgDetailsMore   className=" text-lg mb-auto mt-2 text-slate-800 dark:text-slate-100 " />
                                <textarea id="NewMEssegerDesc"
                                    onChange={ShowCreateMessegerContainerChange}
                                    value={ShowCreateMessegerContainer.description}
                                    placeholder={`${ShowCreateMessegerContainer.scope} description`}
                                    name="description"
                                    className='mx-auto textarea resize-y max-h-[300px] bg-transparent text-slate-900 dark:text-slate-50 mt-2 focus:outline-none  ring-0 placeholder:dark:text-slate-300 placeholder:text-slate-700 outline-1 outline-none   border-none placeholder:text-left placeholder:text-sm  border-slate-900  rounded-sm px-2 w-full' 
                                    type="text"  
                                ></textarea>
                            </label>
                            {/* buttons */}
                            <div className="flex flex-row justify-around w-full min-w-full" >
                                <button onClick={() => ToogleAddMessegerContainer('hide')}  className={` tooltip rounded-sm py-2 px-4 text-sm font-[PoppinsN] text-slate-950 border-[1px] w-fit mx-auto hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 bg-transparent bg-opacity-35 hover:bg-sky-700 transition-all duration-500 hover:bg-opacity-40 dark:text-slate-300  border-sky-600 `}>Cancel</button>
                                <button onClick={() => ToogleAddMessegerContainer('submit')} className={`tooltip rounded-sm py-2 px-4 text-sm font-[PoppinsN] text-slate-950 border-[1px] w-fit mx-auto hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 bg-transparent bg-opacity-35 hover:bg-sky-700 transition-all duration-500 hover:bg-opacity-40 dark:text-slate-300  border-sky-600 `}>Create</button>
                                    
                            </div>
                        </section>                      
                        
                    </div>
                </div>          
                <div className= {` dropdown dropdown-top dropdown-end  ml-0 left-[80%] sm:left-[90%]  top-auto  ${!ShowChatDisp ? ' fixed' : ' hidden'} bottom-2 z-50 `}>
                    {/* <button className={` z-40 float-right right-2 ${showScroller ? ' sticky' : 'hidden'} absolute  bg-blue-600 text-slate-100 p-1 md:text-base text-sm `} ><a href="#navSect"><FaArrowRightLong className=' p-1 text-xl md:text-2xl xl:text-4xl rotate-[270deg]' /></a></button> */}
                    <label tabIndex={0}  role="button" className="btn mr-3 mt-5 mb-auto btn-circle hover:bg-sky-700 dark:hover:bg-sky-700 bg-slate-700 dark:bg-slate-500 border-none outline-none swap swap-rotate">
  
                    {/* this hidden checkbox controls the state */}
                    <input className=" hidden" type="checkbox" />                  
                    {/* hamburger icon */}
                    <IoMdAdd onClick={() => SetShowMoreTools((e) => !e)} className= {`swap-on  fill-current mx-auto   text-slate-100 font-semibold cursor-pointer text-2xl `} />
                    
                    {/* close icon */}
                    <IoMdClose  onClick={() => SetShowMoreTools((e) => !e)}  className= {` swap-off  fill-current text-slate-100 font-semibold cursor-pointer text-2xl `} />
                    
                    </label>
                    <ul tabIndex={0} className=" z-50 dropdown-content dark:ring-0 ring-2 ring-sky-700  menu py-2 shadow bg-base-100 rounded-md gap-2 font-semibold w-52">
                        <li onClick={() => ToogleAddMessegerContainer('show','Groups')} className=" w-full hover:text-slate-900 p-2 cursor-pointer hover:bg-slate-300 transition-all duration-300" >Crate Group</li>
                        <li onClick={() => ToogleAddMessegerContainer('show','Community')} className=" w-full hover:text-slate-900 p-2 cursor-pointer hover:bg-slate-300 transition-all duration-300" >Crate Community</li>
                        <li className=" w-full  hover:text-slate-900 p-2 cursor-pointer hover:bg-slate-300 transition-all duration-300" onClick={FetchNotes}>NotePad</li>
                        
                    </ul>
                </div>

                <div className= {` z-40 ml-0 w-full top-auto ${!ShowChatDisp && ShowNotePad ? ' fixed' : ' hidden'} bottom-10 z-[100%] `}>
                    <div className=" min-h-[300px] mb-6 border-[1px] border-slate-900 rounded-lg ml-0 sm:ml-2 w-[95%] max-w-[95%] xs:max-w-[400px] sm:max-w-[450px] flex flex-col justify-between gap-1 bg-gray-200 dark:bg-slate-300 text-slate-900 dark:text-slate-100 ">
                        {/* header */}
                        <div className= {` ${NotePadComponents.ShowNoteChatLog ? ' border-none' : 'border-b-[1px] border-b-slate-300 ' }py-2 px-4 flex flex-row text-slate-900 border-b-[1px] border-b-slate-500 w-full justify-between `}>
                            <IoMdAdd onClick={() => AddNoteFunc('show')} className= {` ${NotePadComponents.ShowNoteChatLog || NotePadComponents.addNote  ? ' hidden' : ' flex' } cursor-pointer opacity-40 hover:opacity-100 my-auto text-2xl `} />
                            <GoArrowLeft   onClick={CloseNoteChat} data-tip="Close" className= {` tooltip tooltip-error ${!NotePadComponents.ShowNoteChatLog && !NotePadComponents.addNote ? ' hidden' : ' flex' } cursor-pointer opacity-40 hover:opacity-100  my-auto text-2xl `} />
                            <big className=" my-auto">NotePad</big>
                            <IoMdClose onClick={() => CloseNotepadApp('close')} className="cursor-pointer opacity-40 hover:opacity-100 my-auto hover:text-red-500  text-2xl" />
                        </div>
                        <big className={` ${NotePadComponents.ShowNoteChatLog ? ' flex w-full text-center justify-center align-middle mb-auto border-b-[1px] text-slate-800 border-b-slate-300 py-1 font-semibold' : ' hidden'}  `} >{NotePadComponents.SelectedTitle}</big>
                        <div className={` h-fit max-h-[400px] text-slate-900 lg:max-h-[500px] mb-auto px-1 ${NotePadComponents.NoteList ? 'flex flex-col w-full justify-start whitespace-nowrap overflow-y-auto pb-3 gap-1' : ' hidden' } `}>
                            {NotePadlogsMapper}
                        </div>
                        <div ref={NoteChatLogContainer} className={` max-h-[500px] ${NotePadComponents.ShowNoteChatLog ? ' justify-start overflow-auto h-[85%] gap-2 flex flex-col' : ' hidden'} `}>
                            {NotePadChatLogMapper}
                        </div>
                        <div className= {` text-slate-800 ${ NotePadComponents.addNote ? 'flex flex-col' : ' hidden'} w-[80%] m-auto  `}>
                            <label className=" font-semibold text-sm" htmlFor="NewNoteTitle">Note Title</label>
                            <label className={` input max-h-[40px] w-[90%] rounded-sm ml-auto px-0 pl-4 max-w-[500px] input-bordered border-[1px] border-slate-600 bg-slate-200 dark:bg-transparent flex items-center gap-2  `}>
                                <CgDetailsLess className=" text-lg text-slate-400 dark:text-slate-800 " />
                                <input id='NewNoteTitle'
                                    placeholder='my title'
                                    name="NewNoteTitle"
                                    maxLength={50}
                                    onChange={Addnote}
                                    className='mx-auto focus:outline-none ring-0  placeholder:text-slate-600 bg-transparent outline-1 outline-none   border-none placeholder:text-left placeholder:text-sm  border-slate-900  rounded-sm px-2 w-full' 
                                    type="text"  
                                />
                            </label>
                            <input  name="NewNoteTitle" className=" text-ellipsis hidden rounded-sm ring-1 ring-sky-700 bg-transparent placeholder:text-slate-600 placeholder:font-semibold" placeholder="Title" type="text" />
                            <button onClick={() => AddNoteFunc('Add')} className=" tooltip rounded-sm py-2 px-4 text-sm font-[PoppinsN] text-slate-950 border-[1px] w-fit mx-auto hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 bg-transparent bg-opacity-35 hover:bg-sky-700 transition-all duration-500 hover:bg-opacity-40  my-2  border-sky-700 " >Add</button>
                        </div>
                        <div className= {` border-t-[1px] border-t-gray-400 py-2 pb-2 h-[10%]  ${NotePadComponents.ShowNoteChatLog ?'flex flex-row justify-between' : ' hidden'} px-3 w-full `}>
                            <textarea  onChange={Addnote} className="w-[90%] bg-transparent dark:placeholder:text-slate-500 text-slate-800 outline-none  max-w-[400px]  rounded-md border-[1px] border-slate-500 dark:border-slate-500 my-auto  py-2 break-words text-left min-w-[80%] min-h-[50px] max-h-[80px] placeholder:text-gray-400" placeholder="Text goes here..." name="chatMessage" id="NotePadChatBox"></textarea>
                            <button className=" disabled:text-gray-400 " disabled={NotePadComponents.chatMessage == ''} >
                            <IoSendSharp onClick={SubmitNoteChatFunc} title="send" className=" text-slate-800 opacity-40 hover:opacity-100 disabled:hover:text-gray-400 cursor-pointer text-lg  my-auto"/>
                            </button>
                        </div>
                    </div>
                </div>                

            </div>
        </div>
    )
};

const mapStateToProps =  state => ({
    isAuthenticated:state.chatReducer.isAuthenticated
})    


export default connect(mapStateToProps,{UploadFile,UploadProfileFile,load_user, logout,CheckAuthenticated})(Chat);