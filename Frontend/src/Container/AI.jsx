import React, { Profiler, useEffect, useLayoutEffect, useRef, useState } from "react";
import '../App.css'
import { UpdateProfile,FetchUserProfile,UploadProfileFile } from "../actions/profile.jsx";
import { FaHandHoldingHeart } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { connect, useDispatch } from "react-redux";
import {useSelector} from 'react-redux'
import { IoMdAdd } from "react-icons/io";
import { UploadFile} from '../actions/Chat.jsx'
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import { MdOutlinePrivacyTip } from "react-icons/md";
import Lottie,{useLottieInteractivity} from "lottie-react";  // from lottieflow
import {  toast } from 'react-toastify';
import { CiShare2 } from "react-icons/ci";
import 'react-quill/dist/quill.snow.css';
import { MdOutlineSubtitles } from "react-icons/md";
import { BsPostcardHeart } from "react-icons/bs";
import { FaAngleDown } from "react-icons/fa6";
import { MdOutlineAdd } from "react-icons/md";
import { GoCopy } from "react-icons/go";
import { CiCircleMore } from "react-icons/ci";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import { FaFileArrowDown } from "react-icons/fa6";
import { IoMdMore } from "react-icons/io";
import MacadamiaIcon from '../assets/images/macadamia.png'
import CarouselTestImg from '../assets/images/lost.jpg'
import { FiCornerDownLeft } from "react-icons/fi";
import { FiCornerDownRight } from "react-icons/fi";
import { ChatLogReducer, LOADING_USER } from "../actions/types.jsx";
// lottieflow animated icons 
import ProfileTestImg from '../assets/images/fallback.jpeg'
import ImageIcon from '../json/imageIcon.json'
import videoIcon from '../json/videoIcon.json'
import { useParams } from "react-router-dom";
// using argon2 pashing for both javascript and py
//const argon2 = require('argon2');
const AIPage = (props, {UpdateProfile,FetchUserProfile,UploadProfileFile}) => {
    const {register,formState,reset,getValues,setValue,watch} = useForm({
        defaultValues : {
            'AIprompt' : '',
            'postTitle' : '',
            'postContent' : '',
            'postPrivacy' : 'public',           
        },
        mode : 'all'
    })
    const { extrainfo } = useParams();
    const {errors,isSubmitSuccessful,isDirty,isValid} = formState
    const dispatch = useDispatch()
    const db = useSelector((state) => state.auth.user)  
    const UserName = db != null ? db.name : 'Gest'
    const UserEmail  = db != null ? db.email : 'gestuser@gmail.com'
    const UserID  = db != null ? db.id : ''
    const [IsPosting,SetIsPosting] = useState(false)
    const [ProfilePostUpload,SetProfilePostUpload] = useState({
        'file' : null,
        'type' : null,
        'src' : null,
        'Name' : null,
        'PostContent' : ''
    })
    const [IsLoading,SetIsLoading] = useState(false)
    const date = new Date()
    const [ProfilePostUploadingCarousel,SetProfilePostUploadingCarousel] = useState(0)
    const HmEvent  = useSelector((state) => state.auth.notifierType)
    const [ShowChatComponent, SetShowChatComponent] = useState(false)
    const [PostingSteps,SetPostingSteps] = useState(1)
    const [ProfilePicturePhoto,SetProfilePicturePhoto] = useState( db != null ? db.ProfilePic : ProfileTestImg)
    const [Upload,SetUpload] = useState({
        file : null,
        filename : ''
    })
    const modules = {
        toolbar: [
          // Font selection (Sans Serif)
          [{ 'font': [] }],
          
          // Text formatting (Bold, Italic, Underline, Strikethrough)
          ['bold', 'italic', 'underline', 'strike'],
          
          // Text color and background color
          [{ 'color': [] }, { 'background': [] }],
          
          // Subscript and Superscript
          ['super', 'sub'],
          
          // Alignments
          [{ 'align': [] }],
          
          // Ordered and unordered lists
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          
          // Indentation
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          
          // Link, Image, Video
          ['link', 'image', 'video'],
          
          // Code block
          ['blockquote', 'code-block'],
          
          // Horizontal line
          [{ 'align': 'center' }],
        ],
      };
    const UploaderFile = useRef(null)
    const UploadProfilePost = useRef(null)
    const ChatLogRef = useRef(null)
    const [tooltipVal,SettooltipVal]= useState(null)
    const [RoomName,SetRoomName] = useState('null')
    const WsDataStream = useRef(null)
    const [Theme,SetTheme] = useState(useSelector((state)=> state.auth.Theme))
    const [ScrollCards,SetScrollCards] = useState(0)
    const [ReLoad,SetReLoad] = useState(false)
    const [ScrollCardsNum,SetScrollCardsNum] = useState(0)
    const [AiPageCarousel,SetAiPageCarousel] = useState([
        {
            "img" : '/media/ai/carousels/1.jpg',
            "title": "Nutrition Tips for Muscle Growth",
            "info": "What are some key nutrients and foods I should focus on to build muscle effectively?"
        },
        {
            "img" : '/media/ai/carousels/2.jpg',
            "title": "Effective Home Workout Routines",
            "info": "Can you suggest a full-body workout routine I can do at home with minimal equipment?"
        },
        {
            "img" : '/media/ai/carousels/3.jpg',
            "title": "Cardio vs Strength Training",
            "info": "What are the benefits of cardio versus strength training for overall fitness?"
        },
        {
            "img" : '/media/ai/carousels/4.jpg',
            "title": "Hydration and Performance",
            "info": "How does staying hydrated impact my workout performance and recovery?"
        },
        {
            "img" : '/media/ai/carousels/5.jpg',
            "title": "Importance of Rest Days",
            "info": "Why are rest days important, and how do they contribute to muscle growth and injury prevention?"
        },
        {
            "img" : '/media/ai/carousels/6.jpg',
            "title": "Mental Health and Exercise",
            "info": "How does regular exercise improve mental health and reduce stress?"
        },
        {
            "img" : '/media/ai/carousels/7.jpg',
            "title": "Tracking Fitness Progress",
            "info": "What are some effective methods to track my fitness progress over time?"
        }
      ]
      )
    const GlobalPage = useSelector((state)=> state.auth.Page)
    const [chatLogData,SetchatLogData] = useState([])
    const [error, setError] = useState()
    const [UserPromptAi, setUserPromptAi] = useState(false)
    useLayoutEffect(()=> {
        requestWsStream('open')
        if(db != null){
            SetProfilePicturePhoto(db.ProfilePic)
        }
        for (let i = 0; i < chatLogData.length; i++) {
            if(chatLogData[i].email != 'AI'){
                chatLogData[i].img = db != null ? db.ProfilePic : ProfileTestImg
            }
            
        }
        ScrollCardFunc('back')
    },[db,extrainfo])
    useEffect(() => {
        // if(GlobalPage != 'AI'){
        //     SetchatLogData([])
        //     requestWsStream('close')
        // }
    },[GlobalPage])
    useEffect(() => {
        var val = getValues('AIprompt')
        if(val != ''){
            setUserPromptAi(true)
        }else{
            setUserPromptAi(false)
        }
    },[watch('AIprompt')])
    useEffect(() => {
        if(ChatLogRef.current){
            if(ChatLogRef.current.scrollTop > ChatLogRef.current.clientHeight){
                var Log = ChatLogRef.current
                Log.scrollTo({
                    'top' : Log.scrollHeight ,
                    'behavior' : 'smooth',
                })
            }
            
        }
    },[chatLogData.length])
    const MapCarousels = AiPageCarousel.map((items,i) => {
       
        
        return (
            <div onClick={()=> FuncToogleChats('openChat',items.info)} key={i} id={`agri-ai-infocards-${i}`}  className= {`card cursor-pointer hover:shadow-lime-500 hover:shadow-md card-compact transition-all duration-300 bg-base-100 w-full ${i == ScrollCardsNum ? 'md:min-w-[350px] scale-1 z-30 opacity-100' : i < ScrollCardsNum ? 'opacity-70 scale-[0.8] md:translate-x-20 md:min-w-[350px] z-20 ' : 'scale-[0.8] z-20 md:-translate-x-20 opacity-70  md:min-w-[350px]'}  min-w-full rounded-sm shadow-xl `}>
                <figure className=" rounded-sm min-h-[200px] max-h-[200px] " >
                    <img
                    className="  "
                    src={`${import.meta.env.VITE_WS_API}${items.img}`}
                    alt="ideas" />
                </figure>
                <div className="card-body font-sans rounded-sm">
                    <h2 className="card-title  ">{items.title}</h2>
                    <p>{items.info}</p>
                </div>
            </div>
        )
    })
    function StepsFunc(propval) {
        if(propval == 'next'){
            if(PostingSteps == 1){
                SetPostingSteps(2)
            }else if(PostingSteps == 2){
                SetPostingSteps(3)
            }else if(PostingSteps == 3){
                SetPostingSteps(4)
            }else if (PostingSteps == 4 && UserEmail != 'gestuser@gmail.com'){
                // upload the post
                var postDataval = {
                    'title' : getValues('postTitle'),
                    'PostContent' : ProfilePostUpload.PostContent,
                    'postPrivacy' : getValues('postPrivacy'),
                    'UserName' : UserName,
                    'ProfilePic' : String(ProfilePicturePhoto),
                    'PostFileType' : ProfilePostUpload.type
                }
                const formData = new FormData();
                formData.append('PostFile',ProfilePostUpload.file);
                formData.append('scope','UploadPost')
                formData.append('email',UserEmail)
                formData.append('AccountID',UserID)
                formData.append('PostFileName',ProfilePostUpload.Name)
                formData.append('PostDetails',JSON.stringify(postDataval))
                dispatch({
                    type : LOADING_USER,
                    payload : 'Uploading'
                })
                
                props.UploadProfileFile(formData)
                SetIsPosting(false)
                setValue('postTitle','')
                setValue('postContent','')
                setValue('postPrivacy','public')
                SetPostingSteps(1)
                UploadProfilePost.current.value = ''
                SetProfilePostUpload({
                    'file' : null,
                    'type' : null,
                    'src' : null,
                    'Name' : null,
                    'PostContent' : ''
                })
            }else if (UserEmail == 'gestuser@gmail.com'){
                toast('SignUp to make a post',{
                    position : 'top-right',
                    type : 'warning',
                    theme : Theme
                })
            }
            
        }else if (propval == 'back'){
            if(PostingSteps == 4){
                SetPostingSteps(3)
            }else if(PostingSteps == 3){
                SetPostingSteps(2)
            }else if(PostingSteps == 2){
                SetPostingSteps(1)
            }
        }
    }
    function TriggerPostContainer(show,messege){
        if(show == true) {
            SetProfilePostUpload((e) => {
                return  {
                    ...e,
                    'PostContent' : messege
                }
            })
            SetIsPosting(true)
            SetPostingSteps(1)
        }else if(show == false){
            
            SetIsPosting(false)
        }
    }
    function ScrollCardFunc (props){
        if(props == 'back'){
            var i = ScrollCardsNum == 0 ? 0 : ScrollCardsNum - 1
            var name = `agri-ai-infocards-${i}`
            var cardSelected = document.getElementById(name)
            
            var position = cardSelected ? cardSelected.offsetLeft : 0
            SetScrollCardsNum(i)
            if(window.innerWidth < '768'){
                SetScrollCards(`-${(i * 100)}%`)
                
            }else if (window.innerWidth >= '768') {
                var x = position - 230
                if(x <= 0){
                    x = 270
                    SetScrollCards(`${x}px`)
                }
                else {
                    SetScrollCards(`-${x}px`)
                }
                
            }
        }else if (props == 'next'){
            var i = ScrollCardsNum == (AiPageCarousel.length -1) ? (AiPageCarousel.length -1) : ScrollCardsNum + 1
            var name = `agri-ai-infocards-${i}`
            var cardSelected = document.getElementById(name)
            
            var position = cardSelected ? cardSelected.offsetLeft : 0
            SetScrollCardsNum(i)
            if(window.innerWidth < '768'){
                SetScrollCards(`-${(i * 100)}%`)
                
            }else if (window.innerWidth >= '768') {
                var x = position - 230
                if(x <= 0){
                    x = 270
                    SetScrollCards(`${x}px`)
                }
                else {
                    SetScrollCards(`-${x}px`)
                }
                
            }
        }
        
    }
    window.addEventListener('resize', () => {
        ScrollCardFunc('back')
    })
    function ClickProfilePostInputTag(props) {
        if(props == 'image') {
            // document.getElementById('CoverPhotoInput').click()
            UploadProfilePost.current.accept = 'image/*'
            UploadProfilePost.current.click()
        }else if(props == 'video') {
            // document.getElementById('CoverPhotoInput').click()
            UploadProfilePost.current.accept = 'video/*'
            UploadProfilePost.current.click()
        }                
    }
    const ToogleProfilePostUpload = (val) => {
       
        var File =  UploadProfilePost.current.files[0] ?  UploadProfilePost.current.files[0] : val
       
        if(File) {
            var Types = String(File.type).split('/')
            const maxSize = 50 * 1024 * 1024; // 50MB in bytes for file size limit
            if (File && File.size > maxSize) {
                var Themeval = Theme ==  'light' ? 'colored' : 'dark'
                
                toast('File to large, upload file up to 50mb ',{
                    position : 'top-right',
                    theme: Theme
                })
                UploadProfilePost.current.value = ''
              return
            } 
            if(Types[0] == 'image'){
                const render = new FileReader()
                render.onload = function (e) {
                    SetProfilePostUpload((val) => {
                        return {
                            ...val,
                            'file' : File,
                            'src' : e.target.result,
                            'type' : 'image',
                            'Name' : File.name
                        }
                    })               
                                        
                }
                render.readAsDataURL(File)  
            }else if(Types[0] == 'video'){
                const render = new FileReader()
                render.onload = function (e) {
                    SetProfilePostUpload((val) => {
                        return {
                            ...val,
                            'file' : File,
                            'src' : e.target.result,
                            'type' : 'video',
                            'Name' : File.name
                        }
                    })               
                                        
                }
                render.readAsDataURL(File) 
            }

                   
        }

    }
    function SendPrompt (messegeval) {
        if(messegeval){
            var message = messegeval
            setUserPromptAi(false)
            var prev = chatLogData
            var val = {
                text: message,
                email: UserEmail,
                img : ProfilePicturePhoto,
            }
            prev.push(val)
            SetchatLogData(prev)
            SetShowChatComponent(true)
            SetIsLoading(true)
            
            var Log = ChatLogRef.current
            Log.scrollTo({
                'top' : Log.scrollHeight ,
                'behavior' : 'smooth',
            })
            setValue('AIprompt','')
            requestWsStream('RequestAIResponse',message)
        }else {
            var message = getValues('AIprompt')
            setUserPromptAi(false)
            var prev = chatLogData
            var val = {
                text: message,
                email: UserEmail,
                img : ProfilePicturePhoto,
            }
            prev.push(val)
            SetchatLogData(prev)
            SetShowChatComponent(true)
            SetIsLoading(true)
            
            var Log = ChatLogRef.current
            Log.scrollTo({
                'top' : Log.scrollHeight ,
                'behavior' : 'smooth',
            })
            setValue('AIprompt','')
            requestWsStream('RequestAIResponse',message)
        }
        
    }
   
    function CopyChat(props,i) {
        if(props){

            navigator.clipboard.writeText(props).then(() => {
            }).catch(err => {
                //console.error('Error:', err);
            });
            SettooltipVal(i)
            setTimeout(() => {
                SettooltipVal(null)
            }, 2000);
        }else {
            return false   
        }
        
    }
    const requestWsStream = (msg = null,body = null,continuetion = false,continuetionId = null) => {    
       
        if(msg =='open'){
            
            if(WsDataStream.current != null ){
                WsDataStream.current.close(1000,'Opening another socket for less ws jam')

            }
            WsDataStream.current =  new WebSocket(`ws:/${import.meta.env.VITE_WS_API}/ws/ai/${UserEmail}/`);

        }
         if(msg == 'close'){
            
            if(WsDataStream.current != null ){
                WsDataStream.current.close(1000,'usefull eminent')

            }
        }
        
        WsDataStream.current.onmessage = function (e) {
          var data = JSON.parse(e.data)
             if(data.type == 'RequestAIResponse') {
                var val = data.message
                if (val['type'] == 'success') {
                    var prev = chatLogData
                    prev.push(val['result']) 
                    SetchatLogData(prev) 
                    SetIsLoading(false)
                    //SetReLoad((e) => !e)
                    
                }else {
                    toast(val['result'], {
                        type: val['type'],
                        theme: Theme,
                        position: 'top-right',
                    })
                }
                
            }else if(data.type == 'RequestAICarousels') {
                var val = data.message
                if (val['type'] == 'success') {
                    SetAiPageCarousel(val.list)
                    
                }else {
                    //pass
                }
                
            }
        };
        WsDataStream.current.onopen = (e) => {
            // websocket is opened
            requestWsStream('RequestAICarousels','null')
            
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
            if(msg == 'RequestAIResponse') {
                
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'RequestAIResponse',
                        'email' : UserEmail,
                        'prompt' : body
                    })
                )
            }else if(msg == 'RequestAICarousels') {
                
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'RequestAICarousels',
                        'UserEmail' : UserEmail,
                    })
                )
            }
            
        }
        
    }
    const MapChatMesseger = chatLogData.map((items,i) => {
       
        return (
            <div  key={i} className={`dropdown bg-transparent group relative flex px-2 min-w-[150px] max-w-[95%] bg-opacity-90 w-fit my-1 mx-2 ${items.email != 'AI' ? 'chat chat-end flex-col md:flex-row-reverse rounded-l-none  sm:dropdown-left float-right ml-auto' : 'chat chat-start flex-col sm:dropdown-right  mr-auto '}  gap-1`}>
                <div className= {`avatar md:mb-auto `}>
                    <div className="mask transition-all duration-300 mask-hexagon w-6 hover:w-12 ">
                        <img src={items.img} />
                    </div>
                </div>
                <div className={`chat-bubble min-w-fit max-w-full  shadow-md w-[200px] ${items.email != UserEmail ? ' flex-col shadow-transparent bg-transparent px-0  ' : 'p-2 bg-transparent dark:shadow-green-950 shadow-slate-200  flex-col'}text-slate-100 dark:text-slate-900 gap-2 w-full flex rounded-md `}>
                    {/* <blockquote className={` max-w-[95%] md:max-w-[90%] w-fit min-w-fit lg:max-w-[95%] break-word ${items.email != UserEmail ? ' text-slate-200 sm:max-w-[550px]' : 'sm:max-w-[500px] '} text-slate-900 dark:text-slate-200 font-mono text-sm `} > 
                        {items.text } 
                    </blockquote>  */}
                    <ReactQuill
                        className={` max-w-[95%] md:max-w-[90%] w-fit min-w-fit lg:max-w-[95%] break-word ${items.email != UserEmail ? ' text-slate-200 sm:max-w-[550px]' : 'sm:max-w-[500px] '} text-slate-900 dark:text-slate-200 font-mono text-sm md:text-lg `}
                        value={items.text} // HTML content rendered here
                        readOnly={true}
                        modules={{ toolbar: false }} // Removes toolbar
                        theme="snow"
                    />
                </div> 
                <div className={` w-fit mr-auto ${items.email != UserEmail ? 'flex' : 'hidden'} transition-all duration-200 text-lg flex-row gap-2 ml-4 invisible group-hover:visible flex-wrap max-w-xs`} >
                        <button data-tip='Copied' className={` ${tooltipVal == i ? 'tooltip tooltip-top tooltip-open' : ''} `} >
                            <GoCopy onClick={() => CopyChat(items.text,i)} className=" dark:text-slate-400 text-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-200 cursor-pointer " />
                        </button>
                        <button data-tip='Post messege' className=" tooltip tooltip-top" >
                            <BsPostcardHeart onClick={() => TriggerPostContainer(true,items.text)} className=" dark:text-slate-400 text-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-200 cursor-pointer " />
                        </button>
                </div>  
            </div>
        )
    })
    function FuncToogleChats(props,data= null){
        if(props == 'openChat'){
           
            SendPrompt(data)
        }else if (props == 'NewChat') {
            var val = {
                text:`Hi ${UserName } 😊 What's on your mind today?`,
                email:"AI",
                img : `${import.meta.env.VITE_APP_API_URL}/media/AI.webp`
            }
            SetchatLogData([val])
            SetShowChatComponent(true)
        }else if (props == 'CloseChat') {
            SetchatLogData([])
            SetShowChatComponent(false)
        }
    }
    function DownloadFunc (props) {
        if(props){
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
    }
    const OpenImage = (props) => {

        window.open(`${import.meta.env.VITE_WS_API}/media/${props}`,'_blank')
    }

    const OpenImagePrivate = (props) => {
        window.open(`${props}`,'_blank')
    }
   
    const PostContentChange = (value) => {
        SetProfilePostUpload((e) => {
            return  {
                ...e,
                'PostContent' : value
            }
        })
    }
    const ScrollPostUploadingCarousels = (position) =>{
        if(position == 'back'){
            SetProfilePostUploadingCarousel((e) => e != 0 ? e -1  : 0)
        }else if(position == 'next'){
            SetProfilePostUploadingCarousel((e) => e != 1 ? e + 1  : 1)
        }
    }

    return (
        <div className={` h-full w-full overflow-y-auto sticky top-0 min-w-full max-w-[100%] flex flex-col justify-between  `} >
             {/* Post section */}
            <div className=  {` ${IsPosting ?  'flex flex-col lg:flex-row' : 'hidden'} absolute bg-slate-300 dark:bg-slate-800 dark:bg-opacity-90 bg-opacity-90 z-50 top-0 md:mt-4 gap-2 h-fit justify-start overflow-y-auto min-h-fit  w-[100%] mx-auto px-2 `} >

                {/* posting container */}
                <div className={` ${IsPosting ? 'flex flex-col' : 'hidden'} text-slate-800 w-[90%] my-4 rounded-md min-h-[350px] max-w-[600px] mx-auto h-fit border-[1px] border-slate-600 bg-slate-400 dark:bg-slate-500 dark:border-slate-400 `} >
                    <MdOutlineAdd onClick={() => SetIsPosting(false)} className=" text-xl ml-auto mr-4 mt-3 rotate-45 cursor-pointer hover:text-rose-300 text-slate-900 transition-all duration-300 "  />
                    <h1 className=" mx-auto text-slate-100 font-semibold text-base " >Follow steps bellow to post</h1>        
                    {/* first step */}
                    <div className={`  my-auto ${PostingSteps == 1 ? 'flex flex-col' : 'hidden'} p-4 `} >
                        <label className=" font-semibold dark:text-slate-300 text-sm" htmlFor="postTitle">Post Title</label>
                        <label className="input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] border-[1px] border-slate-600 bg-transparent dark:bg-transparent flex items-center gap-10">
                            <MdOutlineSubtitles  className=" text-2xl text-slate-800 dark:text-slate-800" />
                            <input id='postTitle' {...register('postTitle',{
                                required : 'title is required for your post',
                            })}  name="postTitle"  className='mx-auto text-slate-100 focus:outline-none ring-0 max-h-[35px] placeholder:text-slate-300 bg-slate-100 bg-opacity-20 outline-1 outline-none   border-none placeholder:text-left border-slate-900  rounded-sm px-2 w-full'  placeholder="my post title" type="text"  />
                        </label>
                        {errors.postTitle && <p className=" my-2 max-w-[600px] bg-slate-600 p-1 mt-3 text-rose-400 font-semibold mx-auto text-center w-[80%] rounded-sm text-sm sm:text-base" >{errors.postTitle?.message}</p>}

                    </div>
                    {/* second step */}
                    <div className={`   my-auto ${PostingSteps == 2 ? 'flex flex-col' : 'hidden'} p-4 `} >
                        <label className=" font-semibold dark:text-slate-300 text-slate-700  text-sm" htmlFor="postTitle">Post Content</label>
                        {/* <textarea placeholder="details neccessary" {...register('postContent',{required : false})} className=" text-slate-200 textarea placeholder:text-slate-300 bg-transparent border-[1px] border-slate-500 dark:border-slate-700 rounded-md  "  name="postContent" id="postContent"></textarea> */}
                        <ReactQuill
                            placeholder="details neccessary" 
                            className=" text-slate-200 textarea max-h-[500px] overflow-auto  placeholder:text-slate-300 bg-transparent border-[1px] border-slate-500 dark:border-slate-700 rounded-md  "  
                            name="postContent" 
                            id="postContent"
                            value={ProfilePostUpload.PostContent}
                            onChange={PostContentChange}
                            // HTML content rendered here
                            readOnly={false}
                            modules={modules}
                            theme="snow"
                        />
                    </div>
                    {/* third step, uploading image or video, setting post privacy */}
                    <div className={`  my-auto ${PostingSteps == 3 ? 'flex flex-col' : 'hidden'} p-4 `} >
                        <label className=" font-semibold dark:text-slate-300 text-slate-700  text-sm" htmlFor="postTitle">Post Files</label>
                        <div className=" w-full flex flex-row justify-around flex-nowrap" >
                            <input ref={UploadProfilePost} onChange={ToogleProfilePostUpload} className=" hidden" accept="image/*" type="file" />
                            <button className=" w-fit flex flex-col gap-3">
                                <Lottie  onClick={()=>ClickProfilePostInputTag('image')} data-tip="upload image" className=" tooltip h-8 mx-auto cursor-pointer hover:h-10 transition-all duration-300  " animationData={ImageIcon} loop={true} />
                                <p className=" text-slate-200 mx-auto">upload image</p>
                            </button>
                            <button className=" w-fit flex flex-col gap-3">
                                <Lottie onClick={()=>ClickProfilePostInputTag('video')} data-tip="upload video" className=" tooltip h-8 cursor-pointer mx-auto hover:h-10 transition-all duration-300  " animationData={videoIcon} loop={true} />
                                <p className=" text-slate-200 mx-auto">upload video</p>
                            </button>
                            
                        </div>  
                        <span className={` ${ProfilePostUpload.file != null ? 'inline' : 'hidden'} text-center mt-3 text-slate-700 dark:text-slate-300 w-fit mx-auto `} > <p className=" inline text-sm text-slate-100 dark:text-slate-800 " >{ProfilePostUpload.Name}</p> Uploaded {ProfilePostUpload.type} file</span>
                        <label className=" font-semibold dark:text-slate-300 mt-4 text-slate-700  text-sm" htmlFor="postTitle">Post privacy</label>
                        <div className=" w-fit gap-20 max-w-[400px] mt-4 mx-auto flex flex-row justify-between" >
                            <MdOutlinePrivacyTip    className=" my-auto text-lg mr-auto ml-2 text-slate-800 dark:text-slate-800 " />
                            <select {...register('postPrivacy',{required : false})}
                                defaultValue={'English'}
                                className= {` select select-bordered w-fit xs:min-w-[100px] bg-slate-300 text-slate-900 dark:text-slate-200 dark:bg-slate-700 rounded-md max-w-xs `}>
                                <option value={'public'}  >Public</option>
                                <option value={'private'} >Private</option>
                            </select>
                        </div>  
                    </div>
                    {/* fourth step, preview step */}
                    <div className={`  my-auto ${PostingSteps == 4 ? 'flex flex-col' : 'hidden'} p-4 `} >
                        <label className=" font-semibold dark:text-slate-300 text-slate-700  text-sm" htmlFor="postTitle">Post Privacy</label>
                        <label className= {`flex flex-row  justify-start input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 max-w-[500px] border-none bg-transparent dark:bg-transparent items-center gap-10 `}>
                            <MdOutlinePrivacyTip className=" text-2xl text-slate-800 dark:text-slate-800 " />
                            <p
                                className=' text-slate-200 text-center bg-transparent px-2 w-fit' 
                            >{getValues('postPrivacy')}
                            </p>
                        </label>
                        <label className=" font-semibold dark:text-slate-300 text-slate-700  text-sm" htmlFor="postTitle">Post Preview</label>
                        {/* post preview */}
                        <div className={` flex flex-col border-[1px] text-slate-950 dark:text-slate-100 border-slate-600 dark:border-slate-400 justify-start h-fit w-[95%] mx-auto sm:w-[90%] max-w-[600px] rounded-md pt-2 `} >
                            {/*post header container */}
                            <div className=" px-4 pb-2 w-full border-b-[1px] border-slate-600 dark:border-slate-400 h-fit min-h-[60px] flex flex-row justify-around " >
                                <div className="avatar my-auto">
                                    <div className="w-14 h-14 rounded-full">
                                        <img src={ProfilePicturePhoto} />
                                    </div>
                                </div>
                                <div className=" flex my-auto flex-col text-left ml-4 mr-auto h-fit" >
                                    <span className=" font-semibold text-lg " >{UserName}</span>
                                    <small className="" >{date.toLocaleDateString()}</small>
                                    <span className=" font-semibold " >{getValues('postTitle')}</span>
                                </div>
                                <div className="dropdown my-auto hidden dropdown-end">
                                    <CiCircleMore className=" my-auto text-3xl hover:text-slate-100 dark:hover:text-slate-300 text-slate-800 transition-all duration-300 dark:text-slate-800 " tabIndex={0} role="button" />
                                    <ul tabIndex={0} className="dropdown-content menu bg-slate-300 dark:bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                        <li className=" hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md" ><a>Save</a></li>
                                        <li title="report this post" className=" hover:bg-slate-100 dark:hover:bg-slate-700  rounded-md" ><a>Report</a></li>
                                    </ul>
                                </div>
                            </div>
                            {/* post content */}
                            <div id="controls-carousel" className=" w-full h-fit bg-transparent relative overflow-hidden " >
                                <div style={{transform: `translateX(-${ProfilePostUploadingCarousel * 100}%)` }} className=" w-full h-fit bg-transparent transition-all duration-300 relative flex flex-row overflow-visible " >
                                    <div className={` ${ProfilePostUpload.type == 'image' ? '' : 'hidden'} w-full m-auto min-w-full h-fit`} >
                                        <img
                                            className={`${ ProfilePostUpload.type != 'image' ? 'hidden' : 'flex m-auto max-h-[500px]   mask-square'} `}
                                            src={ProfilePostUpload.src} 
                                        />
                                    </div>
                                    <div className={` ${ProfilePostUpload.type == 'video' ? '' : 'hidden'} w-full m-auto min-w-full h-fit`} >
                                        <video 
                                        src={ProfilePostUpload.src} 
                                        className={` ${ ProfilePostUpload.type != 'video' ? 'hidden' : 'flex'} m-auto w-full h-fit p-0 border-none  `} width="320" height="240" controls>
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                    
                                    {/* <span className={` ${getValues('postContent') != '' ? 'flex' : 'hidden' } ${ ProfilePostUpload.type != 'video' ? '-translate-y-2' : ' translate-y-0'}  h-fit bg-slate-400 text-slate-950 dark:bg-slate-800 dark:text-slate-300 dark:bg-opacity-50 bg-opacity-50 p-2 rounded-sm w-full `} >{getValues('postContent')}</span> */}
                                    <ReactQuill
                                        placeholder="details neccessary" 
                                        className={` overflow-auto max-h-[500px]  ${ProfilePostUpload.PostContent != '' ? 'flex' : 'hidden' } ${ ProfilePostUpload.type != 'video' ? '-translate-y-2' : ' translate-y-0'}  h-fit bg-slate-400 text-slate-950 dark:bg-slate-800 dark:text-slate-300 dark:bg-opacity-50 bg-opacity-50 p-2 mt-2 rounded-sm w-full min-w-full `}
                                        name="postContent" 
                                        id="postContent"
                                        value={ProfilePostUpload.PostContent}
                                        onChange={PostContentChange}
                                        // HTML content rendered here
                                        readOnly={true}
                                        modules={{ toolbar: false }} // Removes toolbar
                                        theme="snow"
                                    />
                                </div> 
                                {/* slider controls */}
                                <button onClick={() =>ScrollPostUploadingCarousels('back')} type="button" className={` absolute bottom-1 start-0 z-30  ${ProfilePostUpload.type != null && ProfilePostUpload.type != '' && ProfilePostUpload.PostContent != ''  ?'flex' : 'hidden'} items-center justify-center  h-fit px-4 cursor-pointer group focus:outline-none`} >
                                    <span className="inline-flex items-center justify-center sm:w-10 w-6 h-6 sm:h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 ring-[1px] ring-purple-500 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                                        
                                        <FaAngleLeft className="w-4 h-4 text-sky-500  " />
                                    </span>
                                </button>
                                <button onClick={() =>ScrollPostUploadingCarousels('next')} type="button" className={` absolute bottom-1 end-0 z-30 ${ProfilePostUpload.type != null && ProfilePostUpload.type != '' && ProfilePostUpload.PostContent != '' ?'flex' : 'hidden'} items-center justify-center h-fit px-4 cursor-pointer group focus:outline-none`} >
                                    <span className="inline-flex items-center justify-center sm:w-10 w-6 h-6 sm:h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 ring-[1px] ring-purple-500 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                                        <FaAngleRight className="w-4 h-4 text-sky-500 " />
                                    </span>
                                </button> 
                                
                                
                            </div>
                                                   
                        </div>
                    </div>
                    
                    {/* back,next steps */}
                    <div className=" w-full mt-auto mb-3 max-w-[400px] mx-auto flex flex-row justify-around" >
                        <button onClick={()=> StepsFunc('back')}  data-tip="Back" className= {`tooltip  w-fit mx-auto bg-transparent  rounded-sm py-2 px-4 text-sm font-[PoppinsN] text-slate-950 dark:hover:border-transparent hover:border-transparent border-[1px] hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 dark:hover:bg-sky-700 hover:bg-sky-700 transition-all duration-500 dark:text-slate-300 my-auto border-slate-300  dark:border-slate-400 `}  >Back</button>
                        <button onClick={()=> StepsFunc('next')}  data-tip="Next" className= {`tooltip  w-fit mx-auto bg-transparent  rounded-sm py-2 px-4 text-sm font-[PoppinsN] text-slate-950 dark:hover:border-transparent hover:border-transparent border-[1px] hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 dark:hover:bg-sky-700 hover:bg-sky-700 transition-all duration-500 dark:text-slate-300 my-auto  border-slate-300  dark:border-slate-400 `}  >{PostingSteps == 4 ? 'Upload' : 'Next'} </button>
                    </div>        
                </div>                
            </div>
            <section className={` ${ ShowChatComponent== true ? 'md:w-[90%] ' : ' md:w-full'}  ${ ShowChatComponent== true?'justify-between' : ''} flex flex-col relative overflow-x-hidden overflow-y-visible w-full rounded-sm  md:mx-auto bg-transparent dark:text-slate-100 mb-auto   h-full`}>
                {/* header */}
                <div className=" bg-transparent top-0 sticky z-40  min-h-[40px] flex flex-row justify-start ml-4 py-3 w-full  max-h-[250px] " >
                    
                    <div className="dropdown dropdown-hover dropdown-bottom  z-40 ">
                        <div tabIndex={0} role="button" className="btn m-1 px-4 min-w-[100px] md:min-w-[150px] md:justify-around shadow-lg shadow-slate-500 dark:shadow-slate-600 bg-slate-400 border-0 ring-1 dark:text-slate-300 text-slate-50 hover:text-slate-100 dark:bg-slate-700 group rounded-sm ring-transparent hover:ring-slate-500 dark:hover:ring-slate-500 dark:ring-slate-600 transition-all duration-300 py-2 hover:bg-slate-400 text-base font-[PoppinsSemiBold] ">Agri-AI 
                            <FaAngleDown className=" group-hover:rotate-180 transition-all  duration-500" /> 
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-40 font-[PoppinsN] gap-3 dark:bg-slate-500 p-0 rounded-md  menu dark:text-slate-100 text-slate-950 bg-slate-400 w-[100px]  xs:w-[150px] shadow">
                            <li onClick={()=> FuncToogleChats('NewChat')} className=" rounded-none  hover:text-slate-900 hover:bg-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-100 " ><p   >New Chat</p></li>
                            <li onClick={()=> FuncToogleChats('CloseChat')} className=" hover:text-slate-900 hover:bg-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-100 " ><p >Close Chat</p></li>
                        </ul>
                    </div>
                </div>
                
            
                {/* title */}
                <big className= {` ${ ShowChatComponent== false?'flex flex-col' : 'hidden'} font-[PoppinsN] text-2xl xs:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-slate-500 dark:text-slate-400 text-center my-6 `} >How can I assist you ?</big>
                {/* carousels */}
                <div className= {` ${ ShowChatComponent== false?'flex flex-col' : 'hidden'} mb-auto  min-h-fit overflow-hidden w-[90%] mx-auto justify-center h-[550px] md:max-h-[550px] mt-5 xs:max-w-[350px] md:w-[100%] md:max-w-[850px] gap-3 `} >
                    <div style={{transform: `translateX(${ScrollCards})`}} className= {` flex flex-row transition-all duration-500 ease-out overflow-visible w-full   mx-auto `} >
                        {MapCarousels}
                    </div>
                    <div className="flex flex-row overflow-visible max-w-[500px] w-full justify-around md:mt-5 mx-auto" >
                        <FiCornerDownLeft onClick={() =>ScrollCardFunc('back')} className=" text-xl dark:text-slate-400 cursor-pointer hover:text-sky-500 dark:hover:text-sky-500 text-slate-600 " />
                        <FiCornerDownRight onClick={() =>ScrollCardFunc('next')} className=" text-xl dark:text-slate-400 cursor-pointer hover:text-sky-500 dark:hover:text-sky-500 text-slate-600 " />
                    </div>                

                </div>
                {/* chat message */}
                <div ref={ChatLogRef} className={` z-20 bg-transparent flex flex-col overflow-y-auto overflow-x-hidden w-full gap-1 h-[84%] max-h-[640px] sm:max-h-[650px] ${ ShowChatComponent== true?'flex flex-col' : 'hidden'}  `} >
                    {MapChatMesseger}
                    <span  data-tip="Loading"  className= {` ${IsLoading ? 'loading loading-dots' : ' invisible'} transition-all duration-200 sticky top-0 tooltip cursor-pointer mx-auto my-2 bg-slate-600  loading-md `}></span>
                </div>
                {/* chat component */}
                <div className="mt-auto h-fit xl:max-w-[900px] border-[1px] dark:border-slate-700 border-slate-400 transition-all duration-500 lg:rounded-md w-[95%] xs:max-w-[300px] sm:max-w-[400px] lg:max-w-[80%] focus-within:max-w-[600px] lg:focus-within:max-w-[90%] mx-auto rounded-xl z-30 overflow-hidden bottom-0  sm:relative sm:mx-auto  py-3 px-3 flex flex-row  align-middle bg-transparent " >
                        <textarea  
                            theme="snow" 
                            modules= {{
                                toolbar: false    // Snow includes toolbar by default
                            }}
                            className={`bg-transparent max-h-[120px] resize-y outline-none text-slate-950   dark:text-slate-200 ring-1 dark:ring-slate-600 ring-slate-500 transition-all duration-300 focus-within:ring-1 dark:focus-within:ring-slate-500 focus-within:ring-slate-600 border-none placeholder:text-slate-700 dark:placeholder:text-slate-400 focus:outline-transparent rounded-xl focus:border-transparent textarea ${UserPromptAi == false ? ' w-full' : 'w-[90%]'}  min-h-fit  h-[70px] overflow-y-auto`}  
                            {...register('AIprompt',{required : false})}
                            placeholder={'Messege AI'} 
                        ></textarea>
                        <button data-tip='Please wait' className={` mt-auto mx-auto ${IsLoading ? ' opacity-30' : 'opacity-100'} `} disabled={IsLoading} >
                            <IoMdSend onClick={() => SendPrompt(null)}  className= {` ${IsLoading ? ' invisible' : 'visible'}  cursor-pointer ${UserPromptAi == false ? ' translate-x-[1000px] w-0' : 'translate-x-0'} hover:text-lime-400 dark:hover:text-lime-600  transition-all duration-300 text-2xl text-slate-900 dark:text-sky-600 sm:mx-auto `} />
                        </button>
                        
                </div>
                <small className=" text-slate-600 dark:text-slate-500 pb-1 text-center" >AI can make mistakes, please double-check it</small>
            </section>
        </div>
    )
   


};

const mapStateToProps =  state => ({
    isAuthenticated:state.auth.isAuthenticated,
    
})    
export default connect(mapStateToProps,{UpdateProfile,FetchUserProfile,UploadProfileFile})(AIPage)
