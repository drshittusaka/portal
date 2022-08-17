import { getCsrfToken } from "next-auth/react"
 import { getProviders, signIn, getSession } from "next-auth/react"
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as yup from 'yup';
import ValidationError from 'yup';
import {useRouter} from 'next/router';
import {useState} from 'react';
//import { providers, signIn, getSession, csrfToken } from "next-auth/react";


export default function SignIn({ csrfToken, providers }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [message, setMessage] =useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
    const onSubmit= async (e) =>{
      const option = { redirect : {destination : '/'}, email : email, password : password}
      const res = await signIn('credentials', option)
      if(res?.error){
        setMessage(error.message)
      }else{ router.push('questionBank') }
    }
    
   
  return (
   <> 
  
  <form method="post" action="/api/auth/callback/credentials">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <label>
        Username
       <input name="username" type="text" value={username} onChange = {e=>setUsername(e.target.value)} />
      </label>
      <label>
        Password
        <input name="password" type="password" value={password} onChange = {e=>setPassword(e.target.value)} />
      </label>
      <button onClick={(e)=>onSubmit(e)}>Sign in</button>
    </form>

    <form method="post" action="/api/auth/signin/email">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <label>
        Email address
        <input type="email" id="email" name="email" />
      </label>
      <button type="submit">Sign in with Email</button>
    </form>
  
  {/* <form action={async (e)=>{
    await fetch(
      '/api/auth/email',{
        method: 'POST',
        body:JSON.stringify(email, csrfToken )
      }
    )
  }}>
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <label>
        Enter email
        <input name="email" type="email" onChange={(e)=>setEmail(e.target.value)} value={email}/>
      </label>
      
      <button type="submit">Sign in with email link</button>
    </form> */}
     <div>
      {Object.values(providers).map((provider) => {
        if(provider.name === 'Email' || provider.name === "Credentials"){
          return null
        } return(
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id, {callbackUrl : `/home`})}>
            Sign in with {provider.name}
          </button>
        </div>)
      })}
    </div>
  </>)
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/home" },
    };
  }

  return {
    props: {
      providers: await getProviders(context),
      csrfToken: await getCsrfToken(context),
    },
  }
  
  
 /** const providers = await getProviders()
  const csrfToken = await getCsrfToken(context)
  return {
    props: {
      csrfToken,
      providers,
    },
  } */
}









/** 



  
   <Formik
  initialValues = {{ email : '', password : ''}}
  onSubmit = {onSubmit}
  validationSchema = {validationSchema}
  >
  {formik=>{
    return<Form>
    <Field name='csrfToken' type='hidden' />
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
 
    <button type='submit' disabled={!formik.isValid || formik.isSubmitting || formik.unTouched }>
              Submit
            </button>
    
  </Form>}}
  </Formik> **/