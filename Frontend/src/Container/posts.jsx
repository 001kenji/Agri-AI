import React, { Profiler, useEffect, useLayoutEffect, useRef, useState } from "react";
import '../App.css'
import { connect, useDispatch } from "react-redux";
import {useSelector} from 'react-redux'
import { UploadFile} from '../actions/Chat.jsx'
import { UpdateProfile,FetchUserProfile,UploadProfileFile } from "../actions/profile.jsx";
import Lottie,{useLottieInteractivity} from "lottie-react";  // from lottieflow
import Notifier from "../Components/notifier.jsx";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CiCircleMore } from "react-icons/ci";
import { BsFillHandThumbsUpFill } from "react-icons/bs";
import { SlShareAlt } from "react-icons/sl";
import { GoLink } from "react-icons/go";
import { FaCommentDots } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { IoSendSharp } from "react-icons/io5";
import { BsEmojiNeutral } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { IoIosImages } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import ReactPlayer from 'react-player'
import {  toast,ToastContainer } from 'react-toastify';
import { IoMdMore } from "react-icons/io";
import { FaPaste } from "react-icons/fa6";
import EmojiPicker from 'emoji-picker-react';
import 'react-quill/dist/quill.snow.css';
// lottieflow animated icons 
import { MdArrowUpward } from "react-icons/md";
import ThumbsUpIcon from '../json/thumbsUp.json'


import { MdOutlineSubtitles } from "react-icons/md";
import { MdArrowDownward } from "react-icons/md";

import ProfileTestImg from '../assets/images/fallback.jpeg'

import { PostCommentsReducer, SelectedPageReducer } from "../actions/types.jsx";
import { CheckAuthenticated, load_user } from "../actions/auth.jsx";

