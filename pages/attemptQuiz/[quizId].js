import {useRouter} from 'next/router';
import Link from 'next/link' 
import {Formik, Form, Field, FieldArray, ErrorMessage} from 'formik';
import * as yup from 'yup';
import ValidationError from 'yup';
import {useSWR} from 'swr';
import {useState, useEffect} from 'react'
import axios from 'axios'


//import {useState, useEffect} from 'react'
const AttemptQuiz=({data})=>{
  const { quizName, timeAllowed, questions, negFacSba, negFacMc} = data
  const totalSba = (questions.filter((sB)=>(sB.questionType==="Single Best Answer"))).length
  const totalMcq = (questions.filter((mC)=>(mC.questionType==="Multiple Choice"))).length
  const [response, setResponse] = useState([])
  const [timer, setTimer] = useState(timeAllowed)
  //const [rightSba, setRightSba]= useState(0)
  //const [wrongSba, setWrongSba]= useState(0)
  //const [rightMcq, setRightMcq] = useState(0)
//  const [wrongMcq, setWrongMcq]= useState(0)
  
  const onSubmit= async () =>{
    let attemptedSba= response.filter((res)=>(res.questionType === 'Single Best Answer'))
    let correctSba= attemptedSba.filter((res)=>(res.is_correct === true))
    correctSba = correctSba.length
    const negSba = attemptedSba - correctSba
    negSba = negSba * negFacSba
   // setRightSba(correctSba)
    let attemptedMcq= response.filter((res)=>(res.questionType === 'Multiple Choice'))
     let correctMcq= attemptedMcq.filter((res)=>(res.is_correct === res.choice))
    correctMcq = correctMcq.length
    const negMcq = attemptedMcq - correctMcq
    negMcq = negMcq * megFacMcq
  //  setRightMcq(correctMcq) 
    
    const resp = await fetch(
     '/api/attemptedQuiz',
     { method : 'POST',
      body : JSON.stringify({
        response,
        correctSBA : correctSba,
        totalSBA : totalSba,
        negFacSBA : negFacSba,
        correctMCQ : correctMcq,
        totalMCQ : totalMcq,
        negFacMCQ : negFacMc, 
        score : totalMcq - negMcq + totalSba - negSba,
        remainingTime : timer
      }),
       headers: {
        'Content-Type': 'application/json'
      }
     })
     .then(alert(JSON.stringify(totalCorrect)))
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
  const response = await fetch(
    `http://localhost:3000/api/createQuiz/${params.quizId}`
  )
  const question = await response.json()

  return {
    props: {
      data : question
    }
  }
}










 /** 

import {useRouter} from 'next/router';
import Link from 'next/link' 
import {Formik, Form, Field, FieldArray, ErrorMessage} from 'formik';
import * as yup from 'yup';
import ValidationError from 'yup';
import {useSWR} from 'swr';
import {useState} from 'react'
import axios from 'axios'


//import {useState, useEffect} from 'react'
const AttemptQuiz=({data})=>{
  const { quizName, timeAllowed, questions} = data
  //const [response, setResponse] = useState([{question : '', answer : '', is_correct : false, choice: false }])
  //response = []
    const savedValues ={
    questions : questions.map(({_id, questionType, question, answers})=>{
    return{
    _id : _id,
      questionType: questionType,
      question: question,
      answers: answers.map(({answer, is_correct, choice})=>{
      return {answer : answer, is_correct : is_correct, choice : choice}  })
      
    }
  })
  }
  
  
  const initialValues ={ 
    quizName: '',
    questions : [{
    _id : '',
    question : '',
    answers : [
    {
      answer : '', is_correct : false, choice : ''
    },
    ]
  }]}
  
  const onSubmit=(values)=>{
    alert(JSON.stringify(values))
  }
  
  
  return(
  <>
  <h1>The Quiz Title : {quizName}</h1>
  <h1>Time Allowed : {timeAllowed}</h1>
 
  <Formik
  initialValues={savedValues || initialValues}
  onSubmit={onSubmit}
  >{
    formik=>{
    return(
       <Form>
      <FieldArray name='questions'>{
        fieldArrayProps=>{
          const {form} = fieldArrayProps
          const {values} = form
          const {questions} = values
          return(<div>{
            questions.map(({_id, questionType, question, answers}, index)=>(
            <div>
            <div>
            <label htmlFor='question'>{index+=1}. {question}</label>
            </div>
            {
              answers.map(({answer, is_correct, choice}, i)=>(
                <div key={i}>
              <FieldArray name='answers'>{
              fieldArrayHelper =>{
                const {push, remove, form} = fieldArrayHelper
                const {values} = form
                const {answers} = values
                return(
                <div>
                <Field name={`questions[${_id}].answers`} value={{question : question, answer : answer, is_correct : is_correct}} type='radio'  />
                
                  </div>
                )
              }
            }</FieldArray>
              </div>))
            }
            </div>
            ))
          }</div>)
        }
      }</FieldArray>
      
      
        <button type='submit' disabled={!formik.isValid || formik.isSubmitting || formik.unTouched }>
              Submit
            </button>
      
      </Form> 
      )
    }
  }</Formik>
  
  
  
  </>) 
  
}
 
export default AttemptQuiz












import {useRouter} from 'next/router';
import Link from 'next/link' 
import {Formik, Form, Field, FieldArray, ErrorMessage} from 'formik';
import * as yup from 'yup';
import ValidationError from 'yup';
import {useSWR} from 'swr';
import {useState} from 'react'
import axios from 'axios'


//import {useState, useEffect} from 'react'
const AttemptQuiz=({data})=>{
  const { quizName, timeAllowed, questions} = data
  const [response, setResponse] = useState([{question : '', answer : '', is_correct : false, choice: false }])
  //response = []
  
  return(
  <>
  <h1>The Quiz Title : {quizName}</h1>
  <h1>Time Allowed : {timeAllowed}</h1>
  <form>
  {
    questions.map(({_id, questionType, question, answers}, index)=>(
    <div key={_id}><h2>{index+=1}. {question}</h2><br/><div>{
     questionType === 'Single Best Answer' && (answers.map(({answer, is_correct},i)=>(
      <div key={i}>
      <input type='radio' name={index} value={{question : question, answer : answer, is_correct : is_correct}} 
        onChange = {response => setResponse([...response, e.target.value])} />
      <label htmlFor= {answer}>{answer}</label>
      </div>
      )))
    }</div><div>
      {
     questionType === 'Multiple Choice' && (answers.map(({answer, is_correct, choice},i)=>(
      <div key={i}>
      True<input type='radio' name={[ index, i]} value={{question : question, answer : answer, is_correct : is_correct, choice: true }}
        
           onChange = {response => setResponse([...response, e.target.value])}
        />
        False<input type='radio' name={[ index, i]} value={{question : question, answer : answer, is_correct : is_correct, choice: false }} 
        onChange = {response => setResponse([...response, e.target.value])}
        />
      <label htmlFor= {answer}>{answer}</label>
      </div>
      )))
    }
    </div></div>
    ))
  }
 </form>
  
  </>) 
  
}
 
export default AttemptQuiz












export async function getServerSideProps(context) {
  const { params } = context
  const response = await fetch(
    `http://localhost:3000/api/createQuiz/${params.quizId}`
  )
  const question = await response.json()

  return {
    props: {
      data : question
    }
  }
}




       // checked={response == response.push({question : question, answer : answer, is_correct : is_correct, choice: false })}


export async function getStaticPaths(context){
  const { params } = context
   const {quizId} = params
  const response = await fetch(
    `http://localhost:3000/api/createQuiz/${quizId}`
  )
  const question = await response.json()
//JSON.parse(JSON.stringify(resp))
  
  
  return{
    paths : {params : {quizId : question._id}}, fallback : false
  }} 



 export async function getStaticPaths(){
  
  const resp = await fetch (`/api/questionBank, {
    method : 'GET',
    headers: {
     'Content-Type' : 'application/json' 
    }
  })
  const questions = await resp.json() //JSON.parse(JSON.stringify(resp))
  const paths = {questions.map(({_id})=>{
    return{
      params : {
      questionId : {_id}
    }
    }
  })}
  return{
    paths : paths, fallback : false
  }
  
}

export async function getStaticProps(context){
  const {params} = context
  const questionId =  params.questionId
  const resp = await db.collection("Question Bank").findOne({_id : new ObjectId(questionId)}).toArray()
  const questions = await resp.json() //JSON.parse(JSON.stringify(resp))
  return {
    props : {
      data : questions
    }, revalidate : 30
  }} **/    