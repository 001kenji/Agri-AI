import React, { Profiler, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Navbar from "../Components/navbar";
import '../App.css'
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import { FaHandHoldingHeart } from "react-icons/fa";
import { connect, useDispatch } from "react-redux";
import { CheckAuthenticated, logout,FetchLogout, load_user } from "../actions/auth";
import {useSelector} from 'react-redux'
import { UploadFile} from '../actions/Chat.jsx'
import ReactQuill from 'react-quill';
import { CiLogout } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineQuestionMark } from "react-icons/md";
import { IoSunny } from "react-icons/io5";
import { BsMoonStarsFill } from "react-icons/bs";
import 'react-quill/dist/quill.snow.css';
import { Link, Navigate } from "react-router-dom";
import Cookies from 'js-cookie'
import DefaultImg from '../assets/images/fallback.jpeg'
//hashing using bcrypt for javascript only and not py
import { TiThMenuOutline } from "react-icons/ti";
import { MdOutlineLogout } from "react-icons/md";
import { MdLogin } from "react-icons/md";
import { PageToogleReducer, SelectedPageReducer, ShowLoginContainerReducer, ToogleTheme } from "../actions/types.jsx";
import Chat from "./chat.jsx";
import TTT_AI from './AI.jsx'
import TTI_AI from "./TTI.jsx";
import Login from "./login.jsx";
import Notifier from "../Components/notifier.jsx";
import ProfileJSX from './Profile.jsx'
import PostsJSX from './posts'
// using argon2 pashing for both javascript and py
//const argon2 = require('argon2');
const Home = (props, {logout,FetchLogout ,isAuthenticated,load_user,UploadFile,}) => {
    const { page, extrainfo } = useParams();
    const dispatch = useDispatch()
    const db = useSelector((state) => state.auth.user)
    const UserRefreshToken = useSelector((state) => state.auth.refresh)
    const [Upload,SetUpload] = useState({
        file : null,
        filename : ''
    })
    const navigate = useNavigate();
    const UploaderFile = useRef(null)
    const [Theme,SetTheme] = useState(useSelector((state)=> state.auth.Theme))
    const ShowLoginContainer = useSelector((state)=> state.auth.ShowLoginContainer)
    const User = useSelector((state)=> state.auth.user)
    const Email = User != null ? User.email : 'null'
    const UserID = User != null ? User.id : 'd5802e33-d46d-4bbb-bccb-32fe4f1446bc' // this is the id for gest user
    const [AiPageSelected,SetAiPageSelected] = useState('TextToText')
    const [Homeauthorized,setHomeauthorized] = useState(true)
    const [Page,SetPage] = useState('AI')
    const SelectedPage = useSelector((state) => state.ProfileReducer.SelectedPage)

    const [Profile,SetProfile] = useState({
        'edit' : false,
        'name' : User != null ? User.name : '',
        'email' : Email,
        'About' : User != null ? User.about : '',
        'ProfilePic' : User != null ? User.ProfilePic : DefaultImg,
        'File' : null,
        'ProfilePicName' : User != null ? User.ProfilePic : 'Profile Picture',
        
    })
     
    useLayoutEffect(() => {
        dispatch({
            type : PageToogleReducer,
            payload : page
        })
        if(SelectedPage != null){
            
            OpenProfilePage(SelectedPage)
        }else {
            SetPage(page)
            
        }
       
        
    },[SelectedPage])

    //console.log(profile)
    ///console.log(isAuthenticated)
    // if (isAuthenticated  && localStorage.getItem('access') == 'undefined') {
    //    ///console.log('your are not authenticated in the login sect', isAuthenticated)

    //     return <Navigate to="/login" replace />;
    // }
    useEffect(() => {
        if(User != null) {
            SetProfile((e) => {
                return {
                    ...e,
                    'ProfilePic' : User.ProfilePic
                }
            })
        }else {
            SetProfile((e) => {
                return {
                    ...e,
                    'ProfilePic' : `${import.meta.env.VITE_WS_API}/media/media unavailable ${Theme}.jpg`
                }
            })
        }
    },[User])
    
    useEffect(() => {
        if(UserRefreshToken){
            props.CheckAuthenticated();
            props.load_user();
            setHomeauthorized(true)
            
        }
        
    },[UserRefreshToken])
 
    function FuncToogleTheme (props) {
        if(props){
            SetTheme(props)
            dispatch({
                type : ToogleTheme,
                payload : props
            })
           
        }
    }
    function AutoSwitchTheme (props) {
        if(props) {
            var val = Theme != 'light' ? 'light' : 'dark'
            dispatch({
                type : ToogleTheme,
                payload : val
            })
            SetTheme(val)
        }
    }
    // if(localStorage.getItem('access') == null /*|| db == null*/) {
    // //console.log('not found')
    // logout;
    // return <Navigate to="/login" replace />;
    // }

    const Uploader = (props) => {
        var File =  UploaderFile.current.files[0] ?  UploaderFile.current.files[0] : props
        if(File ){
            var Types = String(File.type).split('/')  
            if(Types[0] == 'video') {
                const width = File.videoWidth;
                const height = File.videoHeight;
                const aspectRatio = width / height;
                var videoDis = document.getElementById('UploadedVideo')
                const render = new FileReader()
                render.onload = function (e) {
                        videoDis.src = e.target.result
                        SetUpload({
                            filename : File.name,
                            file : File
                        })
                    }                        
                render.readAsDataURL(File)   

            }            
        }       
    }
    function ToogleLogout () {
        var access  = localStorage.getItem('access')
        props.logout()
        props.FetchLogout(UserRefreshToken,access)
    } 
    function ShowLoginContainerFunc (propsval) {
        if(propsval) {
            dispatch({
                type : ShowLoginContainerReducer,
                payload : true
            })
        }
    }
    function OpenProfilePage (props){
        if (props != null ) {
            SetPage('profile')
            navigate(`/home/profile/${props}`)
            dispatch({
                type : SelectedPageReducer,
                payload : null
            })
        }
    }
    function TooglePages (props){
        dispatch({
            type : PageToogleReducer,
            payload : props
        })
        if (props != null && props == 'profile') {
            SetPage(props)
            navigate(`/home/${props}/${UserID}`)
        }if (props != null && props == 'AI') {
            SetPage(props)
            navigate(`/home/${props}/${UserID}`)
        }else if (props != null && props == 'post'){
            SetPage(props)
            navigate(`/home/${props}/`)
        }else if (props != null && props != 'profile'){
            SetPage(props)
            navigate(`/home/${props}/${UserID}`)
        }
    }
 
    return (
        <div className={`w-full drawer lg:drawer-open   md:h-screen h-full ${Theme} selection:bg-black selection:text-white selection:font-bold selection:p-1 dark:selection:bg-white  dark:selection:text-black `} >
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content bg-slate-300 z-40 dark:bg-slate-900 overflow-auto  flex flex-col">
                    <div className="navbar z-30 px-0 bg-slate-300 dark:bg-slate-900 border-b-[1px] border-b-slate-500 dark:border-b-slate-600 transition-all duration-300 text-slate-50  w-full">
                        <div className="flex-none pl-2 lg:hidden ">
                            <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <TiThMenuOutline 
                                className="inline-block h-5 w-5 text-slate-700 dark:text-slate-300 stroke-current"
                            />
                            
                            </label>
                        </div>
                        <div id="BigProppin" className="mx-2 flex-1 text-transparent bg-clip-text bg-gradient-to-br from-lime-700 dark:from-lime-400 to-sky-400 dark:to-sky-400 w-fit max-w-fit text-lg md:text-xl lg:text-2xl px-2">Agri-AI</div>
                        <div id="NavAnime" className=" h-[1px] w-full  fixed  mt-[64px] transition-all duration-500 opacity-50" ></div>
                    </div>
                    {/* Page content here */}
                    <div className="  bg-slate-300 z-40 dark:bg-slate-900 h-full min-h-screen w-full min-w-full " >
                         <Notifier />
                        <div className={` ${(db == null || db == 'null') && ShowLoginContainer ? 'block' : 'hidden'} h-fit w-fit absolute  z-50 ml-3 md:ml-8 md:translate-x-[50%] md:mt-8 lg:ml-[22%]  min-h-[300px] max-h-[500px] min-w-[300px] `} ><Login /></div>
                        {Page == 'AI' ? 
                            <div className=" h-full min-h-screen w-full min-w-full bg-transparent " >
                                <div className=" w-full min-w-full h-fit flex flex-row bg-transparent justify-start gap-4 px-3 " >
                                    <p onClick={()=> SetAiPageSelected('TextToText')} className={` ${AiPageSelected == 'TextToText' ? ' dark:text-lime-600 text-sky-600 shadow-sky-800 dark:shadow-lime-700 ' : 'text-slate-700  dark:text-slate-400 shadow-slate-500 dark:shadow-slate-500'} px-4 py-2 my-3 rounded-2xl text-sm text-center shadow-[0px_0px_8px_1px_rgba(0,0,0,0.25)]  hover:shadow-slate-900  transition-all duration-300 hover:dark:shadow-slate-400 cursor-pointer w-fit `}>Text to Text</p>
                                    <p onClick={()=> SetAiPageSelected('TextToImage')} className={` ${AiPageSelected == 'TextToImage' ? ' dark:text-lime-600 text-sky-600 shadow-sky-800 dark:shadow-lime-700 ' : 'text-slate-700  dark:text-slate-400 shadow-slate-500 dark:shadow-slate-500'} px-4 py-2 my-3 rounded-2xl text-sm text-center shadow-[0px_0px_8px_1px_rgba(0,0,0,0.25)]  hover:shadow-slate-900  transition-all duration-300 hover:dark:shadow-slate-400 cursor-pointer w-fit `}>Text to Image</p>
                                </div>
                                {
                                    AiPageSelected == 'TextToText' ? <TTT_AI className='z-30' />  : <TTI_AI className='z-30' />
                                }
                                
                            </div>
                            :
                        Page == 'messeger' ? 
                            <Chat  className='z-30' /> :
                        Page == 'profile' ? 
                            <ProfileJSX className='z-30' /> :
                        Page == 'post' ? 
                            <PostsJSX className='z-30' /> :
                            ''}
                    </div>
                </div>
                <div className="drawer-side z-50 lg:drawer-open lg:fixed ">
                    <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay transition-all duration-500"></label>
                    <ul className="menu bg-slate-300 text-slate-900 dark:text-slate-100 border-r-[1px] lg:max-w-[250px]  border-r-slate-500 dark:border-r-slate-600 min-h-full dark:bg-slate-900 font-[PoppinsN]  transition-all duration-500 w-80 p-4">
                        <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn lg:hidden btn-square btn-ghost">
                            <IoMdAdd  
                                className="inline-block rotate-45 transition-all duration-300 ml-auto h-5 w-full hover:text-rose-600 text-slate-900 dark:text-slate-300 stroke-current"
                            />
                            
                        </label>
                        {/* Sidebar content here */}
                        <li onClick={()=> TooglePages('AI')} className= {` ${Page == 'AI' ? ' text-sky-600 dark:text-lime-500' : ''} hover:pl-6  transition-all hover:text-slate-50  duration-300 cursor-pointer `} ><a className="hover:bg-slate-500 cursor-pointer dark:hover:bg-slate-600" >AI</a></li>
                        <li onClick={()=> TooglePages('market')} className={` ${Page == 'market' ? ' text-sky-600 dark:text-lime-500' : ''} hover:pl-6   transition-all hover:text-slate-50 duration-300  cursor-pointer  `}><a className="hover:bg-slate-500 cursor-pointer dark:hover:bg-slate-600" >Market</a></li>
                        <li onClick={()=> TooglePages('messeger')} className={` ${Page == 'messeger' ? ' text-sky-600 dark:text-lime-500' : ''} hover:pl-6   transition-all hover:text-slate-50 duration-300  cursor-pointer  `}><a className="hover:bg-slate-500 cursor-pointer dark:hover:bg-slate-600" >Messeger</a></li>
                        <li onClick={()=> TooglePages('post')} className={` ${Page == 'post' ? ' text-sky-600 dark:text-lime-500' : ''} hover:pl-6   transition-all hover:text-slate-50 duration-300  cursor-pointer  `}><a className="hover:bg-slate-500 cursor-pointer dark:hover:bg-slate-600" >Posts</a></li>

                        <li onClick={()=> TooglePages('profile')} className={` ${Page == 'profile' ? ' text-sky-600 dark:text-lime-500' : ''} hover:pl-6  mt-auto flex hover:text-slate-50 flex-row justify-start align-middle transition-all duration-300  cursor-pointer  `}>
                            <a className="hover:bg-slate-500 cursor-pointer dark:hover:bg-slate-600 w-full my-auto" >Profile
                            <div className="avatar hover:bg-transparent px-0">
                                <div className="mask  hover:bg-transparent mask-hexagon w-8">
                                    <img className=" hover:bg-transparent" src={Profile.ProfilePic} />
                                </div>
                            </div>
                            </a>
                        </li>
                        <li  className=" hover:pl-6 group transition-all hover:text-slate-50 duration-300" >
                            <a className="hover:bg-slate-500 cursor-pointer dark:hover:bg-slate-600 overflow-hidden"  onClick={() => AutoSwitchTheme('switch')} >Theme {Theme == 'dark' ? 
                                <BsMoonStarsFill  onClick={() => FuncToogleTheme('light')} className=" text-base animate-nonne duration-700 text-sky-300 cursor-pointer group-hover:animate-pulse" /> : 
                                <IoSunny onClick={() => FuncToogleTheme('dark')} className=" text-lg animate-pulse duration-700 text-yellow-400 cursor-pointer group-hover:animate-spin " /> } 
                            </a> 
                        </li>
                        <li onClick={ToogleLogout}  className={` ${ db != null ? 'flex' : 'hidden'} hover:pl-6 transition-all hover:text-slate-50 duration-300  cursor-pointer `} ><a className="hover:bg-slate-500 cursor-pointer dark:hover:bg-slate-600" >Logout 
                                <MdOutlineLogout  className=" text-lg text-rose-500 opacity-100"  />    
                            </a>
                        </li>
                        <li onClick={() => ShowLoginContainerFunc('show')}  className={` ${db == null ? 'flex' : 'hidden'} hover:pl-6 transition-all hover:text-slate-50 duration-300  cursor-pointer `} ><a className="hover:bg-slate-500 cursor-pointer dark:hover:bg-slate-600" >Login 
                                <MdLogin  className=" text-lg text-amber-500 opacity-100"  />    
                            </a>
                        </li>

                    </ul>
                </div>
            
           
            
        </div>
    )
   


};

const mapStateToProps =  state => ({
    isAuthenticated:state.auth.isAuthenticated,
    
})    
export default connect(mapStateToProps, {CheckAuthenticated,UploadFile,logout,FetchLogout,load_user})(Home)
