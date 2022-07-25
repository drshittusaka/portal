// import clientPromise from "../../lib/mongodb";
import {useRouter} from 'next/router';
import Link from 'next/link' 
import {Formik, Form, Field, FieldArray, ErrorMessage} from 'formik';
import * as yup from 'yup';
import ValidationError from 'yup';
import {useSWR} from 'swr';
import {useState} from 'react'
import axios from 'axios'
import clientPromise from "../lib/mongodb";
import { getSession } from 'next-auth/react';


//import {useState, useEffect} from 'react'
const CreateQuiz=({datas})=>{
  //const [dataState, setDataState] = useState([])
  const subjects = ['', 'English Language', 'Biology', 'Chemistry', 'Mathematics', 'Physics']
    const [data, setData] = useState(datas)
    const [sub, setSub] = useState('')
    const router = useRouter()
  const savedValues ={
    questions : data.map(({_id, subject, questionType, question, answers})=>{
    return{
    _id : _id,
      subject : subject,
      questionType: questionType,
      question: question,
      answers: answers.map(({answer, is_correct})=>{
      return {answer : answer, is_correct : is_correct}  })
      
    }
  })
  }
  
  const initialValues ={ 
    quizName: '',
    questions : [{
    selected: false,
    _id : '',
    subject : '',
    questionType : '',
    question : '',
    answers : [
    {
      answer : '', is_correct : false
    },
    ]
  }]}
  
  
  const validationSchema= yup.object().shape({
    quizName : yup.string().required('Quiz name is required'),
  //  timeAllowed : yup.number().required('Specify the time allowed for the quiz'),
  })
  

  const onClick= async (e)=>{
    const resp = await fetch(`http://localhost:3000/creatQuiz?subject={sub}`
    )
   // .then(resp=>setData(resp.data))
  const questions = await resp.json()
    return setData(questions)
    
      
  }
  
  const handleClick =()=>{
   
   onClick()
  } 
  
  const onSubmit= async (values) =>{
    
     let timeHr = values.timeAllowedHr ? values.timeAllowedHr : 0
     let timeMin = values.timeAllowedMin ? values.timeAllowedMin : 0
    
   let selectedQuestions = { 
   
    quizName: values.quizName,
     timeAllowed: timeHr * 60 * 60 + timeMin * 60,
     questions : values.questions.filter((question)=> question.selected === true)
   }
   
    const response = await fetch(
     '/api/createQuiz',
     { method : 'POST',
      body : JSON.stringify(selectedQuestions),
       headers: {
        'Content-Type': 'application/json'
      }
     })
     .then( 
     router.push('questionBank'))
     .catch((e)=> {alert(e)})
  }

   return(
  <>
  
  <form>
  <select name='subject' defaultValue='' onChange={function(e){setSub(e.target.value)}}>
   <option value='Biology'>Biology</option>
   <option value='Chemistry'>Chemistry</option>
   <option value='English Language'>English Language</option>
   <option value='Mathematics'>Mathematics</option>
   <option value='Physics'>Physics</option>
  </select>
  <button onClick={(e)=>onClick(e)}>Filter Subject</button>
  </form>
  
  <Formik
  initialValues={savedValues || initialValues}
  onSubmit = {onSubmit}
  validationSchema = {validationSchema}
  enableReinitialize
  >{
    formik =>{
    return(
    <Form>
       <div>
      <label>Enter the Quiz Name</label>
      <Field name='quizName'/>
      </div> 
      <div>
      <label>Time allowed </label>
      <Field name='timeAllowedHr' type='number' placeHolder='Hour' />
      <Field name='timeAllowedMin' type='number' placeHolder='Minutes' />
      </div> 
      <FieldArray name='questions'>
      {
        fieldArrayProps =>{
          const {push, remove, form} = fieldArrayProps
          const {values} = form
          const {questions} = values
          return(<div>
          
          {
            questions.map(({_id, subject, questionType, question, answers}, i)=>(
              <div key={_id}>
             
            <div>
            <label>Check the box to select below question for the quiz</label>
            <Field name={`questions[${i}].selected`} type='checkbox' /> </div>
             <Field name={`questions[${_id}].subject`} value={subject} />
             <Field name={`questions[${_id}].questionType`} value={questionType} />
             <Field name={`questions[${_id}].question`} value={question}  />
            {
              answers.map(({answer, is_correct}, index)=>(
                <div key={index}>
              <FieldArray name='answers'>{
              fieldArrayHelper =>{
                const {push, remove, form} = fieldArrayHelper
                const {values} = form
                const {answers} = values
                return(
                <div>
                <Field name={`questions[${_id}].answers[${index}].answer`} value={answer}/>
                <Field name={`questions[${_id}].is_correct[${index}].is_correct`} value={is_correct} />
                  </div>
                )
              }
            }</FieldArray>
              </div>))
            }
            </div>
            ))
          }
         
          </div>)
        }
      }
      </FieldArray> <br/>
          
      
        <button type='submit' disabled={!formik.isValid || formik.isSubmitting || formik.unTouched }>
              Submit
            </button>
      </Form>
    )
  }
  }</Formik>
  </> )

 }
