import react, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import '../App.css'
import { FaAnglesRight } from "react-icons/fa6";
import { FaAnglesLeft } from "react-icons/fa6";
import { Navigate, generatePath } from 'react-router';
import { CLEAR_MANAGEMENT } from '../actions/types';
import Navbar from '../Components/navbar';
import { HiAdjustmentsVertical } from "react-icons/hi2";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { IoIosCloudDone } from "react-icons/io";
import { SubmitReviewFunc,SubmitStudent,AddStudent,CheckAuthenticated, SubmitManagenent, GetReviewFunc } from '../actions/auth';
import { connect, useDispatch, useSelector } from 'react-redux'
import { RiNumber1, RiNumber2, RiNumber3, RiNumber4, RiNumber5, RiNumber6, RiNumber7 } from "react-icons/ri";
import { formToJSON } from 'axios';

const Manage = ({ SubmitManagenent,SubmitReviewFunc,GetReviewFunc,SubmitStudent,isAuthenticated,AddStudent}) => {
    const [stepInfo,setstepInfo ] = useState({
        'Step1' : false,
        'Step2' : false,
        'Step3' : false,
    })
    const dispatch = useDispatch()
    const [HideTable, setHideTable] = useState(false)
    const [HideReviewTable, setHideReviewTable] = useState(false)
    const Management = useSelector((state) => state.auth.Management)
    const ReviewManager = useSelector((state) => state.auth.ReviewTable)
    const Is_Manager = useSelector((state) => state.auth.isManager)
    const [StudenInfo, setStudenInfo] = useState([])
    const [ReviewInfo,setReviewInfo] = useState([])
    const StudentStatus = useSelector((state) => state.auth.ManagementStatus)
    const [Academic_Num,setAcademic_Num] = useState(null)
    const [ExpandAcademic,setExpandAcademic] = useState(true)
    const [showMenu, setShowMenu] = useState(false)
    const [DisableBtns,setDisableBtns]   = useState(false)
    const [ShowPubmish, setShowPubmish] = useState(false)
    const [ExpandStudents,setExpandStudents] = useState(true)
    const [ExpandRemarks,setExpandRemarks] = useState(true)
    const [ExpandGeneral,setExpandGeneral] = useState(true)
    const [ExpandFinally,setExpandFinally] = useState(true)
    const [CallingYear,setCallingYear] = useState(0)
    const LgEvent = useSelector((state) => state.auth.notifierType)
    const tableRef = useRef()
    const TableContainerRef = useRef()
    const [GeneralData,setGeneralData] = useState({
        'Academic_1_Term' : '',
        'Academic_2_Term' : '',
        'Academic_3_Term' : '',
        'Academic_4_Term' : '',
        'Exam-Type' : 'null',
        'Term' : 'null',
        'form' : 'null'
    })
    const [GeneralData2,setGeneralData2] = useState({
        'Academic_1_Term' : '',
        'Academic_2_Term' : '',
        'Academic_3_Term' : '',
        'Academic_4_Term' : '',
        'Exam-Type' : 'null',
        'Term' : 'null',
        'form' : 'null'
    })
    const [GeneralData3,setGeneralData3] = useState({
        'Academic_1_Term' : '',
        'Academic_2_Term' : '',
        'Academic_3_Term' : '',
        'Academic_4_Term' : '',
        'Exam-Type' : 'null',
        'Term' : 'null',
        'form' : 'null'
    })
    const [GeneralData4,setGeneralData4] = useState({
        'Academic_1_Term' : '',
        'Academic_2_Term' : '',
        'Academic_3_Term' : '',
        'Academic_4_Term' : '',
        'Exam-Type' : 'null',
        'Term' : 'null',
        'form' : 'null'
    })

    useEffect(() => {
        
        if(LgEvent != 'LOADING'){
           
            setDisableBtns(false)
        }else if(LgEvent == 'LOADING'){
            setDisableBtns(true)
          
        }
    },[LgEvent])

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;      
    }
    if(Is_Manager == false){
        return <navigator to='/home' replace  />
    }
      
    //redirect concept if he/she is not a manager
    function ShowNum(props) {
        for (let i = 0; i < stepInfo.length; i++) {
            if(stepInfo[i] == props){
                return true
            }
            
        }
    }

    useEffect(() => {
       
        if (Management != null && Academic_Num != null && Management != 'undefined' && Management != 'null' && stepInfo.Step3 == false){
            setDisableBtns(false)
            const header = ['ADM','NAME','GENDER \n(B/G)','STREAM\n(E,S,W)','KCPE','PHONE-NUMBER']

            var manage = JSON.parse(Management)
            var filtered = manage.unshift(header)
            setStudenInfo(manage)
            setTimeout(() => {
                setstepInfo((e) => {
                    return {
                        ...e,
                        Step1 : true
                    }
                })
                setExpandAcademic(false)
                setExpandStudents(true)
            }, 2000);
        }
    },[Management])
  
    useEffect(() => {
        if (ReviewManager != null && ReviewManager != 'undefined' && ReviewManager != 'null' ){
            var manage = JSON.parse(ReviewManager)
            setDisableBtns(false)
            setReviewInfo(manage)            
        }
    },[ReviewManager])


    const AcademicChange = (event)  =>{
        const {value} = event.target
        setAcademic_Num(value)
    }
    function PushStep(props) {
        
        if(props ==1 ){
            //want to move to 2
            setExpandAcademic(false)
        }else if(props == 2){
            //want to move to 3
            setExpandStudents(false)
            setExpandFinally(true)
            setstepInfo((e) => {
                return {
                    ...e,
                    Step2 : true
                }
            })
        }
    }
    function PushBack(props) {
        setstepInfo((e) => {
            return {
                ...e,
                [`Step${props}`] : (!`Step${props}`)
            }
        })
        if(props == 1){
            //wand to return to 1
            setExpandAcademic(true)
            
        }else if (props == 2){
            //want to return to 2
            setExpandFinally(false)
            setExpandStudents(true)
            
        }
    }

    
    let BtnTop = document.getElementById('BtnTop')

    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        BtnTop.style.display = "block";
    } else {
        BtnTop.style.display = "none";
    }
    }
    function ScrollTop() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        }
    

    function GetInfo() {

        setStudenInfo([])
        dispatch({
            type :CLEAR_MANAGEMENT
        })
        
        AddStudent(Number(Academic_Num))
        
        
    }
    

    const handleCellChange = (rowIndex, colIndex, value) => {
        const newData = [...StudenInfo];
        newData[rowIndex][colIndex] = value;
        setStudenInfo(newData);
      };
      const handleCellChangeReview = (rowIndex, colIndex, value) => {
        const newData = [...ReviewInfo];
        newData[rowIndex][colIndex] = value;
        setReviewInfo(newData);
      };

      const GeneralDataChange = (event) => {
        event.preventDefault()
        const {value, name} = event.target
        setGeneralData((e) => {
            return{
                ...e,
                [name] : value
            }
        })
        setReviewInfo([])
      

      }
      const GeneralDataChange2 = (event) => {
        event.preventDefault()
        const {value, name} = event.target
        setGeneralData2((e) => {
            return{
                ...e,
                [name] : value
            }
        })      
        setReviewInfo([])
      }
      const GeneralDataChange3 = (event) => {
        event.preventDefault()
        const {value, name} = event.target
        setGeneralData3((e) => {
            return{
                ...e,
                [name] : value
            }
        })      
        setReviewInfo([])
      }
      const GeneralDataChange4 = (event) => {
        event.preventDefault()
        const {value, name} = event.target
        setGeneralData4((e) => {
            return{
                ...e,
                [name] : value
            }
        })
        setReviewInfo([])
      }
   

      function SubmitFunc (props) {
        setstepInfo((e) => {
            return {
                ...e,
                Step3 : true
            }
        })
        var GeneralVal = StudenInfo.slice(1).map((row) => row.slice(0,4));
        var KCPEVal = StudenInfo.slice(1).map((row) => row.slice(4,5));
        var NumberVal = StudenInfo.slice(1).map((row) => row.slice(5));
        const val = {
            'Academic' : Academic_Num,
            'excelData' : {
                'General' : GeneralVal,
                'KCPE': KCPEVal,
                'NUMBER': NumberVal
            }
        }
        
        setStudenInfo([])
        
        setExpandAcademic(true)
        setExpandStudents(true)
        setstepInfo((e) => {
            return {
                ...e,
                Step3 : false
            }
        })
        setExpandFinally(true)
        SubmitStudent(val)
        dispatch({
            type : CLEAR_MANAGEMENT
        })

      }
      const TableDiv = document.getElementById('TableDiv')
      function handleScroll  (direction) {
        const val = TableDiv.scrollLeft
        if(direction == 'left'){
           
            TableDiv.scrollLeft = val - 100
            
        }else if(direction == 'right'){
            TableDiv.scrollLeft = val + 100
        }
        
      };
      const TableDivReview = document.getElementById('TableDivReview')
      function handleScrollReview  (direction) {
        const val = TableDivReview.scrollLeft
        if(direction == 'left'){
           
            TableDivReview.scrollLeft = val - 100
            
        }else if(direction == 'right'){
            TableDivReview.scrollLeft = val + 100
        }
        
      };
      const OptionForm = (event) => {
        const {name,value} = event.target
        setGeneralData((e) => {
            return {
                ...e,
                [name] : value
            }
        })
      }

      

      function GetReview(props) {
        setDisableBtns(true)
        var Academic_Num = Number()
        if(props == 1){
            Academic_Num = 1
            
            var data = {
                'Academic_Num' : Academic_Num,
                'form' : GeneralData.form,
                'Term' : GeneralData.Term,
                'Exam' : GeneralData['Exam-Type']
            }
            setCallingYear(Academic_Num)
            GetReviewFunc(data)
            
        }else if(props == 2){
            Academic_Num = 2
            var data = {
                'Academic_Num' : Academic_Num,
                'form' : GeneralData2.form,
                'Term' : GeneralData2.Term,
                'Exam' : GeneralData2['Exam-Type']
            }
            GetReviewFunc(data)
            setCallingYear(Academic_Num)
            
        }else if(props == 3){
            Academic_Num = 3
            var data = {
                'Academic_Num' : Academic_Num,
                'form' : GeneralData3.form,
                'Term' : GeneralData3.Term,
                'Exam' : GeneralData3['Exam-Type']
            }
            GetReviewFunc(data)
            setCallingYear(Academic_Num)
            
        }else if(props == 4){
            Academic_Num = 4
            var data = {
                'Academic_Num' : Academic_Num,
                'form' : GeneralData4.form,
                'Term' : GeneralData4.Term,
                'Exam' : GeneralData4['Exam-Type']
            }
            GetReviewFunc(data)
            setCallingYear(Academic_Num)
            
        }
      }
      function SubmitReview(props) {
        setDisableBtns(true)
        var Academic_Num = Number()
        const Original = ReviewInfo[0] ?  ReviewInfo.slice(1) : []
        const HeaderVal = ReviewInfo[0] ?  ReviewInfo.slice(1).map((row) => row.slice(0,2)) : []
        const BodyVal = ReviewInfo[0] ? ReviewInfo.slice(1).map((row) => row.slice(2)) : []
        const Cred1 = Number(GeneralData.form) == 1 && GeneralData.Term == 'Term One' && Number(GeneralData['Exam-Type']) == 1 ? true : false
        const Cred2 = Number(GeneralData2.form) == 1 && GeneralData2.Term == 'Term One' && Number(GeneralData2['Exam-Type']) == 1 ? true : false
        const Cred3 = Number(GeneralData3.form) == 1 && GeneralData3.Term == 'Term One' && Number(GeneralData3['Exam-Type']) == 1 ? true : false
        const Cred4 = Number(GeneralData4.form) == 1 && GeneralData4.Term == 'Term One' && Number(GeneralData4['Exam-Type']) == 1 ? true : false
        if(props == 1){
            Academic_Num = 1
            var data = {
                'Academic_Num' : Academic_Num,
                'Body' : Cred1 ? Original : BodyVal,
                'Header' : Cred1 ?  [] : HeaderVal,
                'form' : GeneralData.form,
                'Term' : GeneralData.Term,
                'Exam' : GeneralData['Exam-Type']
            }
            SubmitReviewFunc(data)
            
        }else if(props == 2){
            Academic_Num = 2
            var data = {
                'Academic_Num' : Academic_Num,
               'Body' : Cred2 ? Original : BodyVal,
                'Header' : Cred2 ?  [] : HeaderVal,
                'form' : GeneralData2.form,
                'Term' : GeneralData2.Term,
                'Exam' : GeneralData2['Exam-Type']
            }
            SubmitReviewFunc(data)
            
        }else if(props == 3){
            Academic_Num = 3
            var data = {
                'Academic_Num' : Academic_Num,
               'Body' : Cred3 ? Original : BodyVal,
                'Header' : Cred3 ?  [] : HeaderVal,
                'form' : GeneralData3.form,
                'Term' : GeneralData3.Term,
                'Exam' : GeneralData3['Exam-Type']
            }
            SubmitReviewFunc(data)
            
        }else if(props == 4){
            Academic_Num = 4
            var data = {
                'Academic_Num' : Academic_Num,
               'Body' : Cred4 ? Original : BodyVal,
                'Header' : Cred4 ?  [] : HeaderVal,
                'form' : GeneralData4.form,
                'Term' : GeneralData4.Term,
                'Exam' : GeneralData4['Exam-Type']
            }
            SubmitReviewFunc(data)
            
        }
      }

      function shouldDisplay(props) {
        return Number(props.form) !== 4 || props['Exam-Type'] !== 'Term Three' ? false : true;
      }
    

    return (
        <>
            <div className=" top-0 sticky w-full z-50  border-slate-900">
                <Navbar />
            </div>
            <div onClick={() => setShowMenu((e) => (!e))} className=" ml-1 overflow-hidden border-[1px] h-fit text-center align-middle shadow-sm border-slate-800 rounded-sm w-fit my-1 cursor-pointer" >
                <span className="text-[x-small] my-1 font-bold justify-around rounded-md mx-auto text-center pl-1  w-fit h-fit sm:pr-4  align-middle sm:text-sm sm:font-semibold animate-pulse flex flex-row gap-1 transition-all duration-500">Add Students<HiAdjustmentsVertical   className=" my-auto  text-center text-red-700 font-semibold" /> </span>
            </div>

            <div className={` w-full px-4 mx-auto transition-all duration-500  max-w-[600px]   border-slate-800 rounded-sm ${showMenu ? ' p-2 translate-y-0 w-full border-0' : 'border-[1px]   p-1  h-1 translate-y-2 py-auto  mb-4 bg-slate-600 shadow-sm shadow-pink-600'} flex   justify-around  sm:flex-row wrap gap-1 `} >                  
                <div  className={` w-full sm:w-[90%] transition-all duration-500 px-3 shadow-slate-700 shadow-sm pl-4 mx-auto ${showMenu ? 'flex flex-col' : 'hidden'} transition-all duration-500  justify-around text-center `} >
                {/* fot the step indicator */}
                <div className={` flex flex-col w-full text-sm sm:text-base gap-1 align-middle justify-around`}>
                    <div className=' w-full md:w-[60%]  mx-auto flex flex-row justify-around px-5'>
                        <p className={`mr-auto font-bold text-[x-small] sm:text-sm  my-3 ${stepInfo.Step1 ? 'bg-green-600 shadow-md shadow-amber-600 ' : 'shadow-slate-800 border-blue-600 bg-transparent'} border-[1px] rounded-sm shadow-md  p-1 h-fit w-fit  `} >Step-1</p>
                        <p className=' mx-auto my-auto text-center font-semibold'>Select Academic Year.</p>
                        <IoIosCloudDone className={` sm:text-xl   ml-auto ${stepInfo.Step1 ? ' text-green-600' : ' text-gray-600' } my-auto text-base `} />
                    </div>
                    <div className={` sm:mx-auto max-w-[500px]  px-2 ${ExpandAcademic ? 'flex flex-wrap sm:flex-nowrap flex-row justify-around gap-4' : 'z-0 h-1 hidden opacity-0'} `}>
                        <select onChange={AcademicChange} className={ ` w-[40%] outline-none p-2  sm:w-[20%] mx-auto min-w-fit ${ExpandAcademic ? 'flex flex-row justify-around' : 'z-0 h-1 hidden opacity-0'} ring-1 ring-slate-800 px-1 text-[small] sm:text-base min-w-fit font-semibold text-slate-800 text-center py-auto border-[1px] border-gray-400 rounded-sm`} name="" id="">
                            <option selected value="null" disabled>Select Form</option>
                            {/* {SubmissionOptions} */}
                            <option className=' '  data-name='Form-1'  value="1">Form 1</option>
                            <option  data-name='Form-2' value="2">Form 2</option>
                            <option  data-name='Form-3' value="3">Form 3</option>
                            <option  data-name='Form-4' value="4">Form 4</option>
                        </select>
                        <input className=' min-w-fit py-2  rounded-sm text-center font-semibold max-w-[100px] ' value={`Academic Year: ${Academic_Num}`} type="text" disabled />
                    </div>
                    <div className={` w-full ${ExpandAcademic ?'flex flex-row justify-around' : 'hidden'} px-4 my-1 `} >
                        <button disabled={Academic_Num == null} onClick={GetInfo} className=' disabled:hover:text-slate-900 p-2 disabled:bg-gray-500 hover:bg-transparent hover:shadow-md hover:shadow-slate-600 transition-all duration-500 hover:text-blue-600 hover:border-blue-600 border-[1px] rounded-sm text-sm font-semibold bg-blue-600 mx-auto min-w-[60px]'>Get</button> 
                    </div>
                    
                </div>
                {/* step 2 */}
                <div className={` ${ !ExpandAcademic ? 'flex flex-col' : 'hidden'} w-full text-sm sm:text-base gap-1 align-middle justify-around`}>
                    <div className=' w-[80%] md:w-[60%] mx-auto flex flex-row justify-around px-5'>
                        <p className={`mr-auto font-bold text-[x-small] sm:text-sm my-3 ${stepInfo.Step2 ? 'bg-green-600 shadow-md shadow-amber-600' : 'shadow-slate-800 border-blue-600 bg-transparent'} border-[1px] rounded-sm shadow-md  p-1 h-fit w-fit  `} >Step-2</p>
                        <p className=' mx-auto my-auto text-center font-semibold'>Add New Students</p>
                        <IoIosCloudDone className={` sm:text-xl ml-auto ${stepInfo.Step2 ? ' text-green-600' : ' text-gray-600' } my-auto text-base `} />

                    </div>

                    <div id='TableDiv' style={{display : `${HideTable ? ' hidden': 'flex'}`}}  className={` ${ExpandStudents  ?'flex flex-col ' : 'hidden'}  overflow-auto white-space-nowrap `}>
                        <span className={` mt-3 ${ StudenInfo[0] ? 'sm:flex grid grid-cols-2 my-2 sm:flex-row' : 'hidden'} gap-1 mx-auto w-fit text-[x-small] sm:font-semibold font-bold sm:text-sm `}>Empty Students capacity: <p className=" w-fit text-center text-pink-600 font-bold">{StudentStatus != 'null' ? StudentStatus : 'null'}</p> Max Students Capacity: <p className=" w-fit text-center text-pink-600 font-bold" >160</p>  </span>
                        <table    className={` ${!HideTable ? '' : 'hidden'} border-[1px] border-slate-900 mx-auto p-1  whitespace-nowrap sticky top-0 `} >
                            <tbody   className="  w-fit">
                                {StudenInfo.map((row, rowIndex) => (
                                <tr id={`row${rowIndex}`} className='  hover:border-b-red-600 cursor-text hover:bg-slate-300 w-fit min-h-fit h-8 border-[1px] mx-1 border-slate-400' key={rowIndex}>
                                    {row.map((cell, colIndex) => (
                                    <td className={` px-1  min-w-fit ${colIndex == 0   ? ' sticky left-0 z-50 bg-slate-800  text-slate-100 text-xs' : 'text-sm'} ${rowIndex == 0 ? 'font-semibold bg-slate-800 text-slate-100 text-center' : ''} rounded-[1px] border-l-[1px] border-slate-400 w-fit  hover:border-slate-900  outline-none text-left sm:text-base `}
                                    key={colIndex} contentEditable={ rowIndex != 0}  suppressContentEditableWarning={true} 
                                    onBlur={(e) => handleCellChange(rowIndex, colIndex, e.target.textContent)}>
                                        {cell != '' ? cell : ''}
                                    </td>
                                    ))}
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className=" z-[100%] my-auto sticky w-full flex flex-row justify-around bg-slate-300 bottom-0">
                        <div className={` py-1 ${ StudenInfo[0] ? 'flex flex-row' : 'hidden'} justify-around w-[50%] `} >
                            <FaAnglesLeft onClick={() => handleScroll('left')} className="my-auto hover:text-purple-700  " /> <FaAnglesRight onClick={() => handleScroll('right')} className="my-auto hover:text-purple-700  " />
                        </div>
                        <div className={`my-auto py-1 ${ StudenInfo[0] ? 'flex flex-row' : 'hidden'} justify-around w-[50%] `} >
                            <button onClick={() => setHideTable(true)} className=" text-xs font-semibold p-1 hover:bg-slate-800 hover:text-slate-100 sm:text-sm rounded-sm text-slate-800 bg-slate-100 selection:bg-none select-none ">Hide Table</button>
                            <button onClick={() => setHideTable(false)} className=" text-xs font-semibold p-1 hover:bg-slate-800 hover:text-slate-100 sm:text-sm rounded-sm text-slate-800 bg-slate-100 selection:bg-none  select-none">Unhide Table</button>
                        </div>
                    </div> 
                    

                    <div className={` w-full ${ExpandStudents ?'flex flex-row justify-around' : 'hidden'} px-4 my-1 `} >
                        <button disabled={false} onClick={() => PushBack(1)} className={`  disabled:hover:text-slate-900 p-2 disabled:bg-gray-500 hover:bg-transparent transition-all duration-500 hover:text-blue-600 hover:border-blue-600 border-[1px] rounded-sm text-sm font-semibold bg-blue-600 mx-auto min-w-[60px] `}>Back</button> 
                        <button disabled={false} onClick={() => PushStep(2)} className=' disabled:hover:text-slate-900 p-2 disabled:bg-gray-500 hover:bg-transparent transition-all duration-500 hover:text-blue-600 hover:border-blue-600 border-[1px] rounded-sm text-sm font-semibold bg-blue-600 mx-auto min-w-[60px]'>Next</button> 
                    </div>
                    
                </div>
                {/* finaly */}
                <div className={` ${ !ExpandStudents ? 'flex flex-col' : 'hidden'} w-full text-sm sm:text-base gap-1 align-middle justify-around`}>
                    <div className=' w-[80%] md:w-[60%] mx-auto flex flex-row justify-around px-5'>
                        <p className={` sm:text-sm mr-auto font-bold text-[x-small] my-3 ${stepInfo.Step3 ? 'bg-green-600 shadow-md shadow-amber-600' : 'shadow-slate-800 border-blue-600 bg-transparent'} border-[1px] rounded-sm shadow-md  p-1 h-fit w-fit  `} >Final</p>
                        <p className=' mx-auto my-auto text-center font-semibold'>Submission.</p>
                        <IoIosCloudDone className={` sm:text-xl  ml-auto ${stepInfo.Step3 ? ' text-green-600' : ' text-gray-600' } my-auto text-base `} />
                    </div>                    
                    
                    <div className={` max-w-[600px] mx-auto w-full ${ExpandFinally ?'flex flex-row justify-around' : 'hidden'} px-4 my-1 `} >
                        <button disabled={false} onClick={() => PushBack(2)} className={` hover:shadow-md hover:shadow-slate-600 disabled:hover:text-slate-900 p-2 disabled:bg-gray-500 hover:bg-transparent transition-all duration-500 hover:text-blue-600 hover:border-blue-600 border-[1px] rounded-sm text-sm font-semibold bg-blue-600 mx-auto min-w-[60px] `}>Back</button> 
                        <button onClick={() => SubmitFunc(3)} disabled={false}  className=' disabled:hover:text-slate-900 p-2 disabled:bg-gray-500 hover:bg-transparent transition-all duration-500 hover:text-amber-600 hover:border-blue-600 border-[1px] rounded-sm text-sm font-semibold ring-1 ring-pink-600 bg-amber-600 mx-auto min-w-[60px]'>Submit</button> 
                    </div>
                    
                </div>

                <FaLongArrowAltLeft onClick={ScrollTop} id="BtnTop" title='Scroll to top'  className=" rotate-90 z-50 cursor-pointer sm:text-lg overflow-hidden  bottom-12 hover:text-slate-950 text-pink-600 " />

                </div>
            </div>

            <div onClick={() => setShowPubmish((e) => (!e))} className=" ml-1 overflow-hidden border-[1px] h-fit text-center align-middle shadow-sm border-slate-800 rounded-sm w-fit my-1 cursor-pointer" >
                <span className="text-[x-small] my-1 font-bold justify-around rounded-md mx-auto text-center pl-1  w-fit h-fit sm:pr-4  align-middle sm:text-sm sm:font-semibold animate-pulse flex flex-row gap-1 transition-all duration-500">Review-Publish<HiAdjustmentsVertical   className=" my-auto  text-center text-red-700 font-semibold" /> </span>
            </div>

            <div className={` transition-all duration-500      border-slate-800 rounded-sm ${ShowPubmish ? ' p-2 translate-y-0 w-full border-0' : ' w-[80%] mx-auto border-[1px] min-w-fit  p-1  h-1 translate-y-2 py-auto  mb-4 bg-slate-600 shadow-sm shadow-pink-600'}   justify-around flex gap-1 `} >                  
                <div  className={` w-full sm:w-[90%] transition-all duration-500 px-3 shadow-slate-700 shadow-sm pl-4 mx-auto ${ShowPubmish ? 'flex flex-col' : 'hidden'} transition-all duration-500  justify-around text-center `} >
                {/*manipulation of review and publish */}
                    <div className={` w-full flex flex-col mx-auto`}>
                        <p className=' m-auto font-mono text-sm lg:text-base px-3 py-2' >Publishing reviewed data makes it to be permanently applied to the system.</p>
                        <div className=' border-b-[1px] border-b-slate-600 w-full grid grid-cols-3 md:flex md:flex-row gap-1  my-auto py-2'>
                            <span className=" md:min-w-fit my-auto col-span-3  text-[x-small] font-bold justify-around rounded-md mx-auto text-center pl-1  w-fit h-fit sm:pr-4  align-middle sm:text-sm sm:font-semibold animate-pulse flex flex-row gap-1 transition-all duration-500">Academic-Year: 1</span>
                            <div className=' flex flex-wrap gap-2 flex-row w-full col-span-3  justify-around'>
                                <select onChange={GeneralDataChange} className={` py-2 sm:w-[20%] mx-auto w-fit ${ShowPubmish ? 'flex flex-row justify-around' : 'z-0 h-1 hidden opacity-0'}    outline-slate-500 px-1 text-[small] sm:text-base min-w-fit font-semibold text-slate-800 text-center my-auto py-auto border-[1px] border-gray-400 rounded-sm`} name="form" id="form">
                                    <option selected value="null" disabled>Select Form</option>
                                    {/* {SubmissionOptions} */}
                                    <option value={1} >Form 1</option>
                                    <option value={2}>Form 2</option>
                                    <option value={3} >Form 3</option>
                                    <option value={4} >Form 4</option>
                                </select>
                                <select onChange={GeneralDataChange} className={` py-2 sm:w-[20%] mx-auto w-fit ${ShowPubmish ? 'flex flex-row justify-around' : 'z-0 h-1 hidden opacity-0'}    outline-slate-500 px-1 text-[small] sm:text-base min-w-fit font-semibold text-slate-800 text-center my-auto py-auto border-[1px] border-gray-400 rounded-sm`} name="Term" id="Term">
                                    <option selected value="null" disabled>Select Term</option>
                                    {/* {SubmissionOptions} */}
                                    <option value='Term One' >Term 1</option>
                                    <option value='Term Two' >Term 2</option>
                                    <option value='Term Three' >Term 3</option>
                                </select>
                                <select style={{'display' : Number(GeneralData.form) == 4 && GeneralData.Term == 'Term Three' ? 'none' : 'flex'}} onChange={GeneralDataChange} className={` py-2 sm:w-[20%] mx-auto w-fit ${ShowPubmish ? 'flex flex-row justify-around' : 'z-0 h-1 hidden opacity-0'} my-auto outline-slate-500 px-1 text-[small] sm:text-base min-w-fit font-semibold text-slate-800 text-center py-auto border-[1px] border-gray-400 rounded-sm`} name="Exam-Type" id="Exam-Type">
                                        <option selected value="null" disabled>Select Exam</option>
                                        {/* {SubmissionOptions} */}
                                        <option value={1} >Opener Exam</option>
                                        <option value={2} >MidTerm Exam</option>
                                        <option value={3} >EndTerm Exam</option>
                                </select>
                            </div>
                            
                            <div className={` w-full ${ShowPubmish ?'flex flex-col gap-2 sm:gap-1 sm:flex-row justify-around' : 'hidden'} col-span-3 py-2 w-[80%] mx-auto my-auto  `} >
                                <button disabled={DisableBtns || GeneralData.form == 'null' || GeneralData.Term == 'null' || GeneralData['Exam-Type'] == 'null'} onClick={() => GetReview(1)}  className={`  disabled:hover:text-slate-900 p-2  disabled:bg-gray-500 hover:bg-transparent transition-all duration-500 hover:shadow-md hover:shadow-slate-600 hover:text-blue-600 hover:border-blue-600 border-[1px] rounded-sm text-sm font-semibold bg-blue-600 mx-auto min-w-[60px] `} >Review Marks</button> 
                                <button disabled={DisableBtns || !ReviewInfo[0] || CallingYear != 1 } onClick={() => SubmitReview(1)}  className=' disabled:hover:text-slate-900 p-2 disabled:bg-gray-500 hover:bg-transparent transition-all duration-500 hover:shadow-md hover:shadow-blue-600 hover:text-amber-600 hover:border-blue-600 border-[1px] rounded-sm text-sm font-semibold ring-1 ring-pink-600 bg-amber-600  mx-auto min-w-[60px]'>Pubmish Marks</button> 
                            </div>

                        </div>

                        <div className='border-b-[1px] border-b-slate-600 w-full grid grid-cols-3 md:flex md:flex-row gap-1  my-auto py-2'>
                            <span className=" md:min-w-fit my-auto col-span-3  text-[x-small] font-bold justify-around rounded-md mx-auto text-center pl-1  w-fit h-fit sm:pr-4  align-middle sm:text-sm sm:font-semibold animate-pulse flex flex-row gap-1 transition-all duration-500">Academic-Year: 2</span>
                            <div className=' flex flex-row flex-wrap gap-2 w-full col-span-3  justify-around'>
                                <select onClick={GeneralDataChange2}  className={`my-auto py-2 sm:w-[20%] mx-auto w-fit ${ShowPubmish ? 'flex flex-row justify-around' : 'z-0 h-1 hidden opacity-0'}    outline-slate-500 px-1 text-[small] sm:text-base min-w-fit font-semibold text-slate-800 text-center py-auto border-[1px] border-gray-400 rounded-sm`} name="form" id="">
                                    <option selected value="null" disabled>Select Form</option>
                                    {/* {SubmissionOptions} */}
                                    <option value={1} >Form 1</option>
                                    <option value={2}>Form 2</option>
                                    <option value={3} >Form 3</option>
                                    <option value={4} >Form 4</option>
                                </select>
                                <select onClick={GeneralDataChange2}  className={`my-auto py-2 sm:w-[20%] mx-auto w-fit ${ShowPubmish ? 'flex flex-row justify-around' : 'z-0 h-1 hidden opacity-0'}    outline-slate-500 px-1 text-[small] sm:text-base min-w-fit font-semibold text-slate-800 text-center py-auto border-[1px] border-gray-400 rounded-sm`} name="Term" id="">
                                    <option selected value="null" disabled>Select Term</option>
                                    {/* {SubmissionOptions} */}
                                    <option value='Term One' >Term 1</option>
                                    <option value='Term Two' >Term 2</option>
                                    <option value='Term Three' >Term 3</option>
                                </select>
                                <select style={{'display' : Number(GeneralData2.form) == 4 && GeneralData2.Term == 'Term Three' ? 'none' : 'flex'}} onClick={GeneralDataChange2}  className={`my-auto py-2 sm:w-[20%] mx-auto w-fit ${ShowPubmish ? 'flex flex-row justify-around' : 'z-0 h-1 hidden opacity-0'}    outline-slate-500 px-1 text-[small] sm:text-base min-w-fit font-semibold text-slate-800 text-center py-auto border-[1px] border-gray-400 rounded-sm`} name="Exam-Type" id="">
                                        <option selected value="null" disabled>Select Exam</option>
                                        {/* {SubmissionOptions} */}
                                        <option value={1} >Opener Exam</option>
                                        <option value={2} >MidTerm Exam</option>
                                        <option value={3} >EndTerm Exam</option>
                                </select>
                            </div>
                            
                            <div className={` w-full ${ShowPubmish ?'flex flex-col gap-2 sm:gap-1 sm:flex-row justify-around' : 'hidden'} col-span-3 py-2 w-[80%] mx-auto my-auto `} >
                                <button onClick={() => GetReview(2)}  disabled={DisableBtns || GeneralData2.form == 'null' || GeneralData2.Term == 'null' || GeneralData2['Exam-Type'] == 'null'}  className={`  disabled:hover:text-slate-900 p-2 disabled:bg-gray-500 hover:bg-transparent transition-all duration-500 hover:shadow-md hover:shadow-slate-600 hover:text-blue-600 hover:border-blue-600 border-[1px] rounded-sm text-sm font-semibold bg-blue-600 mx-auto min-w-[60px] `}>Review Marks</button> 
                                <button onClick={() => SubmitReview(2)} disabled={DisableBtns || !ReviewInfo[0] || CallingYear != 2}  className=' disabled:hover:text-slate-900 p-2 disabled:bg-gray-500 hover:bg-transparent transition-all duration-500 hover:shadow-md hover:shadow-blue-600 hover:text-amber-600 hover:border-blue-600 border-[1px] rounded-sm text-sm font-semibold ring-1 ring-pink-600 bg-amber-600 mx-auto min-w-[60px]'>Pubmish Marks</button> 
                            </div>

                        </div>

                        <div className='border-b-[1px] border-b-slate-600 w-full grid grid-cols-3 md:flex md:flex-row gap-1  my-auto py-2'>
                            <span className=" md:min-w-fit my-auto col-span-3  text-[x-small] font-bold justify-around rounded-md mx-auto text-center pl-1  w-fit h-fit sm:pr-4  align-middle sm:text-sm sm:font-semibold animate-pulse flex flex-row gap-1 transition-all duration-500">Academic-Year: 3</span>
                            <div className=' flex flex-row flex-wrap gap-2 w-full col-span-3  justify-around'>
                                <select onClick={GeneralDataChange3}  className={`my-auto py-2 sm:w-[20%] mx-auto w-fit ${ShowPubmish ? 'flex flex-row justify-around' : 'z-0 h-1 hidden opacity-0'}    outline-slate-500 px-1 text-[small] sm:text-base min-w-fit font-semibold text-slate-800 text-center py-auto border-[1px] border-gray-400 rounded-sm`} name="form" id="">
                                    <option selected value="null" disabled>Select Form</option>
                                    {/* {SubmissionOptions} */}
                                    <option value={1} >Form 1</option>
                                    <option value={2}>Form 2</option>
                                    <option value={3} >Form 3</option>
                                    <option value={4} >Form 4</option>
                                </select>
                                <select onClick={GeneralDataChange3}  className={`my-auto py-2 sm:w-[20%] mx-auto w-fit ${ShowPubmish ? 'flex flex-row justify-around' : 'z-0 h-1 hidden opacity-0'}    outline-slate-500 px-1 text-[small] sm:text-base min-w-fit font-semibold text-slate-800 text-center py-auto border-[1px] border-gray-400 rounded-sm`} name="Term" id="">
                                    <option selected value="null" disabled>Select Term</option>
                                    {/* {SubmissionOptions} */}
                                    <option value='Term One' >Term 1</option>
                                    <option value='Term Two' >Term 2</option>
                                    <option value='Term Three' >Term 3</option>
                                </select>
                                <select style={{'display' : Number(GeneralData3.form) == 4 && GeneralData3.Term == 'Term Three' ? 'none' : 'flex'}} onClick={GeneralDataChange3}  className={`my-auto py-2 sm:w-[20%] mx-auto w-fit ${ShowPubmish ? 'flex flex-row justify-around' : 'z-0 h-1 hidden opacity-0'}    outline-slate-500 px-1 text-[small] sm:text-base min-w-fit font-semibold text-slate-800 text-center py-auto border-[1px] border-gray-400 rounded-sm`} name="Exam-Type" id="">
                                        <option selected value="null" disabled>Select Exam</option>
                                        {/* {SubmissionOptions} */}
                                        <option value={1} >Opener Exam</option>
                                        <option value={2} >MidTerm Exam</option>
                                        <option value={3} >EndTerm Exam</option>
                                </select>
                            </div>
                            
                            <div className={` w-full ${ShowPubmish ?'flex flex-col gap-2 sm:gap-1 sm:flex-row  justify-around' : 'hidden'} col-span-3 py-2 w-[80%] mx-auto my-auto `} >
                                <button onClick={() => GetReview(3)}  disabled={DisableBtns || GeneralData3.form == 'null' || GeneralData3.Term == 'null' || GeneralData3['Exam-Type'] == 'null'}  className={`  disabled:hover:text-slate-900 p-2 disabled:bg-gray-500 hover:bg-transparent transition-all duration-500 hover:shadow-md hover:shadow-slate-600 hover:text-blue-600 hover:border-blue-600 border-[1px] rounded-sm text-sm font-semibold bg-blue-600 mx-auto min-w-[60px] `}>Review Marks</button> 
                                <button onClick={() => SubmitReview(3)} disabled={DisableBtns || !ReviewInfo[0] || CallingYear != 3}  className=' disabled:hover:text-slate-900 p-2 disabled:bg-gray-500 hover:bg-transparent transition-all duration-500 hover:shadow-md hover:shadow-blue-600 hover:text-amber-600 hover:border-blue-600 border-[1px] rounded-sm text-sm font-semibold ring-1 ring-pink-600 bg-amber-600 mx-auto min-w-[60px]'>Pubmish Marks</button> 
                            </div>

                        </div>

                        <div className=' w-full grid grid-cols-3 md:flex md:flex-row gap-1  my-auto py-2'>
                            <span className=" md:min-w-fit my-auto col-span-3  text-[x-small] font-bold justify-around rounded-md mx-auto text-center pl-1  w-fit h-fit sm:pr-4  align-middle sm:text-sm sm:font-semibold animate-pulse flex flex-row gap-1 transition-all duration-500">Academic-Year: 4</span>
                            <div className=' flex flex-row w-full flex-wrap gap-2 col-span-3  justify-around'>
                                <select onClick={GeneralDataChange4} className={`my-auto py-2 sm:w-[20%] mx-auto w-fit ${ShowPubmish ? 'flex flex-row justify-around' : 'z-0 h-1 hidden opacity-0'}    outline-slate-500 px-1 text-[small] sm:text-base min-w-fit font-semibold text-slate-800 text-center py-auto border-[1px] border-gray-400 rounded-sm`} name="form" id="">
                                    <option selected value="null" disabled>Select Form</option>
                                    {/* {SubmissionOptions} */}
                                    <option value={1} >Form 1</option>
                                    <option value={2}>Form 2</option>
                                    <option value={3} >Form 3</option>
                                    <option value={4} >Form 4</option>
                                </select>
                                <select onClick={GeneralDataChange4} className={`my-auto py-2 sm:w-[20%] mx-auto w-fit ${ShowPubmish ? 'flex flex-row justify-around' : 'z-0 h-1 hidden opacity-0'}    outline-slate-500 px-1 text-[small] sm:text-base min-w-fit font-semibold text-slate-800 text-center py-auto border-[1px] border-gray-400 rounded-sm`} name="Term" id="">
                                    <option selected value="null" disabled>Select Term</option>
                                    {/* {SubmissionOptions} */}
                                    <option value='Term One' >Term 1</option>
                                    <option value='Term Two' >Term 2</option>
                                    <option value='Term Three' >Term 3</option>
                                </select>
                                <select style={{'display' : Number(GeneralData4.form) == 4 && GeneralData4.Term == 'Term Three' ? 'none' : 'flex'}} onClick={GeneralDataChange4} className={`my-auto py-2 sm:w-[20%] mx-auto w-fit ${ShowPubmish ? 'flex flex-row justify-around' : 'z-0 h-1 hidden opacity-0'}    outline-slate-500 px-1 text-[small] sm:text-base min-w-fit font-semibold text-slate-800 text-center py-auto border-[1px] border-gray-400 rounded-sm`} name="Exam-Type" id="">
                                        <option selected value="null" disabled>Select Exam</option>
                                        {/* {SubmissionOptions} */}
                                        <option value={1} >Opener Exam</option>
                                        <option value={2} >MidTerm Exam</option>
                                        <option value={3} >EndTerm Exam</option>
                                </select>
                            </div>
                            
                            <div className={`py-2 w-full ${ShowPubmish ?'flex flex-col gap-2 sm:gap-1 sm:flex-row justify-around' : 'hidden'} col-span-3 py-2 w-[80%] mx-auto my-auto `} >
                                <button onClick={() => GetReview(4)}  disabled={DisableBtns || GeneralData4.form == 'null' || GeneralData4.Term == 'null' || GeneralData4['Exam-Type'] == 'null'}  className={`  disabled:hover:text-slate-900 p-2 disabled:bg-gray-500 hover:bg-transparent transition-all duration-500 hover:shadow-md hover:shadow-slate-600 hover:text-blue-600 hover:border-blue-600 border-[1px] rounded-sm text-sm font-semibold bg-blue-600 mx-auto min-w-[60px] `}>Review Marks</button> 
                                <button onClick={()=> SubmitReview(4)} disabled={DisableBtns || !ReviewInfo[0] || CallingYear != 4}  className=' disabled:hover:text-slate-900 p-2 disabled:bg-gray-500 hover:bg-transparent transition-all duration-500 hover:shadow-md hover:shadow-blue-600 hover:text-amber-600 hover:border-blue-600 border-[1px] rounded-sm text-sm font-semibold ring-1 ring-pink-600 bg-amber-600 mx-auto min-w-[60px]'>Pubmish Marks</button> 
                            </div>

                        </div>

                    </div>

                    <div  id='TableDivReview' style={{visibility : `${HideReviewTable ? ' hidden': 'visible'}`}} className={`  ${!HideReviewTable ? 'flex flex-row' : ' '} overflow-auto white-space-nowrap `}>
                            <table ref={TableContainerRef}   className={` border-[1px] border-slate-900 mx-auto p-1  whitespace-nowrap sticky top-0 `} >
                                <tbody ref={tableRef}  className="  w-fit">
                                    {ReviewInfo.map((row, rowIndex) => (
                                    <tr id={`row${rowIndex}`} className=' hover:border-b-red-600 cursor-text hover:bg-slate-300 w-fit min-h-fit h-8 border-[1px] mx-1 border-slate-400' key={rowIndex}>
                                        {row.map((cell, colIndex) => (
                                        <td className={` px-1  min-w-[40px] ${colIndex == 0   ? '  sticky left-0 z-50 bg-slate-600  text-slate-100 text-xs' : 'text-sm'} ${rowIndex == 0 ? 'font-semibold bg-slate-600 text-slate-100 text-center' : ''} rounded-[1px] border-l-[1px] border-slate-400 w-fit min-w-[70px] hover:border-slate-900  outline-none text-left sm:text-base `}
                                        key={colIndex} contentEditable={rowIndex !== 0}  suppressContentEditableWarning={true} 
                                        onBlur={(e) => handleCellChangeReview(rowIndex, colIndex, e.target.textContent)}>
                                            {cell != '' ? cell : ''}
                                        </td>
                                        ))}
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                    </div>

                    <div className=" z-[100%] my-auto sticky w-full flex flex-row justify-around bg-slate-300 bottom-0">
                        <div className={` py-1 ${ ReviewInfo[0] ? 'flex flex-row' : 'hidden'} justify-around w-[50%] `} >
                            <FaAnglesLeft onClick={() => handleScrollReview('left')} className="my-auto hover:text-purple-700  " /> <FaAnglesRight onClick={() => handleScrollReview('right')} className="my-auto hover:text-purple-700  " />
                        </div>
                        <div className={`my-auto py-1 ${ ReviewInfo[0] ? 'flex flex-row' : 'hidden'} justify-around w-[50%] `} >
                            <button onClick={() => setHideReviewTable(true)} className=" text-xs font-semibold p-1 hover:bg-slate-800 hover:text-slate-100 sm:text-sm rounded-sm text-slate-800 bg-slate-100 ">Hide Table</button>
                            <button onClick={() => setHideReviewTable(false)} className=" text-xs font-semibold p-1 hover:bg-slate-800 hover:text-slate-100 sm:text-sm rounded-sm text-slate-800 bg-slate-100 ">Unhide Table</button>
                        </div>
                    </div> 
               

                <FaLongArrowAltLeft onClick={ScrollTop} id="BtnTop" title='Scroll to top'  className=" rotate-90 z-50 cursor-pointer sm:text-lg overflow-hidden  bottom-12 hover:text-slate-950 text-pink-600 " />

                </div>
            </div>
           
        </>
    )
}

const mapStateToProps =  state => ({
    isAuthenticated:state.auth.isAuthenticated,
    
})  

export default connect(mapStateToProps,{SubmitManagenent,SubmitReviewFunc, GetReviewFunc,SubmitStudent,CheckAuthenticated,AddStudent})(Manage)