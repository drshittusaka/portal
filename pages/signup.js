import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as yup from 'yup';
import ValidationError from 'yup';
import {useRouter} from 'next/router';


const Signup=()=>{
  const router = useRouter()
  const initialValues = {
    email : '',
    password : '',
    confirm_password : '',
  }
  
  const validationSchema = yup.object().shape({
    email : yup.string().email('use email as username').required('This field is required'),
    password : yup.string()//.matches("^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$",
      //"Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character")
    .required('This field is required'),
    confirm_password : yup.string().oneOf([yup.ref('password'), null]).required('This field is required'),
  })
  
   const onSubmit= async (values)=>{
     
    const response = await fetch(
     '/api/auth/signup',
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
  <h2>Sign up</h2>
  <Formik
  initialValues = {initialValues}
  onSubmit = {onSubmit}
  validationSchema = {validationSchema}
  >
  {formik=>{
    return<Form>
    
    <div>
  <label htmlFor='email'>Enter username</label>
  <Field name='email' type='email'/>
 <ErrorMessage name='email' />
  </div>
 
    <div>
  <label htmlFor='password'>Enter password</label>
  <Field name='password' type='password'/>
 <ErrorMessage name='password' />
  </div>
    
    <div>
  <label htmlFor='confirm_password'>Confirm password</label>
  <Field name='confirm_password' type='password'/>
 <ErrorMessage name='confirm_password' />
  </div>
 
    <button type='submit' disabled={!formik.isValid || formik.isSubmitting || formik.unTouched }>
              Submit
            </button>
    
  </Form>}}
  </Formik>
  </>
}

export default Signup