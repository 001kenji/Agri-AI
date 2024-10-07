import React, { useCallback,useEffect, useLayoutEffect, Suspense, useRef, useState } from "react";
import { UploadFile } from "../actions/Chat";
import '../App.css'
import Navbar from "../Components/navbar";
import { v4 as uuid } from 'uuid';
import EmojiPicker from 'emoji-picker-react';
import {useDropzone} from 'react-dropzone'
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { Link, Navigate, generatePath, json } from "react-router-dom";
import {connect, useDispatch, useSelector} from 'react-redux'
import { login,CheckAuthenticated,logout,load_user } from "../actions/auth";
import { RiDeleteBinLine } from "react-icons/ri";
import {useForm} from 'react-hook-form'
import { useVoiceVisualizer } from 'react-voice-visualizer';
import { LiaSearchengin } from "react-icons/lia";
import { IoMdAdd } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { GiMoonClaws } from "react-icons/gi";
import { RxSun } from "react-icons/rx";
import { IoMdExit, IoMdMore } from "react-icons/io";
import { BannedListReducer, ChatListReducer, ChatLogReducer, CommunityListReducer, GroupListReducer, MemberListReducer, NotePadlogsReducer, PendingRequestReducer, RejectListReducer, RequestsListReducer, SuggestedListReducer, ToogleTheme } from "../actions/types";
import TestImg from '../assets/images/hm4.jpeg'
import EmptyChatImg from '../assets/images/hm2.jpeg'
import { FaCheckDouble, FaListCheck } from "react-icons/fa6";
import { toast, ToastContainer, useToast } from 'react-toastify';
import { MdExpand } from "react-icons/md";
import 'react-toastify/dist/ReactToastify.css';
import { VscRunErrors } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";
import { IoSendSharp } from "react-icons/io5";
import { TiMicrophone } from "react-icons/ti";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaLink } from "react-icons/fa6";
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
const Chat = ({logout, UploadFile, load_user,isAuthenticated}) => {
    const [Generaldata,SetGeneraldata] = useState({
        'searchVal': "",
        'chatMessage' : ''
        })
    const dispatch = useDispatch()
    const Theme = useSelector((state)=> state.auth.Theme)
    const User = useSelector((state) => state.auth.user)
    const Email = User != null ? User.email : 'null'
    const DbData = useSelector((state) => state.chatReducer)
    const [RequestList,SetRequestList] = useState(useSelector((state) => state.chatReducer.RequestList))
    const [ChatsList,SetChatsList] = useState(useSelector((state) => state.chatReducer.ChatList))
    const [SuggestionsList,SetSuggestionsList] = useState(useSelector((state) => state.chatReducer.SuggestedList))
    const [ShowEmoji,SetShowEmoji] = useState(false)
    const [GroupList,SetGroupList]= useState(useSelector((state) => state.chatReducer.GroupList))
    const [CommunityList,SetCommunityList]= useState(useSelector((state) => state.chatReducer.CommunityList))
    const IsManager = User != null ? User.is_staff : false
    const [RoomName,SetRoomName] = useState('null')
    const [SenderIdVal,SetSenderIdVal] = useState([])
    const [IsPrivate,SetIsPrivate] = useState(false)
    const [DispChoice,SetDispChoice] = useState('Suggestions')
    const ChatLog = useSelector((state) => state.chatReducer.ChatLog)
    const UserEmail = User != null ? User.email : 'null@gmail.com'
    const [HeaderLogVal,SetHeaderLogVal] = useState({
        'group_name' : RoomName,
        'title' : 'Am Name',
        'about' : 'hey there am new in this chat app',
        'img' : 'null',
        'createdOn' : 'null',
        'description' : 'null',
        'ProfilePic' : 'null',
        
        
    })
    const [HeaderLogValChats,SetHeaderLogValChats] = useState({
        'group_name' : 'null',
        'Name' : 'null',
        'about' : 'hey there am new in this chat app',
        'createdOn' : 'null',
        'ProfilePic' : 'null',
        'email' : '',
        'isonline' : false,
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
    const [Member,SetMember] = useState(useSelector((state) => state.chatReducer.MemeberList))
    const [Reject,SetReject] = useState(useSelector((state) => state.chatReducer.RejectList))
    const [Banned,SetBanned] = useState(useSelector((state) => state.chatReducer.BannedList))
    const PendingRequest =useSelector((e) => e.chatReducer.PendingRequest)
    const [PauseTimmer,SetPauseTimmer] = useState(false) 
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
    const [NotePadChat,SetNotePadChat] = useState([null])
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
    const [Profile,SetProfile] = useState({
        'edit' : false,
        'name' : User != null ? User.name : '',
        'email' : User != null ? User.email : '',
        'About' : User != null ? User.about : '',
        'ProfilePic' : User != null ? User.ProfilePic : 'null',
        'File' : null,
        'ProfilePicName' : 'null'
        
    })
    const [Count,SetCount] = useState(0)
    const [SearchChatNumber,SetSearchChatNumber] = useState('null')
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
            var Log = ChatlogContainer.current
            Log.scrollTo({
                'top' : Log.scrollHeight ,
                'behavior' : 'smooth',
            })
        }
            
    },[ChatLog])
    const [ShowChatDisp,SetShowChatDisp] = useState(HeaderLogVal.group_name != 'null' ? true : false)
    var [storeChatSearch,SetstoreChatSearch] = useState([])
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

   
    useEffect(() => {
        if (recordedBlob) {
          const audioElement = audioRef.current;
          const url = URL.createObjectURL(recordedBlob);
          audioElement.src = url;
          var val = Math.floor(Math.random() * 100)
          var name = `${User != null ? User.email : 'null'}voicenote${val}.mp3`
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
   

    function UpdateRequest (email,roomval,choice,id) {
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
        'id' : id
    }
    requestWsStream('UpdateRequest',null,dt)
       
    }
    function RemoveRequest (roomval) {
        toast('Submitting please wait', {
            type: 'info',
            theme: Theme,
            position: 'top-center'
        })
       var dt = {
        'message' : 'RemoveRequest',
        'roomName' : roomval,
        'id' : User.id
    }
    requestWsStream('RemoveRequest',null,dt)
       
    }
 
    function CreateFriend(roomVal,user){
        var emailVal = User.email
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
    }

     const GetName = (props) => {
        if (props){
            var email = User != null ? User.email : 'null'
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
        var email = User != null ? User.email : 'null'
            for (const key in props) {
                if (key !== email ) {
                  return key;
                }
        }
        }
    }   

    function CallCreateChatRoom (room,sender,reciever,recieverindex) {
        SetIsPrivate(true)
        SetRoomName(room)
        SetSenderIdVal([sender,reciever])
        SetHeaderLogValChats((e) => {
            return {
                ...e,
                'isonline' : false,
                'email' : recieverindex
            }
        })
    }

 
    const MapperChatList = ChatsList.map((items,i) => {
        var recieverindex = GetNameChats(items.Details)
        var img = items.Details[recieverindex].ProfilePic
        var name = items.Details[recieverindex].name
        var about = items.Details[recieverindex].about
        var isonline = onlineData.includes(recieverindex)
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
        //console.log(onlineData,recieverindex,isonline)
        return (
            <div key={i}  onClick={() => CallCreateChatRoom(items.group_name,items.SenderId,items.RecieverId,recieverindex)} data-tip="Inbox"   className="tooltip bg-gray-200 dark:bg-transparent group tooltip-top lg:tooltip-left text-slate-800 dark:text-slate-50 min-w-[200px] justify-around  tooltip-info cursor-pointer md:mx-auto md:align-middle hover:shadow-md hover:shadow-sky-500 hover:dark:shadow-orange-500 rounded-md border-slate-600 dark:border-slate-500 w-[300px] md:w-[200px]  flex flex-row px-2 border-[1px] my-1 gap-1" >
                    <div className={`my-2 avatar w-12 mr-auto h-12 min-w-[20%]  ${isonline ? 'online  ' : ' offline  '} `} >
                            <img  src={`${img}`}  className=" cursor-pointer rounded-full m-auto w-10 border-[1px]ss  h-10 "  alt="" />

                    </div>
                    <div className={` flex flex-col gap-1 w-[60%] md:w-[70%] justify-around `} >
                        <p  className="cursor-pointer font-mono outline-none bg-transparent text-left w-fit my-auto mr-auto border-none text-ellipsis" readOnly >{name}</p>
                        <small id="PoppinN"  className={`font-semibold ${lastseenText == 'online' ? 'text-green-500 dark:text-green-400 ' : 'text-red-500  font-semibold'} ${isonline == false ? 'flex' : 'hidden'} cursor-pointer outline-none italic bg-transparent text-left w-fit my-auto ml-auto border-none text-[12px] text-ellipsis`} readOnly >{lastseenText}</small>
                        <small id="PoppinN"  className={` ${isonline == true ? 'flex' : 'hidden'} cursor-pointer outline-none italic bg-transparent text-left w-fit my-auto ml-auto border-none text-green-500 dark:text-green-400 text-ellipsis`} readOnly >online</small>
                    </div>
                   
            </div>
        )
    })

   
    const MapperSuggestions= SuggestionsList.map((items,i) => {
        var index = GetName(items.Details)
        var user = items.Details[index]
        var id =    user ? user.id : ''
        var name =  user ? user.name : ''
        var image = user  ? user.ProfilePic   : '/media/fallback.jpeg'
        
        var isonline = onlineData.includes(index)
      
        return (
            <div key={i}  data-tip="Add" className={`  tooltip  md:mx-auto max-w-[200px]  text-slate-800 dark:text-slate-50  tooltip-info  ${user ? 'flex' : 'hidden'} flex flex-col gap-3`}>
                <div key={i} className= {` cursor-pointer bg-gray-200 dark:bg-transparent md:mx-auto md:align-middle hover:shadow-md hover:shadow-sky-500 hover:dark:shadow-orange-500 rounded-md border-slate-600 dark:border-slate-500 w-[200px]  max-h-[200px]  flex flex-row px-2 border-[1px] my-1 min-h-[90px] gap-1 `} >
                        <div className={`my-2 avatar w-12 mr-auto  min-w-[20%]   h-12  ${isonline ? 'online  ' : ' offline  '} `} >
                            <img onClick={() => OpenImagePrivate(image)} src={`${image}`}  className=" cursor-pointer rounded-full  mx-auto w-10   h-10  border-[1px]ss"  alt="" />

                        </div>
                        <div className={` flex flex-col gap-1 w-[60%] md:w-[70%] justify-around `} >
                            <p  className="cursor-pointer font-mono outline-none bg-transparent text-left w-fit my-auto mr-auto border-none text-ellipsis" readOnly >{name}</p>
                            <button   onClick={() => CreateFriend(id,items.Details)} title="Add friend" className={`  w-fit font-semibold rounded-sm my-auto ml-auto bg-transparent border-slate-600 transition-all duration-300 text-sm  dark:hover:border-sky-500 border-[1px] hover:border-orange-500 hover:text-slate-900 dark:bg-transparent dark:text-slate-200 dark:border-slate-500  text-sky-500 px-2 py-1 `} >Add Friend</button>
                         </div>
                </div>

            </div>
            
        )
    })
   
    const CallSetRoomName =(room,list) =>{
        SetRoomName(room)
        SetUsersList(list)
    }

    const MapperGroupList = GroupList.map((items,i) => {
         var Pending = false         
         Pending = PendingRequest.includes(items.group_name);
         var memberval = Member.includes(items.group_name)
         var rejectval = Reject.includes(items.group_name)
         var bannedval = Banned.includes(items.group_name)
        
        return (
            <div key={i} data-tip="Inbox" className="tooltip min-w-[200px] tooltip-info bg-gray-200 dark:bg-transparent text-slate-800 dark:text-slate-50 tooltip-left flex relative gap-0 w-[200px] flex-col h-fit m-auto border-[1px] rounded-md border-slate-600 dark:border-slate-500   hover:shadow-md hover:shadow-sky-500 hover:dark:shadow-orange-500 " >
                    <div  onClick={() => memberval ? CallSetRoomName(items.group_name,items.UsersList): ''} key={i} className=" z-30 cursor-pointer md:mx-auto w-full max-h-[200px] h-fit  flex flex-row justify-between px-2 gap-1" >
                        <img  src={`${import.meta.env.VITE_WS_API}/media/${items.ProfilePic}`} className="  cursor-pointer rounded-full mx-auto my-2 w-12 border-[1px]ss  h-12  "  alt="" />
                        <p  className=" font-mono outline-none cursor-pointer bg-transparent text-center w-fit max-w-[50%] mx-auto border-none text-ellipsis hidden" >{items.group_name}</p>
                        <p id="PoppinN"  className=" outline-none ring-0 cursor-pointer bg-transparent text-left w-fit mt-2 mb-auto min-w-[70%] max-w-[70%] border-none text-ellipsis mr-auto" disabled >{items.title}</p>

                    </div>
                <img className={` bg-transparent opacity-80 absolute -translate-x-12 left-full rounded-full h-12 ml-auto mr-2 mb-2 w-fit  z-20  ${rejectval && !bannedval && !memberval ? 'flex' : 'hidden'} `} src={RejectImg} alt="" />

                <span title="Waiting Approval" className={` ${ memberval == false && Pending == true && !bannedval  ? 'flex' : ' hidden'} w-fit font-semibold rounded-sm my-1  transition-all duration-300  text-orange-500 px-2 text-sm text-right py-1 mr-2 ml-auto`} >Pending Approval</span>
                <button onClick={() =>RemoveRequest(items.group_name)} title="Withdraw Request" className={`  ${ !memberval && !rejectval && !bannedval && Pending ? ' flex' : 'hidden'} flex    w-fit font-semibold rounded-sm my-auto ml-auto bg-transparent border-slate-600 transition-all duration-300 text-sm  dark:hover:border-sky-500 border-[1px] hover:border-orange-500 hover:text-slate-900 dark:bg-transparent dark:text-slate-200 dark:border-orange-500  text-sky-500 px-2 py-1 mr-2 mb-2`} >Withdraw Request</button>
                <button onClick={() => requestWsStream('JoinRequest',items.group_name,items.title)} title="Send Join Request" className={` ${memberval == true || Pending == true || bannedval || rejectval  ? 'hidden' : ' flex'}   w-fit font-semibold rounded-sm my-auto ml-auto bg-transparent border-slate-600 transition-all duration-300 text-sm  dark:hover:border-sky-500 border-[1px] hover:border-orange-500 hover:text-slate-900 dark:bg-transparent dark:text-slate-200 dark:border-slate-500  text-sky-500 px-2 py-1 mr-2 mb-2`} >Join Request</button>
                <button title="You are banned from requesting to join" className={` cursor-not-allowed ${bannedval ? ' flex' : 'hidden'} flex    w-fit font-semibold rounded-sm my-auto ml-auto bg-transparent border-red-500 transition-all duration-300 text-sm border-[1px]  hover:bg-slate-900 dark:bg-transparent opacity-70 dark:text-red-400 dark:border-yellow-300  text-red-500 px-2 py-1 mr-2 mb-2`} >Request Banned</button>
                </div>
            
        )
    })
    
    const MapperRequests = RequestList.map((items,i) => {
        console.log(items)
        return (
            <div key={i} className="   relative cursor-pointer min-w-[280px] md:mx-auto hover:shadow-md hover:shadow-sky-500 hover:dark:shadow-orange-500 rounded-sm text-slate-800 dark:text-slate-50 bg-gray-200 dark:bg-transparent border-slate-600 dark:border-slate-500 w-fit max-w-[260px]   flex flex-col px-2 border-[1px] my-auto gap-1" >
                    <span className={` hover:text-sm absolute w-fit h-fit font-bold my-2 dark:bg-slate-600 dark:text-lime-500 bg-lime-500 text-slate-100 p-1 rounded-sm z-30 text-[x-small] transition-all duration-300 `} >Group Request</span>
                    <span className={` ${items.status == 'Reject' ? ' absolute' : 'hidden'} hover:text-sm  w-fit h-fit font-bold mt-10 dark:bg-slate-600 dark:text-amber-500 bg-red-500 text-slate-900 p-1 rounded-sm z-30 text-[x-small] transition-all duration-300`} >Rejected Request</span>
                    <span className={` ${items.status == 'Banned' ? ' absolute' : 'hidden'} hover:text-sm  w-fit h-fit font-bold mt-10 dark:bg-slate-600 dark:text-amber-500 bg-slate-800 text-red-500 p-1 rounded-sm z-30 text-[x-small] transition-all duration-300`} >Banned Request</span>
                    <div className="  flex flex-col gap-3 align-middle text-sm">
                        <img onClick={() => OpenImage(items.ProfilePic)} src={`${items.UserDetails[0].UserPic}`} className=" cursor-pointer rounded-full mx-auto my-2 w-20 border-[1px]ss  h-20 "  alt="" />
                        <input  className=" font-mono outline-none bg-transparent text-center w-fit max-w-[100%] mx-auto border-none text-ellipsis " disabled value={items.UserDetails[0].email}/>
                    </div>
                    <input  className=" font-mono outline-none bg-transparent text-center w-fit max-w-[100%] mx-auto border-none text-ellipsis" disabled value={`Group: ${items.groupname}`}/>
                    <blockquote  className=" font-mono outline-none bg-transparent text-center w-fit max-w-[90%] mx-auto border-none  my-2 "  >User Description: {items.UserDetails[0].about}</blockquote>
                    <div className=" flex flex-row gap-3 align-middle text-sm mb-3 " >
                    <button onClick={() => UpdateRequest(items.UserDetails[0].email,items.RoomName,'Accept',items.id)} title="Accept" className={` flex w-fit font-semibold rounded-sm my-1 bg-slate-600 transition-all duration-300 hover:shadow-md dark:hover:shadow-orange-500 hover:shadow-sky-600 dark:bg-slate-600 dark:text-lime-500   text-cyan-400 px-2 py-1 mx-auto`} >Accept</button>
                    <button onClick={() => UpdateRequest(items.UserDetails[0].email,items.RoomName,'Banned',items.id)} title="Ban" className={` ${items.status == 'Reject' ? ' flex' : 'hidden'} flex w-fit font-semibold rounded-sm my-1 bg-slate-600 transition-all duration-300 hover:shadow-md dark:hover:shadow-orange-500 hover:shadow-sky-600 dark:bg-slate-600 dark:text-yellow-300  text-red-400 px-2 py-1 mx-auto`} >Ban</button>
                    <button onClick={() => UpdateRequest(items.UserDetails[0].email,items.RoomName,'Reject',items.id)} title="Reject" className={` ${items.status != 'Reject' && items.status != 'Banned' ? ' flex' : 'hidden'} flex w-fit font-semibold rounded-sm my-1 bg-slate-600 transition-all duration-300 hover:shadow-md dark:hover:shadow-orange-500 hover:shadow-sky-600 dark:bg-slate-600 dark:text-yellow-300  text-red-400 px-2 py-1 mx-auto`} >Reject</button>
                    </div>

            </div>
        )
    })

    useEffect(() => {
        MapperGroupList
    },[PendingRequest])

    const MapperCommunityList = CommunityList.map((items,i) => {
    
        return (
            <div data-tip="Inbox" onClick={() => SetRoomName(items.group_name)} key={i} className="tooltip bg-gray-200 min-w-[200px] dark:bg-transparent tooltip-left tooltip-info min-h-[80px] text-slate-800 dark:text-slate-50 cursor-pointer md:mx-auto hover:shadow-md hover:shadow-sky-500 hover:dark:shadow-orange-500 rounded-md border-slate-600 dark:border-slate-500 w-[200px] max-w-[200px] max-h-[200px] overflow-hidden  flex flex-row px-2 border-[1px] my-auto gap-1" >
                    <img src={`${import.meta.env.VITE_WS_API}/media/${items.ProfilePic}`} className=" cursor-pointer rounded-full mx-auto my-2 w-12 border-[1px]ss  h-12 "  alt="" />
                    <div className={` flex flex-col gap-1 w-[60%] md:w-[70%] justify-around `} >
                    <p id="PoppinN"  className="outline-none ring-0 cursor-pointer bg-transparent text-left w-fit mt-2 mb-auto min-w-[70%] max-w-[70%] border-none text-ellipsis mr-auto" disabled >{items.title}</p>
                    <small id="PoppinN"  className="outline-none ring-0 cursor-pointer bg-transparent text-left w-fit mt-2 mb-auto border-none text-ellipsis mr-auto" disabled >{items.description}</small>
                    </div>
            </div>
        )
    })

    const SetTheme  = (props) => {
            dispatch({
                type : ToogleTheme,
                payload : props
            }
            )
    }

    function CreateChatRoom (msg = null ) {
        if(WsEvent.current != null ){
            //console.log('wsEvent current',WsEvent.current,typeof(WsEvent.current))
            WsEvent.current.close(1000,'Opening another socket for less ws jam')
        }
       //var randomVal = `${RoomName}${Math.floor(Math.random() * 100)}`
        WsEvent.current = new WebSocket(`ws:/${import.meta.env.VITE_WS_API}/ws/chat/${RoomName}/`) 
            toast('Fetching please wait', {
                type: 'info',
                theme: Theme,
                position: 'top-center'
            }) 
         WsEvent.current.onmessage = function (e) {
            var data = JSON.parse(e.data)
            //console.log(data)
            dispatch({
                type : ChatLogReducer,
                payload : data.message
            }
            )  
            
          };
        WsEvent.current.onopen = (e) => {
            //console.log('Socket opened..')
            SetShowChatDisp(true)
            if(WsDataStream.current.readyState === WsDataStream.current.OPEN){
                //console.log('sending request for all data')
                if(DispChoice == 'Chats'){
                    WsDataStream.current.send(
                        JSON.stringify({
                            'message' : 'AllChatLog',
                            'scope' : 'Chats',
                            'RecieverId' : SenderIdVal[1],
                            'SenderId' : SenderIdVal[0]
                        })
                        )
                }else {
                    WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'AllChatLog',
                        'scope' : DispChoice,
                        'roomName' : RoomName
                    })
                    )
                }
                
            }
            toast('Connection Established', {
                type: 'success',
                theme: Theme,
                position: 'top-center',
            })
          
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
                toast('Connection Closed', {
                        type: 'error',
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
        SetIsPrivate(false)
        if(WsEvent.current != null ){
            //console.log('wsEvent current',WsEvent.current,typeof(WsEvent.current))
            WsEvent.current.close(1000,'Closing Chat')
              
        }
        SetRoomName('null')
    }
   useEffect(() => {
    RoomName != 'null' ? CreateChatRoom() : ''
    
   },[RoomName])
    function ToogleDispChoice(props) {
        SetDispChoice(props)
        requestWsStream(props)
    }
    const OpenImage = (props) => {

        window.open(`${import.meta.env.VITE_WS_API}/media/${props}`,'_blank')
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
            SetShow((e) => {
                return {
                ...e,
                'ReplyChat' : msg,
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
    
    
    const ChatLogMapper = ChatLog.map((items,i) => {
        var x = JSON.stringify(items.DelList)
        var y = JSON.parse(x)
        var userDel = y != null ? y.includes(User.email) : false
       
        //var userDel = typeof(items.DelList) == 'objecta' ? items.DelList.includes(User.email) : false
        
        return (
            <div  key={i} className={`dropdown ${DisplayMore ? ' z-20' : ' z-40'}  bg-transparent relative flex px-2 min-w-fit max-w-[280px] sm:max-w-fit  bg-opacity-90 w-fit my-1 mx-2 ${items.email == UserEmail ? 'chat chat-end  sm:dropdown-left float-right ml-auto' : 'chat chat-start sm:dropdown-right  mr-auto '}  flex-col gap-1`}>
                <span className={` ${items.email == UserEmail ? 'text-sky-700 dark:text-slate-100': ' text-red-700 dark:text-yellow-500'} chat-header text-[x-small]  font-semibold`}>{items.name}</span>
                <button tabIndex={i} className= {` overflow-hidden absolute  z-[100%] ${items.email == UserEmail ?  'right-full' : ' left-full'}  top-8 self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-slate-200 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600 `} type="button">
                <IoMdMore  title="more" className={` text-base  cursor-pointer my-auto  sm:text-xl`} />

                </button>
              
                <div className={`chat-bubble   min-w-fit  shadow-md w-[200px] ${items.email == UserEmail ? ' flex-col shadow-red-500  dark:shadow-pink-500  ' : ' bg-slate-900 dark:text-slate-900 dark:bg-slate-800 shadow-purple-500 dark:shadow-green-500 text-slate-100 flex-col'} gap-2 w-full flex `}>
                    <div className= {` border-[1px] rounded-sm p-2 border-slate-600 ${items.ReplyChat != 'null'&& items.ReplyChatName !='null' && items.ReplyChat && items.Status != 'deleted' ? ' flex' : 'hidden'}  flex flex-col max-w-[200px] sm:max-w-[300px]  w-fit justify-start gap-1 my-3 `}   >
                        <span className={` ${items.email == UserEmail ? 'text-sky-600 dark:text-slate-100': ' text-red-700 dark:text-yellow-500'} chat-header  font-semibold flex flex-row gap-3`}>{items.ReplyChatName} : <p className=" italic text-orange-500 text-[x-small] md:text-sm">Reply</p></span>
                        <textarea className={` border-none bg-transparent ${items.email == UserEmail ? ' mr-auto' : ' ml-auto'} w-full text-left  break-words text-slate-100   h-fit max-h-[50px] min-h-[30px] sm:max-h-[100px] min-w-full  rounded-sm font-mono text-sm p-2 resize-y cursor-text`} disabled value={items.ReplyChat} ></textarea>
                    </div>
                    <span className={` ${items.upload == 'file' && items.src != 'null' ? 'flex align-middle gap-2 flex-row' : ' hidden' } `}>
                        <FaFileArrowDown title="Download File" onClick={() => DownloadFunc(items.src)} className={` text-red-600 min-h-6  sm:min-h-8 cursor-pointer ${items.upload == 'file' && items.src != 'null' ? 'flex' : 'hidden'} sm:text-xl ml-3 rounded-sm `}   />
                        <small className=" dark:text-amber-200 italic font-mono w-fit my-auto">{items.src}</small>
                    </span>
                    <video onClick={() => OpenImage(items.src)} src={`${import.meta.env.VITE_WS_API}/media/${items.src}`} controls title="Uploaded Video"  className={`   cursor-pointer ${items.upload == 'video' && items.src != 'null' ? 'flex' : 'hidden'} max-h-[70px] sm:max-h-[90px] md:min-h-[200px] ml-3 rounded-sm  w-fit h-fit`} ></video>                                            
                    <audio  src={`${import.meta.env.VITE_WS_API}/media/${items.src}`}  controls title="Uploaded Audio"  className={`cursor-pointer ${items.email == UserEmail ? ' mr-2' : ' ml-2'} px-2  ${items.upload == 'audio' && items.src != 'null' ? 'flex' : ' hidden'} border-slate-800 min-h-[40px] min-w-[200px]  w-[90%] sm:min-w-[300px]  h-fit`} ></audio>
                    <img onClick={() => OpenImage(items.src)} src={`${import.meta.env.VITE_WS_API}/media/${items.src}`}  title="Uploaded image"   className={`cursor-pointer ${items.email == UserEmail ? ' mr-3' : ' ml-3'}  ${items.upload == 'image' && items.src != 'null' ? ' flex' : 'hidden'}  rounded-sm  min-w-fit border-none my-auto w-fit h-fit  max-h-[50px] xs:max-h-[100px] lg:max-h-[150px] `}  alt="" />
                    
                    <blockquote className={` max-w-[200px]  sm:max-w-[300px]  break-words ${items.email != UserEmail && (items.Status != 'deleted' || !userDel) &&items.action != 'deleted from all'  ? ' dark:text-amber-500 text-sky-600' :items.email == UserEmail && (items.Status != 'deleted' || !userDel) &&items.action != 'deleted from all' ? ' text-yellow-400 dark:text-purple-500 ' : (userDel && items.action == 'deleted from me') || items.action == 'deleted from all'   ? 'text-pink-500' : '' } font-mono text-sm `} > 
                        {items.action == 'delete from all' ? 'This message was deleted!' : items.action == 'deleted from me' && userDel  ? 'This message was deleted!' : items.text } 
                    </blockquote>
                    <div className={` ${items.email == UserEmail ? ' flex-row' : ' flex-row-reverse'} gap-2 sm:gap-3 md:gap-4 w-full flex `}>
                        <small className={` text-[12px] italic font-semibold font-mono w-full ${items.email == UserEmail ? ' text-left  dark:text-cyan-500 pr-3':' dark:text-orange-500 text-right text-green-500'}  `}>{items.time}</small>
                        { items.action != 'deleted from all' && !userDel || items.Status == 'send' ? 
                        <FaCheckDouble className={` ${items.email == UserEmail ? 'text-lime-500 dark:text-green-500' : ' text-red-600 '}  text-sm`}/> :
                        <RiDeleteBinLine className={` text-yellow-400 md:text-lg -p-2 rounded-sm cursor-not-allowed  text-base`}/>
                        }
                    </div>
                    
                </div>
                
                <div tabIndex={i}  className=" z-50 font-semibold dropdown-content  bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                        <li className={` ${items.text != '' ? 'flex w-full' : 'hidden'} `} >
                            <span onClick={() => SetReply('show',items.text,items.name)} className="block w-full cursor-pointer px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white">Reply</span>
                        </li>
                        <li>
                            <span data-tip="Copied" onClick={() => CopyChat(items.text,i)} className= {` w-full ${tooltipVal == i ? 'tooltip tooltip-open' : ''} text-left  ${items.email == UserEmail ?'tooltip-left' : 'tooltip-right'}  block cursor-pointer px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white `}>Copy</span>
                        </li>
                        <li className={` z-50 ${items.action != 'deleted from all' && !userDel ? ' w-full flex' : ' hidden'} `} >
                            <span onClick={()=> SendChat('delete from me',items.text,items.time,items.email,items.name)} className="block w-full cursor-pointer px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white">Delete From me</span>
                        </li>
                        <li className={` z-50 ${items.email == UserEmail && items.action != 'deleted from me' && items.action != 'deleted from all' ? ' w-full flex' : ' hidden'} `} >
                            <span onClick={()=> SendChat('delete from all',items.text,items.time,items.email,items.name)} className="block w-full cursor-pointer px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white">Delete From all</span>
                        </li>
                    </ul>
                </div>
            </div>
        )
    })
    useLayoutEffect(() => { 
        requestWsStream('open',null,null)
       
    },[])
    useEffect(() => {
        if(!navigator.onLine){
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
        
      },[navigator.onLine])
    
    useEffect(() => {
        if(ShowNotePad){
            requestWsStream('NotePadlogs',null,null)
        }
    },[ShowNotePad])
  
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
    
    const requestWsStream = (msg = null,room = null,body = null) => {    
       
        if(msg =='open'){
            
            if(WsDataStream.current != null ){
                WsDataStream.current.close(1000,'Opening another socket for less ws jam')

            }
            WsDataStream.current =  new WebSocket(`ws:/${import.meta.env.VITE_WS_API}/ws/chatList/${Email}/`);

        }
        
        WsDataStream.current.onmessage = function (e) {
          var data = JSON.parse(e.data)
            if(data.type == 'Groups'){
                SetBanned([])
                for( var x in data.message){
                    if(data.message[x].UsersList != 'null' && data.message[x].UsersList != null){
                        const hasValue = data.message[x].UsersList.includes(User.email);
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
                SetCommunityList(data.message)
                dispatch({
                    type : CommunityListReducer,
                    payload : JSON.stringify(data.message)
                }
                )
            }else if (data.type == 'AllChatLog'){
               SetIsPrivate(false)
                SetHeaderLogVal((e) => {
                    return {
                        ...e,
                        'group_name' : data.message[0].group_name,
                        'img' : data.message[0].ProfilePic,
                        'title' : data.message[0].title,
                        'createdOn' : data.message[0].DateCreated,
                        'description' : data.message[0].description,
                        'about' : data.message[0].about,
                        'ProfilePic' : data.message[0].ProfilePic
                    }
                })
                
                ///console.log(data.message[0].ChatLogs)
                dispatch({
                    type : ChatLogReducer,
                    payload : data.message[0].ChatLogs != 'null' && data.message[0].ChatLogs != null ? data.message[0].ChatLogs : []
                }
                )
            }else if(data.type == 'AllChatLogChats'){
                SetIsPrivate(true)
                var index = GetNameChats(data.message[0].Details)
               
                var isonline = onlineData.includes(index)
               
                SetHeaderLogValChats((e) => {
                    return {
                        ...e,
                        'group_name' : data.message[0].group_name,
                        'Name' : data.message[0].Details[index].name,
                        'ProfilePic' : data.message[0].Details[index].ProfilePic,
                        'about': data.message[0].Details[index].about,
                        'createdOn' : data.message[0].DateCreated,
                        'email' : index,
                    }
                })
                
                ///console.log(data.message[0].ChatLogs)
                dispatch({
                    type : ChatLogReducer,
                    payload : data.message[0].ChatLog != 'null' && data.message[0].ChatLog != null ? data.message[0].ChatLog : []
                }
                )
            }else if(data.type == 'JoinRequest'){

                toast(data.message.message, {
                    type: data.message.status ,
                    theme: Theme,
                    position: 'top-center'
                }) 

                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'GetRequestMade',
                        'id' :  User != null ? User.id : 'null'
                    })
                    )
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
                SetRequestList(data.message)
                dispatch({
                    type : RequestsListReducer,
                    payload : JSON.stringify(data.message)
                }
                )
            }else if (data.type == 'UpdateRequest'){
                toast(data.message.message, {
                    type: data.message.status ,
                    theme: Theme,
                    position: 'top-center'
                })
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'RequestsList',
                        'email' :  User != null ? User.email : 'null'
                    })
                    )

                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'GetRequestMade',
                        'id' :  User != null ? User.id : 'null'
                    })
                    )
                
            }else if (data.type == 'Chats'){
                SetChatsList(data.message)
                SetonlineData(data.Ioss13_32kjb[0])
                SetofflineData(data.Ioss13_32kjb[1]) 
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
                
                dispatch({
                    type : ChatListReducer,
                    payload :data.message
                }
                )
            }else if (data.type == 'Suggestions'){
                SetSuggestionsList(data.message)
                SetonlineData(data.Ioss13_32kjb[0])
                SetofflineData(data.Ioss13_32kjb[1])
                dispatch({
                    type : SuggestedListReducer,
                    payload :data.message
                }
                )
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
                load_user()
            }
        };
        WsDataStream.current.onopen = (e) => {
            //SetDispChoice('Suggestions')
            toast('Connection Established', {
                type: 'success',
                theme: Theme,
                position: 'top-right',
            })
            if(msg == null){            
                dispatch({
                    type : 'ClearLists'
                })
                    
                }
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'Suggestions',
                        'RecieverId' : User != null ? User.email : 'null',
                        'email' : User != null ? User.email : 'null'
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
                const formData = new FormData();
                formData.append('file', Profile.File);                    
                formData.append('name',Profile.ProfilePicName)
                Profile.File != null ? UploadFile(formData) : ''
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'EditProfile',
                        'name' : Profile.name,
                        'ProfilePic' :  Profile.ProfilePicName,
                        'email' : User != null ? User.email : 'null',
                        'about' : Profile.About
                    })
                    )
            }else if(msg == 'SubmitNoteChat') {
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'SubmitNoteChat',
                        'title' : NotePadComponents.SelectedTitle,
                        'email' : User != null ? User.email : 'null',
                        'text' : NotePadComponents.chatMessage
                    })
                    )
            }else if(msg == 'NotePadlogsDelete') {
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'NotePadlogsDelete',
                        'email' : User != null ? User.email : 'null',
                        'title' : body
                    })
                    )
            }else if(msg == 'AddNote') {
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'AddNote',
                        'email' : User != null ? User.email : 'null',
                        'title' : NotePadComponents.NewNoteTitle
                    })
                    )
            }else if(msg == 'NotePadlogs') {
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'NotePadlogs',
                        'email' : User != null ? User.email : 'null'
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
                        'about' : User != null ? User.about : 'null',
                        'email' :  User != null ? User.email : 'null',
                        'id' :  User != null ? User.id : 'null',
                        'roomName' : room,
                        'GroupName' : body,
                        'profilePic' :  User != null ? User.ProfilePic : 'null'
                    })
                    )
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'Groups'
                    })
                    )
            }else if(msg == 'RemoveRequest'){
                WsDataStream.current.send(
                    JSON.stringify(body)
                    )
            }else if(msg == 'UpdateRequest'){
                    WsDataStream.current.send(
                    JSON.stringify(body)
                    )
            }else if (msg == 'Suggestions'){
                // dispatch({
                //     type : 'ClearLists'
                // })
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'Suggestions',
                        'RecieverId' : User != null ? User.id : '',
                        'email' : User != null ? User.email : 'null'
                    })
                )
            }else if(msg == 'Chats'){
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'Chats',
                        'RecieverId' : User != null ? User.id : 'null',
                        'email' : User != null ? User.email : 'null'
                    })
                    )
            }else if(msg == 'Groups'){
                    SetReject([])
                    SetBanned([])
                    dispatch({
                        type : 'ClearLists'
                    })
                    WsDataStream.current.send(
                        JSON.stringify({
                            'message' : String(msg)
                        })
                        )

                   dispatch({
                    type : PendingRequestReducer,
                    payload : []
                   })
                    WsDataStream.current.send(
                        JSON.stringify({
                            'message' : 'GetRequestMade',
                            'id' :  User != null ? User.id : 'null'
                        })
                        )
            }else if(msg == 'RequestsList'){
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'RequestsList',
                        'email' :  User != null ? User.email : 'null'
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
            if(val == 'Suggestions'){
                requestWsStream('Suggestions')
            }else if(val == 'Chats'){
                requestWsStream('Chats')
            }
        }
    }
  
    useEffect(() => {
        // for restarting timmer of fetching online toast status
        
        setInterval(() => {
       
            StartRefresh('start',DispChoice)
        }, 10000);
        //
    },[])
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
    
    const SendChat =(action='null',textDel= 'null',Deltime = 'null',Delemail = 'null',Delname = 'null') => {
        
        if(ChatMessageRef.current != null && Generaldata.chatMessage != '' || UploadVal.File != null || action != 'null'){
            ChatMessageRef.current.value = null
            
            
            if(WsEvent.current.readyState === WsEvent.current.OPEN){

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
                   
                    reader.readAsArrayBuffer(UploadVal.File);
                    formData.append('file', UploadVal.File);
                    
                    formData.append('name',Show.UploadedFileName)
                    UploadFile(formData)
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
                        'scope' : DispChoice,
                        'sender' : textDel != 'null' ? Delname :  User != null ? User.name : 'null',
                        'email' : textDel != 'null' ? Delemail : User != null ? User.email : 'null',  
                        'reciever' : '',
                        'message' : textDel != 'null' ? textDel :  Generaldata.chatMessage,
                        'upload' : UploadVal.upload,
                        'src' : UploadVal.File ? Show.UploadedFileName : 'null',
                        'action' : action,
                        'ReplyChat' : Show.ReplyChat ,
                        'ReplyChatName' : Show.ReplyChatName, 
                        'Deltime' : Deltime,
                        'delEmail' : User != null ? User.email : 'null',
                        })
                    )
                }else if(IsPrivate){
                    WsEvent.current.send(
                        JSON.stringify({
                            'group_name' : HeaderLogValChats.group_name, 
                            'scope' : 'Chats',
                            'delEmail' : User != null ? User.email : 'null',
                            'email' :textDel != 'null' ? Delemail : User != null ? User.email : 'null',  
                            'name' :textDel != 'null' ? Delname :  User != null ? User.name : 'null',  
                            'SenderId' : SenderIdVal[0],
                            'RecieverId' :  SenderIdVal[1],                                
                            'message' : textDel != 'null' ? textDel :  Generaldata.chatMessage,
                            'upload' : UploadVal.upload,
                            'src' : UploadVal.File ? Show.UploadedFileName : 'null',
                            'action' : action,
                            'Deltime' : Deltime,
                            'ReplyChat' : Show.ReplyChat,
                            'ReplyChatName' : Show.ReplyChatName

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
  
   const SearchChat = (event) => {
    const {value} = event.target
    value != '' ? SetShowSearchArrow(true) : SetShowSearchArrow(false)
    const ValueSub = String(value).toLocaleLowerCase()
    var val  = ChatlogContainer.current.innerText
    var x = String(val).toLocaleLowerCase()
    var array = x.split('\n')
    
    const Search= (obj,position) => {
        var text = String(obj).toLocaleLowerCase()
       
        if(String(text).match(ValueSub)){
            var store = storeChatSearch
            SetstoreChatSearch((e) => [obj,...e])
            SetSearchChatNumber(store.length)
        }
        
    }
    SetstoreChatSearch([])
    array.forEach((val,i) => Search(val,i))
   
    
   }
  
 
   const NextSearch = (props) => {
       
        const Container = document.getElementById('ChatlogContainer')
        //console.log(Container.clientHeight,Container.scrollHeight,Container.offsetHeight)
        const Move  = (props,i) => {
            if(props == storeChatSearch[Count]) {
                 var y = Container.childNodes[i]
                 var screen = window.innerWidth <= 425 ? 550 : 266
                 Container.scrollTo({
                     'top' : y.offsetTop - screen,
                     'behavior' : 'smooth',
                 })
                 var color = Container.childNodes[i].style.color
                 Container.childNodes[i].style.color = 'red'
                 //Child[Count].style.color = 'red'
                 setTimeout(() => {
                    Container.childNodes[i].style.color = color
                 }, 2000);
               // console.log(props,storeChatSearch[Count],y.offsetTop)
             }  
             //console.log(props,storeChatSearch[Count],Count,storeChatSearch.length)
        }   
        const Movement= () => {
            var Child = Container.childNodes
            var x = Child.length - 1
            for(var i = 0; i <= x; i ++){
                var y = String(Container.childNodes[i].innerText).toLocaleLowerCase()
                var yList = y.split('\n')
                yList.forEach((ee) => Move(ee,i))

               
               
                
            }
        }
        if(props == 'up'){
            SetCount((c)=> c >= (storeChatSearch.length -1) ? 0 : c + 1  )
            Movement()
            
            
        }else if(props == 'down'){  

            SetCount((c) => c != 0 ?  c - 1 : (storeChatSearch.length -1) )
            Movement()
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
        
   function OpenVideoCall() {
        window.open('https://meet.google.com/','_blank')
   }
  

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
            if(User != null && User.email != ''){
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
            }else{
                toast('invalid email',{
                    type : 'warning',
                    theme : Theme,
                    position : "top-right"
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
        if(User != null && User.email != ''){
            var chat = document.querySelector('#NotePadChatBox')
            chat.value = ''
            requestWsStream('SubmitNoteChat',null,null)
        }else{
            toast('invalid User email',{
                type : 'warning',
                theme : Theme,
                position : "top-right"
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
        useEffect(() => {
        if(NoteChatLogContainer.current){
            var Log = NoteChatLogContainer.current
            Log.scrollTo({
                'top' : Log.scrollHeight ,
                'behavior' : 'smooth',
            })
        }
            
    },[NoteChatLog])
    const NotePadlogsMapper = NotePadlogs.map((items,i) => {

        return (
            <div  key={i} className=" cursor-pointer hover:shadow-md hover:shadow-purple-700 rounded-sm border-[1px] border-gray-400 px-3 text-slate-100 flex flex-col w-full gap-1 text-left  tooltip-info tooltip tooltip-top" data-tip="Open">
                <div className=" flex flex-row justify-between px-1 align-middle w-full">
                    <big onClick={() => OpenNoteChat(i,items.title)} className=" w-full" >{i + 1}{`)`} {items.title}</big>
                    <RiDeleteBinLine className=' text-red-600 text-lg hover:text-amber-500 rounded-full bg-transparent cursor-pointer my-auto' onClick={() => requestWsStream('NotePadlogsDelete',null,items.title)} />
                </div>
                <div onClick={() => OpenNoteChat(i,items.title)} className=" px-3 flex flex-row justify-between w-full">
                    <input className=" cursor-pointer text-ellipsis max-w-[60%] align-middle my-auto bg-transparent text-gray-500 italic border-none "  readOnly value={items.LastText} type="text" />
                    <small className=" text-sm my-auto font-mono italic">{items.DateCreated}</small>
                </div>
            </div>
        )
    })

    const NotePadChatLogMapper = NoteChatLog.map((items,i) => {

        return (
            <div  key={i} className={`bg-transparent flex px-2 min-w-fit w-[90%] bg-opacity-90 my-1 mx-2 rounded-sm  mr-auto  flex-col gap-1`}>
                <div className={` p-3 rounded-md min-w-fit  shadow-md  bg-slate-900 dark:text-slate-900 dark:bg-slate-800 shadow-slate-300 text-slate-100 flex-col  gap-2 w-full flex `}>
                                        
                    <blockquote className={` max-w-[250px] break-words text-slate-100  font-mono text-sm `} >{items.text}</blockquote>
                    <div className={` flex-row justify-end gap-2 sm:gap-3 md:gap-4 w-full flex `}>
                        <small className={`  italic font-semibold font-mono w-full text-right dark:text-cyan-500 pr-3' `}>{items.time}</small>                       
                    </div>                    
                </div>
            </div>
        )
    })
    function EditProfile () {
        if(Profile.edit){
            SetProfile((e) => {
                return {
                    ...e,
                    'edit' : false,
                    'About' : User != null ? User.about : '',
                    'name' : User != null ? User.name : '',
                    'email': User != null ? User.email : '',
                    'ProfilePic' : User != null ? User.ProfilePic : ''
                }
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
    useLayoutEffect(() => {
        if(WsDataStream == null){
            SetDispChoice('')
        }
    },[WsDataStream])
    const SkeletonArray = [1,2,3,4,5,6,7,8,9,10]
    const SkeletonDiv = SkeletonArray.map((items,i) => {
        return (
            <div key={i} className="flex w-52 p-2 rounded-md md:mx-auto md:my-0 my-auto bg-transparent cursor-pointer transition-all duration-300 flex-col gap-4">
                <div className="skeleton transition-all duration-300 dark:bg-slate-600 h-32 w-full"></div>
                <div className="skeleton transition-all duration-300 dark:bg-slate-600 h-4 w-28 mx-auto"></div>
            </div>
        )
    })

    return(
        <div className={` w-full md:h-screen h-full ${Theme}`}>
            <div className=" overflow-visible w-full h-full  min-h-full">
                <div className="  top-0  w-full z-50 bg-transparent  border-slate-900">
                    <Navbar />
                </div>   
                <div className={` ${ShowEmoji ? 'flex' : ' hidden'} justify-center absolute z-50 top-[80%] sm:top-[78%]  lg:top-[40%] lg:translate-x-[350px] md:top-[38%] sm:left-5`}>
                    <EmojiPicker onEmojiClick={EmojisFunc} className=" mx-auto " height={400} width={300} />
                </div>
                {/* top tools */}
                <div className=" mb-[1px] shadow-md shadow-orange-800 transition-all duration-700 dark:shadow-sky-500 dark:bg-slate-800 bg-slate-100 flex flex-row w-full justify-around">
                    <div className=" w-fit flex py-2 flex-row">
                            <LiaSearchengin title="Search" onClick={SearchFunc} className={` cursor-pointer w-fit hover:ring-0  hover:text-pink-500 ${!ShowSearch ? ' opacity-100' : ' opacity-100'} transition-all duration-500 text-2xl my-auto text-orange-500 translate-x-6 z-40`}/>
                            <input 
                                onChange={WriteGeneraldata}
                                name="searchVal"
                                className="   bg-slate-300 text-slate-200 dark:text-slate-800 dark:ring-2 dark:bg-slate-200 border-none  placeholder:text-slate-700 placeholder:font-semibold pl-6 text-center max-w-[100px] sm:max-w-[200px] outline-none text-ellipsis transition-all duration-500 hover:ring-transparent rounded-md dark:ring-sky-500 font-mono z-30 m-auto ring-2 w-fit "
                                placeholder={` Search`}
                                onMouseEnter={() => SetShowSearch(false)}
                                onMouseLeave={() => SetShowSearch(true)}
                                type="text" 
                            />

                    </div>
                    <div className=" z-40 flex flex-row py-2 align-middle">
                                <span className=" flex flex-row gap-1 align-middle text-slate-800 dark:text-slate-100">
                                <span onClick={() => SetTheme(Theme == 'light' ? 'dark' : 'light')} className=' overflow-hidden cursor-pointer hover:underline-offset-2  hover:dark:text-amber-500 hover:text-blue-600 flex flex-row gap-2 font-semibold align-middle m-auto justify-around text-center dark:text-slate-100'>Theme:
                                    <p onClick={() => SetTheme(Theme == 'light' ? 'dark' : 'light')} className=' w-fit m-auto'>{Theme == 'light' ? <GiMoonClaws className=' my-auto w-fit animate-pulse mx-auto text-base text-center cursor-pointer hover:animate-spin' onClick={() => SetTheme('dark')}/>  : 
                                    <RxSun className='  my-auto w-fit text-base text-center animate-pulse mx-auto cursor-pointer hover:animate-spin '  onClick={() => SetTheme('light')} />}</p> 
                                </span>
                                </span>
                    </div>
                    <div className=" relative flex">
                        <div className={` ${navigator.onLine ? 'avatar online' : 'avatar offline'}   z-40 dark:border-slate-300 dark:text-slate-100 hover:dark:shadow-slate-200 shadow-md hover:shadow-slate-800  flex justify-center align-middle text-center my-auto min-w-[50px] max-w-[100px] border-[1px] border-slate-800 rounded-sm py-3 `}>
                            <CgProfile onClick={() => SetShowProfile((e) => !e)} className=" hover:text-amber-500 text-lg cursor-pointer" />
                        </div>
                        <div className={` right-full absolute translate-x-12 sm:translate-x-0  bg-slate-900 bg-opacity-90 min-w-[300px]  transition-all duration-500 h-fit min-h-[100px]  ${ShowProfile ? ' flex flex-row z-50 opacity-100' : ' z-0 opacity-0'}`}>
                                <div className=" my-2 flex flex-col gap-0 h-full w-[95%] text-center align-middle">
                                    <img id="ProfileProfilePicImage" onClick={() => !Profile.edit ? OpenImagePrivate(User !=null ? User.ProfilePic : 'null') : '' } src={`${Profile.ProfilePic}`}  className={`  cursor-pointer rounded-md mx-auto my-auto w-16 h-16 sm:min-h-fit sm:max-h-32 sm:max-w-32 sm:min-w-fit  `}  alt="" />
                                    < MdOutlineFileUpload onClick={TriggerProfilePicUpload} title="upload" className= {` ${Profile.edit ? 'flex mx-auto' : 'hidden'} hover:text-xl transition-all duration-300 dark:hover:text-lime-500 text-slate-100 mx-auto mt-2 mb-3 hover:text-blue-600 cursor-pointer text-lg   my-auto `}/>
                                    <input  ref={UploaderProfilePic} accept="image/*" onChange={UploadProfilePicFunc} className=" hidden text-sm h-fit my-auto" type="file" />
                                    <span className=" mb-1 w-full justify-around gap-3 pl-2  flex flex-row align-middle">
                                        <p id="PoppinN" className=" min-w-[50px] sm:min-w-[100px] w-fit text-slate-200 my-auto text-left mr-auto align-middle">Name: </p>
                                        <input onChange={OnProfileChange} name='name' id="PoppinN"  className="h-fit my-auto text-slate-200 text-sm outline-sky-600 disabled:outline-none bg-transparent text-left w-fit border-sky-600  disabled:border-none text-ellipsis" disabled={!Profile.edit} type="text" value={`${Profile.name}`} />

                                    </span>
                                    <span className=" mb-1 w-full justify-around gap-3 pl-2  flex flex-row align-middle">
                                        <p id="PoppinN" className=" min-w-[50px] sm:min-w-[100px] w-fit  text-slate-200 my-auto text-left mr-auto align-middle">Email: </p>
                                        <input name='email' id="PoppinN"  className="h-fit my-auto text-slate-200 text-sm outline-none bg-transparent text-left w-fit  border-sky-600  disabled:border-none  text-ellipsis" disabled type="text" value={`${Profile.email}`} />
                                    </span>
                                    <span className=" mb-1 w-full justify-around gap-3 pl-2  flex flex-row align-middle">
                                        <p id="PoppinN" className=" min-w-[50px] sm:min-w-[*0px] w-fit  text-slate-200 my-auto text-left mr-auto align-middle">About: </p>
                                        <textarea onChange={OnProfileChange} maxLength={80} name='About' disabled={!Profile.edit} id="PoppinN"  className="h-fit my-auto text-slate-200 text-sm outline-none bg-transparent text-left w-fit min-w-fit max-h-[100px] min-h-[50px]  border-sky-600  disabled:border-none  text-ellipsis" value={Profile.About} />
                                    </span>
                                    <span className=" mb-1 w-full justify-around gap-3 pl-2 py-2 flex flex-row align-middle overflow-hidden">
                                        <button onClick={EditProfile} id="PoppinN" className=" min-w-[50px] sm:min-w-[60px]  text-slate-100 py-1 hover:bg-orange-600 transition-all duration-300 m-auto text-sm rounded-sm mr-auto align-middle bg-sky-600 text-center  w-fit">{Profile.edit ? 'Cancel' : 'Edit'}</button>
                                        <button onClick={() => requestWsStream('EditProfile')} id="PoppinN" className= {` ${Profile.edit ? 'flex justify-center' : ' translate-y-[300%]'} min-w-[50px] sm:min-w-[80px]  text-slate-100 py-1 hover:bg-yellow-400 hover:text-slate-900 transition-all duration-300 m-auto text-sm rounded-sm mr-auto align-middle bg-orange-600 text-center  w-fit `}>Submit</button>
                                    </span>
                                </div>
                                <span onClick={() => SetShowProfile(false)} className={` cursor-pointer w-fit h-fit text-lg hover:text-amber-500 text-slate-100 px-2  mb-auto ml-auto text-center`}>&times;</span>
                        </div>
                    </div>

                </div>

                <div className="dark:bg-slate-800 bg-slate-100 dark:text-slate-100 transition-all duration-500 flex flex-col  md:flex-row-reverse gap-3 w-full h-full">

                    <div className=" flex flex-col  gap-2 w-full md:w-[25%] md:min-w-fit lg:w-[20%]">
                        <div className=" flex flex-row z-40 md:w-full md:flex-col md:align-middle md:justify-center p-2 sm:gap-4 md:gap-2 gap-2 text-sm font-semibold md:text-base">
                                <p className={`hover:text-orange-500 my-auto transition-all md:mx-auto w-fit duration-300 ${DispChoice == 'Suggestions' ? '   animate-pulse cursor-not-allowed autofill   dark:border-orange-500 text-red-500' : ' cursor-pointer'} `} onClick={() => ToogleDispChoice('Suggestions')} >Suggestions</p>
                                <p className={` hover:text-orange-500 transition-all duration-300 md:mx-auto my-auto w-fit ${DispChoice == 'Chats' ? '   animate-pulse cursor-not-allowed autofill  dark:border-orange-500 text-red-500' : ' cursor-pointer'} `} onClick={() => ToogleDispChoice('Chats')}>Chats</p>                            
                            <div className=" flex flex-row z-40 overflow-x-auto md:w-full p-2 sm:gap-4 my-auto  md:justify-around md:gap-2 gap-2 text-sm font-semibold md:text-base" >
                                <p className={`hover:text-orange-500 transition-all md:mx-auto w-fit duration-300 ${DispChoice == 'Groups' ? '   animate-pulse cursor-not-allowed autofill   dark:border-orange-500 text-red-500' : ' cursor-pointer'} `} onClick={() => ToogleDispChoice('Groups')} >Groups</p>
                                <p className={`hover:text-orange-500 transition-all md:mx-auto w-fit duration-300 ${DispChoice == 'Community' ? '   animate-pulse cursor-not-allowed autofill   dark:border-orange-500 text-red-500' : ' cursor-pointer'} `} onClick={() => ToogleDispChoice('Community')} >Community</p>
                                <p className={`hover:text-orange-500 transition-all md:mx-auto w-fit duration-300 ${IsManager ? 'flex' : 'hidden'} ${DispChoice == 'RequestsList'   ? ' animate-pulse cursor-not-allowed autofill   dark:border-orange-500 text-red-500' : ' cursor-pointer'} `} onClick={() => ToogleDispChoice('RequestsList')} >Requests</p>
                            </div>
                           
                        </div>

                        <Suspense fallback={SkeletonDiv}>
                            <div className=" z-40  min-h-[130px] md:h-[80%]  justify-around md:justify-start  align-middle md:overflow-y-auto flex flex-row md:max-h-[550px]   overflow-auto w-full py-3 px-4 sm:gap-1 gap-3 md:flex-col">
                                {DispChoice == 'Chats' ? WsDataStreamOpened ? MapperChatList : SkeletonDiv : DispChoice == 'Groups' ? WsDataStreamOpened ? MapperGroupList : SkeletonDiv : DispChoice == 'Community' ? WsDataStreamOpened ?  MapperCommunityList : SkeletonDiv : DispChoice == 'RequestsList' ? WsDataStreamOpened ? MapperRequests : SkeletonDiv : DispChoice == 'Suggestions' ? WsDataStreamOpened ? MapperSuggestions : SkeletonDiv : SkeletonDiv } 
                            </div>
                        </Suspense>
                       
                    </div>
                
                    <div className=" w-full md:w-[80%] min-h-[400px] h-screen">
                        
                        <section className={` overflow-x-hidden  mt-5 w-[98%] md:w-[90%] rounded-sm border-green-800 border-[1px] ${ShowChatDisp ? 'flex flex-col justify-between' : 'hidden'}   m-auto md:mx-auto bg-transparent dark:text-slate-100  h-[90%]`}>
                                {/* top sticky header */}
                                <div className=" bg-slate-100 dark:bg-slate-800 top-0 m-2 sticky z-40 scroll-mt-4  min-h-[40px] flex flex-row  max-h-[50px]">
                                    <div className={` ${!DisplayMore ? 'z-30' : ' z-20' } flex flex-row justify-around  h-full gap-0 w-[90%] mr-auto py-1`} >
                                        <div className={` ${ HeaderLogValChats.isonline == true && IsPrivate == true ? 'avatar online' : 'avatar offline'} `} >
                                           <img onClick={() => {OpenImage(HeaderLogVal.ProfilePic)}} src={`${import.meta.env.VITE_WS_API}/media/${HeaderLogVal.ProfilePic}`}  className={` ${!IsPrivate ? ' flex' : 'hidden'} cursor-pointer rounded-full mr-auto ml-[3px] my-auto w-10   h-10 `}  alt="" />
                                            <img onClick={() => {OpenImagePrivate(HeaderLogValChats.ProfilePic)}} src={`${HeaderLogValChats.ProfilePic}`}  className={` ${IsPrivate ? 'flex' : 'hidden'} cursor-pointer rounded-full mr-auto ml-[3px] my-auto w-10   h-10 `}  alt="" />
                                          
                                        </div>
                                       <div className=" px-2 mr-auto flex flex-col h-full justify-center gap-1 w-[90%]">
                                           <div className={` ${ DispChoice != 'Chats' ? 'flex flex-row gap-2' : ' hidden'} align-middle w-fit`}>
                                                <input id="PoppinN"  className=" h-fit my-auto text-sm outline-none bg-transparent text-left w-full max-w-full  border-none text-ellipsis" readOnly type="text" value={`Room Name:  ${HeaderLogVal.group_name}`} />
                                                <input id="PoppinN"  className=" hidden sm:flex h-fit my-auto text-sm outline-none bg-transparent text-left w-full max-w-full  border-none text-ellipsis" readOnly type="text" value={`Name:  ${HeaderLogVal.title}`} />
                                           </div>
                                           <div className={` ${DispChoice == 'Chats' ? 'flex flex-row' : 'hidden'}   gap-2 align-middle w-fit`}>
                                                <input id="PoppinN"  className=" flex h-fit my-auto text-sm outline-none bg-transparent text-left w-full max-w-full  border-none text-ellipsis" readOnly type="text" value={`Name:  ${HeaderLogValChats.Name}`} />
                                           </div>
                                            <input id="PoppinN"  className={` ${DispChoice != 'Chats' ? 'flex' : 'hidden'} h-fit text-sm my-auto outline-none bg-transparent text-left w-full max-w-full  border-none text-ellipsis`} readOnly type="text" value={`About:  ${HeaderLogVal.about}`} />
                                            <input id="PoppinN"  className={` ${DispChoice == 'Chats' ? 'flex' : 'hidden'} h-fit text-sm my-auto outline-none bg-transparent text-left w-full max-w-full  border-none text-ellipsis`} readOnly type="text" value={`About:  ${HeaderLogValChats.about}`} />
                                        </div>                                        
                                    </div>
                                    <div className=" dark:text-slate-100 w-[10%] flex align-middle justify-center">
                                            <FaVideo className=" text-base cursor-pointer z-30 flex my-auto hover:text-amber-500 " onClick={OpenVideoCall} />
                                            <IoMdMore onClick={() => SetDisplayMore((e) => !e )} title="more" className={` text-base ${DisplayMore ? '' : ' z-20'}  cursor-pointer hover:text-3xl hover:md:text-4xl my-auto text-2xl md:text-3xl`} />
                                            <div className={` absolute mr-[90%] sm:mr-[70%] lg:mr-[45%] xl:mr-[25%]  bg-slate-900 bg-opacity-90 min-w-[300px] transition-all duration-500 h-fit min-h-[100px]  ${DisplayMore ? ' flex flex-row z-30 opacity-100' : ' z-0 opacity-0 hidden '}`}>
                                                    <div className=" my-2 flex flex-col gap-0 h-full w-[95%] text-center align-middle">
                                                        <img onClick={() => OpenImage(HeaderLogVal.ProfilePic)} title="profile pic" src={`${import.meta.env.VITE_WS_API}/media/${HeaderLogVal.ProfilePic}`} className={` ${!IsPrivate ? 'flex' : 'hidden'} cursor-pointer rounded-md mx-auto my-auto w-16 h-16 sm:min-h-fit sm:max-h-24 sm:max-w-24 sm:min-w-fit `}  alt="" />
                                                        <img onClick={() => {OpenImagePrivate(HeaderLogValChats.ProfilePic)}} src={`${HeaderLogValChats.ProfilePic}`}  className={` ${IsPrivate ? 'flex' : 'hidden'} cursor-pointer rounded-md mx-auto my-auto w-16 h-16 sm:min-h-fit sm:max-h-24 sm:max-w-24 sm:min-w-fit  `}  alt="" />
                                                        <span className=" mb-1 w-full justify-around gap-3 pl-2  flex flex-row align-middle">
                                                            <p id="PoppinN" className=" min-w-[50px] sm:min-w-[100px] w-fit text-slate-200 my-auto text-left mr-auto align-middle">Name: </p>
                                                            <input id="PoppinN"  className="h-fit my-auto text-slate-200 text-sm outline-none bg-transparent text-left w-fit  border-none text-ellipsis" disabled type="text" value={`${!IsPrivate ? HeaderLogVal.title : HeaderLogValChats.Name}`} />
                                                        </span>
                                                        <span className=" mb-1 w-full justify-around gap-3 pl-2  flex flex-row align-middle">
                                                            <p id="PoppinN" className=" min-w-[50px] sm:min-w-[100px] w-fit  text-slate-200 my-auto text-left mr-auto align-middle">Created On: </p>
                                                            <input id="PoppinN"  className="h-fit my-auto text-slate-200 text-sm outline-none bg-transparent text-left w-fit  border-none text-ellipsis" disabled type="text" value={`${!IsPrivate ?  HeaderLogVal.createdOn : HeaderLogValChats.createdOn}`} />
                                                        </span>
                                                        <span className=" mb-1 w-full justify-around gap-0 pl-2  flex flex-row align-middle">
                                                            <p id="PoppinN" className=" w-fit min-w-fit max-w-[110px] text-slate-200 my-auto mr-auto text-left align-middle">{!IsPrivate ? 'Description:' : 'About:' } </p>
                                                            <textarea disabled id="PoppinN"  className="h-fit  text-slate-200 text-sm outline-none bg-transparent min-w-[50%] text-left w-fit my-auto border-none min-h-[50px] max-h-[100px] max-w-[300px]: text-ellipsis" value={ !IsPrivate ? HeaderLogVal.description : HeaderLogValChats.about} />
                                                        </span>
                                                       <span className=" my-2 w-full justify-around gap-3 pl-2  flex flex-row align-middle">
                                                            <p id="PoppinN" className=" w-fit min-w-[50px] sm:min-w-[100px] text-slate-200 my-auto text-left mr-auto align-middle">Search: </p>
                                                            <input id="PoppinN"  onChange={SearchChat} className="h-fit my-auto text-slate-200 text-sm outline-none bg-transparent text-left w-fit  border-[1px] focus:ring-2 focus:border-none focus:ring-purple-700 border-dotted border-gray-400  max-w-[130px] mr-auto  text-ellipsis"  type="text" />
                                                            <small className={` text-slate-900 bg-slate-400 font-semibold h-fit m-auto rounded-sm px-1 ${SearchChatNumber != 'null' &&ShowSearchArrow ?'flex' : 'hidden'}`} >{SearchChatNumber}</small>
                                                            <FaAngleLeft  onClick={() =>NextSearch('up')} className={` ${ShowSearchArrow ? 'flex' : 'hidden'} text-slate-200 cursor-pointer hover:bg-slate-100 hover:px-1 rounded-sm hover:text-xl rotate-90 text-lg hover:text-purple-700`} />
                                                            <FaAngleLeft  onClick={() =>NextSearch('down')}  className={` ${ShowSearchArrow ? 'flex' : 'hidden'} text-slate-200 cursor-pointer hover:bg-slate-100 hover:px-1 rounded-sm hover:text-xl rotate-[270deg] text-lg hover:text-purple-700`} />
                                                        </span> 
                                                        <span className={` ${!IsPrivate ?'flex flex-row' : 'hidden'} my-2 w-full justify-around gap-3 pl-2 relative align-middle`}>
                                                            <p id="PoppinN" className=" w-fit min-w-[50px] sm:min-w-[100px] text-slate-200 mt-0 text-left mr-auto align-middle">Members: </p>
                                                            <blockquote className={` bg-transparent text-slate-100 text-left ${ExpandUserList == true ? 'h-fit ' : 'h-[40px] '} overflow-hidden transition-all duration-500 m-auto rounded-sm px-1 flex flex-col max-w-[300px] w-fit border-dotted border-[1px] border-gray-500 `} >{MapUSerList}</blockquote>
                                                            <MdExpand onClick={() => SetExpandUserList((e)=> !e)} title="expand" className=" absolute cursor-pointer left-full top-0 text-red-600" />
                                                        </span>
                                                        <span className=" mb-1 w-full justify-around gap-3 pl-2  flex flex-row align-middle">
                                                            <p id="PoppinN" className=" w-fit min-w-[50px] sm:min-w-[100px]  text-slate-200 my-auto text-left mr-auto align-middle">Close Chat: </p>
                                                            <button id="PoppinN"  className="h-fit bg-red-500 my-auto hover:text-slate-900 hover:bg-purple-800 font-semibold text-sm mr-auto  px-1 py-1 rounded-sm text-slate-800 outline-none text-left w-fit  border-none text-ellipsis" onClick={CloseChat} >Close</button>
                                                        </span>
                                                    </div>
                                                    <span onClick={() => SetDisplayMore(false)} className={` cursor-pointer w-fit h-fit text-lg hover:text-amber-500 text-slate-100 px-2  mb-auto ml-auto text-center`}>&times;</span>
                                            </div>
                                    </div>
                                    

                                </div>
                                {/* chat log */}
                                <div  id="ChatlogContainer" ref={ChatlogContainer} className={` z-20 bg-transparent flex flex-col overflow-auto w-full gap-1 border-y-[1px] dark:border-slate-300 border-slate-800 h-[85%]  `}>
                                    {ChatLogMapper}
                                </div>
                                {/* text bar */}
                                
                                <div className="  bg-transparent w-full flex relative flex-col py-2 justify-between h-fit min-h-fit z-30" >
                                        <div className=" w-full flex flex-col md:flex-row justify-start">
                                            <video controls title="Uploaded Video" id="UploadedVideo" className={` ${Show.UploadedVideo ? 'flex' : 'hidden'} max-h-[70px] sm:max-h-[90px] ml-3 rounded-sm border-[1px] w-fit h-fit`} src=""></video>
                                            <FaFileArrowUp className={` w-fit mr-auto text-amber-500 ${Show.UploadedFile ? 'flex' : ' hidden'} border-slate-800 min-h-[30px] max-h-10 w-[90%] md:max-w-[600px] ml-3 rounded-sm   h-fit`}  />
                                            <audio ref={audioRef} controls title="Uploaded Audio" id="UploadedAudio" className={` ${Show.UploadedAudio ? 'flex' : ' hidden'} border-slate-800 min-h-[30px] w-[70%] md:max-w-[400px] ml-3 rounded-sm  h-fit`} src=""></audio>
                                            <img  title="Uploaded image" id="UploadedPic" src={TestImg} className={` ${Show.UploadedImg ? ' flex' : 'hidden'} rounded-md ml-3 min-w-fit my-auto w-16 h-16 `}  alt="" />
                                            <small className=" my-auto px-2 text-[x-small] lg:text-sm ">{Show.UploadedFileName}</small>
                                            <div className= {` ${Show.ReplyChatDiv ? ' flex' : 'hidden'}  flex flex-row max-w-[80%] mr-auto w-fit justify-start gap-1 sm:gap-4  `}   >
                                                <textarea className={`max-w-[250px] text-left translate-y-4 break-words text-slate-100 bg-slate-700 ml-2 h-fit max-h-[50px] min-h-fit sm:max-h-[100px] rounded-md font-mono text-sm w-[90%] p-3 tooltip tooltip-info`} readOnly data-tip="Reply Chat"  value={Show.ReplyChat} ></textarea>
                                                <IoMdClose onClick={() => SetReply('close',null)} className="cursor-pointer mb-auto text-red-600 hover:text-purple-500 mt-2 sm:mt-3 text-lg" />
                                            </div>
                                                <IoMdClose onClick={() => ClearUpload('clear')} className= {` ${UploadVal.File != null && UploadVal.upload != '' ? ' absolute left-[90%] ' : 'hidden'} cursor-pointer mb-auto text-red-600 hover:text-purple-500 mt-2 sm:mt-3 text-lg `} />
                                        </div>
                                        <div className=" ml-2" {...getRootProps()} >
                                            <input disabled {...getInputProps()} /> 
                                            <p className=" text-[x-small] font-semibold md:text-sm">Drag and drop some files here, or click to select files</p>
                                        </div>
                                        <div  className="  bg-transparent w-full flex flex-row py-2 justify-between h-fit min-h-fit z-30">
                                            
                                            
                                            <textarea 
                                            ref={ChatMessageRef}
                                            onChange={WriteGeneraldata}
                                            placeholder="Text Goes Here" 
                                            className=" ml-2 dark:ring-transparent pr-5 w-[100%]  dark:bg-transparent dark:border-[1px] dark:border-orange-800 dark:shadow-md dark:shadow-lime-200  placeholder:font-semibold break-words bg-slate-800 text-slate-100 outline-none min-h-[50px] max-h-[80px] dark:text-slate-300 dark:placeholder:text-gray-400 sm:w-[60%] max-w-[600px] border-transparent  rounded-sm border-[1px]  ring-2 ring-slate-600 my-auto  py-2"
                                            name="chatMessage" id="chatMessage"></textarea>
                                            <MdOutlineEmojiEmotions onClick={() => SetShowEmoji((e) => !e)} className={` cursor-pointer transition-all duration-500 z-40 -translate-x-6 text-yellow-300 text-2xl`} />
                                            <div className=" text-right  grid sm:flex sm:flex-row sm:mr-3 sm:gap-4 grid-cols-2 gap-0 justify-end mr-2 ml-auto  w-[40%] max-w-[300px]">
                                                
                                                <input  ref={UploaderFile} onChange={Uploader} className=" hidden text-sm h-fit my-auto" type="file" />
                                                < MdOutlineFileUpload onClick={TriggerUpload} title="upload" className=" hover:text-xl transition-all duration-300 dark:hover:text-lime-500 hover:text-blue-600 cursor-pointer text-lg   my-auto"/>
                                                < FaLink onClick={PastDataText} title="Past" className=" hover:text-xl transition-all duration-300 hover:text-blue-600 cursor-pointer text-lg  my-auto"/>
                                                <span className=" relative flex flex-col h-fit my-auto align-middle w-fit justify-center gap-0">
                                                    <FaSpinner  className={` absolute mb-[150%] ml-[50%] ${Show.VoiceNoteDot ? 'flex' : 'hidden'} animate-spin ml-auto h-3 w-3 text-red-500`} />
                                                     < TiMicrophone onMouseDown={() => TriggerVoiceNote('down')} onMouseUp={() => TriggerVoiceNote('up') } title="record" className=" h-[70%] hover:text-xl  transition-all duration-300 hover:text-blue-600 cursor-pointer text-lg  my-auto"/>
                                       
                                                </span>
                                                < IoSendSharp disabled={Generaldata.chatMessage == '' || UploadVal.File ==null} onClick={() => SendChat('null','null','null')} title="send" className= {` ${Generaldata.chatMessage != '' || UploadVal.File !=null ? " translate-x-0 z-30" : ' translate-x-[1000%] z-0 '} hover:text-xl hover:text-red-600 duration-300 transition-all cursor-pointer text-lg  my-auto `}/>
                                            </div>
                                        </div>
                                        
                                </div>
                        </section>
                        <section className={`  relative overflow-x-hidden mt-5 w-[98%] sm:w-[80%]   rounded-md border-green-800 border-[1px] ${!ShowChatDisp ? 'flex flex-col justify-between' : 'hidden'}   m-auto md:mx-auto bg-transparent dark:text-slate-100  h-fit`} >
                            <img className=" animate-pulse w-full h-full sm:h-fit sm:w-fit"  src={EmptyChatImg} alt="" />
                            <span className=" dark:text-amber-500 transition-all dark:bg-slate-900 absolute font-semibold font-mono w-full duration-700 mt-[20%] bg-gray-400 bg-opacity-70  text-center flex flex-row gap-0">
                               <p className=" w-full text-center duration-500 transition-all animate-none">Select any Inbox to start a chat</p> 
                            </span>
                        </section>
                    </div>
                </div>

                

                <div className= {` dropdown dropdown-top lg:dropdown-right  dropdown-end ml-0 left-[80%] sm:left-[90%]  top-auto md:left-[1%] ${!ShowChatDisp ? ' fixed' : ' hidden'} bottom-2 z-[100%] `}>
                    {/* <button className={` z-40 float-right right-2 ${showScroller ? ' sticky' : 'hidden'} absolute  bg-blue-600 text-slate-100 p-1 md:text-base text-sm `} ><a href="#navSect"><FaArrowRightLong className=' p-1 text-xl md:text-2xl xl:text-4xl rotate-[270deg]' /></a></button> */}
                    <label tabIndex={0}  role="button" className="btn mr-3 mt-5 mb-auto btn-circle hover:bg-sky-700 bg-slate-800 dark:bg-purple-700 border-none outline-none swap swap-rotate">
  
                    {/* this hidden checkbox controls the state */}
                    <input className=" hidden" type="checkbox" />                  
                    {/* hamburger icon */}
                    <IoMdAdd onClick={() => SetShowMoreTools((e) => !e)} className= {`swap-on  fill-current mx-auto   text-slate-100 font-semibold cursor-pointer text-2xl `} />
                    
                    {/* close icon */}
                    <IoMdClose  onClick={() => SetShowMoreTools((e) => !e)}  className= {` swap-off  fill-current text-slate-100 font-semibold cursor-pointer text-2xl `} />
                    
                    </label>
                    <ul tabIndex={0} className=" z-50 dropdown-content dark:ring-0 ring-2 ring-sky-700  menu py-2 shadow bg-base-100 rounded-md gap-2 font-semibold w-52">
                        <li className=" w-full  hover:text-amber-600 p-2 cursor-pointer hover:bg-slate-800 transition-all duration-300" onClick={FetchNotes}>NotePad</li>
                        <li className=" w-full hover:text-amber-600 p-2 cursor-pointer hover:bg-slate-800 transition-all duration-300" >Item 2</li>
                    </ul>
                </div>

                <div className= {` z-50 ml-0   top-auto ${!ShowChatDisp && ShowNotePad ? ' fixed' : ' hidden'} bottom-10 z-[100%] `}>
                    <div className=" min-h-[300px] mb-2 shadow-md shadow-slate-100 mx-auto  xs:ml-2 sm:ml-[20%] w-fit min-w-[250px] sm:min-w-[400px] flex flex-col justify-between gap-1 bg-slate-800 text-slate-100">
                        {/* header */}
                        <div className= {` ${NotePadComponents.ShowNoteChatLog ? ' border-none' : 'border-b-[1px] border-b-slate-300 ' }py-2  flex flex-row w-full justify-around `}>
                            <IoMdAdd onClick={() => AddNoteFunc('show')} className= {` ${NotePadComponents.ShowNoteChatLog || NotePadComponents.addNote  ? ' hidden' : ' flex' } cursor-pointer  my-auto hover:text-amber-500 text-2xl `} />
                            <GoArrowLeft   onClick={CloseNoteChat} data-tip="Close" className= {` tooltip tooltip-error ${!NotePadComponents.ShowNoteChatLog && !NotePadComponents.addNote ? ' hidden' : ' flex' } cursor-pointer  my-auto hover:text-amber-500 text-2xl `} />
                            <big className=" font-semibold my-auto">NotePad</big>
                            <IoMdClose onClick={() => SetShowNotePad(false)} className="cursor-pointer my-auto text-red-600 hover:text-purple-500 text-2xl" />
                        </div>
                        <big className={` ${NotePadComponents.ShowNoteChatLog ? ' flex w-full text-center justify-center align-middle mb-auto border-b-[1px] border-b-slate-300 py-1 font-semibold' : ' hidden'}  `} >{NotePadComponents.SelectedTitle}</big>
                        <div className={` h-fit max-h-[200px] lg:max-h-[500px] mb-auto pr-3 pl-1 ${NotePadComponents.NoteList ? 'flex flex-col w-full justify-start whitespace-nowrap overflow-y-auto pb-3 gap-2' : ' hidden' } `}>
                            {NotePadlogsMapper}
                        </div>
                        <div ref={NoteChatLogContainer} className={` max-h-[500px] ${NotePadComponents.ShowNoteChatLog ? ' justify-start overflow-auto h-[85%] gap-2 flex flex-col' : ' hidden'} `}>
                            {NotePadChatLogMapper}
                        </div>
                        <div className= {` ${ NotePadComponents.addNote ? 'flex flex-col' : ' hidden'} w-[80%] m-auto  `}>
                            <input onChange={Addnote} name="NewNoteTitle" className=" text-ellipsis rounded-sm ring-1 ring-sky-700 bg-transparent placeholder:text-slate-300 placeholder:font-semibold" placeholder="Title" type="text" />
                            <button onClick={() => AddNoteFunc('Add')} className=" hover:shadow-md hover:shadow-slate-200 p-2 rounded-sm bg-transparent hover:text-amber-500 transition-all duration-500 min-w-[80px] mx-auto w-fit my-3 ring-1 ring-sky-700" >Add</button>
                        </div>
                        <div className= {` border-t-[1px] border-t-gray-400 py-2 pb-2 h-[10%]  ${NotePadComponents.ShowNoteChatLog ?'flex flex-row justify-between' : ' hidden'} px-3 w-full `}>
                            <textarea  onChange={Addnote} className=" break-words text-left rounded-sm outline-none bg-transparent ring-1 ring-sky-700 min-w-[80%] min-h-[50px] max-h-[80px] placeholder:text-gray-400" placeholder="Text goes here..." name="chatMessage" id="NotePadChatBox"></textarea>
                            <IoSendSharp onClick={SubmitNoteChatFunc} title="send" className=" hover:text-xl text-purple-700 hover:text-yellow-400 duration-300 transition-all cursor-pointer text-lg  my-auto"/>
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


export default connect(mapStateToProps,{UploadFile,load_user, logout,CheckAuthenticated})(Chat);