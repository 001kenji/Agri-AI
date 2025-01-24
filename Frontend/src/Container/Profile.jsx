import React, { Profiler, useEffect, useLayoutEffect, useRef, useState } from "react";
import '../App.css'
import { FaHandHoldingHeart } from "react-icons/fa";
import { delete_user } from "../actions/auth";
import { connect, useDispatch } from "react-redux";
import {useSelector} from 'react-redux'
import { UploadFile} from '../actions/Chat.jsx'
import { UpdateProfile,FetchUserProfile,UploadProfileFile } from "../actions/profile.jsx";
import Lottie,{useLottieInteractivity} from "lottie-react";  // from lottieflow
import { Player } from '@lordicon/react'; // from lordicon.com
import { FaCamera } from "react-icons/fa6";
import { AiOutlineMail } from "react-icons/ai";
import { IoLinkSharp } from "react-icons/io5";
import { HiMiniIdentification } from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { MdOutlineAddLink } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";
import { PiLinkSimpleHorizontalLight } from "react-icons/pi";
import { IoLanguage } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { HiOutlineHome } from "react-icons/hi2";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { IoLockOpenOutline } from "react-icons/io5";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { CiPhone } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { PiIdentificationBadgeLight } from "react-icons/pi";
import { LuLink2 } from "react-icons/lu";
import { MdEdit } from "react-icons/md";
import { MdOutlineAdd } from "react-icons/md";
import { TiTickOutline } from "react-icons/ti";
import Cookies from 'js-cookie'
import { SlCalender } from "react-icons/sl";
import { MdOutlinePrivacyTip } from "react-icons/md";
import EmojiPicker from 'emoji-picker-react';
import { CiCircleMore } from "react-icons/ci";
import { BsFillHandThumbsUpFill } from "react-icons/bs";
import { SlShareAlt } from "react-icons/sl";
import { GoLink } from "react-icons/go";
import { FaCommentDots } from "react-icons/fa";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { IoSendSharp } from "react-icons/io5";
import { BsEmojiNeutral } from "react-icons/bs";
import { IoIosImages } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import ReactPlayer from 'react-player'
import {  toast } from 'react-toastify';
import { IoMdMore } from "react-icons/io";
import { FaPaste } from "react-icons/fa6";
import { FaRegFolderOpen } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import { FcOpenedFolder } from "react-icons/fc";
import { FcFolder } from "react-icons/fc";
import { FaFileUpload } from "react-icons/fa";
import { SlSizeActual } from "react-icons/sl";
import { GoEye } from "react-icons/go";
import { BsTrash3 } from "react-icons/bs";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaFileLines } from "react-icons/fa6";
import { IoOpenOutline } from "react-icons/io5";
// lottieflow animated icons 
import ImageIcon from '../json/imageIcon.json'
import videoIcon from '../json/videoIcon.json'
import EditIconLight from '../json/editIconlight.json'
import EditIcondark from '../json/editIcondark'
import ThumbsUpIcon from '../json/thumbsUp.json'
import CameraIcon from '../json/CameraLight.json'


import { MdOutlineSubtitles } from "react-icons/md";



import CarouselTestImg from '../assets/images/lost.jpg'
import ProfileTestImg from '../assets/images/fallback.jpeg'
import TestVideo from '../assets/images/testvideo.mp4'

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FAIL_EVENT, FolderListReducer, INTERCEPTER, LOADING_USER, PostCommentsReducer, ProfilePostReducer, SavedProfilePostReducer, SUCCESS_EVENT } from "../actions/types.jsx";
import { useNavigate, useParams } from "react-router-dom";

