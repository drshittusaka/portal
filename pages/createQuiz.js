// import clientPromise from "../../lib/mongodb";
import {useRouter} from 'next/router';
import Link from 'next/link' 
import {Formik, Form, Field, FieldArray, ErrorMessage} from 'formik';
import * as yup from 'yup';
import ValidationError from 'yup';
import {useSWR} from 'swr';
import {useState, useEffect} from 'react'
import axios from 'axios'
import clientPromise from "../lib/mongodb";
import { getSession, useSession } from 'next-auth/react';


//import {useState, useEffect} from 'react'
const CreateQuiz=({datas, subject, user})=>{
  //const [dataState, setDataState] = useState([])
  const subjects = ['', 'English Language', 'Biology', 'Chemistry', 'Mathematics', 'Physics']
    const [data, setData] = useState(datas)
    const [sub, setSub] = useState('')
    const router = useRouter()
    const {data:session, status} = useSession()

  useEffect(()=>{
    if(session && user.role != 'Chief Examiner'){ router.push('/home')}
  })

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
   // timeAllowed : yup.number().required('Specify the time allowed for the quiz')
  })
  

  const onClick= async ()=>{
    
  }
  
  // const handleClick =()=>{
   
  //  onClick()
  // } 
  
  const onSubmit= async (values) =>{

    let quizPass = Array(values.numberOfCandidates).fill("")
    quizPass = quizPass.map((e, index) => {
      return (quizPass[index] = Math.random()
        .toString(36)
        .substring(2, 4));
    })
    
    
     let timeHr = values.timeAllowedHr ? values.timeAllowedHr : 0
     let timeMin = values.timeAllowedMin ? values.timeAllowedMin : 0
    
   let selectedQuestions = { 
    author : user.email,
    quizName: values.quizName,
    timeAllowedHr : values.timeAllowedHr,
    timeAllowedMin : values.timeAllowedMin,
    negFacSba : values.negFacSba,
    negFacMc : values.negFacMc,
    timeAllowed: timeHr * 60 * 60 + timeMin * 60,
     quizPass:quizPass,
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
     router.push('home'))
     .catch((e)=> {alert(e)})
  }

  if (session && user.role === 'Chief Examiner'){ return(
 <>
  
  <form>
  <select name='subject' onChange={function(e){setSub(e.target.value)}}>
  <option value = ' '>Select Option</option>
  <option value=' '>All questions</option>
   <option value='Biology'>Biology</option>
   <option value='Chemistry'>Chemistry</option>
   <option value='English Language'>English Language</option>
   <option value='Mathematics'>Mathematics</option>
   <option value='Physics'>Physics</option>
  </select>
  <button onClick={onClick}>Filter Subject</button> 
  {/* {sub != undefined ?  : null} */}
  </form>
  {subject ? <h1>The list of {data.length} {subject} questions available</h1> : <h1>The list of all {data.length} questions available</h1>}
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
      <Field name='numberOfCandidates' type='number' placeHolder='Enter number of candidates' />
      <Field name='negFacSba' type='number' placeHolder='Multiplication factor for wrong answer' />
      <Field name='negFacMc' type='number' placeHolder='Multiplication factor for wrong answer' />
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
          
      
        <button type='submit' disabled={!formik.isValid || formik.isSubmitting || !formik.dirty }>
              Submit
            </button>
      </Form>
    )
  }
  }</Formik>
  </> )}

  return<><h1>You are not authorized to view this page</h1></>

 }
export default CreateQuiz



export async function getServerSideProps(context){

  const {query} = context
  let {subject} = query
  const client = await clientPromise;
  const db = client.db("StudentPortal");
  const session = await getSession(context)
  const email = session.user.email
  const users = await db.collection("users").findOne({email : email})
  const user = await JSON.parse(JSON.stringify(users))
  const queryString = subject != ' ' && subject != undefined ? {subject : subject} : null
  const question = await db.collection("Question Bank").find(queryString).toArray() // : await db.collection("Question Bank").find().toArray()
  const questions = await JSON.parse(JSON.stringify(question))
 

  

  return {
    props : {
      datas : questions, subject: subject ? subject : null, user, session:session
    }
  }
}




