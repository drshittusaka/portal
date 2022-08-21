// import clientPromise from "../../lib/mongodb";
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
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';




//import {useState, useEffect} from 'react'
const CreateQuiz=({datas, user, subject, quizId, quizPrepared})=>{
  //const [dataState, setDataState] = useState([])
  const subjects = ['', 'English Language', 'Biology', 'Chemistry', 'Mathematics', 'Physics']
    const [data, setData] = useState(datas)
    const [sub, setSub] = useState('')
    const router = useRouter()
    const {data:session, status} = useSession()


    const Item = styled(Paper)(({ theme }) => ({
      backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      ...theme.typography.body2,
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    }));

  useEffect(()=>{
    if(session && user.role != 'Chief Examiner'){ router.push('/home')}
  })

  const savedValues ={
    negFacSba : quizPrepared.negFacSba,
    negFacMc : quizPrepared.negFacMc,
    quizName: quizPrepared.quizName,
    timeAllowedHr : quizPrepared.timeAllowedHr,
    timeAllowedMin : quizPrepared.timeAllowedMin,
    numberOfCandidate :quizPrepared.quizPass.length,
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
    timeAllowedHr : '',
    timeAllowedMin : '',
    negFacSba: '',
    negFacMc: '',
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


  const onDelete= async (quizId, _id)=>{
    try{
    const resp = await fetch(`/api/createQuiz/${quizId}/${_id}`,{
      method : "DELETE",
    })  } catch(e){console.log(e)}
    
    router.reload(`createdQuiz/${quizId}`)
    
  }   
  
  
  const validationSchema= yup.object().shape({
    quizName : yup.string().required(' quiz Name is required')
  //  timeAllowed : yup.number().required('Specify the time allowed for the quiz'),
  })
  

  const onClick= async ()=>{
    
  }
  
  // const handleClick =()=>{
   
  //  onClick()
  // } 
  
  const onSubmit= async (values) =>{

    let quizPass = Array(values.numberOfCandidate).fill("")
    quizPass = quizPass.map((e, index) => {
      return (quizPass[index] = Math.random()
        .toString(36)
        .substring(2, 4));
    })
    
    
     let timeHr = values.timeAllowedHr ? values.timeAllowedHr : 0
     let timeMin = values.timeAllowedMin ? values.timeAllowedMin : 0
    
   let selectedQuestions = { 
    negFacSba : values.negFacSba,
    negFacMc : values.negFacMc,
    author : user.email,
    quizName: values.quizName,
     timeAllowed: timeHr * 60 * 60 + timeMin * 60,
     quizPass:quizPass,
     questions : values.questions.filter((question)=> question.selected === true)
   }
   
   const response = await fetch(
    `/api/createQuiz/${quizId}`,
    { method : 'PUT',
     body : JSON.stringify(
        selectedQuestions
     ),
      headers: {
       'Content-Type': 'application/json'
     }
    })
    .then( 
      router.reload(window.location.pathname))
    .catch((e)=> {alert(e)})
    
  }
 
  
  if (session && user.role === 'Chief Examiner'){ 
  
    return(
 <>
  
  <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6} >
          <Item><form>
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
      <Field name='numberOfCandidate' type='number' placeHolder='Number of excess candidate to add' />
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
  }</Formik></Item>
        </Grid>
        <Grid item xs={6}>
          <Item>



          {
    quizPrepared.questions.map(({_id, subject, question, questionType, answers, author}, index)=>{
      return(<div key={_id}>
      <h2> Subject {subject}</h2><h2> {questionType} </h2> { user.role==='Admin' ? <h2> {author} </h2> : null }
   
      <h2> {question} </h2>
      <p>
      {answers.map(({answer, is_correct}, index)=>{
        return (<div key={index}>
          <p>{index} {answer}    {is_correct ? 'True' : null}</p>
        </div>)
      })}
      </p>
      <button type='button' onClick={() => onDelete(quizId,_id)}>DELETE</button>
     
 
    </div>  )
    })
   }
   

    </Item>
        </Grid>
       
      </Grid>
    </Box>
  
  </> )}

  return<><h1>You are not authorized to view this page</h1></>

 }
export default CreateQuiz



export async function getServerSideProps(context){
  const ObjectId = require('mongodb').ObjectId;
  const {params, query} = context
  let {subject} = query
  const client = await clientPromise;
  const db = client.db("StudentPortal");
  const session = await getSession(context)
  const email = session.user.email
  const users = await db.collection("users").findOne({email : email})
  const user = await JSON.parse(JSON.stringify(users))
  // const quizPreparedRaw = await db.collection("Quiz").find({_id: new ObjectId(params.quizId)}) // : await db.collection("Question Bank").find().toArray()
  // const quizPrepared = await JSON.parse(JSON.stringify(quizPreparedRaw))
  const quizPreparedRaw = await fetch(`http://localhost:3000/api/createQuiz/${params.quizId}`)
  const quizPrepared = await quizPreparedRaw.json()

  const queryString = subject != ' ' && subject != undefined ? {subject : subject} : null
  const questionPerSubject = await db.collection("Question Bank").find(queryString).toArray() // : await db.collection("Question Bank").find().toArray()
  const questionPerSubjects = await JSON.parse(JSON.stringify(questionPerSubject))


 
 const{questions} = quizPrepared
  const question = await db.collection("Question Bank").find().toArray() // : await db.collection("Question Bank").find().toArray()
  const bankQuestions = await JSON.parse(JSON.stringify(question))
  

  // const unCommon =(quest, quizQuest)=>{
  //    let res = []
   
  //   quizQuest.map((elements, i)=>{

  //     quest.map((element, i)=>{
  //       if(elements._id != element._id){res.push(element)}
  //     })
  //    // if(quest.includes(element) === false){res.push(element)}
  //   })
  //   return res
  // }

  function getDifference(array1, array2) {
    return array1.filter(object1 => {
      return !array2.some(object2 => {
        return object1._id === object2._id;
      });
    });
  }



  return {
    props : {
      datas : getDifference(bankQuestions, questions), user : user, subject : subject ? subject : null, quizId : params.quizId,
      quizPrepared : subject ? questionPerSubjects : quizPrepared
    }
  }
}




