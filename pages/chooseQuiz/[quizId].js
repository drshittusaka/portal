import {Formik, Form, Field, FieldArray, ErrorMessage} from 'formik';
import * as yup from 'yup';
import ValidationError from 'yup';
import {useRouter} from 'next/router';
import {useEffect} from 'react'
//import clientPromise from "../lib/mongodb";
//const ObjectId = require('mongodb').ObjectId;


const CreateQuestion=(props)=>{
  const {data} = props
  useEffect(()=>{console.log(data)}, )
  let answers = []
  const subjects=['','Mathematics', 'English Language', 'Biology', 'Chemistry', 'Physics']
  const questionTypes=['','Single Best Answer', 'Multiple Choice']
  const router = useRouter()
  
  
  const savedValues = {
    _id : data._id,
    subject : data.subject,
    questionType : data.questionType,
    question : data.question,
    answers : data.answers.map(({answer, is_correct})=>{
      return {answer : answer, is_correct : is_correct}  })
  }
  
  
  
  const initialValues = {
    _id : data._id,
    subject : 'initialvalues ',
    questionType : ' ',
    question : 'initialValues',
    answers : [
    {
      answer : ' ', is_correct : false
    },
    ]
  }
  
  const validationSchema = yup.object().shape({
    subject : yup.string().required('This field is required'),
    question : yup.string().required('This field is required'),
    questionType : yup.string().required('This field is required'),
    answers : yup.array().of(
    yup.object().shape({
      answer : yup.string().required('This field is required'),
      is_correct :  yup.boolean()
    })
    ).min(4, 'Options should be 4 or 5').max(5,  'Options should be 4 or 5')
    .when('questionType',{
      is : 'Single Best Answer',
      then : yup.array().test(
    'answers',
    'Only one answer can be correct',
    (answers)=>{
      const count = answers.filter((answer)=>{ return answer.is_correct === true }).length
      if (count === 1){ return true}
     // else return new ValidationError('Only one answer can be correct', undefined, answers)
    }
    ),
     // otherwise : pass
    })
  })
  
   const onSubmit= async (values)=>{
     
    const response = await fetch(
     `http://localhost:3000/api/questionBank/${data._id}`
     ,
     { method : 'PUT',
      body : JSON.stringify(values),
       headers: {
        'Content-Type': 'application/json'
      }
     })
     .then( router.push('/questionBank'))
     .catch((e)=> {alert(e)})
    
   }
 

  return<>
  <h2>Edit Question</h2>
  <Formik
  initialValues = {savedValues || initialValues}
  onSubmit = {onSubmit}
  validationSchema = {validationSchema}
  enableReinitialize
  >
  {formik=>{
    return<Form>
  <div>
  <label htmlFor='Subject'>Select Subject/Course</label>
    <Field as='select'name='subject'>
    {
      subjects.map(subject=>{
        return <option key={subject} value={subject}>{subject}</option>
      })
    }
    </Field>
  <ErrorMessage name='subject' />
  </div>
    
    
    
     <div>
  <label htmlFor='questionType'>Type of Question</label>
    <Field as='select'name='questionType'>
    {
      questionTypes.map(questionType=>{
        return <option key={questionType} value={questionType}>{questionType}</option>
      })
    }
    </Field>
  <ErrorMessage name='questionType' />
  </div>
    
   <div>
  <label htmlFor='question_id'>Question_id</label>
  <Field name='_id' type='text' disabled/>
 <ErrorMessage name='_id' />
  </div>
    
    <div>
  <label htmlFor='question'>Enter Question</label>
  <Field name='question' type='text'/>
 <ErrorMessage name='question' />
  </div>
    <div>
  <label htmlFor='Options'>Enter Choices</label>
  <FieldArray name='answers'>{
    (FieldArrayProps)=>{
      const {push, remove, form} = FieldArrayProps
      const {values} = form
      const {answers} = values
    return( <div> 
      
      <div>{answers.map((answer, index) => (
                        <div key={index}>
                          <Field type='checkbox' name={`answers[${index}].is_correct`} />
                          <Field name={`answers[${index}].answer`} />
                         
                          {index > 0 && (
                            <button type='button' onClick={() => remove(index)}>
                              -
                            </button>
                          )}
                        </div>
                      ))}
      { answers.length < 5 && (<button type='button' onClick={() => push()}>
                        +
                      </button>)}
                    </div>
   </div>)
    }
  }</FieldArray>
 
   
  </div>
    <button type='submit' disabled={!formik.isValid || formik.isSubmitting || formik.unTouched }>
              Submit
            </button>
    
  </Form>}}
  </Formik>
  </>
}

export default CreateQuestion




export async function getStaticProps(context) {
  const { params } = context
  const response = await fetch(
    `http://localhost:3000/api/questionBank/${params.questionId}`
  )
  const question = await response.json()

  return {
    props: {
      data : question
    },
    revalidate: 1
  }
}


 export async function getStaticPaths(){
  
  const resp = await fetch (
   `http://localhost:3000/api/questionBank`
   )
  const questions = await resp.json() //JSON.parse(JSON.stringify(resp))
  
  
  return{
    paths : questions.map((question)=>{
    return{params : {questionId : question._id}}}), fallback : false
  }}


/**
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