// using argon2 pashing for both javascript and py
//const argon2 = require('argon2');
const PostsJSX = (props) => {
    const {register,getValues,setValue} = useForm({
        defaultValues : {
            'PostCommentMessege' : ''
        },
        mode : 'all'
    })
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { page, extrainfo } = useParams();
    const db = useSelector((state) => state.auth.user)  
    const [ReLoad,SetReLoad] = useState(false)
    const [ProfilePost,SetProfilePost] = useState([])
    const ProfileDB = useSelector((state) => state.ProfileReducer.ProfileAbout)
    const [PostComments,SetPostComments] = useState(useSelector((state) => state.ProfileReducer.PostComments))
    const [OpenedCommentPost,SetOpenedCommentPost] = useState(null)
    const UserEmail  = db != null ? db.email : 'gestuser@gmail.com'
    const UserID  = db != null ? db.id : '13'
    const [UserName,SetUserName]  = useState(db != null ? db.name : 'null')
    const [PostPosition,SetPostPosition] = useState(0)
    const [PostContainerIsEmpty,SetPostContainerIsEmpty] = useState(false)
    const Theme = useSelector((state)=> state.auth.Theme)
    const lastScrollTop = useRef(0);
    const [ActivePost,SetActivePost] = useState(null)
    const [DispBottomPostContent,SetDispBottomPostContent] = useState(null)
    const [ProfilePostCarousel,SetProfilePostCarousel] = useState([null,0])
    const [EmojiInputTag,SetEmojiInputTag] = useState(null)
    const date = new Date()
    const [ProfilePicturePhoto,SetProfilePicturePhoto] = useState(ProfileTestImg)
    const [Show,SetShow] = useState({
        ReplyChat : '',
        ReplyUsername : ''

    })
    const GlobalPage = useSelector((state)=> state.auth.Page)
    const ProfilePostContainer = useRef(null)
    const PostContainerRef  = useRef(null)
    const WsDataStream = useRef(null)
    useEffect(() => {
        if(ProfileDB != null && db != null){
            // updating users profile picture and cover photo    
            SetProfilePicturePhoto(db.ProfilePic)
        }
       
    },[ProfileDB])
    useEffect(() => {
        // if(GlobalPage != 'post'){
        //     console.log('global page is:',GlobalPage)
        //     SetPostComments([])
        //     SetProfilePost([])
        //     requestWsStream('close')
        // }
    },[GlobalPage])
   //Ref hook for animated icons
   const ThumbsUpRef = useRef()
    // opening websocket for fetching posts
    useLayoutEffect(() => {
        requestWsStream('open',null)
        const intervalId = setInterval(() => {
            //console.log('reloading')
            SetReLoad((e) => !e); // Toggling state every 60 seconds
           
        }, 60000);
        
        return () => {
            clearInterval(intervalId); // Cleanup on unmount
        };

    },[])
    useEffect(() => {
        if(db != null){
            ScrollPosts('back')
            requestWsStream('open',null)
        }
    },[db])
    function DeletePost (idval,index) {
        if(idval ) {
            var data = {
                'scope' : 'DeletePost',
                'AccountEmail' : UserEmail,
                'PostId' : idval
            }
            
            props.FetchUserProfile(JSON.stringify([data]))
        }
    }
    function MakePublic (idval,scope) {
        if(idval ) {
            var data = {
                'AccountEmail' : UserEmail,
                'PostId' : idval
            }
            
            requestWsStream(scope,data)
        }
    }
    const ShowCommentContainer = (propsval,postid) => {
       
        if(propsval != '' || propsval == 0) {
            
            var CommentContainerLoader = document.getElementById(`CommentContainer-loader-${postid}`)
            if(OpenedCommentPost == postid){
                SetOpenedCommentPost(null)
                SetPostComments([])
            }else if(OpenedCommentPost != postid || PostComments.length == 0  ) {
                SetOpenedCommentPost(postid)
                CommentContainerLoader.style = 'flex'
                SetActivePost([propsval,postid])
                if(postid != OpenedCommentPost){
                    SetPostComments([])
                }
                requestWsStream('RequestProfileComments',postid)
            }else {
                SetOpenedCommentPost(null)
                SetPostComments([])
            }
            
        }
    }
    
    // websocket for recieving data like posts
    const requestWsStream = (msg = null,body = null,continuetion = false,continuetionId = null,direction = null) => {    
       
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
            if(data.type == 'RequestPosts'){
                var continuetionval = data.message[1]
                if(data.message[0] != null && continuetionval == 'True'){
                    var direction  = data.message[2]
                    var datapost = data.message[0]
                    if (direction == 'back'){
                        if((ProfilePost.length -1 ) != 0){
                            var slicedPosts = ProfilePost.slice(0, -2)  // exclude the last 2 items
                        }else{
                            var slicedPosts = ProfilePost
                        }
                        
                        var postdata = [...datapost,...slicedPosts] 
                    }else if(direction == 'next'){
                        if((ProfilePost.length -1 ) != 0){
                            var slicedPosts = ProfilePost.slice(2) // exclude the first 2 items
                        }else {
                            var slicedPosts = ProfilePost
                        }
                        
                        var postdata = slicedPosts.concat(data.message[0])
                    }
                    
                    SetProfilePost(postdata)
                }else if(continuetionval == 'False' && data.message[0] != null){
                    
                    SetProfilePost(data.message[0])
                }else if (data.message[0] == null ){
                    toast('No more posts',{
                        position : 'top-right',
                        theme : Theme,
                        type : 'warning'
                    })
                }
                
                
            }else if (data.type == 'RequestProfileComments'){
                var newCommentData = data.message[0]
                var IsContinuetion = data.message[2]
                if(IsContinuetion) {
                    var UniversalCommentData = newCommentData.concat(PostComments)
                    
                }else{
                    UniversalCommentData = newCommentData
                    
                }
                
                var postid = data.message[1]               
                    
                var CommentContainerLoader = document.getElementById(`CommentContainer-loader-${postid}`)
                setTimeout(() => {
                    CommentContainerLoader.style.display = 'none'
                }, 2000);
                  
                
                SetPostComments(UniversalCommentData)
                //console.log(UniversalCommentData)
                // dispatch({
                //     type : PostCommentsReducer,
                //     payload : UniversalCommentData
                // })
                //SetReLoad((e) => !e)
            }else if (data.type == 'SendPostComment'){
                var newCommentData = [data.message[0]]
                var CommentLength = data.message[1]
                //console.log(data.message)
                var postid = newCommentData[0]['post_id']
                var UniversalCommentData = PostComments.concat(newCommentData)

                var postdata = ProfilePost
                for (let i = 0; i < postdata.length; i++) {
                    if(postdata[i].id == postid){
                        postdata[i].CommentNumber = CommentLength
                    }
                    
                }   
                
                SetPostComments(UniversalCommentData)
                // adding postcomments without realoading
                SetProfilePost(postdata)
                
                var Log = document.getElementById(`CommentContainer-${postid}`)
                
                Log.scrollTo({
                    'top' : Log.scrollHeight ,
                    'behavior' : 'smooth',
                })
                
            }else if(data.type == 'RequestDeleteComment') {
                var status = data.message.status 
                if(status == 'success'){
                    var postid = data.message.data[1]
                    var commendId = data.message.data[0] 
                    var CommentLength = data.message.data[2]
                    var UniversalCommentData = PostComments
                    if(UniversalCommentData.length != 0) {
                        var commentsData = UniversalCommentData
                        for (let i = 0; i < commentsData.length; i++) {
                            if(commentsData[i].id == commendId){
                                commentsData.splice(i,1)
                                break
                            }
                            
                        }
                        UniversalCommentData = commentsData
                    }else {
                        UniversalCommentData = []
                    }
                    var postdata = ProfilePost
                    for (let i = 0; i < postdata.length; i++) {
                        if(postdata[i].id == postid){
                            postdata[i].CommentNumber = CommentLength
                        }
                        
                    }   
                    
                    SetPostComments(UniversalCommentData)
                    // adding postcomments without realoading
                    SetProfilePost(postdata)
                    toast(data.message.messege,{
                        position : 'top-right',
                        theme : Theme,
                        type : 'success'
                    })
                    // dispatch({
                    //     type : PostCommentsReducer,
                    //     payload : UniversalCommentData
                    // })
                    SetReLoad((e) => !e)
                }else if(status == 'error'){
                    toast(data.message.messege,{
                        position : 'top-right',
                        theme : Theme,
                        type : 'error'
                    })
                }
            }else if(data.type == 'RequestLikePost'){
                var status = data.message.status 
                if(status == 'success'){
                    var newpost = data.message.data 
                    var postid = newpost.id
                    var UniversalProfilePost = ProfilePost
                    for (let i = 0; i < UniversalProfilePost.length; i++) {
                        if(UniversalProfilePost[i].id == postid){
                            UniversalProfilePost[i] = newpost
                            break
                        }                        
                    }
                    SetProfilePost(UniversalProfilePost)
                    
                    SetReLoad((e) => !e)
                }else if(status == 'error'){
                    toast(data.message.messege,{
                        position : 'top-right',
                        theme : Theme,
                        type : 'error'
                    })
                }
            }else if (data.type == 'RequestSavePost'){
                var val = data.message
                toast(val['result'], {
                    type: val['type'],
                    theme: Theme,
                    position: 'top-right',
                })
            }
        };
        WsDataStream.current.onopen = (e) => {
            // websocket is opened
            var id = extrainfo == 'undefined' ? null : extrainfo
            requestWsStream('RequestPosts',id,false,null,'new')
        }
        // var Log = document.getElementById(`CommentContainer-${14}`)
        // console.log(Log.childNodes)
        WsDataStream.current.onclose = function (e) {
          //console.log('closing due to :',e)
        //   toast('Connection Closed', {
        //       type: 'error',
        //       theme: Theme,
        //       position: 'top-right',
        //   })
          
        }
        if(WsDataStream.current.readyState === WsDataStream.current.OPEN){
            if(msg == 'RequestPosts') {
                
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'RequestPosts',
                        'email' : UserEmail,
                        'position' : body,
                        'continuetion' : continuetion,
                        'direction' : direction
                    })
                )
            }else if (msg == 'RequestProfileComments'){
                    WsDataStream.current.send(
                        JSON.stringify({
                            'message' : 'RequestProfileComments',
                            'position' : body,
                            'continuetion' : continuetion,
                            'continuetionId' : continuetionId
                        })
                    )
            }else if(msg == 'SendPostComment') {
                    WsDataStream.current.send(
                        JSON.stringify({
                            'message' : 'SendPostComment',
                            'data' : body
                        })
                    )
            }else if(msg == 'RequestDeleteComment') {
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'RequestDeleteComment',
                        'data' : body
                    })
                )
            }else if(msg == 'RequestLikePost'){
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'RequestLikePost',
                        'data' : body
                    })
                )
            }else if(msg == 'RequestSavePost'){
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'RequestSavePost',
                        'data' : body
                    })
                )
            }
            
        }
        
    } 
    function SubmitPostComment(position,propsval) {
        if(propsval != null && UserEmail != 'gestuser@gmail.com'){
            var commentInput = document.getElementById(`PostCommentInput-${propsval}`)
            var sendicon = document.getElementById(`ClickedSendIcon-${propsval}`)
            sendicon.style.transform = "translateX('200px')"
            var data = {
                'postid' : String(propsval),
                'messege' : commentInput.value,
                'CommentUserDetails' : {
                    'profilePic' :  db != null ? db.ProfilePic : '',
                    'name' : UserName,
                    'email' : UserEmail,
                    'userID' : UserID   
                },
                'replyCommentDetails' : {
                    'username' : Show.ReplyUsername,
                    'messege' : Show.ReplyChat,
                    'IsReply' : Show.ReplyChat == '' ? false : true
                }
            }           
            
           
            commentInput.value = ''
            
           requestWsStream('SendPostComment',data) 
           var replyDispContainer = document.getElementById(`PostReplyContainer-${propsval}`)
            replyDispContainer.style.display = 'none'
            SetShow((e) => {
                return  {
                    ...e,
                    'ReplyChat' : '',
                    'ReplyUsername' : ''
                }
            })
           var CommentContainer = document.getElementById(`CommentContainer-${propsval}`)
           var CommentContainerLoader = document.getElementById(`CommentContainer-loader-${propsval}`)
           //console.log(CommentContainer,CommentContainerLoader)
           if(CommentContainer.style.display == 'none') {
               
               CommentContainer.style.display = 'flex'
               CommentContainer.style.flexDirection = 'column'
               CommentContainerLoader.style.display = 'none'
               SetActivePost([position,propsval])
           }
           
        }else if (UserEmail == 'gestuser@gmail.com'){
            toast('SignUp to manage account',{
                position : 'top-right',
                type : 'warning',
                theme : Theme
            })
        }
        
    }
    function CopyChat(props,i) {
        if(props){

            navigator.clipboard.writeText(props).then(() => {
            }).catch(err => {
                console.error('Error:', err);
            });
            toast('Copied.',{
                position : 'top-center',
                theme : Theme,
                type : 'success'
            })
        }else {
            return false   
        }
        
    }
    function DeleteComment (commentEmail,commentId,postId){
        if(commentEmail != '' && commentId != '') {
            var x = {
                'commentEmail' : commentEmail,
                'commentId' : commentId,
                'postId' : postId
            }
            requestWsStream('RequestDeleteComment',x,false,null)
        }
    }
    function OpenUserProfile (useridval) {
        if(useridval != null){
            dispatch({
                type : SelectedPageReducer,
                payload : useridval
            })
            //navigate(`/home/profile/${useridval}`)
            
        }
    }
    const TimeCommentUpdater = ({dateString}) => {
        const date = new Date(dateString  + '+03:00') ; // Append time and timezone offset
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
            //console.log(count)
            if (count > 0) {
                var val = count === 1 ? `1 ${interval.label} ago` : `${count} ${interval.label}s ago`

                return <time data-tip={date.toDateString()} className="text-xs cursor-default tooltip tooltip-top w-fit mr-auto text-slate-600 dark:text-slate-500 ">{val}</time>
            }
        }
        
        return <time data-tip={date.toDateString()} className="text-xs cursor-default tooltip tooltip-top w-fit mr-auto text-slate-600 dark:text-slate-500 ">just now</time>
        //return 'just now';
    }
    function ToogleReplyChat (disp,propsval,messageval = null,username = null) {
        console.log(disp,propsval)
        if(propsval != null && disp == 'show') {
            var replyDispContainer = document.getElementById(`PostReplyContainer-${propsval}`)
            replyDispContainer.style.display = 'flex'
            SetShow((e) => {
                return  {
                    ...e,
                    'ReplyChat' : messageval,
                    'ReplyUsername' : username
                }
            })
        }else if(disp == 'close'){
            var replyDispContainer = document.getElementById(`PostReplyContainer-${propsval}`)
            replyDispContainer.style.display = 'none'
            SetShow((e) => {
                return  {
                    ...e,
                    'ReplyChat' : '',
                    'ReplyUsername' : ''
                }
            })
        }
    }
    const MapPostComment = ({postid,postEmail}) => {
       
        if(PostComments[0]){
            //var IsEmpty = Comments && PostComments[0] != {} ? Comments.length == 0 ? true : false : true
            var IsFilled =  PostComments != null ? PostComments.length !=  0 ? true : false : false
            var IsEmpty =  PostComments != null  ? PostComments.length ==  0  ? true : false : false
          
            if(IsFilled ){
               
                var Comments = PostComments.map((items,i) => {
                    var profileid = items.CommentUserDetails.userID ? items.CommentUserDetails.userID  : null
                    var IsReplybody = items.replyCommentDetails != '' && items.replyCommentDetails != 'null' ? true : false
                    var ShowReply = IsReplybody == true ? items.replyCommentDetails.IsReply == true ? true :false : false
                    var replyUsername = ShowReply == true ? items.replyCommentDetails.username : ''
                    var replyMessege = ShowReply == true ? items.replyCommentDetails.messege : ''

                    return (
                        <div  key={i} className={`dropdown bg-transparent  relative flex px-2 min-w-[150px] max-w-[280px] sm:max-w-[90%]   bg-opacity-90 w-fit my-1 mx-2 chat chat-start flex-col md:flex-row   mr-auto   gap-1`}>
                            <div className= {`avatar md:mb-auto `}>
                                <div className="mask transition-all duration-300 mask-hexagon w-6 hover:w-12 ">
                                    <img loading="lazy" src={items.CommentUserDetails.profilePic} />
                                </div>

                            </div>
                            

                            <div className={`chat-bubble bg-slate-200 dark:bg-slate-800 min-w-full max-w-[150px] xs:max-w-[50vw] sm:max-w-full relative   shadow-md flex-col shadow-slate-500  dark:shadow-slate-500 gap-2 w-full flex `}>
                                {/* <video loading="lazy" onClick={() => OpenImage(items.src)} src={`${import.meta.env.VITE_WS_API}/media/${items.src}`} controls title="Uploaded Video"  className={`   cursor-pointer ${items.upload == 'video' && items.src != 'null' ? 'flex' : 'hidden'} max-h-[70px] sm:max-h-[90px] md:min-h-[200px] ml-3 rounded-sm  w-fit h-fit`} ></video>                                            
                                <audio  src={`${import.meta.env.VITE_WS_API}/media/${items.src}`}  controls title="Uploaded Audio"  className={`cursor-pointer ${items.email == UserEmail ? ' mr-2' : ' ml-2'} px-2  ${items.upload == 'audio' && items.src != 'null' ? 'flex' : ' hidden'} border-slate-800 min-h-[40px] min-w-[200px]  w-[90%] sm:min-w-[300px]  h-fit`} ></audio>
                                <img loading="lazy" onClick={() => OpenImage(items.src)} src={`${import.meta.env.VITE_WS_API}/media/${items.src}`}  title="Uploaded image"   className={`cursor-pointer ${items.email == UserEmail ? ' mr-3' : ' ml-3'}  ${items.upload == 'image' && items.src != 'null' ? ' flex' : 'hidden'}  rounded-sm  min-w-fit border-none my-auto w-fit h-fit  max-h-[50px] xs:max-h-[100px] lg:max-h-[150px] `}  alt="" />
                                 */}
                                <span onClick={() => OpenUserProfile(profileid)} className={` text-slate-800 dark:text-slate-100 chat-header hover:underline hover:underline-offset-2 cursor-pointer text-[x-small]  font-semibold`}>{items.CommentUserDetails.name}</span>
                                <div className= {` border-[1px] rounded-sm p-2 text-slate-500 dark:text-slate-400 border-slate-600 ${ShowReply == true ? ' flex' : 'hidden'}  flex flex-col xs:w-full w-full xs:min-w-full justify-start gap-1 my-3 `}   >
                                    <span className={` chat-header  font-semibold flex flex-row gap-3`}>{replyUsername} : <p className=" italic text-orange-500 text-opacity-80 text-[x-small] md:text-sm">Reply</p></span>
                                    <textarea className={` border-none bg-transparent mr-auto text-left  break-all text-slate-950 dark:text-slate-100  h-fit max-h-[50px] min-h-[30px] sm:max-h-[100px] w-[100%] rounded-sm font-mono text-sm p-2 resize-y cursor-text`} disabled value={replyMessege} ></textarea>
                                </div>
                                <blockquote className={` max-w-[120px] xs:max-w-[50vw] sm:max-w-[400px] xl:max-w-[400px] lg:max-w-[200px] w-fit  break-all  text-slate-900 dark:text-slate-200 font-mono text-sm `} > 
                                    {items.message } 
                                </blockquote>                    
                                <TimeCommentUpdater dateString={items.dateCommented} />
                            </div>

                            <button tabIndex={i} className= {` overflow-hidden absolute left-full top-8 sm:relative sm:left-0 sm:top-0 sm:mb-auto  z-[100%] self-center items-center p-2 min-w-[30px] text-sm font-medium text-center text-gray-900 bg-slate-200 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600 `} type="button">
                                <IoMdMore  title="more" className={` text-base  h-4 w-4 cursor-pointer my-auto  sm:text-xl`} />
                            </button>   
                            <div tabIndex={i}  className=" xs:ml-4 sm:ml-4  z-50 font-semibold dropdown-content  bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600">
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                                    <li className={` ${items.message != '' ? 'flex w-full' : 'hidden'} `} >
                                        <span onClick={() => ToogleReplyChat('show',postid,items.message,items.CommentUserDetails.name)} className= {`$ block w-full cursor-pointer px-4 py-2 hover:bg-gray-300 tooltip-right dark:hover:bg-gray-600 dark:hover:text-white `}>Reply</span>
                                    </li>
                                    <li className={` ${items.message != '' ? 'flex w-full' : 'hidden'} `} >
                                        <span onClick={() => CopyChat(items.message,i)} data-tip="Copied"  className= {`$ block w-full cursor-pointer px-4 py-2 hover:bg-gray-300 tooltip-right dark:hover:bg-gray-600 dark:hover:text-white `}>Copy</span>
                                    </li>
                                    <li onClick={() => DeleteComment(items.account_email,items.id,postid)} className={` ${items.message != '' && (postEmail == UserEmail || items.account_email == UserEmail ) ? 'flex w-full' : 'hidden'} `} >
                                        <span className="block w-full cursor-pointer px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white">Delete</span>
                                    </li>
                                </ul>
                            </div>
                                    
                        </div>
                    )
                })
                return Comments
            }else if(IsEmpty) {
                return (
                    <div className= {`card mx-auto bg-base-100 image-full w-[60%] max-h-[150px] my-2 max-w-[200px] shadow-xl `}>
                        <figure className=" w-full opacity-100 "  >
                            <img loading="lazy"
                            className=" opacity-100"
                            src={ProfilePicturePhoto}
                            alt="Shoes" />
                        </figure>
                        <div className="card-body align-middle">
                            <h1 className=" font-[button] text-xl text-center m-auto " >No Comments</h1>
                            
                        </div>
                    </div> 
                )
            }
            
        }else{
            return (
                <div className= {`card mx-auto bg-base-100 image-full w-[60%] max-h-[150px] my-2 max-w-[200px] shadow-xl `}>
                    <figure className=" w-full opacity-100 "  >
                        <img loading="lazy"
                        className=" opacity-100"
                        src={ProfilePicturePhoto}
                        alt="Shoes" />
                    </figure>
                    <div className="card-body align-middle">
                        <h1 className=" font-[button] text-xl text-center m-auto " >No Comments</h1>
                        
                    </div>
                </div> 
            )
        }
    }
    async function PasteClipboard  (id) {
        //console.log(id)
        try {
            const clipboardData = await navigator.clipboard.readText();
            //console.log('Clipboard data:', clipboardData);
            var commentInput = document.getElementById(`PostCommentInput-${id}`)
            commentInput.value = clipboardData
        
          } catch (error) {
            console.error('Failed to read clipboard data:');
          }
    }
    function ScrollingCommentContainer (index,postid) {
        if(index != null) {
            var i = index == 0 ? 0 : index
            var commentContainer = document.getElementById(`CommentContainer-${postid}`)
            var CommentContainerLoader = document.getElementById(`CommentContainer-loader-${postid}`)
            if (commentContainer.scrollTop == 0 && PostComments.length != 0) {
                var commentId = PostComments[0].id
                var postCommentId = PostComments[0].post_id
                if(postCommentId = OpenedCommentPost){
                    
                    //console.log('User has scrolled to the bottom!',position);
                    //console.log('am scrolling:',commentId,postid)
                    //console.log('am scrolled top is: ',commentId)
                    CommentContainerLoader.style = 'flex'
                    requestWsStream('RequestProfileComments',postid,true,commentId)
              
                }
            }
        }
    }
    const handlePostScroll = (event) => {
        //console.log(event)
    
        if (event.deltaY > 0) {
            ScrollPosts('next')
          } else if (event.deltaY < 0) {
            ScrollPosts('back')
          }
       
    }

    function LikePostFunc (postid) {
        //console.log(postid)
        if(postid != null && UserEmail != 'gestuser@gmail.com') {
            var data = {
                'postId' : postid,
                'userEmail' : UserEmail
            }
            requestWsStream('RequestLikePost',data)
        }
        if(UserEmail == 'gestuser@gmail.com'){
            console.log('disp')
            toast('Sign Up to like the post',{
                position : 'top-right',
                theme : Theme,
                type : 'warning'
            })
        }
    }
    function ScrollPosts (props){
       
        if(props == 'next'){
            var length = ProfilePost.length - 1
            var pos = PostPosition >= length ? length : PostPosition 
            SetPostPosition((e) => e >= length ? length : e + 1)
            if(ProfilePost[0]){
                if((ProfilePost.length - 2) == PostPosition || pos == (ProfilePost.length - 1)){
                   
                    var position = ProfilePost[ProfilePost.length -1].id + 1
                    
                    requestWsStream('RequestPosts',position,true,null,'next')
                }
                
            }
            
            
        }else if(props == 'back'){
            var length = ProfilePost.length - 1  
            var half = Math.floor(length / 2)    
            var pos = PostPosition >= length ? length : PostPosition
            SetPostPosition((e) => e <= 0 ? 0 : e - 1) 
            if(ProfilePost[0]){
                if(PostPosition < half || pos == 0){
                   
                    var position = ProfilePost[0].id 
                    
                    requestWsStream('RequestPosts',position,true,null,'back')
                }
                
            }
            

        }
        //console.log(props, PostPosition,length)
    }
    //document.getElementById().childNodes
    function SavePost (postid) {
        if(postid != null && UserEmail != 'null' && UserEmail != 'gestuser@gmail.com'){
            var data = {
                'AccountEmail' : UserEmail,
                'PostId' : postid,
                'userID' : UserID
            }
            console.log('called: ',data)
            requestWsStream('RequestSavePost',data)
        }
        if(UserEmail == 'null' || UserEmail == 'gestuser@gmail.com'){
            toast('SignUp to save the post',{
                position : 'top-right',
                theme : Theme,
                type : 'warning'
            })
        }
    }
    function DeletePost (idval,index) {
        if(UserEmail != 'null' && UserEmail != 'gestuser@gmail.com'){
            if(idval ) {
                var data = {
                    'scope' : 'DeletePost',
                    'AccountEmail' : UserEmail,
                    'PostId' : idval
                }
                
                props.FetchUserProfile(JSON.stringify([data]))
            }
        }
        if(UserEmail == 'null' || UserEmail == 'gestuser@gmail.com'){
            toast('SignUp to save the post',{
                position : 'top-right',
                theme : Theme,
                type : 'warning'
            })
        }
    }
    function EmojisFunc(e) {
        if(EmojiInputTag != null){
            var idval = EmojiInputTag
            var commentInput = document.getElementById(`PostCommentInput-${idval}`)
        
            commentInput.value = commentInput.value + e.emoji
        
        }
    }
    function CopyPostLink(postid) {
        if(postid != null){
            var link = `${import.meta.env.VITE_FRONTEND_URL}/home/post/${postid}`
            navigator.clipboard.writeText(link).then(() => {
            }).catch(err => {
                console.error('Error:', err);
            });
            toast('Link Copied.',{
                position : 'top-center',
                theme : Theme,
                type : 'success'
            })
        }
        
    }
    function ToogleBottomContent (disp,postid) {
        if(disp == 'show'){
            if(postid != null) {
                SetEmojiInputTag(postid)
                SetEmojiInputTag(postid)
                SetDispBottomPostContent(postid)
            }
        }else if(disp != 'hide') {
            if(postid != null) {
                SetEmojiInputTag(postid)
                SetEmojiInputTag(null)
                SetDispBottomPostContent(null)
            }
        }
             
    }
    const TimePostUpdater = ({dateString}) => {
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

                return <small data-tip={date.toDateString()} className=" cursor-default tooltip tooltip-bottom w-fit mr-auto" >{val}</small>
            }
        }

        return <small data-tip={date.toDateString()} className=" cursor-default tooltip tooltip-bottom w-fit mr-auto" >just now</small>
        //return 'just now';
    }
    
    const ScrollPostCarousels = (idval,position) =>{
        if(idval != null && position == 'back'){
            SetProfilePostCarousel([idval,0])
        }else if(idval != null && position == 'next'){
            SetProfilePostCarousel([idval,1])
        }
    }
    
    const MapPosts = ProfilePost.map((items,i) => {
        var profileid = items.postUserDetails.userID ? items.postUserDetails.userID  : null
        var filetype = items.postUserDetails.PostFileType
        var fileurl = items.postUserDetails.PostFileUrl
        var IsUserPost = items.account_email == UserEmail ? true : false
        var IsPrivate = items.postPrivacy == 'public' ? false : true
        var CommentLength =  items.CommentNumber != null ? items.CommentNumber : 0
        var showButtons = items.content != '' && filetype != null ? true : false
        return (
            <div key={i} className=" h-[100vh] min-h-[100vh] max-w-[600px] overflow-hidden w-full sm:mx-auto " >
                <div  className={`flex flex-col relative border-[1px] border-slate-600 dark:border-slate-400 justify-start h-fit w-full mx-auto  bg-gray-200 dark:bg-slate-600 xl:max-w-[600px] rounded-md `} >
                    {/*post header container */}
                    <div className=" px-4 pb-2 w-full z-30 text-slate-800 dark:text-slate-100  border-b-[1px] border-slate-600 dark:border-slate-400 h-fit min-h-[60px] flex flex-row justify-around " >
                        <div className="avatar my-auto">
                            <div className="w-14 h-14 rounded-full">
                                <img loading="lazy" src={items.postUserDetails.profilePic} />
                            </div>
                        </div>
                        <div className=" relative flex my-auto flex-col text-left w-full ml-4 mr-auto h-fit" >
                            <span data-tip='Open Profile' onClick={() => OpenUserProfile(profileid)} className="tooltip tooltip-bottom text-left w-fit mr-auto font-semibold hover:underline hover:underline-offset-2 cursor-pointer text-lg " >
                                {items.postUserDetails.name} 
                                
                                </span>
                            <p className= {` ${IsPrivate && IsUserPost ? 'flex' : 'hidden'} badge badge-neutral absolute inline  left-[95%] bg-opacity-60  bg-slate-950 text-sm text-amber-400 `} >private</p>
                            <TimePostUpdater dateString={items.datePosted} />
                            <span className=" font-semibold " >{items.title}</span>
                        </div>
                        <div className="dropdown min-w-[40px] dark:text-slate-100 my-auto dropdown-end">
                            <CiCircleMore className=" my-auto text-3xl hover:text-slate-100 dark:hover:text-slate-300 text-slate-800 dark:text-slate-200 transition-all duration-300 " tabIndex={0} role="button" />
                            <ul tabIndex={0} className="dropdown-content menu bg-slate-300 dark:bg-base-100   rounded-box z-[1] w-52 p-2 shadow">
                                <li onClick={() => SavePost(items.id)} className=" hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md" ><a>Save</a></li>
                                <li onClick={() => DeletePost(items.id,i)} className= {` ${IsUserPost ? 'flex' : 'hidden'} hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md `} ><a>Delete Post</a></li>
                                <li onClick={() => MakePublic(items.id,'MakePostPublic',)} className= {` ${IsUserPost && IsPrivate ? 'flex' : 'hidden'} hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md `} ><a>Make Pulic</a></li>
                                <li onClick={() => MakePublic(items.id,'MakePostPrivate',)} className= {` ${IsUserPost && !IsPrivate ? 'flex' : 'hidden'} hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md `} ><a>Make Private</a></li>
                                <li title="report this post" className= {` ${IsUserPost ? 'hidden' : 'flex'} hover:bg-slate-100 dark:hover:bg-slate-700  rounded-md `} ><a>Report</a></li>
                            </ul>
                        </div>
                    </div>
                    {/* post content */}
                    <div id="controls-carousel" className=" w-full h-fit bg-transparent relative overflow-hidden " >
                        <div style={{transform: ProfilePostCarousel[0] == items.id ? `translateX(-${ProfilePostCarousel[1] * 100}%)` : ''}} className=" w-full h-fit bg-transparent z-20 transition-all duration-300 max-h-[800px] relative flex flex-row overflow-visible " >
                            <div className={` ${filetype == 'image' ? '' : 'hidden'} w-full m-auto min-w-full h-fit`} >
                                <img loading="lazy"
                                    className= {` ${filetype == 'image' ? ' h-fit max-h-[500px] m-auto mask-square' : ' hidden'} `}
                                    src={`http://127.0.0.1:8000/media${fileurl}`} 
                                />
                            </div>
                            
                            <div className={` ${filetype == 'video' ? '' : 'hidden'} w-full m-auto min-w-full h-fit`} >
                                <video loading="lazy" src={`http://127.0.0.1:8000/media${fileurl}`} 
                                className={` ${filetype == 'video' ? 'flex' : 'hidden'} w-full m-auto min-w-full h-fit p-0 border-none  max-h-[800px] min-h-[400px] `} width="320" height="240" controls>
                                        Your browser does not support the video tag.
                                </video>
                            </div>
                            
                            {/* <span className={` ${items.content != '' ? 'inline' : 'hidden' } ${filetype != 'video' ? '-translate-y-2' : ' translate-y-0'}  h-fit bg-slate-400 text-slate-950 dark:bg-slate-800 dark:text-slate-300 dark:bg-opacity-50 bg-opacity-50 p-2 rounded-sm text-center w-full `} >{items.content}</span> */}
                            <ReactQuill
                                placeholder="details neccessary" 
                                className={` ${items.content != '' ? 'inline' : 'hidden' } ${filetype != 'video' ? '-translate-y-2' : ' translate-y-0'}  h-fit bg-slate-400 text-slate-950 dark:bg-slate-800 dark:text-slate-300 dark:bg-opacity-50 bg-opacity-50  max-h-[500px] overflow-auto mt-2 p-2 rounded-sm text-center w-full min-w-full `}
                                name="postContent" 
                                id="postContent"
                                value={items.content}
                                // HTML content rendered here
                                readOnly={true}
                                modules={{ toolbar: false }} // Removes toolbar
                                theme="snow"
                            />
                        </div>
                        {/* slider controls */}
                        <button  type="button" className={` absolute bottom-1 z-30  ${showButtons ?'flex' : 'hidden'} items-center justify-center  h-fit px-4 cursor-pointer group focus:outline-none`} >
                            <span onClick={() =>ScrollPostCarousels(items.id,'back')} className="inline-flex items-center justify-center sm:w-10 w-6 h-6 sm:h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 ring-[1px] ring-purple-500 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                                
                                <FaAngleLeft className="w-4 h-4 text-sky-500  " />
                            </span>
                        </button>
                        <button  type="button" className={` absolute bottom-1 end-0 z-30 ${showButtons ?'flex' : 'hidden'} items-center justify-center h-fit px-4 cursor-pointer group focus:outline-none`} >
                            <span onClick={() =>ScrollPostCarousels(items.id,'next')} className="inline-flex items-center justify-center sm:w-10 w-6 h-6 sm:h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 ring-[1px] ring-purple-500 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                                <FaAngleRight className="w-4 h-4 text-sky-500 " />
                            </span>
                        </button>
                    </div>
                    <div id={`CommentContainer-${items.id}`} onScroll={()=> ScrollingCommentContainer(i,items.id)} className={` ${OpenedCommentPost == items.id ? 'flex flex-col' : 'hidden' } scroll-smooth absolute z-50  top-0 overflow-x-hidden bg-slate-300 bg-opacity-75 max-h-[300px] overflow-y-auto rounded-lg w-full `}>
                        <span id={`CommentContainer-loader-${items.id}`}  data-tip="Loading" style={{display : 'none'}}  className="loading loading-dots sticky top-0 tooltip cursor-pointer mx-auto my-2 bg-slate-600  loading-md"></span>
                            <MapPostComment  postid={items.id} postEmail={items.account_email} />
                    </div>
                    {/* bottom container */}
                    <div className="px-1 z-30  pb-2 w-full border-t-[1px] border-slate-600 dark:border-slate-400 h-fit min-h-[60px] flex flex-col justify-around " >
                        {/* like, link, share onScroll={()=> ScrollingCommentContainer(i,items.id)} */}
                        
                        <div className=" w-full flex  flex-row justify-around py-2" >
                            <div className=" w-fit flex flex-col justify-start gap-1 mb-auto" >
                                <Lottie lottieRef={ThumbsUpRef} onClick={() => LikePostFunc(items.id)} title="Like" className="text-2xl h-9 cursor-pointer text-blue-700 transition-all duration-300  " onMouseEnter={() => ThumbsUpRef.current.play()} onMouseLeave={() => ThumbsUpRef.current.stop()} animationData={ThumbsUpIcon} loop={false} />

                                <p className={` ${items.likes != 'null' && items.likes != 0 ? ' flex' : 'hidden'}  m-auto text-[12px] sm:text-sm cursor-pointer text-slate-200 dark:text-slate-300 hover:text-slate-800 traal duration-300 dark:hover:text-slate-200  `} >{items.IsUserLiked == true && items.likes != 1 ? 'you and ' : ''}{items.likes}</p>
                            </div>
                            <div className=" w-fit flex flex-col justify-start  gap-1 h-full" >
                                <FaCommentDots onClick={() => ShowCommentContainer(i,items.id)} title="Comment" className="cursor-pointer text-2xl hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 text-slate-800 transition-all duration-300"   />
                                <p className={` ${CommentLength != 0 ? ' flex' : 'hidden'} mx-auto mt-auto text-[12px] sm:text-sm cursor-pointer text-slate-800 dark:text-slate-100 hover:text-slate-800 transition-all duration-300 dark:hover:text-slate-200 `} >{CommentLength}</p>
                            </div>
                            <GoLink onClick={() => CopyPostLink(items.id)} title="Copy link" role='button'  className=" tooltip mb-auto  text-xl hover:text-2xl hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-300 text-slate-800 transition-all duration-300 "  />
                            <div className="dropdown min-w-[40px] mb-auto dropdown-top dropdown-end">
                                <SlShareAlt tabIndex={i}  title="Share" role='button'  className="m-auto text-xl hover:text-2xl hover:text-slate-900 dark:hover:text-slate-300 dark:text-slate-300 text-slate-800 transition-all duration-300 "  />
                                <ul tabIndex={i} className="dropdown-content menu bg-slate-300 dark:bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                    <li className=" hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md" ><a target="_blank" href={`https://x.com/intent/tweet?url=${encodeURIComponent(`${import.meta.env.VITE_FRONTEND_URL}/home/post/${items.id}`)}&text=${encodeURIComponent('Check out this post!')}`} >X</a></li>
                                    <li className=" hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md" ><a href={`mailto:?subject=${import.meta.env.VITE_FRONTEND_URL}/home/post/${items.id}&body=Add%2C%20comment%20`} >Email</a></li>
                                    <li className=" hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md" ><a target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${import.meta.env.VITE_FRONTEND_URL}/home/post/${items.id}`)}`} >Facebook</a></li>
                                    <li className=" hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md" ><a target="_blank" href={`https://wa.me/?text=${encodeURIComponent(`Check this post: ${import.meta.env.VITE_FRONTEND_URL}/home/post/${items.id}`)}`} >WhatsApp</a></li>
                                </ul>
                            </div>
                            
                        </div>
                        {/* comment input container */}
                        <div className=" w-full flex flex-col transition-all duration-1000 rounded-2xl group/comment  bg-slate-300 h-fit " >
                            <div id={`PostReplyContainer-${items.id}`} style={{display : 'none'}}  className= {` flex flex-row w-full bg-transparent mr-auto justify-start gap-1 sm:gap-4  `}   >
                                <textarea className={` max-w-[90%] text-left outline-none border-none break-words text-slate-950 bg-slate-600 bg-opacity-30 ml-0 h-fit max-h-[50px] min-h-fit sm:max-h-[100px] rounded-md font-mono text-sm w-[90%] p-3 tooltip tooltip-info`} readOnly data-tip="Reply Chat"  value={Show.ReplyChat} ></textarea>
                                <IoMdClose onClick={() => ToogleReplyChat('close',items.id)} className="cursor-pointer mb-auto text-red-600 hover:text-purple-500 mt-2 sm:mt-3 text-lg" />
                            </div>
                            <textarea onFocus={() => ToogleBottomContent('show',items.id)} onBlur={() => ToogleBottomContent('hide',items.id)} id={`PostCommentInput-${items.id}`} {...register('PostCommentMessege',{required : false})}
                                placeholder="Comment"
                                className={` textarea w-full ${DispBottomPostContent == items.id ? ' h-[100px] min-h-fit max-h-[100px]' : ' h-[20px] min-h-[35px] max-h-[50px]'}   bg-transparent transition-all duration-300 focus:border-none  pl-6 text-slate-950 shadow-none border-none outline-none resize-y textarea-xs `}>
                            </textarea>
                            
                            <div  className={` w-full  transition-all flex flex-row duration-500 ${DispBottomPostContent == items.id ? 'h-[35px] overflow-visible' : 'h-0 overflow-hidden'}   my-auto justify-around `} >
                                <div className="dropdown min-w-[40px] my-auto dropdown-top ">
                                    <BsEmojiNeutral tabIndex={i} role='button'  title="Comment with emoji" className=" text-xl ml-4  hover:text-yellow-500 dark:hover:text-yellow-500 text-slate-900 transition-all duration-300 " />
                                    <div tabIndex={i} className="dropdown-content menu absolute bg-transparent z-40 w-52 p-2 shadow">
                                        <p>am emoji 😁</p>
                                        {/* <EmojiPicker  loading="lazy"  onEmojiClick={EmojisFunc} className=" mx-auto " height={400} width={300} /> */}
                                    </div>
                                </div>
                                {/* <BsEmojiNeutral onClick={() => EmojiDispFunc(items.id)}  title="Comment with emoji" className=" my-auto text-xl ml-4  hover:text-yellow-500 dark:hover:text-yellow-500 text-slate-900 transition-all duration-300 "  role="button" /> */}
                                <FaPaste onClick={() =>PasteClipboard(items.id)}    title="paste clipboard" className=" my-auto text-xl ml-4  hover:text-slate-500 dark:hover:text-slate-500 text-slate-900 transition-all duration-300 "  role="button" />
                                <IoSendSharp onClick={()=> SubmitPostComment(i,items.id)} id={`ClickedSendIcon-${items.id}`}  title="Comment"  className={` my-auto  text-xl ml-auto mr-4 mb-2 hover:text-sky-500 dark:hover:text-sky-500 text-slate-900 transition-all duration-300 `}  role="button" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    })
    let startY = 0;
    let endY = 0;

    const handleTouchStart = (event) => {
        
        startY = event.touches[0].clientY; // Get the initial touch position
    };

    const handleTouchEnd = (event) => {
        endY = event.changedTouches[0].clientY; // Get the final touch position

        if (startY > endY + 50) {
            //console.log("User swiped up"); // Next short
            ScrollPosts('next')
        } else if (startY < endY - 50) {
            //console.log("User swiped down"); // Previous short
            ScrollPosts('back')
        }
    }
    //onWheel={handlePostScroll}
    return (
        <div  >
            <div className=" flex flex-col sm:drawer sm:grid sm:drawer-open  sm:drawer-end ">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

                <div className="drawer-content bg-transparent">
                    {/* page content post display */}

                    <div className={` ${ProfilePost[0] ? 'flex' : 'hidden'} w-full overflow-hidden h-[100vh] `} >

                        <div ref={PostContainerRef} onTouchStart={handleTouchStart } onTouchEnd={handleTouchEnd }   style={{transform :`translateY(-${PostPosition * 100}%)`}}  className={` flex flex-col justify-start text-slate-950  dark:text-slate-100 w-full overflow-y-visible transition-all duration-500 delay-0 h-full min-h-full my-auto p-2 `} >
                            {MapPosts}
                        </div>
                    </div> 
                    {/* Page content no post display here */}
                    <div className= {` ${!ProfilePost[0]  ? 'card' : 'hidden'}  mx-auto bg-base-100 image-full w-[90%] max-w-[700px] shadow-xl `}>
                            <figure className=" opacity-100 "  >
                                <img loading="lazy"
                                className=" opacity-100"
                                src={ProfilePicturePhoto}
                                alt="Shoes" />
                            </figure>
                            <div className="card-body align-middle">
                                <h1 className=" font-[button] text-2xl m-auto " >No posts</h1>
                                
                            </div>
                    </div>
                </div>
                <div className="sm:hidden fixed w-full sm:w-fit bottom-0 bg-transparent ">
                    <ul className=" flex flex-row   justify-center bg-transparent gap-10 w-full  text-3xl text-slate-800 dark:text-slate-300 min-h-full p-4">
                    {/* Sidebar content here */}
                        <li>
                            <MdArrowUpward onClick={() => ScrollPosts('back')} className=" mx-auto w-fit cursor-pointer transition-all duration-300 hover:bg-slate-700 hover:text-slate-200  ring-1 ring-slate-900 dark:ring-slate-600 rounded-full   " />
                        </li>
                        <li>
                            <MdArrowDownward onClick={() => ScrollPosts('next')} className=" mx-auto w-fit cursor-pointer transition-all duration-300 hover:bg-slate-700 hover:text-slate-200 text-3xl ring-1 ring-slate-900 dark:ring-slate-600 rounded-full   " />
                        </li>
                    </ul>
                    
                </div>
                <div className="drawer-side hidden bg-transparent ">
                    <ul className=" flex flex-col  justify-center bg-transparent gap-10 w-full  text-3xl text-slate-800 dark:text-slate-300 min-h-full p-4">
                    {/* Sidebar content here */}
                        <li>
                            <MdArrowUpward onClick={() => ScrollPosts('back')} className=" mx-auto w-fit cursor-pointer transition-all duration-300 hover:bg-slate-700 hover:text-slate-200  ring-1 ring-slate-900 dark:ring-slate-600 rounded-full   " />
                        </li>
                        <li>
                            <MdArrowDownward onClick={() => ScrollPosts('next')} className=" mx-auto w-fit cursor-pointer transition-all duration-300 hover:bg-slate-700 hover:text-slate-200 text-3xl ring-1 ring-slate-900 dark:ring-slate-600 rounded-full   " />
                        </li>
                    </ul>
                    
                </div>
            </div>
            
        </div>
    )
   


};

const mapStateToProps =  state => ({
    isAuthenticated:state.auth.isAuthenticated,
    
})    
export default connect(mapStateToProps,{CheckAuthenticated,load_user})(PostsJSX)