// using argon2 pashing for both javascript and py
//const argon2 = require('argon2');
const ProfileJSX = (props, {UpdateProfile,FetchUserProfile,UploadProfileFile,delete_user}) => {
    const date = new Date()
    const { extrainfo } = useParams();
    const {register,formState,reset,getValues,setValue,watch} = useForm({
        defaultValues : {
            'UserName': 'Gest',
            'language' : 'Rather not Say',
            'gender' : 'Rather not Say',
            'pronoun' : 'Rather not Say',
            'location' : 'Rather not Say',
            'email' : '',
            'countryCode' : '',
            'number' : '',
            'messeger-id' : '',
            'social-0' : '',
            'social-1' : '',
            'social-2' : '',
            'social-3' : '',
            'social-4' : '',
            'postTitle' : '',
            'postContent' : '',
            'postPrivacy' : 'public',
            'filterYear' : date.getFullYear(),
            'filterPrivacy' : 'all',
            'PostCommentMessege' : '',
            'EditedfolderName' : '',
            'ReplyMessege' : '',
            'password' : ''
        },
        mode : 'all'
    })
    const dispatch = useDispatch()
    const {errors,isSubmitSuccessful,isDirty,isValid} = formState
    const [SocialLinkCount,SetSocialLinkCount] = useState(0)
    const db = useSelector((state) => state.auth.user)  
    const navigate = useNavigate();
    const ProfileDB = useSelector((state) => state.ProfileReducer.ProfileAbout)
    const [ReLoad,SetReLoad] = useState(false)
    const [ProfilePost,SetProfilePost] = useState(useSelector((state) => state.ProfileReducer.ProfilePost))
    const StoreProfileAccount = useSelector((state) => state.ProfileReducer.ProfileAccount)
    const [FolderList,SetFolderList] = useState(useSelector((state) => state.ProfileReducer.FolderList))
    const FileListReducerVal = useSelector((state) => state.ProfileReducer.FileList)
    const [FileList,SetFileList] = useState(useSelector((state) => state.ProfileReducer.FileList))
    const [SavedProfilePost,SetSavedProfilePost] = useState([])
    const ToogleProfileHook = useState(useSelector((state) => state.ProfileReducer.ToogleProfileHook))
    const [PostComments,SetPostComments] = useState([])
    const Showlink1 = ProfileDB != null ? ProfileDB.Contact ? ProfileDB.Contact['socialLink-0'] != '' ? true : false :false : false 
    const Showlink2 = ProfileDB != null ? ProfileDB.Contact ? ProfileDB.Contact['socialLink-1'] != '' ? true : false :false : false 
    const Showlink3 = ProfileDB != null ? ProfileDB.Contact ? ProfileDB.Contact['socialLink-2'] != '' ? true : false :false : false 
    const Showlink4 = ProfileDB != null ? ProfileDB.Contact ? ProfileDB.Contact['socialLink-3'] != '' ? true : false :false : false 
    const Showlink5 = ProfileDB != null ? ProfileDB.Contact ? ProfileDB.Contact['socialLink-4'] != '' ? true : false :false : false 
    const [OpenedCommentPost,SetOpenedCommentPost] = useState(null)
    const UserEmail  = db != null ? db.email : 'gestuser@gmail.com'
    const UserID  = db != null ? db.id : ''
    const UserName = db != null ? db.name : 'null'
    const [IsEditingProfile,SetIsEditingProfile] = useState(false)
    const [IsPosting,SetIsPosting] = useState(false)
    const [ProfilePostCarousel,SetProfilePostCarousel] = useState([null,0])
    const [ProfilePostUploadingCarousel,SetProfilePostUploadingCarousel] = useState(0)
    const [IsAddingFolder,SetIsAddingFolder] = useState(false)
    const [IsFiltering,SetIsFiltering] = useState(false)
    const [PostContainerIsEmpty,SetPostContainerIsEmpty] = useState(false)
    const Theme = useSelector((state)=> state.auth.Theme)
    const [PostingSteps,SetPostingSteps] = useState(1)
    const [folderName,SetfolderName] = useState('')
    const [folderNameFilter,SetfolderNameFilter] = useState('')
    const [fileNameFilter,SetfileNameFilter] = useState('')
    const [IsFilteringFolders,SetIsFilteringFolders] = useState(false)
    const [IsFilteringFiles,SetIsFilteringFiles] = useState(false)
    const [ClickedSendIcon,SetClickedSendIcon] = useState(null)
    const [SelectedProfileNav,SetSelectedProfileNav] = useState('About')
    const [SelectedRepository,SetSelectedRepository] = useState('folder')
    const [AboutMeSelectedTab,SetAboutMeSelectedTab] = useState('Overview')
    const [AccountSelectedTab,SetAccountSelectedTab] = useState('Delete')
    const [EditUsernameAccount,SetEditUsernameAccount] = useState(false)
    const [EditFolderName,SetEditFolderName] = useState({
        'id' : '',
        'action' : false,
        'name' : ''
    })
    const [MediaGallary,SetMediaGallary] = useState({
        'type' : '',
        'src' : '',
        'show' : false,
    })
    const [DeleteAccount,SetDeleteAccount] = useState({
        'password' : '',
        'show' : false,
    })
    const [ActiveFolder,SetActiveFolder] = useState(null)
    const [ActivePost,SetActivePost] = useState(null)
    const [ShowEmoji,SetShowEmoji] = useState(false)
    const [ShowUploadFilePreview,SetShowUploadFilePreview] = useState(false)
    const [DispBottomPostContent,SetDispBottomPostContent] = useState(null)
    const [EmojiInputTag,SetEmojiInputTag] = useState(null)
    const [ProfileAccount,SetProfileAccount] = useState({
        'AccountEmail' : '',
        'AccountID' : '',
        'AccountName' : 'Gest',
        'IsOwner' : false,
        'following' : 0,
        'followers' : 0,
        'IsFollowing' : false,
        'CoverPhoto' : '',
        'ProfilePic' : ''
    })
    const [ProfilePostUpload,SetProfilePostUpload] = useState({
        'file' : null,
        'type' : null,
        'src' : null,
        'Name' : null,
        'PostContent' : ''
    })
    const [NetworkContainer,SetNetworkContainer] = useState({
        'followersList' : [],
        'followingList' : [],
        'scope' : 'followers',
        
    })
    const [Upload,SetUpload] = useState({
        file : null,
        filename : '',
        size : '',
        type : ''
    })
    const [Show,SetShow] = useState({
        ReplyChat : '',
        ReplyUsername : ''

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
    const [ProfileCoverPhoto,SetProfileCoverPhoto] = useState(CarouselTestImg)
    const [ProfilePicturePhoto,SetProfilePicturePhoto] = useState(ProfileTestImg)
    const UploaderCoverPhoto = useRef(null)
    const UploadProfilePicture = useRef(null)
    const UploadProfilePost = useRef(null)
    const ProfilePostContainer = useRef(null)
    const FolderListContainer = useRef(null)
    const FileListContainer = useRef(null)
    const RepositoryUploadFile = useRef(null)
    const followingContainer  = useRef(null)
    const followersContainer = useRef(null)
    const WsDataStream = useRef(null)
    // Ref hook for animated icons
    const EditIconRef = useRef()
    const ThumbsUpRef = useRef()
    const CameraIconRef = useRef()

    function SaveProfile (val) {
        if (val == 'Overview' && UserEmail != 'gestuser@gmail.com') {
            var data = {
                'scope' : 'Overview',
                'language' : getValues('language'),
                'gender' : getValues('gender'),
                'pronoun' : getValues('pronoun'),
                'location': getValues('location')
            }
            
           props.UpdateProfile(JSON.stringify([data,UserEmail]))
        }else if (val == 'Contact' && UserEmail != 'gestuser@gmail.com') {
            var data = {
                'scope' : 'Contact',
                'email' : getValues('email'),
                'countryCode': getValues('countryCode'),
                'number' : getValues('number'),
                'messeger-id' : getValues('messeger-id'),
                'socialLink-0' : getValues('social-0'),
                'socialLink-1' : getValues('social-1'),
                'socialLink-2' : getValues('social-2'),
                'socialLink-3' : getValues('social-3'),
                'socialLink-4' : getValues('social-4')
            }
            props.UpdateProfile(JSON.stringify([data,UserEmail]))
        }
    }
    useLayoutEffect(()=> {
        //console.log(UserID,extrainfo,UserEmail,ProfileAccount.AccountEmail)
        
            //console.log('fetching')
            if(UserID == extrainfo){
                var data = {
                    'scope' : 'ReadProfile',
                    'AccountEmail' : UserEmail,
                    'AccountID' : extrainfo,
                    'IsOwner' : true,
                }
                setValue('UserName',UserName)
               var IsOwner = db == null ? false : UserEmail == ProfileAccount.AccountEmail ? true :false
                SetProfileAccount((e) => {
                    return {
                        ...e,
                        'AccountName' : UserName,
                        'AccountEmail' : UserEmail,
                        'AccountID' : UserID,
                        'IsOwner' : true,
                        'followers' : 0,
                        'following' : 0
                    }
                })
                props.FetchUserProfile(JSON.stringify([data]))
                setValue('filterYear',date.getFullYear())
                requestWsStream('open')
                
            }else{
                var data = {
                    'scope' : 'ReadProfile',
                    'AccountEmail' : UserEmail,
                    'AccountID' : extrainfo,
                    'IsOwner' : false,
                    'UserID' : UserID
                }
               var IsOwner = db == null ? false : UserEmail == ProfileAccount.AccountEmail ? true :false
                var IsStore = Object.keys(StoreProfileAccount).length != 0 ? true : false
                SetProfileAccount((e) => {
                    return {
                        ...e,
                        'AccountName' : IsStore ? StoreProfileAccount.AccountName : ProfileAccount.AccountName,
                        'AccountEmail' : IsStore ? StoreProfileAccount.AccountEmail : ProfileAccount.AccountEmail,
                        'AccountID' : IsStore ? StoreProfileAccount.AccountID : ProfileAccount.AccountID,
                        'IsOwner' : false,
                        'followers' : 0,
                        'following' : 0
                    }
                })
                props.FetchUserProfile(JSON.stringify([data]))
                setValue('filterYear',date.getFullYear())
                requestWsStream('open')
                
                
            }
            setInterval(() => {
                //console.log('cheking')
                SetReLoad((e) => !e)
            }, 60000);    
        
    },[db,extrainfo])
    useEffect(() => {
        
        if(ProfileDB != null){
           
            // updating users profile picture and cover photo    
            //var imgpath = StoreProfileAccount.ProfileCoverPhoto ? StoreProfileAccount.ProfileCoverPhoto : '/fallback.jpeg'

            var profileCoverPhotoUrl = `http://127.0.0.1:8000/media${ProfileDB.ProfileCoverPhoto}`
            
            SetProfileCoverPhoto(profileCoverPhotoUrl)
            if(db != null){
                SetProfilePicturePhoto(db.ProfilePic)
            }
            
           
            // updating about fields with user profile values
            if(ProfileDB.Overview){
                setValue('language',ProfileDB.Overview.language)
                setValue('gender',ProfileDB.Overview.gender)
                setValue('pronoun',ProfileDB.Overview.pronoun)
                setValue('location',ProfileDB.Overview.location)
            }else{
                setValue('language','')
                setValue('gender','')
                setValue('pronoun','')
                setValue('location','')
            }
            
            if(ProfileDB.Contact){
                setValue('email',ProfileDB.Contact.email)
                setValue('countryCode',ProfileDB.Contact.countryCode)
                setValue('number',ProfileDB.Contact.number)
                setValue('messeger-id',ProfileDB.Contact['messeger-id'])
                setValue('email',ProfileDB.Contact.email)
                setValue('social-0',ProfileDB.Contact['socialLink-0'])
                setValue('social-1',ProfileDB.Contact['socialLink-1'])
                setValue('social-2',ProfileDB.Contact['socialLink-2'])
                setValue('social-3',ProfileDB.Contact['socialLink-3'])
                setValue('social-4',ProfileDB.Contact['socialLink-4'])
            }else {
                setValue('email','')
                setValue('countryCode','')
                setValue('number','')
                setValue('messeger-id','')
                setValue('email',)
                setValue('social-0','')
                setValue('social-1','')
                setValue('social-2','')
                setValue('social-3','')
                setValue('social-4','')
            }
            
            setValue('UserName',UserName)
        }
       
    },[ProfileDB,extrainfo])
    useEffect(() => {
        //console.log('called',StoreProfileAccount)
        if(Object.keys(StoreProfileAccount).length != 0){
            var IsOwner = StoreProfileAccount.IsOwner != null ? StoreProfileAccount.IsOwner == 'True' ? true : false : false
            var CoverPhotourlpath = StoreProfileAccount.ProfileCoverPhoto != null  ? StoreProfileAccount.ProfileCoverPhoto : ProfileAccount.CoverPhoto
             var ProfilePicurlpath = StoreProfileAccount.ProfilePic != null  ? StoreProfileAccount.ProfilePic : ProfileAccount.ProfilePic
            SetProfileAccount((e) => {
                return{
                    ...e,
                    'AccountEmail':StoreProfileAccount.AccountEmail != null ? StoreProfileAccount.AccountEmail : ProfileAccount.AccountEmail,
                    'IsOwner' :  IsOwner,
                    'AccountName' : StoreProfileAccount.AccountName != null ? StoreProfileAccount.AccountName : ProfileAccount.AccountName,
                    'AccountID' : StoreProfileAccount.AccountID  != null ? StoreProfileAccount.AccountID : ProfileAccount.AccountID,
                    'followers' : StoreProfileAccount.followers  != null ? StoreProfileAccount.followers : ProfileAccount.followers,
                    'following' : StoreProfileAccount.following  != null ? StoreProfileAccount.following : ProfileAccount.following,
                    'IsFollowing' : StoreProfileAccount.IsFollowing != null  ? StoreProfileAccount.IsFollowing : ProfileAccount.IsFollowing,
                    'CoverPhoto' : CoverPhotourlpath,
                    'ProfilePic' : ProfilePicurlpath,
                }
            })
          
            
            var profileCoverPhotoUrl = `http://127.0.0.1:8000/media${CoverPhotourlpath}`
            
            SetProfileCoverPhoto(profileCoverPhotoUrl)
           
            var profilepicval = `http://127.0.0.1:8000/media${ProfilePicurlpath}`
            
            SetProfilePicturePhoto(profilepicval)
            var postval = StoreProfileAccount.ProfilePost ? StoreProfileAccount.ProfilePost[0] ? StoreProfileAccount.ProfilePost : []  : []                
            StoreProfileAccount.ProfilePost ? SetProfilePost(postval) : ''
            SetPostContainerIsEmpty(false)
            if(StoreProfileAccount.followerslist){
                SetNetworkContainer((e) => {
                    return {
                        ...e,
                        'followersList' : StoreProfileAccount.followerslist
                    }
                })
            }
           
        }
    },[StoreProfileAccount,StoreProfileAccount.followers])
    function ProfileNavigatorFetch(props){
        if(props != null){
            if(SelectedProfileNav == 'SavedPost'){
                requestWsStream('RequestSavedPost')
            }else if(SelectedProfileNav == 'Repository'){
                requestWsStream('RequestFolderData')
            }else if(SelectedProfileNav == 'Post'){
                requestWsStream('RequestProfilePosts','null')
            }else if(SelectedProfileNav == 'Network'){
                requestWsStream('RequestProfileNetwork','null')
            }
            ClearPostFilter('claerFilter')
        }
    }
    useEffect(() => {
        ProfileNavigatorFetch('fetch')
    },[SelectedProfileNav])
    useEffect(() => {
        if(FileListReducerVal[0]){
            SetFileList(FileListReducerVal)
        }   
    },[FileListReducerVal])
    // useEffect(() => {
    //     ToogleNetworkFilter()
        
    // },[IsFiltering,watch('filterPrivacy'),watch('filterYear')])
    
    function ToogleSocialLink (props) {
        if(props == 'Add'){
            SetSocialLinkCount((e) => e + 1)
        }else if (props == 'remove'){
            SetSocialLinkCount((e) => e - 1)
        }
        
    }
    function TooglePostFilter(props) {
        if(props != null){
            if((ProfilePostContainer.current.innerText == '' || ProfilePostContainer.current.innerText == 'No posts') && ProfilePost[0] ){
            
                SetPostContainerIsEmpty(true)
            }else {
                SetPostContainerIsEmpty(false)
            }
        }
    }
    function ClickCoverPhotoInputTag(props) {
        if(props) {
            // document.getElementById('CoverPhotoInput').click()
            UploaderCoverPhoto.current.click()
        }        
    }
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
    function ClickProfilePictureInputTag(props) {
        if(props) {
      
            // document.getElementById('CoverPhotoInput').click()
            UploadProfilePicture.current.click()
        }        
    }
  
    const ToogleCoverPhotoUpload = (val) => {
      
        var File =  UploaderCoverPhoto.current.files[0] ?  UploaderCoverPhoto.current.files[0] : val
       
        if(File && UserEmail != 'gestuser@gmail.com') {
            var CoverPhotoDis = document.getElementById('CoverPhotoDis')     
            const render = new FileReader()
            render.onload = function (e) {
                //CoverPhotoDis.style.backgroundImage = e.target.result                
                SetProfileCoverPhoto(e.target.result)                    
                }            
            render.readAsDataURL(File)            
            const formData = new FormData();
            formData.append('CoverPhoto',File);
            var coverphotoname = `${UserName}${File.name}`
            formData.append('scope','CoverPhotoUpdate')
            formData.append('email',UserEmail)
            formData.append('name',coverphotoname)
            props.UploadProfileFile(formData)
            
        }else if (UserEmail == 'gestuser@gmail.com'){
            toast('SignUp to manage account',{
                position : 'top-right',
                type : 'warning',
                theme : Theme
            })
        }

    }
    const ToogleProfilePictureUpload = (val) => {
       
        var File =  UploadProfilePicture.current.files[0] ?  UploadProfilePicture.current.files[0] : val
       
        if(File && UserEmail != 'gestuser@gmail.com') {
            var CoverPhotoDis = document.getElementById('CoverPhotoDis')     
            const render = new FileReader()
            render.onload = function (e) {
                //CoverPhotoDis.style.backgroundImage = e.target.result                
                SetProfilePicturePhoto(e.target.result)                    
                }            
            render.readAsDataURL(File)            
            const formData = new FormData();
            formData.append('ProfilePicture',File);
            var profilepicturename = `${UserName}${File.name}`
            formData.append('scope','ProfilePictureUpdate')
            formData.append('email',UserEmail)
            formData.append('name',profilepicturename)
            props.UploadProfileFile(formData)
            
        }else if (UserEmail == 'gestuser@gmail.com'){
            toast('SignUp to manage account',{
                position : 'top-right',
                type : 'warning',
                theme : Theme
            })
        }

    }
    const ToogleProfilePostUpload = (val) => {
       
        var File =  UploadProfilePost.current.files[0] ?  UploadProfilePost.current.files[0] : val
       
        if(File) {
            var Types = String(File.type).split('/')
            const maxSize = 50 * 1024 * 1024; // 50MB in bytes for file size limit
            if (File && File.size > maxSize) {
                var Themeval = Theme ==  'light' ? 'colored' : 'dark'
                console.log(Themeval)
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
    function SubmitUsername(val) {
        if(val && UserEmail != 'gestuser@gmail.com') {
            var data = {
                'scope' : 'UsernameUpdate',
                'Username': getValues('UserName')
            }
            SetProfileAccount((e) => {
                return {
                    ...e,
                    'AccountName' : getValues('UserName')
                }
            })
            SetEditUsernameAccount(false)
           props.UpdateProfile(JSON.stringify([data,UserEmail]))
        }else if (UserEmail == 'gestuser@gmail.com'){
            toast('SignUp to manage account',{
                position : 'top-right',
                type : 'warning',
                theme : Theme
            })
        }
    }
    function handleProfilePostScroll () {
    
        if (ProfilePostContainer.current.scrollHeight - ProfilePostContainer.current.scrollTop == (ProfilePostContainer.current.clientHeight )) {
            if(ProfilePost[0]){
               var post = ProfilePost[ProfilePost.length -1]
               var position = post.id + 1
                //console.log('User has scrolled to the bottom!',position);
                requestWsStream('RequestProfilePosts',position)
          
            }
             }
    }
    function FetchMoreProfilePosts (propsval){
        if(propsval){
            if(ProfilePost[0]){
                var post = ProfilePost[ProfilePost.length -1]
                var position = post.id + 1
                //console.log('User has scrolled to the bottom!',position);
                requestWsStream('RequestProfilePosts',position,true)
            
            }
            
        }
    }
    
    function DeletePost (idval,index) {
        if(idval && UserEmail != 'gestuser@gmail.com') {
            var data = {
                'scope' : 'DeletePost',
                'AccountEmail' : UserEmail,
                'PostId' : idval,
                'AccountID' : UserID
            }
            
            props.FetchUserProfile(JSON.stringify([data]))
        }else if (UserEmail == 'gestuser@gmail.com'){
            toast('SignUp to manage account',{
                position : 'top-right',
                type : 'warning',
                theme : Theme
            })
        }
    }
    function DeleteSavedPost (idval) {
        if(idval && UserEmail != 'gestuser@gmail.com') {
            var data = {
                'AccountEmail' : UserEmail,
                'PostId' : idval
            }
            
            requestWsStream('DeleteSavedPost',data)
        }else if (UserEmail == 'gestuser@gmail.com'){
            toast('SignUp to manage account',{
                position : 'top-right',
                type : 'warning',
                theme : Theme
            })
        }
    }
    function MakePublic (idval,scope) {
        if(idval && UserEmail != 'gestuser@gmail.com') {
            var data = {
                'AccountEmail' : UserEmail,
                'PostId' : idval
            }
            requestWsStream(scope,data)
            //props.FetchUserProfile(JSON.stringify([data]))
        }else if (UserEmail == 'gestuser@gmail.com'){
            toast('SignUp to manage account',{
                position : 'top-right',
                type : 'warning',
                theme : Theme
            })
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
    const requestWsStream = (msg = null,body = null,continuetion = false,continuetionId = null) => {    
       
        if(msg =='open'){
            
            if(WsDataStream.current != null ){
                WsDataStream.current.close(1000,'Opening another socket for less ws jam')

            }
            WsDataStream.current =  new WebSocket(`ws:/${import.meta.env.VITE_WS_API}/ws/chatList/${UserEmail}/`);

        }
        
        WsDataStream.current.onmessage = function (e) {
          var data = JSON.parse(e.data)
            if(data.type == 'RequestProfilePosts'){
                var val = data.message
                if(val['continuetion'] == 'True' && val.status != 'error'){
                    var newPostData = val['Posts'] == null ? [] : val['Posts']
                    if(val['Posts'] != null){
                        var postdata = val['Posts'] == null ?  ProfilePost : ProfilePost.concat(newPostData)
                        SetProfilePost(postdata)
                        dispatch({
                            type : ProfilePostReducer,
                            payload : postdata
                        })
                    }else {
                        
                        toast('No more posts',{
                            type : 'warning',
                            theme : Theme,
                            position : 'top-right'
                        })
                    }
                    
                    
                }else if((val['continuetion'] != 'True' && val.status != 'error')){
                    var newPostData = val['Posts'] != null ? val['Posts'] : []
                    if(val['Posts'] != null){
                        var postdata = newPostData
                        SetProfilePost(postdata)
                        dispatch({
                            type : ProfilePostReducer,
                            payload : postdata
                        })
                    }else {
                        toast('No posts',{
                            type : 'warning',
                            theme : Theme,
                            position : 'top-right'
                        })
                    }
                    
                }else if((data.message.status != 'success')){
                    // toast(val.message,{
                    //     position : 'top-right',
                    //     theme : Theme,
                    //     type : data.message.status
                    // })
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
                //SetPostComments(UniversalCommentData)
                // adding postcomments without realoading
                dispatch({
                    type : ProfilePostReducer,
                    payload : postdata
                })
                
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
                    dispatch({
                        type : ProfilePostReducer,
                        payload : UniversalProfilePost
                    })
                    SetReLoad((e) => !e)
                }else if(status == 'error'){
                    toast(data.message.messege,{
                        position : 'top-right',
                        theme : Theme,
                        type : 'error'
                    })
                }
            }else if(data.type == 'MakePostPublic'){
                const val = data.message
                if(val['type'] == 'success'){
                    
                    var postdata = ProfilePost                    
                    for (let i = 0; i <= postdata.length; i++) {
                        if(postdata[i].id == val['posts'].id){
                            //postdata.splice(i,1) // index starting at 0 in splice - removing data at index i
                            postdata.splice(i,1,val['posts'])
                            
                            break
                        }                      
                    }                    
                    SetProfilePost(postdata)
                    dispatch({
                        type : ProfilePostReducer,
                        payload : postdata
                    })
                    toast(val['result'], {
                        type: 'success',
                        theme: Theme,
                        position: 'top-right',
                    })
                    SetReLoad((e) => !e)
                }else if(val['type'] == 'error'){
                    
                    toast(val['result'], {
                        type: 'error',
                        theme: Theme,
                        position: 'top-right',
                    })
                }
               
            }else if(data.type == 'MakePostPrivate'){
                const val = data.message
                if(val['type'] == 'success'){
                    
                    var postdata = ProfilePost
                    var postdata = ProfilePost                    
                    for (let i = 0; i <= postdata.length; i++) {
                        if(postdata[i].id == val['posts'].id){
                            //postdata.splice(i,1) // index starting at 0 in splice - removing data at index i
                            postdata.splice(i,1,val['posts'])
                            
                            break
                        }                      
                    }   
                    SetProfilePost(postdata)
                    dispatch({
                        type : ProfilePostReducer,
                        payload : postdata
                    })
                    toast(val['result'], {
                        type: 'success',
                        theme: Theme,
                        position: 'top-right',
                    })
                    SetReLoad((e) => !e)
                }else if(val['type'] == 'error'){
                    toast(val['result'], {
                        type: 'error',
                        theme: Theme,
                        position: 'top-right',
                    })
                }
               
            }else if (data.type == 'RequestSavePost'){
                var val = data.message
                toast(val['result'], {
                    type: val['type'],
                    theme: Theme,
                    position: 'top-right',
                })
            }else if(data.type == 'RequestSavedPost'){
                var val = data.message
                if(val['type'] == 'success'){           
                    val['Posts'] == null ? SetSavedProfilePost([]) : SetSavedProfilePost(val['Posts'])
                    
                    dispatch({
                        type : SavedProfilePostReducer,
                        payload : postdata
                    })
                }else if(val['type'] == 'error'){
                    toast(val['result'], {
                        type: val['type'],
                        theme: Theme,
                        position: 'top-right',
                    })
                }
            }else if (data.type == 'DeleteSavedPost'){
                var val = data.message
                if (val['type'] == 'success') {
                    val['Posts'] == null ? SetSavedProfilePost([]) : SetSavedProfilePost(val['Posts'])
                    dispatch({
                        type : SavedProfilePostReducer,
                        payload : val['post']
                    })
                    toast(val['result'], {
                        type: val['type'],
                        theme: Theme,
                        position: 'top-right',
                    })
                }else {
                    toast(val['result'], {
                        type: val['type'],
                        theme: Theme,
                        position: 'top-right',
                    })
                }
                
            }else if(data.type == 'RequestFolderData') {
                var val = data.message
                if (val['type'] == 'success') {
                    SetFolderList(val['list'])
                    dispatch({
                        type : FolderListReducer,
                        payload : val['list']
                    })
                }else {
                    toast(val['result'], {
                        type: val['type'],
                        theme: Theme,
                        position: 'top-right',
                    })
                }
                
            }else if(data.type == 'RequestEditfolderName') {
                var val = data.message
                if (val['type'] == 'success') {
                    SetFolderList(val['list'])
                    dispatch({
                        type : FolderListReducer,
                        payload : val['list']
                    })
                    toast(val['result'], {
                        type: val['type'],
                        theme: Theme,
                        position: 'top-right',
                    })
                }else {
                    toast(val['result'], {
                        type: val['type'],
                        theme: Theme,
                        position: 'top-right',
                    })
                }
                
            }else if(data.type == 'RequestAddFolder') {
                var val = data.message
                if (val['type'] == 'success') {
                    SetfolderName('')
                    SetFolderList(val['list'])
                    dispatch({
                        type : FolderListReducer,
                        payload : val['list']
                    })
                    toast(val['result'], {
                        type: val['type'],
                        theme: Theme,
                        position: 'top-right',
                    })
                }else {
                    SetfolderName('')
                    toast(val['result'], {
                        type: val['type'],
                        theme: Theme,
                        position: 'top-right',
                    })
                }
                
            }else if(data.type == 'RequestFolderFiles') {
                var val = data.message
                if (val['type'] == 'success') {
                    SetFileList(val['list'])
                    SetSelectedRepository('file')
                }else {
                    toast(val['result'], {
                        type: val['type'],
                        theme: Theme,
                        position: 'top-right',
                    })
                }
                
            }else if(data.type == 'RequestDeleteRepositoryFile') {
                var val = data.message
                if (val['type'] == 'success') {
                    SetFileList(val['list'])
                    SetSelectedRepository('file')
                    toast(val['result'], {
                        type: val['type'],
                        theme: Theme,
                        position: 'top-right',
                    })
                }else {
                    toast(val['result'], {
                        type: val['type'],
                        theme: Theme,
                        position: 'top-right',
                    })
                }
                
            }else if(data.type == 'RequestDeleteFolder') {
                var val = data.message
                if (val['type'] == 'success') {
                    SetFolderList(val['list'])
                    dispatch({
                        type : FolderListReducer,
                        payload : val['list']
                    })
                    toast(val['result'], {
                        type: val['type'],
                        theme: Theme,
                        position: 'top-right',
                    })
                }else {
                    toast(val['result'], {
                        type: val['type'],
                        theme: Theme,
                        position: 'top-right',
                    })
                }
                
            }else if(data.type == 'RequestProfileNetwork') {
                var val = data.message
                if (val['type'] == 'success') {
                    if(val['continuetion'] == 'True'){
                        if(val['scope'] == 'following'){
                            var UniversalData = NetworkContainer.followingList
                            var newCommentData = val['followinglist'] == null ? NetworkContainer.followingList : val['followinglist'] 
                            var x =  UniversalData.concat(newCommentData)
                            SetNetworkContainer((e) => {
                                return {
                                    ...e,
                                    'followingList' : x
                                }
                            })
                        }else if(val['scope'] == 'followers'){
                            var UniversalData = NetworkContainer.followersList
                            var newCommentData = val['followerslist'] == null ? NetworkContainer.followersList : val['followerslist'] 
                            var x =  UniversalData.concat(newCommentData)
                            SetNetworkContainer((e) => {
                                return {
                                    ...e,
                                    'followersList' : x
                                }
                            })
                        } 
                    }else {
                        SetNetworkContainer((e) => {
                            return {
                                ...e,
                                'followersList' : val['followerslist'],
                                'followingList' : val['followinglist']
                            }
                        })
                    }
                    
                    
                }else {
                    toast(val['result'], {
                        type: val['type'],
                        theme: Theme,
                        position: 'top-right',
                    })
                }
                
            }
        };
        WsDataStream.current.onopen = (e) => {
            // websocket is opened
            //requestWsStream('RequestProfilePosts','null')
            
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
            if(msg == 'RequestProfilePosts') {
                
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'RequestProfilePosts',
                        'email' : UserEmail,
                        'AccountID' : ProfileAccount.AccountID,
                        'position' : body,
                        'IsOwner' : ProfileAccount.IsOwner,
                        'continuetion' : continuetion
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
            }else if(msg == 'MakePostPublic'){
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'MakePostPublic',
                        'data' : body
                    })
                )
            }else if(msg == 'MakePostPrivate'){
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'MakePostPrivate',
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
            }else if(msg == 'RequestSavedPost'){
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'RequestSavedPost',
                        'AccountEmail' : UserEmail
                    })
                )
            }else if(msg == 'DeleteSavedPost'){
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'DeleteSavedPost',
                        'data' : body
                    })
                )
            }else if(msg == 'RequestFolderData') {
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'RequestFolderData',
                        'AccountEmail' : UserEmail
                    })
                )
            }else if(msg == 'RequestAddFolder') {
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'RequestAddFolder',
                        'AccountEmail' : UserEmail,
                        'folderName' : folderName
                    })
                )
            }else if(msg == 'RequestEditfolderName') {
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'RequestEditfolderName',
                        'data' : body,
                    })
                )
            }else if(msg == 'RequestFolderFiles') {
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'RequestFolderFiles',
                        'AccountEmail' : UserEmail,
                        'folderId' : body
                    })
                )
            }else if(msg == 'RequestDeleteFolder') {
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'RequestDeleteFolder',
                        'AccountEmail' : UserEmail,
                        'folderId' : body
                    })
                )
            }else if (msg == 'RequestDeleteRepositoryFile'){
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'RequestDeleteRepositoryFile',
                        'data' : body
                    })
                )
            }else if (msg == 'RequestProfileNetwork'){
                WsDataStream.current.send(
                    JSON.stringify({
                        'message' : 'RequestProfileNetwork',
                        'AccountID' : ProfileAccount.AccountID,
                        'UserEmail' : UserEmail,
                        'scope' : NetworkContainer.scope,
                        'continuetion' : continuetion,
                        'continuetionId' : continuetionId
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
    function EmojisFunc(e) {
        if(EmojiInputTag != null){
            var idval = EmojiInputTag
            var commentInput = document.getElementById(`PostCommentInput-${idval}`)
        
            commentInput.value = commentInput.value + e.emoji
        
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
    const TimeNetworkUpdater = ({dateString}) => {
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

                return <time data-tip={date.toDateString()} className={` ${ProfileAccount.IsOwner ? '' : 'hidden'} text-xs cursor-default tooltip tooltip-top w-fit ml-auto mr-2 text-slate-600 dark:text-slate-300 `}>{val}</time>
            }
        }
        
        return <time data-tip={date.toDateString()} className={` ${ProfileAccount.IsOwner ? '' : 'hidden'} text-xs cursor-default tooltip tooltip-top w-fit ml-auto mr-2 text-slate-600 dark:text-slate-300 `}>just now</time>
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
                var Commentsval = PostComments.map((items,i) => {
                   
                    var profileid = items.CommentUserDetails.userID ? items.CommentUserDetails.userID  : null
                    var IsReplybody = items.replyCommentDetails != '' && items.replyCommentDetails != 'null' ? true : false
                    var ShowReply = IsReplybody == true ? items.replyCommentDetails.IsReply == true ? true :false : false
                    var replyUsername = ShowReply == true ? items.replyCommentDetails.username : ''
                    var replyMessege = ShowReply == true ? items.replyCommentDetails.messege : ''
                    return (
                        <div  key={i} className={`dropdown bg-transparent  relative flex px-2 min-w-[150px] max-w-[280px] sm:max-w-[90%]   bg-opacity-90 w-fit my-1 mx-2 chat chat-start flex-row flex-wrap sm:flex-nowrap  mr-auto   gap-1`}>
                            <div className= {`avatar md:mb-auto `}>
                                <div className="mask transition-all duration-300 mask-hexagon w-6 hover:w-12 ">
                                    <img loading="lazy"
                                    onClick={() =>OpenImage(items.CommentUserDetails.profilePic,'image')}
                                     src={items.CommentUserDetails.profilePic} />
                                </div>

                            </div>
                            <div className={`chat-bubble bg-slate-200 dark:bg-slate-800 min-w-full max-w-[150px] xs:max-w-[50vw] sm:max-w-full relative   shadow-md flex-col shadow-slate-500  dark:shadow-slate-500 gap-2 w-full flex `}>
                                {/* <video loading="lazy" onClick={() => OpenImage(items.src)} src={`${import.meta.env.VITE_WS_API}/media/${items.src}`} controls title="Uploaded Video"  className={`   cursor-pointer ${items.upload == 'video' && items.src != 'null' ? 'flex' : 'hidden'} max-h-[70px] sm:max-h-[90px] md:min-h-[200px] ml-3 rounded-sm  w-fit h-fit`} ></video>                                            
                                <audio  src={`${import.meta.env.VITE_WS_API}/media/${items.src}`}  controls title="Uploaded Audio"  className={`cursor-pointer ${items.email == UserEmail ? ' mr-2' : ' ml-2'} px-2  ${items.upload == 'audio' && items.src != 'null' ? 'flex' : ' hidden'} border-slate-800 min-h-[40px] min-w-[200px]  w-[90%] sm:min-w-[300px]  h-fit`} ></audio>
                                <img loading="lazy" onClick={() => OpenImage(items.src)} src={`${import.meta.env.VITE_WS_API}/media/${items.src}`}  title="Uploaded image"   className={`cursor-pointer ${items.email == UserEmail ? ' mr-3' : ' ml-3'}  ${items.upload == 'image' && items.src != 'null' ? ' flex' : 'hidden'}  rounded-sm  min-w-fit border-none my-auto w-fit h-fit  max-h-[50px] xs:max-h-[100px] lg:max-h-[150px] `}  alt="" />
                                 */}
                                <span onClick={() => OpenUserProfile(profileid)} className={` text-slate-800 dark:text-slate-100 chat-header text-[x-small] hover:underline hover:underline-offset-2 cursor-pointer  font-semibold`}>{items.CommentUserDetails.name}</span>
                                <div className= {` border-[1px] rounded-sm p-2 text-slate-500 dark:text-slate-400 border-slate-600 ${ShowReply == true ? ' flex' : 'hidden'}  flex flex-col xs:w-full w-full xs:min-w-full justify-start gap-1 my-3 `}   >
                                    <span  className={` chat-header  font-semibold flex flex-row gap-3`}>{replyUsername} : <p className=" italic text-orange-500 text-opacity-80 text-[x-small] md:text-sm">Reply</p></span>
                                    <textarea className={` border-none bg-transparent mr-auto text-left  break-all text-slate-950 dark:text-slate-100  h-fit max-h-[50px] min-h-[30px] sm:max-h-[100px] w-[100%] rounded-sm font-mono text-sm p-2 resize-y cursor-text`} disabled value={replyMessege} ></textarea>
                                </div>
                                <blockquote className={` max-w-[120px] xs:max-w-[50vw] sm:max-w-[400px] xl:max-w-[400px] lg:max-w-[200px] w-fit  break-all  text-slate-900 dark:text-slate-200 font-mono text-sm `} > 
                                    {items.message } 
                                </blockquote>                    
                                <TimeCommentUpdater dateString={items.dateCommented} />
                                {/* <time className="text-xs opacity-70">{items.dateCommented}</time> */}
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
                return Commentsval
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
        console.log(id)
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
    function ScrollingNetworkContainer (props) {
        if(props != null) {
            var container = props == 'following' ? followingContainer : followersContainer
            var proceedval = (container.current.scrollTop + container.current.clientHeight >= container.current.scrollHeight) ? true : false
        
            if(proceedval == true){
                var list = props == 'following' ? NetworkContainer.followingList : NetworkContainer.followersList
                var idval = list[0] ? list[list.length -1].position : ''
                
                requestWsStream('RequestProfileNetwork',null,true,idval)
            }
            
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
                position : 'top-right',
                theme : Theme,
                type : 'success'
            })
        }
        
    }
   
    function LikePostFunc (postid) {
      
        if(postid != null && UserEmail != 'gestuser@gmail.com') {
            var data = {
                'postId' : postid,
                'userEmail' : UserEmail
            }
            requestWsStream('RequestLikePost',data)
        }else if (UserEmail == 'gestuser@gmail.com'){
            toast('SignUp to manage account',{
                position : 'top-right',
                type : 'warning',
                theme : Theme
            })
        }
    }
    
    function SavePost (postid,useridval) {
        if(postid != null && UserEmail != 'gestuser@gmail.com'){
            var data = {
                'AccountEmail' : UserEmail,
                'PostId' : postid,
                'userID' : useridval
            }
            requestWsStream('RequestSavePost',data)
        }else if (UserEmail == 'gestuser@gmail.com'){
            toast('SignUp to manage account',{
                position : 'top-right',
                type : 'warning',
                theme : Theme
            })
        }
    }
    function RequestFolderFilesFunc (props) {
        if(props != null) {
            SetFileList([])
            SetActiveFolder(props)

            requestWsStream('RequestFolderFiles',props)
        }
    }
    function RequestDeleteFolderFunc (props) {
        if(props != null) {
            SetFileList([])

            requestWsStream('RequestDeleteFolder',props)
        }
    }
    function RequestDeleteRepositoryFileFunc (fileId,filename) {
        if(fileId != null && filename != '' && UserEmail != 'gestuser@gmail.com'){
            var data = {
                'AccountEmail' : UserEmail,
                'fileId' : fileId,
                'filename' : filename,
                'FolderId' : ActiveFolder
            }
            toast('Deleting, please wait',{
                position : 'top-right',
                theme: Theme,
                type : 'info'
            })
            //console.log('RequestDeleteRepositoryFile',data)
            requestWsStream('RequestDeleteRepositoryFile',data)
        }else if (UserEmail == 'gestuser@gmail.com'){
            toast('SignUp to manage account',{
                position : 'top-right',
                type : 'warning',
                theme : Theme
            })
        }
    }
    const ToogleEditFolderName = (propsval,idval,name = null) => {
        if(propsval == 'cancel') {
            SetEditFolderName({
                'action' : false,
                'id' : '',
                'name' : ''
            })
        }else if(propsval == 'submit' && UserEmail != 'gestuser@gmail.com'){
            var data = {
                'name' : EditFolderName.name,
                'folderId' : EditFolderName.id,
                'AccountEmail' : UserEmail
            }
            toast('Editing, please wait', {
                type: 'info',
                theme: Theme,
                position: 'top-right'
            })
            requestWsStream('RequestEditfolderName',data)
            SetEditFolderName({
                'action' : false,
                'id' : '',
                'name' : ''
            })
        }else if(propsval == 'open' && UserEmail != 'gestuser@gmail.com'){
            SetEditFolderName({
                'action' : true,
                'id' : idval,
                'name' : name
            })
        }else if (UserEmail == 'gestuser@gmail.com'){
            toast('SignUp to manage account',{
                position : 'top-right',
                type : 'warning',
                theme : Theme
            })
        }
    }
    const EditfolderNameChange = (event) => {
        const {value} = event.target 
        SetEditFolderName((e) => {
            return {
                ...e,
                'name' : value
            }
        })
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
    function OpenUserProfile (useridval) {
        if(useridval != null){
            navigate(`/home/profile/${useridval}`)
            SetSelectedProfileNav('About')
            //clearing some profile data
            SetNetworkContainer((e) => {
                return {
                    'followersList' : [],
                    'followingList' : [],
                    'scope' : 'followers',
                }
            })
            SetSavedProfilePost([])
            SetProfilePost([])
            
        }
    }
   
    const ScrollPostCarousels = (idval,position) =>{
        if(idval != null && position == 'back'){
            SetProfilePostCarousel([idval,0])
        }else if(idval != null && position == 'next'){
            SetProfilePostCarousel([idval,1])
        }
    }
    const ScrollPostUploadingCarousels = (position) =>{
        if(position == 'back'){
            SetProfilePostUploadingCarousel((e) => e != 0 ? e -1  : 0)
        }else if(position == 'next'){
            SetProfilePostUploadingCarousel((e) => e != 1 ? e + 1  : 1)
        }
    }
    const MapPosts = ProfilePost.map((items,i) => {
        var profileid = items.postUserDetails.userID ? items.postUserDetails.userID  : null
        var filetype = items.postUserDetails.PostFileType
        var fileurl = items.postUserDetails.PostFileUrl
        var IsUserPost = items.account_email == UserEmail ? true : false
        var IsPrivate = items.postPrivacy == 'public' ? false : true
        var DatePostedval = items.datePosted
        var yearPosted = DatePostedval.split('-')[2]
        var CommentLength = items.CommentNumber != null ? items.CommentNumber : 0
        var showButtons = items.content != '' && filetype != null ? true : false
        //(IsUserPost && !IsFiltering ) || (IsPrivate && !IsFiltering ) || (IsFiltering && getValues('filterYear') == yearPosted && (getValues('filterPrivacy') == 'all' || getValues('filterPrivacy') == items.postPrivacy)) ?  'flex flex-col' :  !IsUserPost && !IsFiltering
        var dispPost = (!IsFiltering ) || (IsFiltering && getValues('filterYear') == yearPosted) || (IsFiltering && getValues('filterPrivacy') == 'all') || ( IsFiltering && getValues('filterPrivacy') == items.postPrivacy) ?  true : false 
       
        return (
            <div key={i} className={` ${ dispPost ? 'flex flex-col' : 'hidden'} border-[1px] border-slate-600 dark:border-slate-400 justify-start h-fit w-[95%] mx-auto sm:w-[90%] max-w-[600px] lg:max-w-full lg:w-full xl:max-w-[600px] rounded-md py-2 `} >
                {/*post header container */}
                <div className=" px-4 pb-2 w-full border-b-[1px] border-slate-600 dark:border-slate-400 h-fit min-h-[60px] flex flex-row justify-around " >
                    <div className="avatar my-auto">
                        <div className="w-14 h-14 rounded-full">
                            <img loading="lazy" 
                                src={items.postUserDetails.profilePic}
                                className=" cursor-pointer"
                                onClick={() =>OpenImage(items.postUserDetails.profilePic,'image')}
                             />

                        </div>
                    </div>
                    <div className=" relative flex my-auto flex-col text-left w-full ml-4 mr-auto h-fit" >
                        <span data-tip='Open Profile' onClick={() => OpenUserProfile(profileid)} className=" tooltip tooltip-bottom text-left w-fit mr-auto font-semibold hover:underline hover:underline-offset-2 cursor-pointer text-lg " >
                            {items.postUserDetails.name} 
                            
                        </span>
                        <p className= {` ${IsPrivate && IsUserPost ? 'flex' : 'hidden'} badge badge-neutral absolute inline  left-[95%] bg-opacity-60  bg-slate-950 text-sm text-amber-400 `} >private</p>
                        
                        <TimePostUpdater dateString={items.datePosted} />
                        {/* <small className="" >{items.datePosted}</small> */}
                        <span className=" font-semibold " >{items.title}</span>
                    </div>
                    <div className="dropdown min-w-[40px] my-auto dropdown-end">
                        <CiCircleMore className=" my-auto text-3xl hover:text-slate-100 dark:hover:text-slate-300 text-slate-800 transition-all duration-300 dark:text-slate-800 " tabIndex={0} role="button" />
                        <ul tabIndex={0} className="dropdown-content menu bg-slate-300 dark:bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            <li onClick={() => SavePost(items.id,profileid)} className=" hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md" ><a>Save</a></li>
                            <li onClick={() => DeletePost(items.id,i)} className= {` ${IsUserPost ? 'flex' : 'hidden'} hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md `} ><a>Delete Post</a></li>
                            <li onClick={() => MakePublic(items.id,'MakePostPublic',)} className= {` ${IsUserPost && IsPrivate ? 'flex' : 'hidden'} hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md `} ><a>Make Pulic</a></li>
                            <li onClick={() => MakePublic(items.id,'MakePostPrivate',)} className= {` ${IsUserPost && !IsPrivate ? 'flex' : 'hidden'} hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md `} ><a>Make Private</a></li>
                            <li title="report this post" className= {` ${IsUserPost ? 'hidden' : 'flex'} hover:bg-slate-100 dark:hover:bg-slate-700  rounded-md `} ><a>Report</a></li>
                        </ul>
                    </div>
                </div>
                {/* post content */}
                <div id="controls-carousel" className=" w-full h-fit bg-transparent relative overflow-hidden " >
                    <div style={{transform: ProfilePostCarousel[0] == items.id ? `translateX(-${ProfilePostCarousel[1] * 100}%)` : ''}}  className={` w-full h-fit bg-transparent transition-all duration-300 relative flex flex-row overflow-visible `} >
                        <div className={` ${filetype == 'image' ? '' : 'hidden'} m-auto w-full min-w-full h-fit`} >
                            <img loading="lazy"
                                onClick={() =>OpenImage(`http://127.0.0.1:8000/media${fileurl}`,'image')}
                                className= {` ${filetype == 'image' ? ' h-fit m-auto cursor-pointer max-h-[500px]  mask-square' : ' hidden'} `}
                                src={`http://127.0.0.1:8000/media${fileurl}`} 
                            />
                        </div>
                        <div className={` ${filetype == 'video' ? '' : 'hidden'} m-auto w-full min-w-full h-fit`} >
                            <video 
                                loading="lazy" 
                                preload="auto" 
                                controlsList="nodownload" data-no-fullscreen="true" 
                                onClick={() =>OpenImage(`http://127.0.0.1:8000/media${fileurl}`,'video')}
                                src={`http://127.0.0.1:8000/media${fileurl}`} 
                                className={` ${filetype == 'video' ? 'flex' : 'hidden'} cursor-pointer w-full m-auto h-fit p-0 border-none min-h-[400px] `} width="320" height="240" type="video/*" controls>
                                    Your browser does not support the video tag. 
                            </video>
                        </div>
                        {/* <span className={` ${items.content != '' ? 'inline' : 'hidden' } ${ filetype != 'video' ? '-translate-y-2' : ' translate-y-0'}  h-fit bg-slate-400 text-slate-950 dark:bg-slate-800 dark:text-slate-300 dark:bg-opacity-50 bg-opacity-50 p-2 rounded-sm text-center w-full `} >{items.content}</span> */}
                        <ReactQuill
                            placeholder="details neccessary" 
                            className={` ${items.content != '' ? 'inline' : 'hidden' } ${ filetype != 'video' ? '-translate-y-2' : ' translate-y-0'}  h-fit bg-slate-400 text-slate-950 dark:bg-slate-800 dark:text-slate-300 dark:bg-opacity-50 bg-opacity-50 p-2 max-h-[500px] overflow-y-auto mt-2 rounded-sm text-center w-full min-w-full `}
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
                    <button onClick={() =>ScrollPostCarousels(items.id,'back')} type="button" className={` absolute bottom-1 start-0 z-30  ${showButtons ?'flex' : 'hidden'} items-center justify-center  h-fit px-4 cursor-pointer group focus:outline-none`} >
                        <span className="inline-flex items-center justify-center sm:w-10 w-6 h-6 sm:h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 ring-[1px] ring-purple-500 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                            
                            <FaAngleLeft className="w-4 h-4 text-sky-500  " />
                        </span>
                    </button>
                    <button onClick={() =>ScrollPostCarousels(items.id,'next')} type="button" className={` absolute bottom-1 end-0 z-30 ${showButtons ?'flex' : 'hidden'} items-center justify-center h-fit px-4 cursor-pointer group focus:outline-none`} >
                        <span className="inline-flex items-center justify-center sm:w-10 w-6 h-6 sm:h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 ring-[1px] ring-purple-500 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                            <FaAngleRight className="w-4 h-4 text-sky-500 " />
                        </span>
                    </button>

                </div>
                {/* bottom container */}
                <div className="px-1  pb-2 w-full border-t-[1px] border-slate-600 dark:border-slate-400 h-fit min-h-[60px] flex flex-col justify-around " >
                    {/* like, link, share onScroll={()=> ScrollingCommentContainer(i,items.id)} */}
                    <div id={`CommentContainer-${items.id}`} onScroll={()=> ScrollingCommentContainer(i,items.id)} className={` ${OpenedCommentPost == items.id ? 'flex flex-col' : 'hidden' }  scroll-smooth overflow-x-hidden mt-2 relative bg-slate-300 max-h-[300px] overflow-y-auto rounded-lg w-full `} >
                        <span id={`CommentContainer-loader-${items.id}`}  data-tip="Loading" style={{display : 'none'}} className="loading loading-dots sticky top-0 tooltip cursor-pointer mx-auto my-2 bg-slate-600  loading-md"></span>
                        <MapPostComment  postid={items.id} postEmail={items.account_email} />
                    </div>
                    <div className=" w-full flex  flex-row justify-around py-2" >
                        <div className=" w-fit flex flex-col justify-start gap-1 mb-auto" >
                            <Lottie lottieRef={ThumbsUpRef} onClick={() => LikePostFunc(items.id)} title="Like" className="  text-2xl h-9 cursor-pointer text-blue-700 transition-all duration-300 " animationData={ThumbsUpIcon} loop={false} autoplay={true} />

                            <p className={` ${items.likes != 'null' && items.likes != 0 ? ' flex' : 'hidden'} m-auto text-[12px] sm:text-sm cursor-pointer text-slate-200 dark:text-slate-800 hover:text-slate-800 traal duration-300 dark:hover:text-slate-200  `} >{items.IsUserLiked == true  && items.likes != 1 ? 'you and ' : ''}{items.likes}</p>
                        </div>
                        <div className=" w-fit flex flex-col justify-start  gap-1 h-full mb-auto" >
                            <FaCommentDots onClick={() => ShowCommentContainer(i,items.id)} title="Comment" className=" cursor-pointer text-2xl hover:text-slate-100 dark:hover:text-slate-100 text-slate-300 transition-all duration-300 "   />
                            <p className={` ${CommentLength != 0 ? ' flex' : 'hidden'} mx-auto mt-auto text-sm cursor-pointer text-slate-800 dark:text-slate-200 hover:text-slate-800 transition-all duration-300 dark:hover:text-slate-200  `} >{CommentLength}</p>
                        </div>
                        <GoLink onClick={() => CopyPostLink(items.id)} title="Copy link" role='button'  className=" tooltip mb-auto  text-xl hover:text-2xl hover:text-slate-100 dark:hover:text-slate-300 text-slate-300 transition-all duration-300 "  />
                        <div className="dropdown min-w-[40px] mb-auto dropdown-top dropdown-end">
                            <SlShareAlt tabIndex={i}  title="Share" role='button'  className="m-auto text-xl hover:text-2xl hover:text-slate-100 dark:hover:text-slate-300 text-slate-300 transition-all duration-300 "  />
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
                        <textarea onFocus={() => ToogleBottomContent('show',items.id)} onBlur={() => ToogleBottomContent('hide',items.id)} id={`PostCommentInput-${items.id}`} 
                            placeholder="Comment"
                            className="textarea w-full max-h-[50px] h-[20px] min-h-[35px] bg-transparent focus:border-none  pl-6 text-slate-950 shadow-none border-none outline-none resize-none textarea-xs ">
                        </textarea>
                        
                        <div  className={` w-full  transition-all flex flex-row duration-500 ${DispBottomPostContent == items.id ? 'h-[35px] overflow-visible' : 'h-0 overflow-hidden'}   my-auto justify-around `} >
                            <div className="dropdown min-w-[40px] my-auto dropdown-top ">
                                <BsEmojiNeutral tabIndex={i} role='button'  title="Comment with emoji" className=" text-xl ml-4  hover:text-yellow-500 dark:hover:text-yellow-500 text-slate-900 transition-all duration-300 " />
                                <div tabIndex={i} className="dropdown-content menu absolute bg-transparent z-40 w-52 p-2 shadow">
                                    {/* <EmojiPicker onEmojiClick={EmojisFunc} className=" mx-auto " height={400} width={300} /> */}
                                </div>
                            </div>
                            {/* <BsEmojiNeutral onClick={() => EmojiDispFunc(items.id)}  title="Comment with emoji" className=" my-auto text-xl ml-4  hover:text-yellow-500 dark:hover:text-yellow-500 text-slate-900 transition-all duration-300 "  role="button" /> */}
                            <FaPaste onClick={() =>PasteClipboard(items.id)}    title="paste clipboard" className=" my-auto text-xl ml-4  hover:text-slate-500 dark:hover:text-slate-500 text-slate-900 transition-all duration-300 "  role="button" />
                            <IoSendSharp onClick={()=> SubmitPostComment(i,items.id)} id={`ClickedSendIcon-${items.id}`}  title="Comment"  className={` my-auto  text-xl ml-auto mr-4 mb-2 hover:text-sky-500 dark:hover:text-sky-500 text-slate-900 transition-all duration-300 `}  role="button" />
                        </div>
                    </div>
                </div>
            </div>
        )
    })
    
    const MapSavedPosts = SavedProfilePost.map((items,i) => {
        
        var profileid = items.postUserDetails.userID ? items.postUserDetails.userID  : null
        var filetype = items.postUserDetails.PostFileType
        var fileurl = items.postUserDetails.PostFileUrl
        var IsUserPost = items.account_email == UserEmail ? true : false
        var IsPrivate = items.postPrivacy == 'public' ? false : true
        var DatePostedval = items.datePosted
        var showButtons = items.content != '' && filetype != null ? true : false
        //var yearPosted = DatePostedval.split('-')[2]

        return (
            <div key={i} className={` flex flex-col border-[1px] border-slate-600 dark:border-slate-400 justify-start h-fit w-[95%] mx-auto sm:w-[90%] max-w-[600px]  rounded-md py-2 `} >
                {/*post header container */}
                <div className=" px-4 pb-2 w-full border-b-[1px] border-slate-600 dark:border-slate-400 h-fit min-h-[60px] flex flex-row justify-around " >
                    <div className="avatar my-auto">
                        <div className="w-14 h-14 rounded-full">
                            <img loading="lazy" src={items.postUserDetails.profilePic}
                                className=" cursor-pointer"
                                onClick={() =>OpenImage(items.postUserDetails.profilePic,'image')}
                            />
                        </div>
                    </div>
                    <div className=" relative flex my-auto flex-col text-left w-full ml-4 mr-auto h-fit" >
                        <span onClick={() => OpenUserProfile(profileid)} className=" font-semibold hover:underline hover:underline-offset-2 cursor-pointer text-lg " >
                            {items.postUserDetails.name} 
                            
                            </span>
                        <p className= {` ${IsPrivate && IsUserPost ? 'flex' : 'hidden'} badge badge-neutral absolute inline  left-[95%] bg-opacity-60  bg-slate-950 text-sm text-amber-400 `} >private</p>
                        
                        <TimePostUpdater dateString={items.datePosted} />
                        <span className=" font-semibold " >{items.title}</span>
                        
                    </div>
                    <div className="dropdown min-w-[40px] my-auto dropdown-end">
                        <CiCircleMore className=" my-auto text-3xl hover:text-slate-100 dark:hover:text-slate-300 text-slate-800 transition-all duration-300 dark:text-slate-800 " tabIndex={0} role="button" />
                        <ul tabIndex={0} className="dropdown-content menu bg-slate-300 dark:bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            <li onClick={() => DeleteSavedPost(items.id)} className= {` flex hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md `} ><a>Delete Saved Post</a></li>
                           
                        </ul>
                    </div>
                </div>
                {/* post content */}
                <div id="controls-carousel" className=" w-full h-fit bg-transparent relative overflow-hidden " >
                    <div style={{transform: ProfilePostCarousel[0] == items.id ? `translateX(-${ProfilePostCarousel[1] * 100}%)` : ''}} className=" w-full h-fit bg-transparent transition-all duration-300 relative flex flex-row overflow-visible " >
                        <div className={` ${filetype == 'image' ? '' : 'hidden'} m-auto w-full min-w-full h-fit`} >
                            <img loading="lazy"
                            onClick={() =>OpenImage(`http://127.0.0.1:8000/media${fileurl}`,'image')}
                                className= {` ${filetype == 'image' ? ' h-fit max-h-[500px]  m-auto mask-square' : ' hidden'} `}
                                src={`http://127.0.0.1:8000/media${fileurl}`} 
                            />
                        </div>
                        
                        <div className={` ${filetype == 'video' ? '' : 'hidden'} m-auto w-full min-w-full h-fit`} >
                            <video loading="lazy" src={`http://127.0.0.1:8000/media${fileurl}`} 
                            onClick={() =>OpenImage(`http://127.0.0.1:8000/media${fileurl}`,'video')}
                            className={` ${filetype == 'video' ? 'flex' : 'hidden'} w-full m-auto h-fit p-0 border-none min-h-[400px] `} width="320" height="240" controls>
                                    Your browser does not support the video tag.
                            </video>
                        </div>
                        
                        {/* <span className={` ${items.content != '' ? 'inline' : 'hidden' }  h-fit bg-slate-400 text-slate-950 dark:bg-slate-800 dark:text-slate-300 dark:bg-opacity-50 bg-opacity-50 p-2 rounded-sm text-center w-full `} >{items.content}</span> */}
                        <ReactQuill
                            placeholder="details neccessary" 
                            className={` ${items.content != '' ? 'inline' : 'hidden' }  h-fit bg-slate-400 text-slate-950 dark:bg-slate-800 dark:text-slate-300 dark:bg-opacity-50 bg-opacity-50 overflow-y-auto p-2 rounded-sm text-center  max-h-[500px] w-full min-w-full  `}
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
                    <button onClick={() =>ScrollPostCarousels(items.id,'back')} type="button" className={` absolute  bottom-1 start-0 z-30  ${showButtons ?'flex' : 'hidden'} items-center justify-center  h-fit px-4 cursor-pointer group focus:outline-none`} >
                        <span className="inline-flex items-center justify-center  sm:w-10 w-6 h-6 sm:h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 ring-[1px] ring-purple-500 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                            
                            <FaAngleLeft className="w-4 h-4 text-sky-500  " />
                        </span>
                    </button>
                    <button onClick={() =>ScrollPostCarousels(items.id,'next')} type="button" className={` absolute  bottom-1 end-0 z-30 ${showButtons ?'flex' : 'hidden'} items-center justify-center h-fit px-4 cursor-pointer group focus:outline-none`} >
                        <span className="inline-flex items-center justify-center  sm:w-10 w-6 h-6 sm:h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 ring-[1px] ring-purple-500 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                            <FaAngleRight className="w-4 h-4 text-sky-500 " />
                        </span>
                    </button>

                   
                </div>
                
            </div>
        )
    })
    
    const MapFolderList = FolderList.map((items,i) => {
        var titleval = String(items.title).toLocaleLowerCase()
        var filterval = String(folderNameFilter).toLocaleLowerCase()
        var IsMatch = String(titleval).match(filterval)
        var Show =  IsMatch ? true : false
        return (
            <div key={i}  className={`  ${ IsFilteringFolders == true && Show == true ?'flex flex-col ' : IsFilteringFolders == false ? 'flex flex-col' : 'hidden'} text-center group w-[90%] hover:shadow-lg transition-all duration-300 hover:shadow-yellow-300 mx-auto bg-slate-300 bg-opacity-40 dark:bg-slate-600 min-h-[150px] xs:min-h-[200px] max-w-[200px] xs:max-w-[300px] border-[1px] border-slate-300 cursor-pointer dark:border-slate-600 justify-around rounded-md p-2 `} >
                <div className=" flex flex-row justify-around gap-4 w-full" >
                    <button onClick={() => ToogleEditFolderName('open',items.id,items.title)}  data-tip="Edit folder name"  className={` tooltip tooltip-right mr-auto w-fit text-right h-fit bg-transparent `} >
                        <MdOutlineModeEditOutline  className=" my-auto  text-lg dark:text-slate-200 hover:text-purple-500 dark:hover:text-sky-500  transition-all duration-300 "  role="button" />
                    </button> 
                    <button onClick={() => RequestFolderFilesFunc(items.id)}  data-tip="Open folder"  className={` tooltip tooltip-left w-fit text-right h-fit bg-transparent `} >
                        <IoOpenOutline    className=" my-auto text-lg dark:text-slate-200 hover:text-purple-500 dark:hover:text-sky-500  transition-all duration-300 "  role="button" />
                    </button> 
                    <button onClick={() => RequestDeleteFolderFunc(items.id)}  data-tip="Delete folder"  className={` tooltip tooltip-left w-fit text-right h-fit bg-transparent `} >
                        <BsTrash3   className=" my-auto text-lg text-rose-600 dark:text-rose-500 hover:text-pink-500 dark:hover:text-pink-500  transition-all duration-300 "  role="button" />
                    </button> 
                </div> 
                <label className="swap group-hover:swap-active swap-off ">
                    {/* this hidden checkbox controls the state */}
                    <input className=" hidden" type="checkbox" />
                    <FcOpenedFolder className="swap-on h-24 w-24 fill-current" />
                    <FcFolder className="swap-off h-24 w-24 fill-current" />
                </label>
                <div className=" w-full flex flex-row flex-wrap xs:flex-row justify-around" >
                    <big className= {` ${EditFolderName.action == false || EditFolderName.id != items.id ? 'flex' : 'hidden'} w-fit font-semibold text-xl xs:text-2xl mx-auto `} >{items.title}</big>
                    <input value={EditFolderName.name} onChange={EditfolderNameChange}  className= {` ${EditFolderName.action == true && EditFolderName.id == items.id ? 'flex' : 'hidden'} text-xl xs:text-2xl ml-0 bg-transparent border-none rounded-sm text-ellipsis w-[100%] xs:max-w-[70%] `} placeholder="Username" type="text" />
                    <MdOutlineAdd onClick={() => ToogleEditFolderName('cancel')}    title="Cancel changes" className={`tooltip ${EditFolderName.action == true && EditFolderName.id == items.id ? 'flex' : 'hidden'} rotate-45 cursor-pointer sm:text-lg my-auto mx-auto xs:mx-0 text-slate-600  dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 z-30 transition-all duration-30  lg:text-2xl `} />
                    <TiTickOutline onClick={() => ToogleEditFolderName('submit')}    title="Submit changes" className={`tooltip ${EditFolderName.action == true && EditFolderName.id == items.id ? 'flex' : 'hidden'} cursor-pointer sm:text-lg my-auto mx-auto xs:mx-0 text-slate-600  dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 z-30 transition-all duration-30  lg:text-2xl `} />
                </div>

                <time className=" mt-auto text-sm md:text-base" >{items.dateCreated}</time>
            </div>
        )
    })

    const MapFileList = FileList.map((items,i) => {
        var titleval = String(items.name).toLocaleLowerCase()
        var filterval = String(fileNameFilter).toLocaleLowerCase()
        var IsMatch = String(titleval).match(filterval)
        var Show =  IsMatch ? true : false
        //console.log(items)
        return (
            <tr key={i} className= {` ${ IsFilteringFiles == true && Show == true ?'' : IsFilteringFiles == false ? '' : 'hidden'} bg-slate-300 border-b text-sm md:text-base text-gray-900 dark:bg-slate-700 *:dark:text-slate-100 border-gray-600 dark:border-gray-500 `}>
                <th scope="row" className="px-2 py-4 font-medium inline-flex gap-2 whitespace-nowrap ">
                <FaFileLines className="text-base text-blue-600 dark:text-blue-500 my-auto transition-all duration-300 "  />
                    <input readOnly className=" outline-none border-none input-disabled bg-transparent w-fit min-w-fit cursor-default text-inherit text-ellipsis my-auto" value={items.name} type="text" />
                </th>
                <td className="px-1 py-4">
                    {items.dateCreated}
                </td>
                <td className="px-1 py-4">
                    {items.size}
                </td>
                <td className="px-1 flex flex-row  gap-3 my-auto py-4 justify-start align-middle h-fit">
                    <button data-tip="View file"  className={` ${items.type == 'image' ? 'flex' : 'hidden'} tooltip tooltip-left w-fit h-fit bg-transparent `} >
                        <a target="_blank" href={`${import.meta.env.VITE_APP_API_URL}/media${items.fileUrl}`}>
                          <GoEye  className=" m-auto text-lg text-blue-600 dark:text-blue-500 hover:text-purple-500 dark:hover:text-purple-500 transition-all duration-300 "  role="button" />
                        </a>
                    </button>
                    <button onClick={() => DownloadRepositoryFile(items.fileUrl)} data-tip="Download file"  className={` tooltip tooltip-left w-fit h-fit bg-transparent `} >
                            <MdOutlineFileDownload   className=" m-auto text-lg text-blue-600 dark:text-blue-500 hover:text-purple-500 dark:hover:text-purple-500  transition-all duration-300 "  role="button" />
                    </button>

                    <button onClick={() => RequestDeleteRepositoryFileFunc(items.id,items.name)} data-tip="Delete file"  className={` tooltip tooltip-left w-fit h-fit bg-transparent `} >
                        <BsTrash3   className=" m-auto text-lg text-rose-600 dark:text-rose-500 hover:text-pink-500 dark:hover:text-pink-500  transition-all duration-300 "  role="button" />
                    </button>                    
                </td>
            </tr>
        )
    })
    const MapfollowersList = NetworkContainer.followersList.map((items,i) => {
        
        return (
            <div key={i} onClick={() => OpenUserProfile(items.userID)} className=" flex flex-row justify-between rounded-md border-[1px] dark:border-slate-600 p-1 w-fit mx-auto min-w-[180px] sm:min-w-[200px] min-h-fit h-[80px] max-h-[80px] ">
                <img loading="lazy"
                    className="mask w-14  mask-squircle"
                    src={`${import.meta.env.VITE_APP_API_URL}${items.ProfilePic}`} 
                />
                <div className="flex flex-col h-full bg-transparent min-h-full pt-2 w-full pl-2 justify-around" >
                    <p data-tip='Open Profile' className=" tooltip tooltip-bottom mb-auto hover:underline cursor-pointer hover:underline-offset-4 w-fit text-ellipsis max-w-[90%] " >{items.name}</p>
                    <TimeNetworkUpdater dateString={items.followedDate} />
                </div>
            </div>
        )
    })
    const MapfollowingList = NetworkContainer.followingList.map((items,i) => {

        return (
            <div key={i} onClick={() => OpenUserProfile(items.userID)} className=" flex flex-row justify-between rounded-md border-[1px] dark:border-slate-600 p-1 w-fit mx-auto min-w-[180px] sm:min-w-[200px] min-h-fit h-[80px] max-h-[80px] ">
                <img loading="lazy"
                    className="mask w-14  mask-squircle"
                    src={`${import.meta.env.VITE_APP_API_URL}${items.ProfilePic}`} 
                />
                <div className="flex flex-col h-full bg-transparent min-h-full w-full pt-2  pl-2 justify-around" >
                    <p data-tip='Open Profile' className=" tooltip tooltip-bottom mb-auto hover:underline cursor-pointer hover:underline-offset-4 w-fit text-ellipsis max-w-[90%] " >{items.name}</p>
                    <TimeNetworkUpdater dateString={items.followedDate} />
                </div>
            </div>
        )
    })
    const downloadFile = async (fileUrl) => {
        const response = await fetch(fileUrl, {
          method: 'GET',
          headers: {
            "x-CSRFToken": `${Cookies.get('Inject')}`,
            "Cookie": `Inject=${Cookies.get('Inject')}`
            // Add any headers if required, e.g., Authorization
          },
        });
      
        if (!response.ok) {
          
            toast('An error occured when downloading', {
                type: 'error',
                theme: Theme,
                position: 'top-right'
            })
            throw new Error('Network response was not ok');
        }
      
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileUrl.split('/').pop(); // Extract the file name from the URL
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url); // Clean up the URL object
        toast('Successfully Downloaded', {
            type: 'success',
            theme: Theme,
            position: 'top-right'
        })
    };
      
    function DownloadRepositoryFile (fileUrl) {
        var link = `${import.meta.env.VITE_APP_API_URL}/media${fileUrl}`;
        downloadFile(link)
        
    }
   
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
                toast('SignUp to manage account',{
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
    function ClearPostFilter(props) {
        if (props) {
            setValue('filterPrivacy','all')
            setValue('filterYear',date.getFullYear())
            SetIsFiltering(false)
        }
    }
    function ToogleProfileFilter (propsval) {
        if (propsval) {
            SetIsFiltering(true)
            TooglePostFilter('toongle')
        }
    }
   
    const folderNameChange = (event) => {
        const {value} = event.target 
        SetfolderName(value)
    }
    
    const FolderFilterChange = (event) => {
        const {value} = event.target 
        SetfolderNameFilter(value)
        SetfileNameFilter(value)
        if(value == ''){
            SetIsFilteringFolders(false)
            SetIsFilteringFiles(false)
        }else{
            SetIsFilteringFolders(true)
            SetIsFilteringFiles(true)
        }
    }
    function CreateFolderFunc (propsval) {
        if(propsval && UserEmail != 'gestuser@gmail.com') {
            SetIsAddingFolder(false)
            requestWsStream('RequestAddFolder')
        }else if (propsval && UserEmail == 'gestuser@gmail.com'){
            toast('SignUp to manage account',{
                position : 'top-right',
                type : 'warning',
                theme : Theme
            })
        }
    }
    function ClickUploadRepository (props) {
        if(props){
            RepositoryUploadFile.current.click()
        }
    }
    const formatFileSize = (size) => {
        const units = ["bytes", "KB", "MB", "GB", "TB"];
        let unitIndex = 0;
      
        while (size >= 1024 && unitIndex < units.length - 1) {
          size /= 1024;
          unitIndex++;
        }
      
        return `${size.toFixed(2)} ${units[unitIndex]}`;
    };
      
    const ToogleRepositoryUpload = (props) => {
        var File =  RepositoryUploadFile.current.files[0] ?  RepositoryUploadFile.current.files[0] : props
        if(File ){
            const maxSize = 50 * 1024 * 1024; // 50MB in bytes for file size limit
            var Types = String(File.type).split('/')
            if (File.size > maxSize) {
                toast('File to large, upload file up to 50mb ',{
                    position : 'top-right',
                    theme: Theme,
                    type : 'warning'
                })
                RepositoryUploadFile.current.value = ''
                SetShowUploadFilePreview(false)
              return
            }else {
                const render = new FileReader()
                var sizeval = formatFileSize(File.size)
                render.onload = function (e) {
                        SetUpload({
                            filename : File.name,
                            file : File,
                            size : sizeval,
                            type : Types[0]
                        })
                    }                        
                render.readAsDataURL(File) 
                SetShowUploadFilePreview(true)
            }
              

                       
        }       
    }
    function UploadRepositoryFile (propsval){
        if (propsval && Upload.file != null && UserEmail != 'gestuser@gmail.com') {    
            const formData = new FormData();
            formData.append('file',Upload.file);
            formData.append('scope','UploadRepositoryFile')
            formData.append('email',UserEmail)
            formData.append('size',Upload.size)
            formData.append('name',Upload.filename)
            formData.append('folderId',ActiveFolder)
            formData.append('fileType',Upload.type)
            toast('Uploading, please wait',{
                position : 'top-right',
                theme: Theme,
                type : 'info'
            })
            dispatch({type : INTERCEPTER})
            props.UploadProfileFile(formData)
            SetShowUploadFilePreview(false)
        }else if (UserEmail == 'gestuser@gmail.com'){
            toast('SignUp to manage account',{
                position : 'top-right',
                type : 'warning',
                theme : Theme
            })
        }
    }
    function RepositoryNavigator (propsval) {
        if(propsval == 'folder'){
            SetSelectedRepository('folder')
            SetFileList([])
        }
    }
    function ToogleFollowAccount (propsval){
        if(propsval != null && UserEmail != 'gestuser@gmail.com'){
            var IsOwner = db == null ? false : UserEmail == ProfileAccount.AccountEmail ? true :false
            var data = {
                'scope' : 'FollowAccount',
                'UserEmail' : UserEmail,
                'AccountID' : ProfileAccount.AccountID,
                'UserID' : UserID,
                'action' : propsval,
                'IsOwner' : IsOwner
            }
            props.FetchUserProfile(JSON.stringify([data]))
        }else if(UserEmail == 'gestuser@gmail.com'){
            toast('SignUp to manage account',{
                position : 'top-right',
                type : 'warning',
                theme : Theme
            })
        }
    }
    function ToogleNetworkFilter (propsval){
        if(propsval != null){
            SetNetworkContainer((e) => {
                return {
                    ...e,
                    'scope' : propsval
                }
            })
        }
    }
    const PostContentChange = (value) => {
        SetProfilePostUpload((e) => {
            return  {
                ...e,
                'PostContent' : value
            }
        })
    }
    const ToogleAboutSectionContent = (section,value) => {
        if(section != null) {
            setValue(section,value)
            //console.log('value:',section,getValues(section))
        }
    }
    const ReadProfileAbout =(section,ignore,replace) => {
        if(section != null) {
            var data = getValues(section)
            var response = data != ignore ? data : replace
            return response
        }
    }
    const HandleCoverPhotoError = (event) => {
        console.log('error am called')
        SetProfileCoverPhoto(`${import.meta.env.VITE_WS_API}/media/media unavailable ${Theme}.jpg`)
    }
    const HandleProfilePhotoError = (event) => {
        SetProfilePicturePhoto(`${import.meta.env.VITE_WS_API}/media/media unavailable ${Theme}.jpg`)
    }
    function ToongleSelectedProfileNav(props) {
        if(props != null) {
            SetSelectedProfileNav(props)
            if(props != 'Network'){
                SetNetworkContainer((e) => {
                    return {
                        ...e,
                        'followersList' : [],
                        'followingList' : [],
                        'scope' : 'followers'
                    }
                })
            }
            if (props != 'SavedPost'){
                var postremeinder = SavedProfilePost.splice(0,2) //clearing posts to save memory - keeping only 2 posts
                SetSavedProfilePost(postremeinder)
                dispatch ({
                    type : SavedProfilePostReducer,
                    payload : postremeinder
                })
            }
            if (props != 'Post'){
                var postremeinder = ProfilePost.splice(0,2) //clearing posts to save memory - keeping only 2 posts
                SetProfilePost(postremeinder)
                dispatch ({
                    type : ProfilePostReducer,
                    payload : postremeinder
                })
            }
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
    function ToongleAccountManager (propsval) {
        if(propsval == 'show'){
            SetDeleteAccount((e) => {
                return {
                    ...e,
                    'show' : true
                }
            })
            setValue('password','')
        }else if(propsval == 'hide'){
            SetDeleteAccount((e) => {
                return {
                    ...e,
                    'show' : false
                }
            })
            setValue('password','')
        }else if(propsval == 'delete'){
            var pass = getValues('password')
            props.delete_user(UserEmail,pass)
            setValue('password','')
        }
    }
    return (
        <div className={` h-full w-full min-w-full relative max-w-[100%] flex flex-col justify-start `} >
            {/* cover container */}
            <div   id="CoverPhotoDis" className=" avatar flex bg-slate-800 w-full md:w-[98%] md:mt-3 md:mx-auto md:rounded-lg h-[200px] min-h-[200px] sm:h-[300px] sm:min-h-[300px] lg:h-[300px] lg:min-h-[300px] bg-cover bg-no-repeat lg:bg-center bg-center" >
                <div onClick={() =>OpenImage(ProfileCoverPhoto,'image')} className="w-full cursor-pointer md:rounded-lg h-full absolute">
                    <img loading="lazy" src={ProfileCoverPhoto} onError={HandleCoverPhotoError} />
                </div>
                <input ref={UploaderCoverPhoto} onChange={ToogleCoverPhotoUpload} className=" hidden" accept="image/*" type="file" />
                {/* <button onClick={()=>ClickCoverPhotoInputTag('click')} data-tip="Edit Cover Photo"   className=" tooltip ml-auto md:flex hidden mt-auto mb-2 mr-2 rounded-sm py-2 px-4 text-sm hover:text-base font-[PoppinsN] text-slate-300 border-[1px] hover:text-slate-50 dark:hover:text-slate-100 transition-all duration-300 cursor-pointer z-30 bg-slate-600 dark:bg-slate-400 dark:text-slate-900 lg:font-semibold border-sky-500" >Change Cover Photo</button> */}
                <FaCamera onClick={()=>ClickCoverPhotoInputTag('click')} data-tip="Edit Cover Photo" className={` ${ProfileAccount.IsOwner ? ' ' : 'hidden'} tooltip ml-auto text-slate-300 flex mt-auto mb-2 mr-2 rounded-sm text-2xl dark:text-slate-400 hover:text-slate-50 dark:hover:text-slate-50 z-30 transition-all duration-300 cursor-pointer `} title="Change cover photo" />

            </div>
            {/*media galary displayer */}
            <div className={` ${MediaGallary.show ? 'fixed flex flex-row' : 'hidden'}  z-40 w-full bg-transparent dark:bg-slate-800 bg-slate-300 bg-opacity-30 dark:bg-opacity-30 `} >
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

            {/* username, profile picture,followers,following container */}
            <div className="z-30 bg-transparent dark:text-slate-50 lg:pt-2 lg:pl-4 align-middle text-slate-950 transition-all duration-300 w-full -translate-y-16 lg:translate-y-0 lg:flex-row h-fit flex flex-col gap-0 " >
                <img loading="lazy" onClick={() =>OpenImage(ProfilePicturePhoto,'image')}               
                    className="mask mask-decagon overflow-hidden cursor-pointer mx-auto lg:ml-0 mt-auto h-32 xs:h-36"
                    src={ProfilePicturePhoto} 
                    onError={HandleProfilePhotoError}
                />   
                <input ref={UploadProfilePicture} onChange={ToogleProfilePictureUpload} className=" hidden" accept="image/*" type="file" />
                <FaCamera onClick={()=> ClickProfilePictureInputTag('click')} data-tip="Change profile picture" className={` ${ProfileAccount.IsOwner ? ' ' : 'hidden'} tooltip cursor-pointer text-slate-600 mx-auto dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 z-30 transition-all duration-30 lg:translate-y-32 lg:-translate-x-12 lg:text-2xl -translate-y-4 translate-x-10 `} title="Change cover photo" />

                <div className=" flex flex-col w-full gap-4 -translate-y-3 lg:translate-y-0 transition-all duration-300 lg:ml-2  lg:my-auto" >
                    <div className=" w-full h-fit min-w-full flex flex-row lg:ml-0 lg:justify-start  gap-4 justify-center" >
                        <big className= {` ${!EditUsernameAccount ? 'flex' : 'hidden'} font-semibold text-2xl lg:text-4xl ml-4 my-auto lg:ml-0 pt-2 w-fit xs:text-3xl `} >{ProfileAccount.AccountName}</big>
                        <input {...register('UserName',{required : false})}  className= {` ${EditUsernameAccount ? 'flex' : 'hidden'} text-2xl lg:text-4xl ml-4 lg:ml-0 bg-transparent border-none rounded-sm text-ellipsis w-[200px] xs:text-3xl `} placeholder="Username" type="text" />
                        {/* <MdEdit onChange={OnChangeUsername} onClick={() => SetEditUsernameAccount(true)}   title="Edit username" className={`tooltip ${!EditUsernameAccount ? 'hidden' : 'hidden'} cursor-pointer mt-auto sm:text-lg text-slate-600  dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 z-30 transition-all duration-30  lg:text-2xl `} /> */}
                        <Lottie onClick={() => SetEditUsernameAccount(true)}  lottieRef={EditIconRef} onMouseEnter={() => EditIconRef.current.play()}   onMouseLeave={() => EditIconRef.current.stop()} className={` tooltip ${!EditUsernameAccount && ProfileAccount.IsOwner ? 'flex' : 'hidden'} h-14 cursor-pointer transition-all bg-transparent  duration-300  `}  animationData={Theme == 'light' ?EditIconLight : EditIcondark} loop={false} />
                        
                        <MdOutlineAdd  onClick={() => SetEditUsernameAccount(false)}   title="Cancel changes" className={`tooltip ${EditUsernameAccount ? 'flex' : 'hidden'} rotate-45 cursor-pointer sm:text-lg mt-auto text-slate-600  dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 z-30 transition-all duration-30  lg:text-2xl `} />
                        <TiTickOutline onClick={() => SubmitUsername('submit')}   title="Submit changes" className={`tooltip ${EditUsernameAccount ? 'flex' : 'hidden'} cursor-pointer sm:text-lg mt-auto text-slate-600  dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 z-30 transition-all duration-30  lg:text-2xl `} />
                    </div>
                   
                    <div className=" flex lg:text-lg flex-col sm:flex-row lg:flex-col xl:flex-row justify-start sm:justify-around lg:max-w-[90%] md:mx-auto lg:ml-0 flex-wrap w-full h-fit" >
                        
                        <div className=" flex lg:mr-auto text-sm xs:text-base w-full sm:w-[40%]   md:gap-4 justify-around flex-row " >
                            <span className=" m-auto lg:ml-0  flex flex-row justify-start gap-3 text-slate-600 font-semibold dark:text-slate-400 w-fit" >followers: <p className=" dark:text-slate-50 text-slate-950" > {ProfileAccount.followers}</p> </span>
                            <span className={` m-auto lg:ml-0 flex flex-row justify-start gap-3 text-slate-600 font-semibold dark:text-slate-400 w-fit`} >following: <p className=" dark:text-slate-50 text-slate-950" >{ProfileAccount.following}</p> </span>
                    
                        </div>
                        <div className={` ${ProfileAccount.IsOwner ? 'flex' : 'hidden'}   text-sm py-4 sm:py-0 lg:ml-auto xl:mx-auto  xs:text-base w-full sm:w-[40%]  md:gap-4 justify-around flex-row `}   >
                            <button onClick={()=> SetIsEditingProfile(true)} data-tip="Edit Profile"    className={`  ${IsEditingProfile ? 'hidden' : 'flex '} tooltip    rounded-sm py-2 px-4 text-sm font-[PoppinsN] text-slate-950 border-[1px] hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 bg-transparent bg-opacity-35 hover:bg-sky-700 transition-all duration-500 dark:text-slate-300 my-auto  border-sky-500 `}>Edit Profile</button>
                            <button onClick={()=> SetIsEditingProfile(false)} data-tip="Edit Profile"   className={`  ${IsEditingProfile ? 'flex ' : 'hidden'} tooltip    rounded-sm py-2 px-4 text-sm font-[PoppinsN] text-slate-950 border-[1px] hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 bg-transparent bg-opacity-35 hover:bg-sky-700 transition-all duration-500 dark:text-slate-300 my-auto  border-sky-500 `}>View Profile</button>

                            {/* <button data-tip="button" className=" tooltip    rounded-sm py-2 px-4 text-sm font-[PoppinsN] text-slate-950 border-[1px] hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 bg-transparent bg-opacity-35 hover:bg-sky-700 transition-all duration-500 dark:text-slate-300 my-auto  border-sky-500"  >Button</button> */}
                        </div>
                        <div className={` ${!ProfileAccount.IsOwner && db != null ? 'flex' : 'hidden'}   text-sm py-4 sm:py-0 lg:ml-auto xl:mx-auto  xs:text-base w-full sm:w-[40%]  md:gap-4 justify-around flex-row `}   >
                            <button onClick={() => OpenUserProfile(UserID)} data-tip='Home' className={`my-auto tooltip tooltip-top text-slate-600 hover:text-slate-900 dark:hover:text-slate-100 transition-all font-semibold dark:text-slate-400 `} ><HiOutlineHome className=" text-xl cursor-pointer " /></button>
                            <button  data-tip="Follow account" onClick={() => ToogleFollowAccount('follow')}    className={` ${ProfileAccount.IsFollowing == false ? 'flex  ' : 'hidden'} tooltip  tooltip-bottom   rounded-sm py-2 px-4 text-sm font-[PoppinsN] text-slate-950 border-[1px] hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 bg-transparent bg-opacity-35 hover:bg-sky-700 transition-all duration-500 dark:text-slate-300 my-auto  border-sky-500 `}>Follow</button>
                            <button data-tip="Unfollow account" onClick={() => ToogleFollowAccount('unfollow')}   className={`  ${ProfileAccount.IsFollowing == true ? 'flex  ' : 'hidden'} tooltip  tooltip-bottom   rounded-sm py-2 px-4 text-sm font-[PoppinsN] text-slate-950 border-[1px] hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 bg-transparent bg-opacity-35 hover:bg-sky-700 transition-all duration-500 dark:text-slate-300 my-auto  border-sky-500 `}>Unfollow</button>
                            {/* <button data-tip="button" className=" tooltip    rounded-sm py-2 px-4 text-sm font-[PoppinsN] text-slate-950 border-[1px] hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 bg-transparent bg-opacity-35 hover:bg-sky-700 transition-all duration-500 dark:text-slate-300 my-auto  border-sky-500"  >Button</button> */}
                        </div>
                        
                    </div>
                    <hr className=" h-[1px] bg-slate-400 lg:hidden dark:bg-slate-700 border-none w-[95%] mx-auto " />
                </div>

            </div>

            {/* nav bar container */}
            <div className="z-30 w-[90%] mx-auto h-fit min-h-fit -translate-y-10 gap-4 lg:mt-4 lg:translate-y-0 transition-all duration-300 overflow-auto flex flex-row px-4 py-1 bg-transparent " >
           
                <button onClick={() => ToongleSelectedProfileNav('About')} className={` ${SelectedProfileNav == 'About' ? 'text-sky-400 dark:text-sky-500 bg-slate-700 ring-[2px] dark:bg-opacity-40' : 'dark:text-slate-100 text-slate-100'}  hover:text-lime-400 dark:hover:text-lime-400 dark:hover:ring-slate-600 transition-all duration-300 hover:ring-[2px] hover:ring-slate-600 font-sans font-semibold bg-slate-500 py-2 px-4 rounded-sm`} >About</button>
                <button onClick={() => ToongleSelectedProfileNav('Post')} className={` ${SelectedProfileNav == 'Post' ? 'text-sky-400 dark:text-sky-500 bg-slate-700 ring-[2px] dark:bg-opacity-40' : 'dark:text-slate-300 text-slate-100'}  hover:text-lime-400 dark:hover:text-lime-400 dark:hover:ring-slate-600 transition-all duration-300 hover:ring-[2px] hover:ring-slate-600 font-sans font-semibold bg-slate-500 py-2 px-4 rounded-sm  `} >Post</button>
                <button onClick={() => ToongleSelectedProfileNav('Repository')} className={`${SelectedProfileNav == 'Repository' ? 'text-sky-400 dark:text-sky-500 ring-[2px] bg-slate-700 dark:bg-opacity-40' : 'dark:text-slate-300 text-slate-100'} ${ProfileAccount.IsOwner ? '' : 'hidden'}  hover:text-lime-400 dark:hover:text-lime-400 dark:hover:ring-slate-600 transition-all duration-300 hover:ring-[2px] hover:ring-slate-600 font-sans font-semibold bg-slate-500 py-2 px-4 rounded-sm `} >Repository</button>
                <button onClick={() => ToongleSelectedProfileNav('SavedPost')} className={`${SelectedProfileNav == 'SavedPost' ? 'text-sky-400 dark:text-sky-500 ring-[2px] bg-slate-700 dark:bg-opacity-40' : 'dark:text-slate-300 text-slate-100'} ${ProfileAccount.IsOwner ? '' : 'hidden'} hover:text-lime-400 dark:hover:text-lime-400 dark:hover:ring-slate-600 transition-all duration-300 hover:ring-[2px] hover:ring-slate-600 font-sans font-semibold bg-slate-500 py-2 px-4 rounded-sm `} >Saved</button>
                <button onClick={() => ToongleSelectedProfileNav('Network')} className={` ${SelectedProfileNav == 'Network' ? 'text-sky-400 dark:text-sky-500 bg-slate-700 ring-[2px] dark:bg-opacity-40' : 'dark:text-slate-300 text-slate-100'}  hover:text-lime-400 dark:hover:text-lime-400 dark:hover:ring-slate-600 transition-all duration-300 hover:ring-[2px] hover:ring-slate-600 font-sans font-semibold bg-slate-500 py-2 px-4 rounded-sm  `} >Network</button>
                <button onClick={() => ToongleSelectedProfileNav('Account')} className={`${SelectedProfileNav == 'Account' ? 'text-sky-400 dark:text-sky-500 ring-[2px] bg-slate-700 dark:bg-opacity-40' : 'dark:text-slate-300 text-slate-100'} ${ProfileAccount.IsOwner ? '' : 'hidden'}  hover:text-lime-400 dark:hover:text-lime-400 dark:hover:ring-slate-600 transition-all duration-300 hover:ring-[2px] hover:ring-slate-600 font-sans font-semibold bg-slate-500 py-2 px-4 rounded-sm `} >Account</button>
            
            </div>

            {/* about section */}
            <div className=  {`z-30 pb-[150px] ${SelectedProfileNav == 'About' ?  'flex flex-col lg:flex-row' : 'hidden'}  md:mt-4 gap-2 h-fit justify-start overflow-y-auto min-h-fit bg-slate-400 dark:bg-slate-500 w-full px-2 `} >
                {/* selection tab */}
                <div className=" w-full flex flex-col border-b-[1px] lg:border-none lg:max-w-[400px] border-b-slate-600 gap-2 justify-start p-2" >
                    <button onClick={() => SetAboutMeSelectedTab('Overview')} className= {` ${AboutMeSelectedTab == 'Overview' ? ' text-sky-400 dark:text-slate-200 dark:bg-opacity-60 bg-slate-700  ' : 'bg-slate-600 dark:bg-slate-800 dark:text-slate-400 text-slate-950'} w-full text-left  rounded-md transition-all hover:text-slate-200 duration-300  p-2 font-semibold hover:bg-slate-700 `} >Overview</button>
                    <button onClick={() => SetAboutMeSelectedTab('Contact Information')} className= {` ${AboutMeSelectedTab == 'Contact Information' ? ' text-sky-400 dark:text-slate-200 dark:bg-opacity-60 bg-slate-700  ' : 'bg-slate-600 dark:bg-slate-800 dark:text-slate-400 text-slate-950'} w-full text-left  rounded-md transition-all hover:text-slate-200 duration-300  p-2 font-semibold hover:bg-slate-700 `} >Contact Information</button>
                </div>
                {/* selected overview tab info */}
                <div className={`${AboutMeSelectedTab == 'Overview' ? 'flex flex-col gap-2' : ' hidden'} text-slate-950  dark:text-slate-100 w-full h-fit p-2 `} >
                    <label className=" font-semibold dark:text-slate-300 text-sm" htmlFor="">Language</label>
                    <div className={` ${IsEditingProfile ? 'flex' : 'hidden'} dropdown dropdown-hover dropdown-bottom xs:max-w-xs mx-auto w-[90%]   `}>
                        <div tabIndex={'language'} role="button" className="btn m-1 w-full justify-between bg-slate-200 border-0 ring-1 dark:text-slate-200 text-slate-900 dark:bg-slate-700 group rounded-md transition-all duration-300 py-1 hover:bg-slate-200 hover:ring-transparent ring-transparent text-base font-normal ">
                            {ReadProfileAbout('language','Rather not Say','Select Language')} 
                            <FaAngleDown className=" group-hover:rotate-180 transition-all text-slate-600 dark:text-slate-500  duration-500" /> 
                        </div>
                        <ul tabIndex={'language'} className="dropdown-content z-40 font-[PoppinsN] border-[1px] border-slate-600 dark:border-slate-800 gap-0 dark:bg-slate-500 p-0 rounded-md  menu dark:text-slate-100 text-slate-950 bg-slate-200 w-full shadow">
                            <li onClick={() => ToogleAboutSectionContent('language','english')} className={` ${getValues('language') == 'english' ? ' bg-gray-400 dark:bg-gray-300 dark:text-slate-800' : ''} rounded-none hover:text-slate-900 hover:bg-sky-400 dark:hover:bg-sky-500 dark:hover:text-slate-100 focus:rounded-none `} ><p   >English</p></li>
                            <li onClick={() => ToogleAboutSectionContent('language','kiswahili')}  className={` ${getValues('language') == 'kiswahili' ? ' bg-gray-400 dark:bg-gray-300 dark:text-slate-800' : ''} hover:text-slate-900 hover:bg-sky-400 dark:hover:bg-sky-500 dark:hover:text-slate-100 `} ><p >Kiswahili</p></li>
                        </ul>
                    </div>
                    <label className= {` ${IsEditingProfile ? 'hidden' : 'flex flex-row  justify-start'} input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] border-none bg-transparent dark:bg-transparent flex items-center gap-10 `}>
                        <IoLanguage  className=" text-lg text-slate-800 dark:text-slate-800 " />
                        <p
                            className=' text-slate-200 text-center bg-transparent px-2 w-fit' 
                        >{ProfileDB ? ProfileDB.Overview.language : '' }
                        </p>
                    </label>
                    <label className=" font-semibold dark:text-slate-300 text-sm" htmlFor="">Gender</label>
                    <div className={` ${IsEditingProfile ? 'flex' : 'hidden'} dropdown dropdown-hover dropdown-bottom xs:max-w-xs mx-auto w-[90%]  `}>
                        <div tabIndex={'gender'} role="button" className="btn m-1 w-full justify-between bg-slate-200 border-0 ring-1 dark:text-slate-200 text-slate-900 dark:bg-slate-700 group rounded-md transition-all duration-300 py-1 hover:bg-slate-200 hover:ring-transparent ring-transparent text-base font-normal ">
                            {ReadProfileAbout('gender','Rather not Say','Select Gender')}
 
                            <FaAngleDown className=" group-hover:rotate-180 transition-all text-slate-600 dark:text-slate-500  duration-500" /> 
                        </div>
                        <ul tabIndex={'gender'} className="dropdown-content z-40 font-[PoppinsN] border-[1px] border-slate-600 dark:border-slate-800 gap-0 dark:bg-slate-500 p-0 rounded-md  menu dark:text-slate-100 text-slate-950 bg-slate-200 w-full shadow">
                            <li onClick={() => ToogleAboutSectionContent('gender','Male')} className={` ${getValues('gender') == 'Male' ? ' bg-gray-400 dark:bg-gray-300 dark:text-slate-800' : ''} rounded-none hover:text-slate-900 hover:bg-sky-400 dark:hover:bg-sky-500 dark:hover:text-slate-100 focus:rounded-none `} ><p   >Male</p></li>
                            <li onClick={() => ToogleAboutSectionContent('gender','Female')}  className={` ${getValues('gender') == 'Female' ? ' bg-gray-400 dark:bg-gray-300 dark:text-slate-800' : ''} hover:text-slate-900 hover:bg-sky-400 dark:hover:bg-sky-500 dark:hover:text-slate-100 `} ><p >Female</p></li>
                        </ul>
                    </div>
                    <label className= {` ${IsEditingProfile ? 'hidden' : 'flex flex-row  justify-start'} input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] border-none bg-transparent dark:bg-transparent flex items-center gap-10 `}>
                        <RxAvatar   className=" text-lg text-slate-800 dark:text-slate-800 " />
                        <p
                            className=' text-slate-200 text-center bg-transparent px-2 w-fit' 
                        >{ProfileDB ? ProfileDB.Overview.gender : '' }
                        </p>
                    </label>
                    <label className=" font-semibold dark:text-slate-300 text-sm" htmlFor="">Pronounciation</label>
                    <div className={` ${IsEditingProfile ? 'flex' : 'hidden'} dropdown dropdown-hover dropdown-bottom xs:max-w-xs mx-auto w-[90%]  `}>
                        <div tabIndex={'pronoun'} role="button" className="btn m-1 w-full justify-between bg-slate-200 border-0 ring-1 dark:text-slate-200 text-slate-900 dark:bg-slate-700 group rounded-md transition-all duration-300 py-1 hover:bg-slate-200 hover:ring-transparent ring-transparent text-base font-normal ">
                            {ReadProfileAbout('pronoun','Rather not Say','Select')}
                            <FaAngleDown className=" group-hover:rotate-180 transition-all text-slate-600 dark:text-slate-500  duration-500" /> 
                        </div>
                        <ul tabIndex={'pronoun'} className="dropdown-content z-40 font-[PoppinsN] border-[1px] border-slate-600 dark:border-slate-800 gap-0 dark:bg-slate-500 p-0 rounded-md  menu dark:text-slate-100 text-slate-950 bg-slate-200 w-full shadow">
                            <li onClick={() => ToogleAboutSectionContent('pronoun','he/him')} className={` ${getValues('pronoun') == 'he/him' ? ' bg-gray-400 dark:bg-gray-300 dark:text-slate-800' : ''} rounded-none hover:text-slate-900 hover:bg-sky-400 dark:hover:bg-sky-500 dark:hover:text-slate-100 focus:rounded-none `} ><p   >he/him</p></li>
                            <li onClick={() => ToogleAboutSectionContent('pronoun','she/her')}  className={` ${getValues('pronoun') == 'she/her' ? ' bg-gray-400 dark:bg-gray-300 dark:text-slate-800' : ''} hover:text-slate-900 hover:bg-sky-400 dark:hover:bg-sky-500 dark:hover:text-slate-100 `} ><p >she/her</p></li>
                            <li onClick={() => ToogleAboutSectionContent('pronoun','they/them')}  className={` ${getValues('pronoun') == 'they/them' ? ' bg-gray-400 dark:bg-gray-300 dark:text-slate-800' : ''} hover:text-slate-900 hover:bg-sky-400 dark:hover:bg-sky-500 dark:hover:text-slate-100 `} ><p >they/them</p></li>
 
                        </ul>
                    </div>
                    <label className= {` ${IsEditingProfile ? 'hidden' : 'flex flex-row  justify-start'} input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] border-none bg-transparent dark:bg-transparent flex items-center gap-10 `}>
                        <IoChatbubbleEllipsesOutline    className=" text-lg text-slate-800 dark:text-slate-800 " />
                        <p
                            className=' text-slate-200 text-center bg-transparent px-2 w-fit' 
                        >{ProfileDB ? ProfileDB.Overview.gender : '' }
                        </p>
                    </label>
                    <label className=" font-semibold dark:text-slate-300 text-sm" htmlFor="">Location</label>
                    <div className={` ${IsEditingProfile ? 'flex' : 'hidden'} dropdown dropdown-hover dropdown-bottom xs:max-w-xs mx-auto w-[90%]  `}>
                        <div tabIndex={'location'} role="button" className="btn m-1 w-full justify-between bg-slate-200 border-0 ring-1 dark:text-slate-200 text-slate-900 dark:bg-slate-700 group rounded-md transition-all duration-300 py-1 hover:bg-slate-200 hover:ring-transparent ring-transparent text-base font-normal ">
                            {ReadProfileAbout('location','Rather not Say','Select Location')}
                            <FaAngleDown className=" group-hover:rotate-180 transition-all text-slate-600 dark:text-slate-500  duration-500" /> 
                        </div>
                        <ul tabIndex={'location'} className="dropdown-content z-40 font-[PoppinsN] border-[1px] border-slate-600 dark:border-slate-800 gap-0 dark:bg-slate-500 p-0 rounded-md  menu dark:text-slate-100 text-slate-950 bg-slate-200 w-full shadow">
                            <li onClick={() => ToogleAboutSectionContent('location','Nairobi')} className={` ${getValues('location') == 'Nairobi' ? ' bg-gray-400 dark:bg-gray-300 dark:text-slate-800' : ''} rounded-none hover:text-slate-900 hover:bg-sky-400 dark:hover:bg-sky-500 dark:hover:text-slate-100 focus:rounded-none `} ><p   >Nairobi</p></li>
                            <li onClick={() => ToogleAboutSectionContent('location','Nakuru')}  className={` ${getValues('location') == 'Nakuru' ? ' bg-gray-400 dark:bg-gray-300 dark:text-slate-800' : ''} hover:text-slate-900 hover:bg-sky-400 dark:hover:bg-sky-500 dark:hover:text-slate-100 `} ><p >Nakuru</p></li>
                            <li onClick={() => ToogleAboutSectionContent('location','Mombasa')}  className={` ${getValues('location') == 'Mombasa' ? ' bg-gray-400 dark:bg-gray-300 dark:text-slate-800' : ''} hover:text-slate-900 hover:bg-sky-400 dark:hover:bg-sky-500 dark:hover:text-slate-100 `} ><p >Mombasa</p></li>
 
                        </ul>
                    </div>
                    <label className= {` ${IsEditingProfile ? 'hidden' : 'flex flex-row  justify-start'} input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] border-none bg-transparent dark:bg-transparent flex items-center gap-10 `}>
                        <IoLocationOutline className=" text-lg text-slate-800 dark:text-slate-800 " />
                        <p
                            className=' text-slate-200 text-center bg-transparent px-2 w-fit' 
                        >{ProfileDB ? ProfileDB.Overview.location : '' }
                        </p>
                    </label>
                    <button onClick={() => SaveProfile('Overview')} data-tip="Save Data" className= {` ${IsEditingProfile ? 'flex md:flex' : 'hidden'} tooltip  w-fit mx-auto bg-slate-500 dark:bg-slate-700  rounded-sm py-2 px-4 text-sm font-[PoppinsN] text-slate-950 border-[1px] hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-10 dark:hover:bg-sky-700 hover:bg-sky-700 transition-all duration-500 dark:text-slate-300 my-auto  border-sky-500 `}  >Save</button>

                </div>
                {/* selected contact informaiton tab info */}
                <div className={`${AboutMeSelectedTab == 'Contact Information' ? 'flex flex-col gap-2' : ' hidden'} text-slate-950 dark:text-slate-100 w-full h-fit p-2 `} >
                    <label className=" font-semibold dark:text-slate-300 text-sm" htmlFor="">Email</label>
                    <label className={` ${IsEditingProfile ? 'flex' : 'hidden'} input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] input-bordered border-[1px] border-slate-600 bg-slate-200 dark:bg-transparent flex items-center gap-2  `}>
                        <AiOutlineMail className=" text-lg text-slate-400 dark:text-slate-800 " />
                        <input id='email'
                            placeholder='example@gmail.com'
                            name="email"  {...register('email',{
                            required : false
                            })}
                            className='mx-auto text-slate-100 focus:outline-none ring-0 placeholder:dark:text-slate-300 placeholder:text-slate-500 bg-slate-200 dark:bg-slate-700  outline-1 outline-none   border-none placeholder:text-left placeholder:text-sm  border-slate-900  rounded-sm px-2 w-full' type="email"  
                        />
                    </label>
                    <label className= {` ${IsEditingProfile ? 'hidden' : 'flex flex-row  justify-start'} input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] border-none bg-transparent dark:bg-transparent flex items-center gap-10 `}>
                        <AiOutlineMail   className=" text-lg min-w-[20px] text-slate-800 dark:text-slate-800 " />
                        <p
                            className=' text-slate-200 text-sm xs:text-base  text-center bg-transparent px-2 w-fit' 
                        >{ProfileDB ? ProfileDB.Contact ?  ProfileDB.Contact.email : '' : '' }
                        </p>
                    </label>
                    <label className=" font-semibold dark:text-slate-300 text-sm" htmlFor="">Number</label>
                    <div className= {` ${IsEditingProfile ? 'flex' : 'hidden'} max-w-[80%] w-[80%] md:max-w-[500px] mx-auto  items-center `}>
                        <div className={` ${IsEditingProfile ? 'flex' : 'hidden'} dropdown dropdown-hover dropdown-bottom focus:outline-offset-0 focus:border-transparent  flex-shrink-0 min-w-[70px] z-10 inline-flex items-center py-0 px-0 text-[12px] xs:px-0 md:text-sm font-medium text-center text-gray-900 bg-transparent rounded-none focus:outline-transparent  dark:text-white dark:border-gray-600`}>
                            <div tabIndex={'countryCode'} role="button" className="btn m-1 w-full justify-between bg-slate-200 border-0 ring-1 dark:text-slate-200 text-slate-900 dark:bg-slate-700 group transition-all duration-300 hover:bg-slate-200 hover:ring-transparent ring-transparent text-base font-normal ">
                                {ReadProfileAbout('countryCode','','Select')}
                                <FaAngleDown className=" group-hover:rotate-180 transition-all text-slate-600 dark:text-slate-500  duration-500" /> 
                            </div>
                            <ul tabIndex={'countryCode'} className="dropdown-content z-40 font-[PoppinsN] border-[1px] border-slate-600 dark:border-slate-800 gap-0 dark:bg-slate-500 p-0 rounded-md  menu dark:text-slate-100 text-slate-950 bg-slate-200 w-full shadow">
                                <li onClick={() => ToogleAboutSectionContent('countryCode','+254')} className={` ${getValues('countryCode') == '+254' ? ' bg-gray-400 dark:bg-gray-300 dark:text-slate-800' : ''} rounded-none hover:text-slate-900 hover:bg-sky-400 dark:hover:bg-sky-500 dark:hover:text-slate-100 focus:rounded-none `} ><p>Kenya: +254</p></li>
                                <li onClick={() => ToogleAboutSectionContent('countryCode','+256')}  className={` ${getValues('countryCode') == '+256' ? ' bg-gray-400 dark:bg-gray-300 dark:text-slate-800' : ''} hover:text-slate-900 hover:bg-sky-400 dark:hover:bg-sky-500 dark:hover:text-slate-100 `} ><p >Uganda: +256</p></li>
                                <li onClick={() => ToogleAboutSectionContent('countryCode','+255')}  className={` ${getValues('countryCode') == '+255' ? ' bg-gray-400 dark:bg-gray-300 dark:text-slate-800' : ''} hover:text-slate-900 hover:bg-sky-400 dark:hover:bg-sky-500 dark:hover:text-slate-100 `} ><p >Tanzania: +255</p></li>
    
                            </ul>
                        </div>
                        <label htmlFor="phone-input" className="mb-2 text-sm font-medium text-gray-900 sr-only bg-transparent  dark:text-white">Phone number:</label>
                        <div className="relative  w-full">
                            <input  {...register('number',{
                                required : false
                                })}
                                type="phone" id="phone-input" className="block p-2.5 border-slate-900  w-full z-20 text-sm text-gray-900 bg-slate-200 focus:ring-2 ring-slate-200 hover:ring-slate-500 rounded-sm rounded-l-none outline-1  border-none  focus:ring-slate-300 dark:bg-slate-700 dark:ring-slate-400 dark:focus:ring-gray-500 outline-none  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white " placeholder="7000000000" required 
                            />
                        </div>
                    </div>
                    <label className= {` ${IsEditingProfile ? 'hidden' : 'flex flex-row  justify-start'} input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] border-none bg-transparent dark:bg-transparent flex items-center gap-10 `}>
                        <CiPhone     className=" text-xl text-slate-800 dark:text-slate-800 " />
                        <p
                            className=' text-slate-200 text-center bg-transparent px-2 w-fit' 
                        >{ProfileDB ? ProfileDB.Contact ? String(`${ProfileDB.Contact.countryCode}  ${ProfileDB.Contact.number}`) : '' : '' }
                        </p>
                    </label>
                    <label className=" font-semibold dark:text-slate-300 text-sm" htmlFor="">Messeger Id</label>
                    <label className= {`${IsEditingProfile ? 'flex' : 'hidden'} input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] input-bordered border-[1px] border-slate-600 bg-slate-200 dark:bg-transparent flex items-center gap-2 `} >
                        <HiMiniIdentification   className=" text-xl text-slate-400 dark:text-slate-800 " />
                        <input 
                            placeholder='messeger id'
                            name="text"  {...register('messeger-id',{
                            required : false
                            })}
                            className='mx-auto text-slate-100 focus:outline-none ring-0 placeholder:dark:text-slate-300 placeholder:text-slate-500 bg-slate-200 dark:bg-slate-700 outline-1 outline-none   border-none placeholder:text-left placeholder:text-sm  border-slate-900  rounded-sm px-2 w-full' type="email"  
                        />
                    </label>
                    <label className= {` ${IsEditingProfile ? 'hidden' : 'flex flex-row  justify-start'} input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] border-none bg-transparent dark:bg-transparent flex items-center gap-10 `}>
                        <PiIdentificationBadgeLight className=" text-xl text-slate-800 dark:text-slate-800 " />
                        <p
                            className=' text-slate-200 text-center bg-transparent px-2 w-fit' 
                        >{ProfileDB ? ProfileDB.Contact ? ProfileDB.Contact['messeger-id'] : '' : '' }
                        </p>
                    </label>
                    {/* social link input tags */}
                    <label className=" font-semibold dark:text-slate-300 text-sm" htmlFor="">Social link</label>
                    <label id="SocialLink-0" className= {`${IsEditingProfile ? 'flex' : 'hidden'} input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] input-bordered border-[1px] border-slate-600 bg-slate-200 dark:bg-transparent flex items-center gap-2 `}>
                        <IoLinkSharp    className=" text-xl text-slate-400 dark:text-slate-800 " />
                        <input 
                            placeholder='www.example.com'
                            name="url"  {...register('social-0',{
                            required : false
                            })}
                            className='mx-auto text-slate-100 focus:outline-none ring-0 placeholder:dark:text-slate-300 placeholder:text-slate-500 bg-slate-200 dark:bg-slate-700 outline-1 outline-none   border-none placeholder:text-left placeholder:text-sm  border-slate-900  rounded-sm px-2 w-full' type="email"  />
                    </label>
                    <label id="SocialLink-1" className= {` ${SocialLinkCount >= 1 && IsEditingProfile == true ? 'flex' : 'hidden'} input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] input-bordered border-[1px] border-slate-600 bg-slate-200 dark:bg-transparent flex items-center gap-2 `}>
                        <IoLinkSharp    className=" text-xl text-slate-400 dark:text-slate-800 " />
                        <input
                            placeholder='www.example.com'
                            name="url"  {...register('social-1',{
                            required : false
                            })}
                            className='mx-auto text-slate-100 focus:outline-none ring-0 placeholder:dark:text-slate-300 placeholder:text-slate-500 bg-slate-200 dark:bg-slate-700 outline-1 outline-none   border-none placeholder:text-left placeholder:text-sm  border-slate-900  rounded-sm px-2 w-full' type="email"  />
                    </label>
                    <label id="SocialLink-2" className= {` ${SocialLinkCount >= 2 && IsEditingProfile == true ? 'flex' : 'hidden'} input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] input-bordered border-[1px] border-slate-600 bg-slate-200 dark:bg-transparent flex items-center gap-2 `}>
                        <IoLinkSharp    className=" text-xl text-slate-400 dark:text-slate-800 " />
                        <input
                            placeholder='www.example.com'
                            name="url"  {...register('social-2',{
                            required : false
                            })}
                            className='mx-auto text-slate-100 focus:outline-none ring-0 placeholder:dark:text-slate-300 placeholder:text-slate-500 bg-slate-200 dark:bg-slate-700 outline-1 outline-none   border-none placeholder:text-left placeholder:text-sm  border-slate-900  rounded-sm px-2 w-full' type="email"  />
                    </label>
                    <label id="SocialLink-3" className= {` ${SocialLinkCount >= 3 && IsEditingProfile == true ? 'flex' : 'hidden'} input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] input-bordered border-[1px] border-slate-600 bg-slate-200 dark:bg-transparent flex items-center gap-2 `}>
                        <IoLinkSharp    className=" text-xl text-slate-400 dark:text-slate-800 " />
                        <input
                            placeholder='www.example.com'
                            name="url"  {...register('social-3',{
                            required : false
                            })}
                            className='mx-auto text-slate-100 focus:outline-none ring-0 placeholder:dark:text-slate-300 placeholder:text-slate-500 bg-slate-200 dark:bg-slate-700 outline-1 outline-none   border-none placeholder:text-left placeholder:text-sm  border-slate-900  rounded-sm px-2 w-full' type="email"  />
                    </label>
                    <label id="SocialLink-4" className= {` ${SocialLinkCount >= 4 && IsEditingProfile == true ? 'flex' : 'hidden'} input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] input-bordered border-[1px] border-slate-600 bg-slate-200 dark:bg-transparent flex items-center gap-2 `}>
                        <IoLinkSharp    className=" text-xl text-slate-400 dark:text-slate-800 " />
                        <input
                            placeholder='www.example.com'
                            name="url"  {...register('social-4',{
                            required : false
                            })}
                            className='mx-auto text-slate-100 focus:outline-none ring-0 placeholder:dark:text-slate-300 placeholder:text-slate-500 bg-slate-200 dark:bg-slate-700 outline-1 outline-none   border-none placeholder:text-left placeholder:text-sm  border-slate-900  rounded-sm px-2 w-full' type="email"  />
                    </label>
                    {/* social link display tags */}
                    
                    <label className= {` ${IsEditingProfile == true || Showlink1 == false ? 'hidden' : 'flex flex-row  justify-start'} input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] border-none bg-transparent dark:bg-transparent flex items-center gap-10 `}>
                        <LuLink2 className=" text-xl text-slate-800 dark:text-slate-800 " />
                        <p
                            className=' text-slate-200 text-center bg-transparent px-2 w-fit' 
                        >{ProfileDB ? ProfileDB.Contact ? ProfileDB.Contact['socialLink-0'] : '' : '' }
                        </p>
                    </label>
                    <label className= {` ${IsEditingProfile == true || Showlink2 == false ? 'hidden' : 'flex flex-row  justify-start'} input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] border-none bg-transparent dark:bg-transparent flex items-center gap-10 `}>
                        <LuLink2 className=" text-xl text-slate-800 dark:text-slate-800 " />
                        <p
                            className=' text-slate-200 text-center bg-transparent px-2 w-fit' 
                        >{ProfileDB ? ProfileDB.Contact ? ProfileDB.Contact['socialLink-1'] : '' : '' }
                        </p>
                    </label>
                    <label className= {` ${IsEditingProfile == true || Showlink3 == false? 'hidden' : 'flex flex-row  justify-start'} input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] border-none bg-transparent dark:bg-transparent flex items-center gap-10 `}>
                        <LuLink2 className=" text-xl text-slate-800 dark:text-slate-800 " />
                        <p
                            className=' text-slate-200 text-center bg-transparent px-2 w-fit' 
                        >{ProfileDB ? ProfileDB.Contact ? ProfileDB.Contact['socialLink-2'] : '' : '' }
                        </p>
                    </label>
                    <label className= {` ${IsEditingProfile == true || Showlink4 == false ? 'hidden' : 'flex flex-row  justify-start'} input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] border-none bg-transparent dark:bg-transparent flex items-center gap-10 `}>
                        <LuLink2 className=" text-xl text-slate-400 dark:text-slate-800 " />
                        <p
                            className=' text-slate-200 text-center bg-transparent px-2 w-fit' 
                        >{ProfileDB ? ProfileDB.Contact ? ProfileDB.Contact['socialLink-3'] : '' : '' }
                        </p>
                    </label>
                    <label className= {` ${IsEditingProfile == true || Showlink5 == false ? 'hidden' : 'flex flex-row  justify-start'} input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] border-none bg-transparent dark:bg-transparent flex items-center gap-10 `}>
                        <LuLink2 className=" text-xl text-slate-400 dark:text-slate-800 " />
                        <p
                            className=' text-slate-200 text-center bg-transparent px-2 w-fit' 
                        >{ProfileDB ? ProfileDB.Contact ? ProfileDB.Contact['socialLink-4'] : '' : '' }
                        </p>
                    </label>
                    <MdOutlineAddLink onClick={() => ToogleSocialLink('Add')} className={`  ${SocialLinkCount == 4 || IsEditingProfile == false ? 'hidden' : 'flex'} text-2xl w-fit ml-auto mr-2 xs:mr-8  cursor-pointer text-amber-400 dark:text-yellow-400 transition-all duration-300 hover:text-sky-200 dark:hover:text-sky-400 `} />
                    <PiLinkSimpleHorizontalLight  onClick={() => ToogleSocialLink('remove')} className={`  ${SocialLinkCount >= 1 && IsEditingProfile == true ? 'flex' : 'hidden'} text-2xl w-fit ml-auto mr-2 xs:mr-8  cursor-pointer text-rose-600 dark:text-red-400 transition-all duration-300 hover:text-sky-200 dark:hover:text-sky-400 `} />
                    <button onClick={() => SaveProfile('Contact')} data-tip="Save Data" className= {` ${IsEditingProfile ? 'flex  md:flex' : 'hidden'} tooltip w-fit mx-auto bg-slate-500 dark:bg-slate-700  rounded-sm py-2 px-4 text-sm font-[PoppinsN] text-slate-950 border-[1px] hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 dark:hover:bg-sky-700 hover:bg-sky-700 transition-all duration-500 dark:text-slate-300 my-auto  border-sky-500 `}  >Save</button>

                </div>
            </div>

            {/* Post section */}
            <div className=  {`z-30 ${SelectedProfileNav == 'Post' ?  'flex flex-col lg:flex-row' : 'hidden'}   sticky top-0 md:mt-4 gap-2 h-fit justify-start overflow-y-auto min-h-fit bg-slate-400 dark:bg-slate-500 w-full px-2 `} >
                {/* selection tab */}
                <button onClick={() => SetIsPosting(true)} data-tip="Add Post"  className={` ${!IsPosting && ProfileAccount.IsOwner ? 'flex lg:absolute ' : 'hidden'} tooltip tooltip-left  w-10 min-w-12 h-10 border-[1px] mr-3 ml-auto mt-3 rounded-md border-slate-200 dark:border-slate-600 bg-transparent `} >
                    <IoIosAddCircleOutline className=" my-auto text-xl mx-auto hover:text-slate-200 text-slate-900 transition-all duration-300 "  role="button" />
                </button>

                {/* posting container */}
                <div className={` ${IsPosting ? 'flex flex-col' : 'hidden'} w-[90%] my-4 rounded-md min-h-[350px] max-w-[600px] mx-auto h-fit border-[1px] border-slate-600 dark:border-slate-400 `} >
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
                    <div className={`  my-auto ${PostingSteps == 2 ? 'flex flex-col' : 'hidden'} p-4 `} >
                        <label className=" font-semibold dark:text-slate-300 text-slate-700  text-sm" htmlFor="postTitle">Post Content</label>
                        {/* <textarea placeholder="details neccessary" {...register('postContent',{required : false})} className=" text-slate-200 textarea placeholder:text-slate-300 bg-transparent border-[1px] border-slate-500 dark:border-slate-700 rounded-md  "  name="postContent" id="postContent"></textarea> */}
                        <ReactQuill
                            placeholder="details neccessary" 
                            className=" overflow-auto max-h-[500px] text-slate-200 textarea placeholder:text-slate-300 bg-transparent border-[1px] border-slate-500 dark:border-slate-700 rounded-md  "  
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
                        <span className={` ${ProfilePostUpload.file != null ? 'inline' : 'hidden'} text-center mt-3 text-slate-300 dark:text-slate-300 w-fit break-all mx-auto `} > <p className=" inline text-sm text-slate-200 dark:text-slate-800 " >{ProfilePostUpload.Name}</p> Uploaded {ProfilePostUpload.type} file</span>
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
                        <label className= {` ${IsEditingProfile ? 'hidden' : 'flex flex-row  justify-start'} input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 max-w-[500px] border-none bg-transparent dark:bg-transparent flex items-center gap-10 `}>
                            <MdOutlinePrivacyTip className=" text-2xl text-slate-800 dark:text-slate-800 " />
                            <p
                                className=' text-slate-200 text-center bg-transparent px-2 w-fit' 
                            >{getValues('postPrivacy')}
                            </p>
                        </label>
                        <label className=" font-semibold dark:text-slate-300 text-slate-700  text-sm" htmlFor="postTitle">Post Preview</label>
                        {/* post prview */}
                        <div className={` flex flex-col border-[1px] text-slate-950 dark:text-slate-100 border-slate-600 dark:border-slate-400 justify-start h-fit w-[95%] mx-auto sm:w-[90%] max-w-[600px] rounded-md pt-2 `} >
                            {/*post header container */}
                            <div className=" px-4 pb-2 w-full border-b-[1px] border-slate-600 dark:border-slate-400 h-fit min-h-[60px] flex flex-row justify-around " >
                                <div className="avatar my-auto">
                                    <div className="w-14 h-14 rounded-full">
                                        <img loading="lazy" src={ProfilePicturePhoto} />
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
                                    <div className={` ${ProfilePostUpload.type == 'image' ? '' : 'hidden'} m-auto w-full min-w-full h-fit`} >
                                        <img loading="lazy"
                                            className={`${ ProfilePostUpload.type != 'image' ? 'hidden' : 'flex m-auto max-h-[500px] mask-square'} `}
                                            src={ProfilePostUpload.src} 
                                        />
                                    </div>
                                    <div className={` ${ProfilePostUpload.type == 'video' ? '' : 'hidden'} m-auto w-full min-w-full h-fit`} >
                                        <video 
                                        loading="lazy" src={ProfilePostUpload.src} 
                                        className={` ${ ProfilePostUpload.type != 'video' ? 'hidden' : 'flex'} w-full m-auto h-fit p-0 border-none  `} width="320" height="240" controls>
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                    
                                    {/* <span className={` ${ProfilePostUpload.PostContent != '' ? 'flex' : 'hidden' } ${ ProfilePostUpload.type != 'video' ? '-translate-y-2' : ' translate-y-0'}  h-fit bg-slate-400 text-slate-950 dark:bg-slate-800 dark:text-slate-300 dark:bg-opacity-50 bg-opacity-50 p-2 rounded-sm w-full `} >{ProfilePostUpload.PostContent}</span> */}
                                    <ReactQuill
                                        placeholder="details neccessary" 
                                        className={`overflow-auto max-h-[500px] ${ProfilePostUpload.PostContent != '' ? 'flex' : 'hidden' } ${ ProfilePostUpload.type != 'video' ? '-translate-y-2' : ' translate-y-0'}  h-fit bg-slate-400 text-slate-950 dark:bg-slate-800 dark:text-slate-300 dark:bg-opacity-50 mt-2 bg-opacity-50 p-2 rounded-sm w-full min-w-full `}
                                        name="postContent" 
                                        id="postContent"
                                        value={ProfilePostUpload.PostContent}
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
                        <button onClick={()=> StepsFunc('back')}  data-tip="Back" className= {`tooltip  w-fit mx-auto bg-transparent  rounded-sm py-2 px-4 text-sm font-[PoppinsN] text-slate-950 dark:hover:border-transparent hover:border-transparent border-[1px] hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 dark:hover:bg-sky-700 hover:bg-sky-700 transition-all duration-500 dark:text-slate-300 my-auto border-slate-100  dark:border-purple-400 `}  >Back</button>
                        <button onClick={()=> StepsFunc('next')}  data-tip="Next" className= {`tooltip  w-fit mx-auto bg-transparent  rounded-sm py-2 px-4 text-sm font-[PoppinsN] text-slate-950 dark:hover:border-transparent hover:border-transparent border-[1px] hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 dark:hover:bg-sky-700 hover:bg-sky-700 transition-all duration-500 dark:text-slate-300 my-auto  border-slate-100  dark:border-purple-400`}  >{PostingSteps == 4 ? 'Upload' : 'Next'} </button>
                    </div>        
                </div>
                {/* filter container */}
                <div className= {` ${!IsPosting ? 'flex flex-col' : 'hidden'}  w-full lg:max-w-[300px]  border-b-[1px] dark:text-slate-100 text-slate-950 lg:border-none  border-b-slate-600 gap-2 justify-start p-2 `}  >
                    <div className=" w-full flex flex-row mt-8 justify-around" >
                        <h1 className=" mx-auto font-semibold text-lg xs:text-xl text-center " >Filters</h1>
                        
                    </div>
                    
                    <div className=" w-full max-w-[400px] mx-auto flex flex-row justify-around" >
                        <span className=" font-semibold dark:text-slate-200 my-auto" >Go to:</span>
                        <SlCalender   className=" my-auto text-lg mr-auto ml-2 text-slate-800 dark:text-slate-800 " />
                        
                        <div className={` dropdown dropdown-hover dropdown-bottom w-fit xs:min-w-[200px] max-w-xs   ml-auto `}>
                            <div tabIndex={'filterYear'} role="button" className="btn m-1 w-full justify-between bg-slate-200 border-0 ring-1 dark:text-slate-200 text-slate-900 dark:bg-slate-700 group rounded-md transition-all duration-300 py-1 hover:bg-slate-200 hover:ring-transparent ring-transparent text-base font-normal ">
                                {ReadProfileAbout('filterYear','','Year')} 
                                <FaAngleDown className=" group-hover:rotate-180 transition-all text-slate-600 dark:text-slate-500  duration-500" /> 
                            </div>
                            <ul tabIndex={'filterYear'} className="dropdown-content z-40 font-[PoppinsN] border-[1px] border-slate-600 dark:border-slate-800 gap-0 dark:bg-slate-500 p-0 rounded-md  menu dark:text-slate-100 text-slate-950 bg-slate-200 w-full shadow">
                                <li onClick={() => ToogleAboutSectionContent('filterYear','2024')} className={` ${getValues('filterYear') == '2024' ? ' bg-gray-400 dark:bg-gray-300 dark:text-slate-800' : ''} rounded-none hover:text-slate-900 hover:bg-sky-400 dark:hover:bg-sky-500 dark:hover:text-slate-100 focus:rounded-none `} ><p>2024</p></li>
                                <li onClick={() => ToogleAboutSectionContent('filterYear','2023')}  className={` ${getValues('filterYear') == '2023' ? ' bg-gray-400 dark:bg-gray-300 dark:text-slate-800' : ''} hover:text-slate-900 hover:bg-sky-400 dark:hover:bg-sky-500 dark:hover:text-slate-100 `} ><p >2023</p></li>
                                <li onClick={() => ToogleAboutSectionContent('filterYear','2022')}  className={` ${getValues('filterYear') == '2022' ? ' bg-gray-400 dark:bg-gray-300 dark:text-slate-800' : ''} hover:text-slate-900 hover:bg-sky-400 dark:hover:bg-sky-500 dark:hover:text-slate-100 `} ><p >2022</p></li>
                            </ul>
                        </div>
                    </div>
                    <div className={`  ${ProfileAccount.IsOwner ? 'flex flex-row justify-around' : 'hidden'} w-full max-w-[400px] mx-auto `} >
                        <span className=" font-semibold dark:text-slate-200 my-auto" >Privacy:</span>
                        <MdOutlinePrivacyTip    className=" my-auto text-lg mr-auto ml-2 text-slate-800 dark:text-slate-800 " />
                        
                        <div className={` dropdown dropdown-hover dropdown-bottom w-fit xs:min-w-[200px] max-w-xs   ml-auto `}>
                            <div tabIndex={'filterPrivacy'} role="button" className="btn m-1 w-full justify-between bg-slate-200 border-0 ring-1 dark:text-slate-200 text-slate-900 dark:bg-slate-700 group rounded-md transition-all duration-300 py-1 hover:bg-slate-200 hover:ring-transparent ring-transparent text-base font-normal ">
                            {getValues('filterPrivacy')} 
                                <FaAngleDown className=" group-hover:rotate-180 transition-all text-slate-600 dark:text-slate-500  duration-500" /> 
                            </div>
                            <ul tabIndex={'filterPrivacy'} className="dropdown-content z-40 font-[PoppinsN] border-[1px] border-slate-600 dark:border-slate-800 gap-0 dark:bg-slate-500 p-0 rounded-md  menu dark:text-slate-100 text-slate-950 bg-slate-200 w-full shadow">
                                <li onClick={() => ToogleAboutSectionContent('filterPrivacy','all')} className={` ${getValues('filterPrivacy') == 'all' ? ' bg-gray-400 dark:bg-gray-300 dark:text-slate-800' : ''} rounded-none hover:text-slate-900 hover:bg-sky-400 dark:hover:bg-sky-500 dark:hover:text-slate-100 focus:rounded-none `} ><p>All</p></li>
                                <li onClick={() => ToogleAboutSectionContent('filterPrivacy','public')}  className={` ${getValues('filterPrivacy') == 'public' ? ' bg-gray-400 dark:bg-gray-300 dark:text-slate-800' : ''} hover:text-slate-900 hover:bg-sky-400 dark:hover:bg-sky-500 dark:hover:text-slate-100 `} ><p >Public</p></li>
                                <li onClick={() => ToogleAboutSectionContent('filterPrivacy','private')}  className={` ${getValues('filterPrivacy') == 'private' ? ' bg-gray-400 dark:bg-gray-300 dark:text-slate-800' : ''} hover:text-slate-900 hover:bg-sky-400 dark:hover:bg-sky-500 dark:hover:text-slate-100 `} ><p >Private</p></li>
                            </ul>
                        </div>
                    </div>
                    <div className=" w-full max-w-[400px] mx-auto flex flex-row justify-around" >
                        <button onClick={() => ClearPostFilter('filter')}  data-tip="Clear filters" className= {`tooltip  w-fit mx-auto bg-transparent  rounded-sm py-2 px-4 text-sm font-[PoppinsN] text-slate-950 dark:hover:border-transparent hover:border-transparent border-[1px] hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 dark:hover:bg-sky-700 hover:bg-sky-700 transition-all duration-500 dark:text-slate-300 my-auto border-slate-100  dark:border-purple-400 `}  >Clear</button>
                        <button onClick={() => ToogleProfileFilter('filter')}  data-tip="Trigger filters" className= {`tooltip  w-fit mx-auto bg-transparent  rounded-sm py-2 px-4 text-sm font-[PoppinsN] text-slate-950 dark:hover:border-transparent hover:border-transparent border-[1px] hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 dark:hover:bg-sky-700 hover:bg-sky-700 transition-all duration-500 dark:text-slate-300 my-auto  border-slate-100  dark:border-purple-400`}  >Done</button>
                    </div>
                </div>
                {/* post card map container */}
                <div className={`flex flex-col justify-start text-slate-950  dark:text-slate-100 w-full max-h-[90vh] sm:max-h-screen  overflow-y-auto h-fit p-2 `} >
                    {/* post container */}
                    <div ref={ProfilePostContainer} className={` ${ProfilePost[0] ? 'flex flex-col' : 'hidden'} scroll-smooth  gap-4 justify-start text-slate-950  dark:text-slate-100 w-full max-h-[90vh] sm:max-h-screen  overflow-y-auto h-fit p-2 `}  >
                        {MapPosts} 
                    </div>
                    
                    <div className= {` ${!ProfilePost[0] || PostContainerIsEmpty == true   ? 'card' : 'hidden'}  mx-auto bg-base-100 image-full w-[90%] max-w-[700px] shadow-xl `}>
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
                    <button onClick={()=>FetchMoreProfilePosts('fetch')} className={` ${ProfilePost[0] ? 'flex' : 'hidden'} my-3 w-fit mx-auto border-[1px] rounded-sm bg-slate-600 border-sky-400 hover:shadow-lg text-slate-100  hover:shadow-sky-400 transition-all duration-300 py-2 px-4  `} >More</button>
                    
                </div>
                
            </div>

            {/* saved post section */}
            <div className=  {`z-30 ${SelectedProfileNav == 'SavedPost'  && ProfileAccount.IsOwner == true  ?  'flex flex-col lg:flex-row' : 'hidden'}   sticky top-0 md:mt-4 gap-2 h-fit justify-start overflow-y-auto min-h-fit bg-slate-400 dark:bg-slate-500 w-full px-2 `} >
                {/* saved post card map container */}
                <div className={`flex flex-col justify-start text-slate-950  dark:text-slate-100 w-full max-h-[90vh] sm:max-h-screen  overflow-y-auto h-fit p-2 `} >
                    {/* saveed post container */}
                    <div className={` ${SavedProfilePost[0] ? 'flex flex-col lg:flex-wrap lg:flex-row ' : 'hidden'} scroll-smooth  gap-4 justify-start text-slate-950  dark:text-slate-100 w-full max-h-[90vh] sm:max-h-screen  overflow-y-auto h-fit p-2 `}  >
                        {MapSavedPosts} 
                    </div>
                    
                    <div className= {` ${!SavedProfilePost[0] || PostContainerIsEmpty == true   ? 'card' : 'hidden'}  mx-auto bg-base-100 image-full w-[90%] max-w-[700px] shadow-xl `}>
                        <figure className=" opacity-100 "  >
                            <img loading="lazy"
                            className=" opacity-100"
                            src={ProfilePicturePhoto}
                            alt="Shoes" />
                        </figure>
                        <div className="card-body align-middle">
                            <h1 className=" font-[button] text-2xl m-auto " >No Saved posts</h1>
                            
                        </div>
                    </div>                    
                    
                </div>
                
            </div>

            {/* repository section  */}
            <div className=  {`z-30 ${SelectedProfileNav == 'Repository' && ProfileAccount.IsOwner == true   ?  'flex flex-col lg:flex-row' : 'hidden'}   sticky top-0 md:mt-4 gap-2 h-full justify-start overflow-y-auto min-h-fit bg-slate-400 dark:bg-slate-500 w-full px-2 `} >
                {/* selection tab */}
                <button onClick={() => SetIsAddingFolder(true)} data-tip="Add Folder"  className={` ${!IsAddingFolder && SelectedRepository != 'file' ? 'flex ' : 'hidden'} tooltip tooltip-left w-10 min-w-12 h-10 border-[1px] mr-3 ml-auto mt-3 rounded-md border-slate-200 dark:border-slate-600 bg-transparent `} >
                    <IoIosAddCircleOutline className=" my-auto text-xl mx-auto hover:text-slate-200 text-slate-900 transition-all duration-300 "  role="button" />
                </button>

                {/* adding folder container */}
                <div className={` ${IsAddingFolder ? 'flex flex-col' : 'hidden'} w-[90%] my-4 rounded-md min-h-[350px] max-w-[600px] mx-auto h-fit border-[1px] border-slate-600 dark:border-slate-400 `} >
                    <MdOutlineAdd onClick={() => SetIsAddingFolder(false)} className=" text-xl ml-auto mr-4 mt-3 rotate-45 cursor-pointer hover:text-rose-300 text-slate-900 transition-all duration-300 "  />
                    <h1 className=" mx-auto text-slate-100 font-semibold text-base " >Fill in the input bellow</h1>        
                    {/* first step */}
                    <div className={`  my-auto flex flex-col p-4 `} >
                        <label className=" font-semibold dark:text-slate-300 text-sm" htmlFor="Folder Name">Folder Name</label>
                        <label className="input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] border-[1px] border-slate-600 bg-transparent dark:bg-transparent flex items-center gap-10">
                            <FaRegFolderOpen   className=" text-2xl text-slate-800 dark:text-slate-800" />
                            <input id='Folder Name' 
                            onChange={folderNameChange}
                            name="Folder Name"  className='mx-auto text-slate-100 focus:outline-none ring-0 max-h-[35px] placeholder:text-slate-300 bg-slate-100 bg-opacity-20 outline-1 outline-none   border-none placeholder:text-left border-slate-900  rounded-sm px-2 w-full'  placeholder="my folder name" type="text"  />
                        </label>
                        {errors.postTitle && <p className=" my-2 max-w-[600px] bg-slate-600 p-1 mt-3 text-rose-400 font-semibold mx-auto text-center w-[80%] rounded-sm text-sm sm:text-base" >{errors.postTitle?.message}</p>}

                    </div>
                    
                    {/* back,next steps */}
                    <div className=" w-full mt-auto mb-3 max-w-[400px] mx-auto flex flex-row justify-around" >
                        <button onClick={() => SetIsAddingFolder(false)}  data-tip="Cancel" className= {`tooltip  w-fit mx-auto bg-transparent  rounded-sm py-2 px-4 text-sm font-[PoppinsN] text-slate-950 dark:hover:border-transparent hover:border-transparent border-[1px] hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 dark:hover:bg-sky-700 hover:bg-sky-700 transition-all duration-500 dark:text-slate-300 my-auto border-slate-100  dark:border-purple-400 `}  >Cancel</button>
                        <button onClick={()=> CreateFolderFunc('create')} disabled={folderName == '' ? true : false}  data-tip="Next" className= {`tooltip  w-fit mx-auto bg-transparent  rounded-sm py-2 px-4 text-sm font-[PoppinsN] text-slate-950 disabled:opacity-15 disabled:cursor-not-allowed dark:hover:border-transparent hover:border-transparent border-[1px] hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 dark:hover:bg-sky-700 hover:bg-sky-700 transition-all duration-500 dark:text-slate-300 my-auto  border-slate-100  dark:border-purple-400`}  >Create</button>
                    </div>        
                </div>
                {/* filter folder container */}
                <div className= {` ${!IsAddingFolder ? 'flex flex-col' : 'hidden'}  w-full lg:max-w-[300px]  border-b-[1px] dark:text-slate-100 text-slate-950 lg:border-none  border-b-slate-600 gap-2 justify-start p-2 `}  >
                    <label className="input input-bordered bg-transparent  transition-all duration-300 border-slate-200 dark:border-slate-700 mx-auto w-full max-w-sm flex items-center gap-2">
                        <input type="text" value={folderNameFilter} onChange={FolderFilterChange} className="grow border-none outline-none transition-all duration-300 rounded-md  " placeholder="Search" />
                        <BsSearch
                            className="h-4 w-4 cursor-pointer hover:opacity-100 focus:opacity-100 opacity-70"
                        />  
                    </label>
                </div>
                {/* repository folder card map container */}
                <div className={` ${SelectedRepository == 'folder' ? 'flex flex-col justify-start' : 'hidden'} text-slate-950  dark:text-slate-100 w-full max-h-[90vh] sm:max-h-screen  overflow-y-auto h-fit p-2 `} >
                    {/* post container */}
                    <div ref={FolderListContainer} className={` ${FolderList[0] ? 'flex flex-row flex-wrap' : 'hidden'} scroll-smooth  gap-4 justify-around text-slate-950  dark:text-slate-100 w-full max-h-[90vh] sm:max-h-screen  overflow-y-auto h-fit p-2 `}  >
                        {MapFolderList}
                    </div>
                    
                    <div className= {` ${!FolderList[0] ? 'card' : 'hidden'}  mx-auto bg-base-100 image-full w-[90%] max-w-[700px] shadow-xl `}>
                        <figure className=" opacity-100 "  >
                            <img loading="lazy"
                            className=" opacity-100"
                            src={ProfilePicturePhoto}
                            alt="Shoes" />
                        </figure>
                        <div className="card-body align-middle">
                            <h1 className=" font-[button] text-2xl m-auto " >No folders</h1>                            
                        </div>
                    </div>                   
                    
                </div>
                {/*repository file map container  */}
                <div className={` ${SelectedRepository == 'file' ? 'flex flex-col justify-start' : 'hidden'} text-slate-950  dark:text-slate-100 w-full max-h-[90vh] sm:max-h-screen  overflow-y-auto h-fit p-2 `} >
                    
                    <div className= {` ${ShowUploadFilePreview == false ? 'flex flex-row':'hidden'} sticky left-0 justify-around w-full `} >
                            <button onClick={() => RepositoryNavigator('folder')} className=" py-2 px-4 rounded-sm text-sm mb-3 border-[1px] border-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300 dark:border-slate-600 " >Back</button>
                            <input onChange={ToogleRepositoryUpload} ref={RepositoryUploadFile} className=" hidden"  type="file" />
                            <button onClick={() => ClickUploadRepository('click')} data-tip="Upload file"  className={` tooltip tooltip-left w-10 min-w-14 h-10 border-[1px] rounded-md border-slate-200 dark:border-slate-600 bg-transparent `} >
                                <FaFileUpload className=" my-auto text-xl mx-auto text-slate-200 transition-all duration-300 "  role="button" />
                            </button>
                    </div>
                    {/* file upload review */}
                    <div className={`  ${SelectedRepository == 'file' && ShowUploadFilePreview == true ?'flex flex-row flex-wrap': 'hidden'} scroll-smooth gap-1 justify-around border-[1px] text-slate-950 border-slate-200 dark:border-slate-600  dark:text-slate-100 w-full max-w-sm mx-auto my-2 max-h-[90vh] sm:max-h-screen  overflow-y-auto h-fit p-2 `} >
                        <h1 className=" mx-auto text-slate-100 font-semibold text-base " >File Review</h1>        

                        <div className={`  my-auto flex flex-col p-4 `} >
                            <label className=" font-semibold dark:text-slate-300 text-sm" htmlFor="File Name">File Name</label>
                            <label className="input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] border-[1px] border-slate-600 bg-transparent dark:bg-transparent flex items-center gap-10">
                                <FaFileUpload   className=" text-2xl text-slate-800 dark:text-slate-800" />
                                <input id='File Name' 
                                value={Upload.filename}
                                name="File Name"  className='mx-auto text-slate-100 focus:outline-none ring-0 max-h-[35px] placeholder:text-slate-300 bg-slate-100 bg-opacity-20 outline-1 outline-none   border-none placeholder:text-left border-slate-900  rounded-sm px-2 w-full'  placeholder="my folder name" type="text"  />
                            </label>
                            <label className=" font-semibold dark:text-slate-300 text-sm" htmlFor="File size">File size</label>
                            <label className="input max-h-[40px] w-[80%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] border-[1px] border-slate-600 bg-transparent dark:bg-transparent flex items-center gap-10">
                                <SlSizeActual    className=" text-2xl text-slate-800 dark:text-slate-800" />
                                <input id='File size' 
                                value={Upload.size}
                                name="File size"  className='mx-auto text-slate-100 focus:outline-none ring-0 max-h-[35px] placeholder:text-slate-300 bg-slate-100 bg-opacity-20 outline-1 outline-none   border-none placeholder:text-left border-slate-900  rounded-sm px-2 w-full'  placeholder="my folder name" type="text"  />
                            </label>
                        </div>                        
                        {/* back,next steps */}
                        <div className=" w-full mt-auto mb-3 max-w-[400px] mx-auto flex flex-row justify-around" >
                            <button onClick={() => SetShowUploadFilePreview(false)}  data-tip="Cancel" className= {`tooltip  w-fit mx-auto bg-transparent  rounded-sm py-2 px-4 text-sm font-[PoppinsN] text-slate-950 dark:hover:border-transparent hover:border-transparent border-[1px] hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 dark:hover:bg-sky-700 hover:bg-sky-700 transition-all duration-500 dark:text-slate-300 my-auto border-slate-100  dark:border-purple-400 `}  >Cancel</button>
                            <button onClick={()=> UploadRepositoryFile('upload')} disabled={RepositoryUploadFile.current == null ? true : false}  data-tip="Next" className= {`tooltip  w-fit mx-auto bg-transparent  rounded-sm py-2 px-4 text-sm font-[PoppinsN] text-slate-950 disabled:opacity-15 disabled:cursor-not-allowed dark:hover:border-transparent hover:border-transparent border-[1px] hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 dark:hover:bg-sky-700 hover:bg-sky-700 transition-all duration-500 dark:text-slate-300 my-auto  border-slate-100  dark:border-purple-400`}  >Upload</button>
                        </div> 
                    </div>
                    {/* file map container */}
                    <div ref={FileListContainer} className= {`${FileList[0] ? 'flex ' : 'hidden'} mx-auto relative rounded-md overflow-auto shadow-md w-[90%] min-w-[600px] max-h-[90vh] `}>
                        <table className="text-sm table-auto text-left rtl:text-right w-full min-w-full  text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 rounded-md dark:bg-gray-800 dark:text-gray-300">
                                <tr>
                                    <th scope="col" className="px-2 py-3">File Name</th>
                                    <th scope="col" className="px-2 py-3">Date Crated</th>
                                    <th scope="col" className="px-2 py-3">Size</th>
                                    <th scope="col" className="px-2 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MapFileList}
                            </tbody>
                            <tfoot className="text-xs text-gray-700 uppercase bg-gray-50 rounded-md dark:bg-gray-800 dark:text-gray-300" >
                                <tr>
                                    <th scope="col" className="px-2 py-3">File Name</th>
                                    <th scope="col" className="px-2 py-3">Date Crated</th>
                                    <th scope="col" className="px-2 py-3">Size</th>
                                    <th scope="col" className="px-2 py-3">Action</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>                       
                    {/* no file available card */}
                    <div className= {` ${!FileList[0] ? 'card' : 'hidden'}  mx-auto bg-base-100 image-full w-[90%] max-w-[700px] shadow-xl `}>
                        <figure className=" opacity-100 "  >
                            <img loading="lazy"
                            className=" opacity-100"
                            src={ProfilePicturePhoto}
                            alt="Shoes" />
                        </figure>
                        <div className="card-body align-middle">
                            <h1 className=" font-[button] text-2xl m-auto " >No files</h1>                            
                        </div>
                    </div> 
                </div>

                
            </div>
            {/* Network section */}
            <div className=  {`z-30 ${SelectedProfileNav == 'Network' ?  'flex flex-col lg:flex-row' : 'hidden'}   sticky top-0 md:mt-4 gap-2 h-full md:min-h-fit max-h-[90vh] justify-start overflow-y-auto bg-slate-400 dark:bg-slate-500 w-full px-2 `} >

                {/* filter container */}
                <div className= {` flex flex-col w-full lg:max-w-[250px]  border-b-[1px] dark:text-slate-100 text-slate-950 lg:border-none  border-b-slate-600 gap-2 justify-start p-2 `}  >
                    <div className=" w-full flex flex-row mt-8 justify-around" >
                        <h1 className=" mx-auto font-semibold text-lg xs:text-2xl text-center " >Network</h1>
                    </div>                  
                    <div className=" w-full max-w-[400px] mx-auto flex flex-row justify-around" >
                        <button onClick={() => ToogleNetworkFilter('followers')} className={` ${NetworkContainer.scope == 'followers' ? ' opacity-100 underline underline-offset-4 text-green-600 dark:text-sky-400 ' : 'opacity-50 hover:opacity-80 '} `}  >Followers</button>
                        <button onClick={() => ToogleNetworkFilter('following')}  className={` ${NetworkContainer.scope == 'following' ? ' opacity-100 underline underline-offset-4 text-green-600 dark:text-sky-400 ' : 'opacity-50 hover:opacity-80 '} `}  >following</button>
                    </div>
                </div>
                <div className={`flex flex-col justify-start text-slate-950  dark:text-slate-100 w-full max-h-[90vh] sm:max-h-screen  overflow-y-auto h-full p-2 `} >
                    {/* followers list container */}
                    <div ref={followersContainer} onScroll={()=> ScrollingNetworkContainer('followers')} className={` ${NetworkContainer.followersList[0] && NetworkContainer.scope == 'followers'  ? 'flex flex-row' : 'hidden'} flex-wrap scroll-smooth  gap-4 justify-start text-slate-950  dark:text-slate-100 w-full max-h-[90vh] sm:max-h-screen  overflow-y-auto overflow-x-hidden h-fit p-2 `}  >
                        {MapfollowersList} 
                    </div>
                    {/* following list container */}
                    <div ref={followingContainer} onScroll={()=> ScrollingNetworkContainer('following')} className={` ${NetworkContainer.followingList[0] && NetworkContainer.scope == 'following'  ? 'flex flex-row' : 'hidden'} flex-wrap scroll-smooth  gap-4 justify-start text-slate-950  dark:text-slate-100 w-full max-h-[90vh] sm:max-h-screen  overflow-y-auto overflow-x-hidden h-fit p-2 `}  >
                        {MapfollowingList} 
                    </div>
                    {/* no list to display card */}
                    <div className= {` ${ !NetworkContainer.followersList[0] && NetworkContainer.scope == 'followers'    ? 'card' : !NetworkContainer.followingList[0] && NetworkContainer.scope == 'following'  ? 'card': 'hidden'}  mx-auto bg-base-100 image-full w-[90%] max-w-[700px] shadow-xl `}>
                        <figure className=" opacity-100 "  >
                            <img loading="lazy"
                            className=" opacity-100"
                            src={ProfilePicturePhoto}
                            alt="Shoes" />
                        </figure>
                        <div className="card-body align-middle">
                            <h1 className=" font-[button] text-2xl text-center m-auto " >{ProfileAccount.AccountName} list of {NetworkContainer.scope} is unavailable.</h1>
                            
                        </div>
                    </div>                    
                    
                </div>
                
            </div>
            {/* account section */}
            <div className=  {`z-30 pb-[150px] ${SelectedProfileNav == 'Account' ?  'flex flex-col lg:flex-row' : 'hidden'}  md:mt-4 gap-2 h-full md:min-h-fit max-h-[90vh] justify-start overflow-y-auto min-h-fit bg-slate-400 dark:bg-slate-500 w-full px-2 `} >
                {/* selection tab */}
                <div className=" w-full flex flex-col border-b-[1px] lg:border-none lg:max-w-[400px] border-b-slate-600 gap-2 justify-start p-2" >
                    <button onClick={() => SetAccountSelectedTab('Delete')} className= {` ${AccountSelectedTab == 'Delete' ? ' text-sky-400 dark:text-slate-200 dark:bg-opacity-60 bg-slate-700  ' : 'bg-slate-600 dark:bg-slate-800 dark:text-slate-400 text-slate-950'} w-full text-left  rounded-md transition-all hover:text-slate-200 duration-300  p-2 font-semibold hover:bg-slate-700 `} >Delete Account</button>
                </div>
                {/* selected overview tab info */}
                <div className={`${AccountSelectedTab == 'Delete' ? 'flex flex-col gap-2' : ' hidden'} pl-4 text-slate-950  dark:text-slate-100 w-full h-fit p-2 `} >
                    <p>Deleting your account will remove all of your data from our database. This cannot be reversed.</p>
                    <button onClick={() => ToongleAccountManager('show')} data-tip="Delete Account"   className={`  ${!DeleteAccount.show ? 'flex ' : 'hidden'} tooltip    rounded-sm py-2 px-4 text-sm w-fit  font-[PoppinsN] text-slate-950 border-[1px] hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 bg-transparent bg-opacity-30 hover:bg-red-500 transition-all duration-500 dark:text-slate-300 my-auto border-opacity-90  border-red-300 `}>Delete</button>
                    <div className={` ${DeleteAccount.show ? 'flex flex-col gap-2 justify-start ' : 'hidden'} w-full `} >
                        <div className=" flex flex-col gap-2 pl-2 w-[90%] max-w-[600px] mr-auto">
                            <big id="BigProppin" className=" text-red-300 ">Deleting Account</big>
                            <p >Input your account Password</p>
                            <label className="input max-h-[40px] w-[90%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] input-bordered border-[1px] border-slate-700 dark:border-slate-600 border-opacity-90  bg-transparent flex items-center gap-2">
                                <IoLockOpenOutline  className="text-lg text-rose-500  " />
                                <input {...register('password',{
                                        required : 'Password is required!',
                                        minLength : {
                                            value : 5,
                                            message :'Input more characters'
                                        }
                                    })}  id="password" className='outline-0  placeholder:text-slate-600 text-slate-900 dark:text-slate-100 dark:placeholder:text-slate-300 bg-slate-100 bg-opacity-20 outline-none  mx-auto  border-none placeholder:text-left  rounded-sm p- w-full'   placeholder="password" type="password" />
                            </label>
                            {errors.password && <p className=" my-2 max-w-[600px] bg-gray-800 text-red-500 text-left p-1 ml-4 bg-opacity-70 w-[80%] rounded-sm text-sm sm:text-base" >{errors.password?.message}</p>}
                    
                        </div>
                        <div className=" flex flex-col xs:flex-row w-full justify-around px-8">
                        <button onClick={() => ToongleAccountManager('hide')} data-tip="Cancel"   className={` tooltip    rounded-sm py-2 px-4 text-sm w-fit  font-[PoppinsN] text-slate-950 border-[1px] hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 bg-transparent bg-opacity-30 hover:bg-sky-500 transition-all duration-500 dark:text-slate-300 my-auto border-opacity-90  border-sky-300 `}>Back</button>
                        <button onClick={() => ToongleAccountManager('delete')} data-tip="Delete Account"   className={` tooltip    rounded-sm py-2 px-4 text-sm w-fit  font-[PoppinsN] text-slate-950 border-[1px] hover:text-slate-50 dark:hover:text-slate-50 cursor-pointer z-30 bg-transparent bg-opacity-30 hover:bg-red-500 transition-all duration-500 dark:text-slate-300 my-auto border-opacity-90  border-red-300 dark:border-red-400 `}>Confirm Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
   

};

const mapStateToProps =  state => ({
    isAuthenticated:state.auth.isAuthenticated,
    
})    
export default connect(mapStateToProps,{UpdateProfile,FetchUserProfile,UploadProfileFile,delete_user})(ProfileJSX)


