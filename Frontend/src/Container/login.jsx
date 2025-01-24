import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {CheckAuthenticated, load_user,reset_password,signupAuth} from '../actions/auth'
import '../App.css'
import '../CSS/nav.css'
import axios from 'axios'
import { Link, Navigate, useParams } from "react-router-dom";
import {connect, useDispatch, useSelector} from 'react-redux'
import { login } from "../actions/auth";
import bcrypt from 'bcryptjs'
import {useForm} from 'react-hook-form'
import LoginCover from '../assets/images/artwork.png'
import Logo from '../assets/images/hm3.jpeg'
import { toast, ToastContainer } from 'react-toastify';
import { TiVendorApple } from "react-icons/ti";
import { FaUnlock } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { TfiMicrosoftAlt } from "react-icons/tfi";
import { FcGoogle } from "react-icons/fc";
import { IoIosAdd } from "react-icons/io";
import { IoLockOpenOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { AiOutlineMail } from "react-icons/ai";
import { ShowLoginContainerReducer } from "../actions/types";
const Login = (props,{login,signupAuth, testFetch,reset_password,isAuthenticated}) => {
    const {register, formState, handleSubmit, getValues, setValue,watch,reset} = useForm({
        defaultValues :{
            'email': "",
            'resetemail' : '',
            'password' : '',
            'signupemail' :'',
            'name' :'',
            'signuppassword' : '',
            'signuprepassword' : ''
         },
         mode :'all'
    })
    const { page, extrainfo } = useParams();
    const [AuthData,SetAuthData] = useState({
        title : 'Login'
    })
    const dispatch = useDispatch()
    const Theme = useSelector((state) => state.auth.Theme)
    const {errors, isValid,isDirty, isSubmitting, isSubmitted} = formState
    const [islogedin,setislogedin] = useState(false)
    const [disableBtns, setDisableBtns] = useState(false)
    const LgEvent  = useSelector((state) => state.auth.notifierType)
    const [isChecked, setIsChecked] = useState(false);
    useEffect(() => {
        if(LgEvent != 'LOADING'){
          
            setDisableBtns(false)
        }else if(LgEvent == 'LOADING'){
            setDisableBtns(true)
            
        }
    },[LgEvent])
   
    
    function SubmitLogin(userdata){
        //console.log(getValues('email'))
        //login(getValues('email'), hashedpassword)
        
        props.login(getValues('email'), getValues('password'))
        reset()
        setislogedin(true) 

        if(isSubmitted){
            setDisableBtns(false)
        }
        if(page != 'post'){
            return <Navigate to="/home/AI" replace />;
        }
        
    }
    
    const RememberMe = (event) => {
       const {value,checked} = event.target 
       setIsChecked(checked);
       return
      if(checked) {
        if ('PasswordCredential' in window) {
            const cred = new PasswordCredential({
              id: getValues('email'),
              password: getValues('password')
            });
    
            navigator.credentials.store(cred)
              .then(() => {
                //console.log('Credentials stored successfully');
                // Redirect or handle successful login
              })
              .catch(error => {
                //console.error('Error storing credentials:', error);
              });
          } else {
            //console.warn('PasswordCredential API not supported');
          }
      }
    }
    function SubmitResetRequest(requestData){
        // e.preventDefault()
 
         //console.log(email[0])
         props.reset_password(getValues('resetemail'))
         
     }
     function SubmitSingup (signupData) {
        
        if(signupData.password === signupData.re_password){
           
             props.signupAuth(getValues('name'),getValues('signupemail'),getValues('signuppassword'), getValues('signuprepassword'));
             
         }
     }
    // isauthenticated ? redirect to home page
    // if (isAuthenticated && localStorage.getItem('access') != 'undefined') {
    //    // console.log('your are authenticated in the login sect', isAuthenticated)

    //     return <Navigate to="/home" replace />;
    // }
    function ToogleAuth (props) {
        if(props == 'reset-password'){
            SetAuthData((e) => {
                return {
                    ...e,
                    title : 'Reset'
                }
            })
        }else if(props == 'signup'){
            SetAuthData((e) => {
                return {
                    ...e,
                    title : 'signUp'
                }
            })
        }else if(props == 'Login'){
            SetAuthData((e) => {
                return {
                    ...e,
                    title : 'Login'
                }
            })
        }
    }
    function ToogleLoginContainer (propsval) {
        if(propsval) {
            dispatch({
                type : ShowLoginContainerReducer,
                payload : false
            })
        }
    }
    return(
        <div className={'flex flex-col justify-start min-h-[500px] text-slate-50 overflow-hidden  w-[300px] xs:w-[350px] lg:w-[400px] mx-auto bg-slate-900 shadow-lg rounded-sm shadow-gray-400 '} >
            <big className=" mx-auto mt-2" id="Tittle">{AuthData.title}</big>
            <IoIosAdd onClick={() => ToogleLoginContainer('close')} className=" ml-auto mr-2 hover:text-rose-500  transition-all duration-300 rotate-45 text-2xl absolute left-full right-8 top-2 w-fit overflow-hidden text-slate-400 cursor-pointer" />
            <div className=" flex flex-wrap flex-row justify-start align-middle gap-3 mt-2 w-full h-fit max-h-fit" >
                    <button className=" flex font-[Button] mx-auto  flex-row gap-1 rounded-sm hover:shadow-md transition-all duration-300 hover:shadow-sky-700 border-[1px] border-sky-700 opacity-90 px-4 py-2 w-fit " ><FcGoogle className=" mr-1 text-2xl" /> Google</button>
                    <button className=" flex font-[Button] mx-auto  flex-row gap-1 rounded-sm hover:shadow-md transition-all duration-300 hover:shadow-slate-400 border-[1px] border-slate-400 opacity-90 px-4 py-2 w-fit " ><TiVendorApple  className=" mr-1 text-2xl" /> Apple</button>
                    <button className=" flex font-[Button] mx-auto flex-row gap-1 rounded-sm hover:shadow-md transition-all duration-300  hover:shadow-sky-700 border-[1px] border-sky-700 opacity-90 px-4 py-2 w-fit " ><FaFacebookF  className=" text-sky-500 mr-1 text-2xl" /> Facebook</button>
                    <button className=" flex font-[Button] mx-auto flex-row gap-1 rounded-sm hover:shadow-md transition-all duration-300 hover:shadow-sky-700 border-[1px] border-sky-700 opacity-90 px-4 py-2 w-fit " ><TfiMicrosoftAlt   className=" text-sky-500 mr-1 text-2xl" /> Microsoft</button>

            </div>
            <hr className=" w-full mt-2 h-[1px] bg-slate-300 opacity-60 " />
            <span className=" mx-auto w-fit max-w-fit mb-1 opacity-60" >or</span>
            <form name="loginform" noValidate className= {` ${AuthData.title == 'Login' ? 'flex flex-col ' : 'hidden'}   bg-transparent max-w-[800px] gap-4 min-h-fit justify-around w-full border-[1px] placeholder:text-center placeholder:font-semibold border-slate-900 p-3 rounded-sm  mx-auto align-middle `} >
                    <label className="input max-h-[40px] w-[90%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] input-bordered border-[1px] border-lime-700 bg-transparent flex items-center gap-2">
                        <AiOutlineMail className=" text-lg text-lime-500 opacity-100" />
                        <input id='LoginEmail' {...register('email',{
                            required : 'Email is Required!',
                            pattern: {
                                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: 'Please enter a valid email',
                            },
                        })} name="email"  className='mx-auto text-slate-100 focus:outline-none ring-0 max-h-[35px] placeholder:text-slate-300 bg-slate-100 bg-opacity-20 outline-1 outline-none   border-none placeholder:text-left placeholder:font-bold  border-slate-900  rounded-sm px-2 w-full'  placeholder="EMAIL" type="email"  />
                    </label>
                    {errors.email && <p className=" my-2 max-w-[600px] bg-gray-800 text-red-500 font-semibold mx-auto text-center w-[60%] min-w-fit rounded-sm italic text-sm sm:text-base" >{errors.email?.message}</p>}
                    <label className="input max-h-[40px] w-[90%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] input-bordered border-[1px] border-lime-700 bg-transparent flex items-center gap-2">
                        <IoLockOpenOutline  className="text-lg text-rose-500  " />

                        <input {...register('password',{
                                required : 'Password is required!',
                                minLength : {
                                    value : 5,
                                    message :'Input more characters'
                                }
                            })}  id="password" className='outline-0  placeholder:text-slate-300 text-slate-100 bg-slate-100 bg-opacity-20 outline-none  mx-auto  border-none placeholder:text-left placeholder:font-bold  rounded-sm p- w-full'   placeholder="PASSWORD" type="password" />
                    </label>
            
                {errors.password && <p className=" my-2 max-w-[600px] bg-gray-800 text-red-500 font-semibold mx-auto text-center w-[80%] rounded-sm text-sm sm:text-base" >{errors.password?.message}</p>}
                <div className="form-control w-full flex flex-row justify-around ml-auto font-semibold">
                    <button id="submit" type="button" onClick={SubmitLogin} className=" bg-transparent transition-all duration-500 opacity-80 hover:opacity-100 disabled:cursor-not-allowed rounded-sm py-1 px-2 bg-blue-700 hover:border-blue-600 border-[1px] hover:shadow-slate-800 hover:shadow-md hover:bg-transparent min-w-[100px] font-bold text-slate-200 hover:text-blue-600">Login</button>

                    <label className="label cursor-pointer">
                        <span className="label-text opacity-70 text-slate-200 font-semibold mx-3">Remember me</span>
                        <input checked={isChecked} onChange={RememberMe} type="checkbox"  className="checkbox bg-transparent rounded-md checkbox-primary" />
                    </label>
                </div>
            </form>
            <form noValidate className= {` ${AuthData.title == 'signUp' ? 'flex flex-col ' : 'hidden'}  bg-transparent max-w-[800px] gap-4 min-h-fit justify-around w-full border-[1px] placeholder:text-center placeholder:font-semibold border-slate-900 p-3 rounded-sm  mx-auto align-middle `} >
                <label className="input  max-h-[40px]  w-[90%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] input-bordered border-[1px] border-lime-700 bg-transparent flex items-center gap-2">
                    <AiOutlineMail className=" text-lg text-lime-500 opacity-100" />
                    <input id='signupemail' {...register('signupemail',{
                        required : 'Email is Required!',
                        pattern: {
                            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: 'Please enter a valid email',
                        },
                    })} name="signupemail"  className='mx-auto text-slate-100 focus:outline-none ring-0 max-h-[35px] placeholder:text-slate-300 bg-slate-100 bg-opacity-20 outline-1 outline-none   border-none placeholder:text-left placeholder:font-bold  border-slate-900  rounded-sm px-2 w-full'  placeholder="EMAIL" type="email"  />
                </label>
                    
                {errors.signupemail && <p className=" my-2 max-w-[600px] bg-slate-900 text-red-500 font-semibold mx-auto text-center w-[60%] min-w-fit rounded-sm italic text-sm sm:text-base" >{errors.signupemail?.message}</p>}
                <label className="input  max-h-[40px]  w-[90%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] input-bordered border-[1px] border-lime-700 bg-transparent flex items-center gap-2">
                <   CiUser  className=" text-xl text-lime-500 opacity-100" />    
                    <input {...register('name',{
                        required :'Username is Required!'
                    })} name="name" className='mx-auto focus:outline-none text-slate-100 placeholder:text-slate-300  bg-slate-100 bg-opacity-20 outline-1 outline-none   border-none placeholder:text-left placeholder:font-bold  border-slate-900  rounded-sm p-2 w-full'  placeholder="USERNAME" type="text"  />
                    
                </label>   
                    
                {errors.name && <p className=" my-2 max-w-[600px] bg-slate-900 text-red-500 font-semibold mx-auto text-center w-[60%] italic min-w-fit rounded-sm text-sm sm:text-base" >{errors.name?.message}</p>}
                <label className="input  max-h-[40px]  w-[90%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] input-bordered border-[1px] border-lime-700 bg-transparent flex items-center gap-2">
                    <FaUnlock className="h-4 w-4 text-green-500  opacity-100" />
                    <input {...register('signuppassword',{
                        required : 'Password is Required!',
                        minLength : {
                            value : 5,
                            message : 'Input more characters'
                        }
                    })}  name="signuppassword" className='mx-auto focus:outline-none text-slate-100 placeholder:text-slate-300  bg-slate-100 bg-opacity-20 outline-1 outline-none   border-none placeholder:text-left placeholder:font-bold  border-slate-900  rounded-sm p-2 w-full'   placeholder="PASSWORD" type="password" />
                    
                </label>
                    
                {errors.signuppassword && <p className=" my-2 max-w-[600px] bg-slate-900 text-red-500 font-semibold mx-auto text-center w-[60%] italic min-w-fit rounded-sm text-sm sm:text-base" >{errors.signuppassword?.message}</p>}
                <label className="input  max-h-[40px]  w-[90%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] input-bordered border-[1px] border-lime-700 bg-transparent flex items-center gap-2">
                    <FaUnlock className="h-4 w-4 text-lime-600  opacity-100" />
                    <input {...register('signuprepassword',{
                        required : true,
                        validate: (val =   string) => {
                            if (watch('signuppassword') != val) {
                            return "Your passwords do no match";
                            }
                        },
                    })}  name="signuprepassword" className='mx-auto focus:outline-none text-slate-100 placeholder:text-slate-300  bg-slate-100 bg-opacity-20 outline-1 outline-none   border-none placeholder:text-left placeholder:font-bold  border-slate-900  rounded-sm p-2 w-full'  placeholder="CONFIRM PASSWORD" type="password" />
                    
                </label>    
                    
                    {errors.signuprepassword && <p className=" my-2 max-w-[600px] bg-slate-900 text-red-500 font-semibold mx-auto text-center italic w-[60%] min-w-fit rounded-sm text-sm sm:text-base" >{errors.signuprepassword?.message}</p>}
                    <button type="button" onClick={SubmitSingup} className=" bg-transparent transition-all w-fit mx-auto py-2 duration-500 opacity-80 hover:opacity-100 disabled:cursor-not-allowed rounded-sm px-2 bg-blue-700 hover:border-blue-600 border-[1px] hover:shadow-slate-800 hover:shadow-md hover:bg-transparent min-w-[100px] font-bold text-slate-200 hover:text-blue-600 ">Sign Up</button>
            </form>
            <form  className= {`  ${AuthData.title == 'Reset' ? 'flex flex-col ' : 'hidden'}  bg-transparent max-w-[800px] gap-4 min-h-fit justify-around w-full border-[1px] placeholder:text-center placeholder:font-semibold border-slate-900 p-3 rounded-sm  mx-auto align-middle`} >
                    <label className="input max-h-[40px] w-[90%] rounded-sm mx-auto px-0 pl-4 max-w-[500px] input-bordered border-[1px] border-lime-700 bg-transparent flex items-center gap-2">
                        <AiOutlineMail className=" text-lg text-lime-500 opacity-100" />
                        <input id='ForgotPasswordemail' {...register('resetemail',{
                            required : 'Email is Required!',
                            pattern: {
                                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: 'Please enter a valid email',
                            },
                        })} name="email"  className='mx-auto text-slate-100 focus:outline-none ring-0 max-h-[35px] placeholder:text-slate-300 bg-slate-100 bg-opacity-20 outline-1 outline-none   border-none placeholder:text-left placeholder:font-bold  border-slate-900  rounded-sm px-2 w-full'  placeholder="EMAIL" type="email"  />
                    </label>
                    {errors.resetemail && <p className=" my-2 max-w-[600px] bg-slate-900 text-red-500 font-semibold mx-auto text-center w-[80%] rounded-sm text-sm sm:text-base" >{errors.resetemail?.message}</p>}
                    <button disabled={isSubmitting } type="button" onClick={SubmitResetRequest} className=" bg-transparent transition-all duration-500 opacity-80 hover:opacity-100 disabled:cursor-not-allowed rounded-sm px-2 bg-blue-700 hover:border-blue-600 border-[1px] hover:shadow-slate-800 hover:shadow-md hover:bg-transparent min-w-[100px] w-fit mx-auto py-2 font-bold text-slate-200 hover:text-blue-600">Request</button>
            </form>   
            <div className=" flex flex-col mt-10  w-full  px-2 align-middle justify-around">
            <p className= {` ${AuthData.title != 'Reset' ? 'flex flex-row  gap-2' : 'hidden'} font-semibold text-slate-500 opacity-70 hover:opacity-90 text-sm mx-auto my-3 `} >Forgot password: <span className=" hover:text-slate-300 transition-all duration-300 text-sky-500 font-semibold underline underline-offset-4 cursor-pointer" onClick={() => ToogleAuth('reset-password')} > Reset password</span></p>
                <p className= {` ${AuthData.title != 'signUp' && AuthData.title != 'Reset' ? 'flex flex-row  gap-2 ' : 'hidden'} font-semibold text-slate-500 opacity-70 hover:opacity-90 text-sm mx-auto my-3 `}>Dont have an account: <span className=" hover:text-slate-300 transition-all duration-300 text-sky-500 font-semibold underline underline-offset-4 cursor-pointer" onClick={() => ToogleAuth('signup')} >Sign up</span></p>
                <p className= {` ${AuthData.title != 'Login' ? 'flex flex-row  gap-2' : 'hidden'} font-semibold text-slate-500 opacity-70 hover:opacity-90 text-sm mx-auto my-3 `}>Have an account: <span className=" hover:text-slate-300 transition-all duration-300 text-sky-500 font-semibold underline underline-offset-4 cursor-pointer" onClick={() => ToogleAuth('Login')} >Log-in</span></p>
            </div>
            <small className=" mt-auto mb-1 ml-1 text-transparent bg-clip-text bg-gradient-to-br from-lime-400 to-sky-400 w-fit opacity-100 font-[Button] " >Agri-Ai</small>
        </div>
    )


};

const mapStateToProps =  state => ({
    isAuthenticated:state.auth.isAuthenticated
})    


export default connect(mapStateToProps, {reset_password,signupAuth, login})(Login);