import {Formik, Form, Field, FieldArray, ErrorMessage} from 'formik';
import * as yup from 'yup';
import ValidationError from 'yup';
import {useRouter} from 'next/router';
import { useSession, getSession } from 'next-auth/react';
import Link from 'next/link';
import clientPromise from "../lib/mongodb";
import { FileInput, ImageInput } from "formik-file-and-image-input/lib"
import { useState } from 'react';
import { serialize } from 'object-to-formdata';


const CreateQuestion=({user}, session)=>{
 // const { data : session} = useSession()
 let [picture, setPicture] = useState([])
 let [pix, setPix] = useState()


   const subjects=['','Mathematics', 'English Language', 'Biology', 'Chemistry', 'Physics']
  const questionTypes=['','Single Best Answer', 'Multiple Choice']
  const router = useRouter()
  const initialValues = {

    image: [],

    author : user.email,
    subject : ' ',
    questionType : ' ',
    question : ' ',
    answers : [
    
    {
      answer : '', is_correct : false, choice: '' //Add 'choice' to ease Marking Multiple Choice questions in attempte
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
   //const formData = serialize(values)
  const formData = new FormData()
  //delete values.image[0].length
  //delete values.image[0].item
  //for(const img in values.image[0]){formData.append(`${img}`, values.image[0][img])}
//    for (let i = 0; i < values.image[0].length; i++) {
//      formData.append(values.image[0][i].name, values.image[0][i])
//  }



formData.append('image', values.image[0] )

  // const fileList = Array.from(values.image[0])
  // for (let i = 0; i < fileList.length; i++) {
  //   formData.append(fileList[i].name, fileList[0])
  // }

// //  fileList.map((img, i) => {
// //  // const arr =Array.from(img)
// //   formData.append(`img ${i}`,  img)
// //  })
// formData.append('image', fileList)
// formData.append('image', Array.from(values.image[0])[0])
formData.append('body',  JSON.stringify(values))
 // setPicture(fileList)
  //  let fileReader = new FileReader()
  //  fileReader.readAsDataURL(values.image)
  //  fileReader.onload = function(e){
  //   setPicture(e.target.result)
  //  }
    // e.preventDefault
    
     const response = await fetch(
       '/api/questionBank',
    // 'https://api.cloudinary.com/v1_1/zaktech/image/upload',
     { method : 'POST',
      body : formData,
      //  headers: {
      //  // 'Content-Type': 'application/json'
      // }
     })
     .then( r =>console.log (r.json()))
     .catch((e)=> {alert(e.message)})
    //console.log(values.image)
   //  fileList.map((img, i) =>  console.log(img))   
console.log(Array.from(formData))
//console.log(fileList)
   }
 

  if(session ){
   
    return<>
    <h2>Create Question</h2>
   {/* {picture.map((img, i) =>  {
      let fileReader = new FileReader()
    fileReader.readAsDataURL(img)
    fileReader.onload = function(e){
     setPix(e.target.result)
    }
   
  return <div> <img src={pix} width='100px' height='100px' /> </div>})   } */}
    <Formik
    initialValues = {initialValues}
    onSubmit = {onSubmit}
    validationSchema = {validationSchema}
    >
    {formik=>{
      return<form onSubmit={formik.handleSubmit}>



<label htmlFor="file">File upload </label>
                  <input name="image" type="file"  onChange={(event) => {
                    formik.setFieldValue("image", event.currentTarget.files);
                  }}  />

   {/*       <Field as='Input' name='image' type='file' onChange={(e)=>formik.setFieldValue('image', e.target.files[0])}/>

                <FileInput
                    name="file"
                    validFormats={fileFormats}
                    component={CustomFileInputWrapper}
                />
                <ImageInput
                    name="image"
                    validFormats={imageFormats}
                    component={CustomImageInputWrapper}
                /> */
               
                }



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
      <Field as='select' name='questionType'>
      {
        questionTypes.map(questionType=>{
          return <option key={questionType} value={questionType}>{questionType}</option>
        })
      }
      </Field>
    <ErrorMessage name='questionType' />
    </div>

    
    <div>
    <Field name='author' value= {user.email}  type='text' disabled/>
 
    </div>

   
      
    {/* <Field name='image' >
      {
        ({field})=>{
          console.log(field)
         return <div><Input  type='file' {...field} onChange={(e)=>field.setFieldValue('image', e.target.files[0])}/></div>
        }
      }
    </Field>
       */}
    
      
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
      
    </form>}}
    </Formik>
    </>
  }

  return(
    <>
    You need to sign in before you can create question <Link href='/signin'><a>Sign in</a></Link>
    </>
  )
}

export default CreateQuestion



export async function getServerSideProps(context){
  const session = await getSession(context)
  const client = await clientPromise;
  const db = await client.db("StudentPortal");  
  const email = await session.user.email
  const users = await db.collection("users").findOne({email : email})
  const user = await JSON.parse(JSON.stringify(users))
  let passKeys = await db.collection("Pass Keys").findOne()
  passKeys = await JSON.parse(JSON.stringify(passKeys))
  
  return {
    props : {
      user , session
    }
  }
}
