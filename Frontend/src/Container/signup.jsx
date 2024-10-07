import React, { useEffect, useLayoutEffect, useState } from "react";
import Navbar from "../Components/navbar";
import {CheckAuthenticated, load_user} from '../actions/auth'
import { Link, Navigate } from "react-router-dom";
import {connect, useSelector} from 'react-redux'
import { signupAuth } from "../actions/auth";
import {useForm} from 'react-hook-form' 
import { FaUnlock } from "react-icons/fa";
import LoginCover from '../assets/images/artwork.png'
import Logo from '../assets/images/hm3.jpeg'
function Signup ({signupAuth, isAuthenticated}) {
    const {register, handleSubmit, watch, formState, getValues} = useForm({
        defaultValues :{
            'name' :'',
            'email':'',
            'password':'',
            're_password':""
        },
        mode : 'all'
    })
    const {errors, isDirty, isValid, isSubmitting} = formState
    const [accountcreated, setaccountcreated] = useState(false)
    const [disableBtns, setDisableBtns] = useState(false)
    const HmEvent  = useSelector((state) => state.auth.notifierType)

    useEffect(() => {       
        if(HmEvent != 'LOADING'){
            
            setDisableBtns(false)
        }else if(HmEvent == 'LOADING'){
            setDisableBtns(true)
           
        }
    },[HmEvent])
    function SubmitSingup (signupData) {
       if(signupData.password === signupData.re_password){
           // console.log('passoword match')
            signupAuth(signupData.name,signupData.email,signupData.password, signupData.re_password);
            setaccountcreated(true)
        }
    }
    if (isAuthenticated) {
      //  console.log('your are authenticated in the login sect')

        //return <Navigate to="/" replace />;
    }
    if(accountcreated){
        //return <Navigate to="/login" replace />;
    }
    function MoveToAdmin() {
        window.open(`${import.meta.env.VITE_APP_API_URL}/admin/`,'_blank')
    }

   
    return (
        <div>
            <div className="  top-0 sticky w-full z-50  border-slate-900">
                <Navbar />
            </div>       
            

            <div className=" z-50 flex flex-col  h-screen min-h-[100%] md:flex-row w-full">
                <div className={` bg-image w-full sm:h-screen relative md:w-[50%] md:h-full h-full sm:min-h-[100%] min-h-[80%]  flex justify-center align-middle`}>
                    <img className=" z-0 w-full h-full" src={LoginCover} title="cover-image"  alt="" />
                    
                    <blockquote className=" z-40 absolute mt-[50%] bg-slate-900 text-slate-100 h-fit my-auto py-3 px-3 bg-opacity-60 p-1  rounded-sm ">
                    <p className=" text-center font-mono font-semibold px-1 text-base md:text-lg">Communication: Where Meaning Meets Momentum.</p>
                    </blockquote>
                    
                    
                    
                </div>
                <div id="logo" className=" w-full flex flex-col md:w-[50%] md:h-full ">
                        <img  src={Logo} title="school logo" className=" hidden shadow-md shadow-slate-500  rounded-full w-fit h-fit max-w-[300px] max-h-[200px] -p-2 relative mx-auto" alt="" />
                        <h1 className=" text-3xl  mx-auto text-center font-semibold font-mono py-2 text-amber-500  h-fit p-4 w-fit">Sign Up</h1>
                        <form noValidate className=" md:mt-36 lg:mt-50 max-w-[800px] shadow-lg shadow-amber-500 flex flex-col min-h-fit gap-4 justify-around w-[90%] border-[1px] placeholder:text-left placeholder:font-bold border-slate-900 p-3 rounded-md  mx-auto align-middle" onSubmit={handleSubmit(SubmitSingup)}>
                            <label className="input w-[90%] rounded-sm mx-auto max-w-[500px] input-bordered border-[1px] border-lime-600 bg-transparent flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="h-4 w-4 text-green-500  opacity-100">
                                    <path
                                    d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                                    <path
                                    d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                                </svg>
                                <input {...register('email',{
                                    required : 'Email is Required!',
                                    pattern: {
                                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                        message: 'Please enter a valid email',
                                    },
                                })} name="email"  className='mx-auto focus:outline-none text-slate-100 placeholder:text-slate-300  bg-slate-100 bg-opacity-20 outline-1 outline-none   border-none placeholder:text-left placeholder:font-bold  border-slate-900  rounded-sm p-2 w-full'  placeholder="EMAIL" type="email"  />
                                
                            </label>
                                
                            {errors.email && <p className=" my-2 max-w-[600px] bg-slate-900 text-red-500 font-semibold mx-auto text-center w-[60%] min-w-fit rounded-sm italic text-sm sm:text-base" >{errors.email?.message}</p>}
                            <label className="input w-[90%] rounded-sm mx-auto max-w-[500px] input-bordered border-[1px] border-lime-600 bg-transparent flex items-center gap-2">
                                    <svg class="w-4 h-4 text-red-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                                    </svg>
                                <input {...register('name',{
                                    required :'Username is Required!'
                                })} name="name" className='mx-auto focus:outline-none text-slate-100 placeholder:text-slate-300  bg-slate-100 bg-opacity-20 outline-1 outline-none   border-none placeholder:text-left placeholder:font-bold  border-slate-900  rounded-sm p-2 w-full'  placeholder="USERNAME" type="text"  />
                                
                            </label>   
                                
                            {errors.name && <p className=" my-2 max-w-[600px] bg-slate-900 text-red-500 font-semibold mx-auto text-center w-[60%] italic min-w-fit rounded-sm text-sm sm:text-base" >{errors.name?.message}</p>}
                            <label className="input w-[90%] rounded-sm mx-auto max-w-[500px] input-bordered border-[1px] border-lime-600 bg-transparent flex items-center gap-2">
                                <FaUnlock className="h-4 w-4 text-green-500  opacity-100" />
                                <input {...register('password',{
                                    required : 'Password is Required!',
                                    minLength : {
                                        value : 5,
                                        message : 'Input more characters'
                                    }
                                })}  name="password" className='mx-auto focus:outline-none text-slate-100 placeholder:text-slate-300  bg-slate-100 bg-opacity-20 outline-1 outline-none   border-none placeholder:text-left placeholder:font-bold  border-slate-900  rounded-sm p-2 w-full'   placeholder="PASSWORD" type="password" />
                                
                            </label>
                               
                            {errors.password && <p className=" my-2 max-w-[600px] bg-slate-900 text-red-500 font-semibold mx-auto text-center w-[60%] italic min-w-fit rounded-sm text-sm sm:text-base" >{errors.password?.message}</p>}
                            <label className="input w-[90%] rounded-sm mx-auto max-w-[500px] input-bordered border-[1px] border-lime-600 bg-transparent flex items-center gap-2">
                                <FaUnlock className="h-4 w-4 text-lime-600  opacity-100" />
                                <input {...register('re_password',{
                                    required : true,
                                    validate: (val =   string) => {
                                        if (watch('password') != val) {
                                        return "Your passwords do no match";
                                        }
                                    },
                                })}  name="re_password" className='mx-auto focus:outline-none text-slate-100 placeholder:text-slate-300  bg-slate-100 bg-opacity-20 outline-1 outline-none   border-none placeholder:text-left placeholder:font-bold  border-slate-900  rounded-sm p-2 w-full'  placeholder="CONFIRM PASSWORD" type="password" />
                                
                            </label>    
                                
                                {errors.re_password && <p className=" my-2 max-w-[600px] bg-slate-900 text-red-500 font-semibold mx-auto text-center italic w-[60%] min-w-fit rounded-sm text-sm sm:text-base" >{errors.re_password?.message}</p>}
                                <button disabled={!isDirty || !isValid || isSubmitting || disableBtns} type="submit" className=" bg-transparent transition-all duration-500 disabled:cursor-not-allowed w-fit mx-auto rounded-sm p-2 bg-blue-700 hover:border-blue-600 border-[1px] hover:shadow-slate-800 hover:shadow-md hover:bg-transparent min-w-[100px] font-bold text-slate-200 hover:text-blue-600 ">Sign Up</button>
                            </form>

                        <div className="pl-2 text-center flex flex-col sm:flex-row sm:flex-wrap mt-6 w-full justify-around gap-3">
                            <p className=" font-semibold text-purple-600 my-3">Login Admin Panel: <span className=" hover:text-amber-600 cursor-pointer text-red-500 font-semibold underline underline-offset-4" onClick={MoveToAdmin} >Login</span></p>

                            <p className=" font-semibold text-purple-600 my-3">Have an account: <Link className=" hover:text-amber-600 text-sky-500 font-semibold underline underline-offset-4"  to="/login" > Sign In</Link></p>
                        
                        </div>
                </div>
                
            </div>
        </div>
    )


};

const mapStateToProps =  state => ({
    isAuthenticated:state.auth.isAuthenticated
})    

export default connect(mapStateToProps, {signupAuth})(Signup)