export default CreateQuiz



export async function getServerSideProps(context){
 //const {query} = context
 //let {subject} = query
  /**const client = await clientPromise;
  const db = client.db("StudentPortal")
  const post = subject ? await db.collection("Question Bank").find({subject: subject}).toArray() : await db.collection("Question Bank").find({}).toArray()
   
  const questions = await JSON.parse(JSON.stringify(post)) //JSON.parse(JSON.stringify(resp))
     
  **/
  //const queryString = subject ? `?subject=${subject}` : ''

  const client = await clientPromise;
  const db = client.db("StudentPortal");
  const session = await getSession(context)
  const email = session.user.email
  const question = await db.collection("Question Bank").find({author : email }).toArray();
  const questions = await JSON.parse(JSON.stringify(question))

  /** const resp = await fetch (`http://localhost:3000/api/questionBank${queryString}`
  
  , {
    method : 'GET',
    headers: {
     'Content-Type' : 'application/json' 
    }
  }) **/
  //const questions = await resp.json()
  return {
    props : {
      datas : questions
    }
  }
}




/**
 const CreateQuiz=({data})=>{
  //const [dataState, setDataState] = useState([])
    
  const savedValues ={ questions : [{
    _subject : ' ',
    _questionType : ' ',
    _question : ' ',
    _answers : [
    {
      _answer : ' ', _is_correct : false
    },
    ]
  }]}
  
  const initialValues ={ questions : [{
    
    _subject : ' ',
    _questionType : ' ',
    _question : ' ',
    _answers : [
    {
      _answer : ' ', _is_correct : false
    },
    ]
  }]}
  const onSubmit=(values)=>{
    alert(JSON.stringify(values))
  }

   return(
  <>
  <Formik
  initialValues={initialValues}
  onSubmit = {onSubmit}
  enableReinitialize
  >{
    formik =>{
    return(
    <Form>
      {
        data.map(({_id, subject, questionType, question, answers})=>{
          const [answer, is_correct] = answers
          return( <div key={_id}>
            
      <FieldArray name='questions'>
      {
        fieldArrayProps =>{
          const {push, remove, form} = fieldArrayProps
          const {values} = form
          const {questions} = values
          return(<div>
          
          {
            questions.map(({_subject, _questionType, _question, _answers}, i)=>(
              <div key={i}>
              <Field name={`questions[${i}].selected`} />
             <Field name={`questions[${i}]._subject`} value={subject} />
             <Field name={`questions[${i}]._questionType`} value={questionType} />
             <Field name={`questions[${i}].question`} value={question} />
            {
              answers.map(({answer, is_correct}, index)=>(
                <div key={index}><FieldArray name='answers'>{
              fieldArrayHelper =>{
                const {push, remove, form} = fieldArrayHelper
                const {values} = form
                const {answers} = values
                return(
                <div>{
                  _answers.map(({_answer, _is_correct}, id)=>(
                  
                  <div key={id}>
                   
                   <Field name={`questions[${i}]._answers[${id}]._answer`} value={answer} />
                    <Field name={`questions[${i}]._is_correct[${id}]._is_correct`} value={is_correct} />
                  </div>
                  ))
                }</div>
                )
              }
            }</FieldArray>
              </div>))
            }
            </div>
            ))
          }
         
          </div>)
        }
      }
      </FieldArray> <br/>
              
              
          </div>
          
          )
        })
      } 
      
        <button type='submit'>
              Submit
            </button>
      </Form>
    )
  }
  }</Formik>
  </> )

 }
export default CreateQuiz

**/
