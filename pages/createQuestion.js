import {Formik, Form, Field, FieldArray, ErrorMessage} from 'formik';
import * as yup from 'yup';
import ValidationError from 'yup';
import {useRouter} from 'next/router';


const CreateQuestion=()=>{
  const subjects=['','Mathematics', 'English Language', 'Biology', 'Chemistry', 'Physics']
  const questionTypes=['','Single Best Answer', 'Multiple Choice']
  const router = useRouter()
  const initialValues = {
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
     
    const response = await fetch(
     '/api/questionBank',
     { method : 'POST',
      body : JSON.stringify(values),
       headers: {
        'Content-Type': 'application/json'
      }
     })
     .then( 
     router.push('questionBank'))
     .catch((e)=> {alert(e)})
    
   }
 

  return<>
  <h2>Create Question</h2>
  <Formik
  initialValues = {initialValues}
  onSubmit = {onSubmit}
  validationSchema = {validationSchema}
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





/**   { answers.map(({answer, is_correct}, index)=>{ return(
      <div key={index}>
  
        <Field name={`answers[${index}].answer`}  />
      
        <button type='button' onClick={() => push() } >-</button>
 
      {index > 0 && (
                            <button type='button' onClick={() => remove(index)}>
                              -
                            </button>
                          )}
  </div> 
        )
      
    })} **/ 



/* 
<Field name='answers'>{
   ({field, meta})=>{
     const {name, value} = field
     return<>
     <input type='text' name={answer} {...field}/>
     
    <input type='checkbox' name={is_correct} {...field}/>
     
     //{meta.touch && meta.error ? <div>{meta.error}</div> : null}
     </>
   }
 }</Field> **/