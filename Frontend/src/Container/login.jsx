import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {CheckAuthenticated, load_user} from '../actions/auth'
import '../App.css'
import Navbar from "../Components/navbar";
import axios from 'axios'
import { Link, Navigate } from "react-router-dom";
import {connect, useSelector} from 'react-redux'
import { login } from "../actions/auth";
import bcrypt from 'bcryptjs'
import {useForm} from 'react-hook-form'
import LoginCover from '../assets/images/artwork.png'
import Logo from '../assets/images/hm3.jpeg'
import { toast, ToastContainer } from 'react-toastify';
import { FaUnlock } from "react-icons/fa";

const Login = ({login, testFetch,isAuthenticated}) => {
    const {register, formState, handleSubmit, getValues, setValue} = useForm({
        defaultValues :{
            'email': "",
            'password' : ''
         },
         mode :'all'
    })
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
        
        login(getValues('email'), getValues('password'))
        setislogedin(true) 

        if(isSubmitted){
            setDisableBtns(false)
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

    // isauthenticated ? redirect to home page
    if (isAuthenticated && localStorage.getItem('access') != 'undefined') {
       // console.log('your are authenticated in the login sect', isAuthenticated)

        return <Navigate to="/home" replace />;
    }

    function MoveToAdmin() {
        window.open(`${import.meta.env.VITE_APP_API_URL}/admin/`,'_blank')
    }

  
    return(
        <div className=" overflow-visible w-full h-full  min-h-full">
              <div className="  top-0 sticky w-full z-50  border-slate-900">
                <Navbar />
            </div>
            
           
            <div className=" z-40 flex flex-col  h-screen min-h-[100%] md:flex-row w-full">
                <div className={` bg-image w-full sm:h-screen relative md:w-[50%] md:h-full h-full  sm:min-h-[100%] min-h-[80%]  flex justify-center align-middle`}>
                    <img className=" z-0 w-full h-full" src={LoginCover} title="cover-image"  alt="" />
                    
                    <blockquote className=" z-40 absolute mt-[50%] bg-slate-900 text-slate-100 h-fit my-auto py-3 px-3 bg-opacity-60 p-1  rounded-sm ">
                    <p className=" text-center font-mono font-semibold px-1 text-base md:text-lg">Communication: Where Meaning Meets Momentum.</p>
                    </blockquote>
                    
                    
                    
                </div>
                <div id="logo" className=" bg-transparent w-full flex flex-col md:w-[50%] md:h-full ">
                        <h1 className=" text-3xl text-amber-500  mx-auto text-center font-semibold font-mono py-2  h-fit p-4 w-fit"> Login</h1>

                        <div id='logo' className=" hidden shadow-md shadow-slate-500  rounded-full w-44 h-40 max-w-[300px] max-h-[300px] relative mx-auto" alt="" ></div>
                            <form noValidate className=" md:mt-36 lg:mt-60 bg-transparent max-w-[800px] gap-4 min-h-fit shadow-lg shadow-red-700 flex flex-col  justify-around w-[90%] border-[1px] placeholder:text-center placeholder:font-semibold border-slate-900 p-3 rounded-sm  mx-auto align-middle" onSubmit={handleSubmit(SubmitLogin)}>
                                    <label className="input w-[90%] rounded-sm mx-auto max-w-[500px] input-bordered border-[1px] border-lime-600 bg-transparent flex items-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 16 16"
                                            fill="currentColor"
                                            className="h-4 w-4  text-lime-500 opacity-100">
                                            <path
                                            d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                                            <path
                                            d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                                        </svg>
                                        <input id='email' {...register('email',{
                                            required : 'Email is Required!',
                                            pattern: {
                                                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                                message: 'Please enter a valid email',
                                            },
                                        })} name="email"  className='mx-auto text-slate-100 focus:outline-none placeholder:text-slate-300 bg-slate-100 bg-opacity-20 outline-1 outline-none   border-none placeholder:text-left placeholder:font-bold  border-slate-900  rounded-sm p-2 w-full'  placeholder="EMAIL" type="email"  />
                                    </label>
                                    {errors.email && <p className=" my-2 max-w-[600px] bg-gray-800 text-red-500 font-semibold mx-auto text-center w-[60%] min-w-fit rounded-sm italic text-sm sm:text-base" >{errors.email?.message}</p>}
                                    <label className="input w-[90%] rounded-sm mx-auto max-w-[500px] input-bordered border-[1px] border-lime-600 bg-transparent flex items-center gap-2">
                                        <FaUnlock className="h-4 w-4 text-red-500  opacity-100" />

                                        <input {...register('password',{
                                                required : 'Password is required!',
                                                minLength : {
                                                    value : 5,
                                                    message :'Input more characters'
                                                }
                                            })}  id="password" className='outline-0  placeholder:text-slate-300 text-slate-100 bg-slate-100 bg-opacity-20 outline-none  mx-auto  border-none placeholder:text-left placeholder:font-bold  rounded-sm p-2 w-full'   placeholder="PASSWORD" type="password" />
                                    </label>
                            
                                {errors.password && <p className=" my-2 max-w-[600px] bg-gray-800 text-red-500 font-semibold mx-auto text-center w-[80%] rounded-sm text-sm sm:text-base" >{errors.password?.message}</p>}
                                <div className="form-control w-full flex flex-row justify-around ml-auto font-semibold">
                                    <button id="submit" disabled={!isDirty || !isValid || isSubmitting } type="submit" className=" bg-transparent transition-all duration-500 disabled:cursor-not-allowed rounded-sm p-2 bg-blue-700 hover:border-blue-600 border-[1px] hover:shadow-slate-800 hover:shadow-md hover:bg-transparent min-w-[100px] font-bold text-slate-200 hover:text-blue-600">Login</button>

                                    <label className="label cursor-pointer">
                                        <span className="label-text text-slate-200 font-semibold mx-3">Remember me</span>
                                        <input checked={isChecked} onChange={RememberMe} type="checkbox"  className="checkbox bg-transparent rounded-md checkbox-secondary" />
                                    </label>
                                </div>
                            </form>

                        <div className="pl-2 text-center flex flex-col sm:flex-row sm:flex-wrap mt-6 w-full justify-around gap-3">

                            <div className=" flex flex-col mt-10 lg:flex-row w-full justify-around">
                                <p className=" font-semibold text-purple-600 my-3">Forgot password: <Link className=" hover:text-amber-600 text-sky-500 font-semibold underline underline-offset-4"  to="/reset_password" > Reset password</Link></p>
                                <p className="font-semibold text-purple-600 my-3">Dont have an account: <Link className=" hover:text-amber-600 text-sky-500 font-semibold underline underline-offset-4"  to="/signup" >Sign up</Link></p>
                        
                            </div>
                        </div>
                </div>
                
            </div>
           

        </div>
    )


};

const mapStateToProps =  state => ({
    isAuthenticated:state.auth.isAuthenticated
})    


export default connect(mapStateToProps, {login})(Login);