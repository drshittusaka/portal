import {useRouter} from 'next/router';
import Link from 'next/link' 
import {Formik, Form, Field, FieldArray, ErrorMessage} from 'formik';
import * as yup from 'yup';
import ValidationError from 'yup';
import {useSWR} from 'swr';
import {useState, useEffect} from 'react'
import axios from 'axios'
import clientPromise from "../../lib/mongodb";
import { getSession, useSession } from 'next-auth/react';


//import {useState, useEffect} from 'react'
const AttemptQuiz=({data, user})=>{

  const { quizName, timeAllowed, questions, negFacSba, negFacMc, _id} = data
  const totalSba = (questions.filter((sB)=>(sB.questionType==="Single Best Answer"))).length
  const allMc = (questions.filter((mC)=>(mC.questionType==="Multiple Choice")))
  let allMcq = allMc.map((element)=>element.answers.length)
  let totalMcq = allMcq.reduce((prev, curr)=> {return prev + curr}, 0)

  const [response, setResponse] = useState([])
  const [timer, setTimer] = useState(timeAllowed)
  const router = useRouter()
  //const [rightSba, setRightSba]= useState(0)
  //const [wrongSba, setWrongSba]= useState(0)
  //const [rightMcq, setRightMcq] = useState(0)
//  const [wrongMcq, setWrongMcq]= useState(0)
  
  const onSubmit= async () =>{
    let attemptedSba= response.filter((res)=>(res.questionType === 'Single Best Answer'))
    let correctSba= attemptedSba.filter((res)=>(res.is_correct === true))
    correctSba = correctSba.length
    let negSba = attemptedSba - correctSba
    negSba = negSba * negFacSba
    let sbaScore= correctSba - negSba
   // setRightSba(correctSba)
    let attemptedMcq= response.filter((res)=>(res.questionType === 'Multiple Choice'))
    //let attemptedMcqOptions = attemptedMcqQuestions.map((element)=>(element.answers))
     // let attemptedMcq =  attemptedMcqOptions.reduce((prev, curr)=> {return prev + curr}, 0)
    let correctMcq= attemptedMcq.filter((res)=>(res.is_correct === res.choice) || (res.is_correct === undefined && res.choice === false))
    correctMcq = correctMcq.length
    let negMcq = attemptedMcq.length - correctMcq
    negMcq = negMcq * negFacMc
    let mcqScore = correctMcq - negMcq

    let scoreTotal = ((mcqScore + sbaScore)/(totalSba + totalMcq))*100
  //  setRightMcq(correctMcq) 

  const attemptedQuiz ={
    quizName: quizName,
        quizId : _id,
        candidate : user,
        response,
        attemptedSBA: attemptedSba.length,
        correctSBA : correctSba,
        totalSBA : totalSba,
        negFacSBA : negFacSba,
        attemptedMCQ: attemptedMcq,
        correctMCQ : correctMcq,
        totalMCQ : totalMcq,
        negFacMCQ : negFacMc, 
        score : scoreTotal ,
        remainingTime : timer
  
  }
    
    const resp = await fetch(
     '/api/attemptedQuiz',
     { method : 'POST',
      body : JSON.stringify({
        attemptedQuiz
            }),
       headers: {
        'Content-Type': 'application/json'
      }
     })
     .then(router.push('/home'))
     .catch((e)=> {alert(e)}) 

     
     await fetch(
       `/api/createProfile/${user.email}`,
      { method : 'POST',
       body : JSON.stringify({
        attemptedQuiz
       }),
        headers: {
         'Content-Type': 'application/json'
       }
      })
      .then(router.push('/home'))
      .catch((e)=> {alert(e)}) 

    
    alert('SUBMITTED') 
  } 
  
  useEffect(()=>{
    timer > 0 && setTimeout(()=>setTimer(timer-1),1000)
    timer === 0 && alert('Time up') 
  },[timer])
  
  

  return(
  <>

  
  
  
  <h1>The Quiz Title : {quizName}</h1>
  <h1>Time Allowed : {timer}</h1>
  <form onSubmit={onSubmit}>
  {
    questions.map(({_id, questionType, question, answers}, index)=>(
    <div key={_id}><h2>{index+=1}. {question}</h2><br/><div>{
     questionType === 'Single Best Answer' && (answers.map(({answer, is_correct},i)=>(
      <div key={i}>
      <input type='radio' name={_id} value={{questionType:questionType, _id: _id, index : index, question : question, answer : answer, is_correct : is_correct}} 
       onChange = {()=> setResponse(response=>[...response.filter((resp)=>(resp._id !== _id)), {questionType: questionType, _id: _id, index: index, question : question, answer : answer, is_correct : is_correct}])} 
      />
      <label htmlFor= {answer}>{answer}</label>
      </div>
      )))
    }</div><div>
      {
     questionType === 'Multiple Choice' && (answers.map(({answer, is_correct, choice},i)=>(
      <div key={i}>
      True<input type='radio' name={`${_id}${i}`} value={{questionType: questionType, _id: _id, index : index, i: i, question : question, answer : answer, is_correct : is_correct, choice: true }}
        
       onChange= {()=>setResponse(response=>[...response.filter((resp)=>(resp._id !== !_id && resp.i !== i)), {questionType: questionType, _id: _id, index: index, i: i, question : question, answer : answer, is_correct : is_correct, choice: true }])}
        />
        False<input type='radio' name={`${_id}${i}`} value={{questionType: questionType, _id: _id, index: index, i: i, question : question, answer : answer, is_correct : is_correct, choice: false }} 
        onChange = {()=>setResponse(response=>[...response.filter((resp)=>(resp._id !== !_id && resp.i !== i)), {questionType: questionType, _id: _id, index: index, i: i, question : question, answer : answer, is_correct : is_correct, choice: false}])}
        />
      <label htmlFor= {answer}>{answer}</label>
      </div>
      )))
    }
    </div></div>
    ))
  }
  <button type='submit'>Submit</button>
 </form>
  
  </>) 
  
}
 
export default AttemptQuiz




export async function getServerSideProps(context) {
 const { params } = context
  const {quizId} = params
  

  const ObjectId = require('mongodb').ObjectId;
  const client = await clientPromise;
  const db = client.db("StudentPortal");
  const session = await getSession(context)
  const email = session.user.email
  const users = await db.collection("users").findOne({email : email})
  const user = await JSON.parse(JSON.stringify(users))

  const questionPerSubject = await db.collection("Quiz").findOne({quizName: quizId[0]})// : await db.collection("Question Bank").find().toArray()
  const question = await JSON.parse(JSON.stringify(questionPerSubject))
  const {quizPass, _id} = question
  const isPass = quizPass.includes(quizId[1])
  isPass && await db.collection("Quiz").updateOne({_id: new ObjectId(_id)}, {$pull : {'quizPass': quizId[1]}})

  if(!isPass){
    return {redirect: {permanent: false, destination: `/home`}}}
        //user: user
      
  

 if(isPass){
  return {
    props: {
      data : question,
      user: user
    }
  }
 }
}









