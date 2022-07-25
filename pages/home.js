
import { useSession, signIn, signOut, getSession} from "next-auth/react"
import { useEffect, useState } from "react";
import Link from "next/link"
import clientPromise from "../lib/mongodb";


export default function Component({ user}) {
 let {data : session } = useSession()

console.log(session)
  
  if (session && user.role === 'Chief Examiner') {
    return (
      <>
   
      You are {session.user.name} <br />logged in with the email {session.user.email} <br /> you are a {user.role} <br />
        <button onClick={() => signOut({callbackUrl : `/`})}>Sign out</button>
        <Link href='/createQuestion'><a>
          Create Question
        </a></Link>
        <Link href='/questionBank'><a>
          Question Bank
        </a></Link>
        <Link href='/createQuiz'><a>
          Create Quiz
        </a></Link>
      </>
    )
  }
  else if (session && user.role === 'Examiner') {
    return (
      <>
   
      You are {session.user.name} <br />logged in with the email {session.user.email} <br /> you are a {user.role} <br />
        <button onClick={() => signOut({callbackUrl : `/`})}>Sign out</button>
        <Link href='/createQuestion'><a>
          Create Question
        </a></Link>
        <Link href='/questionBank'><a>
          Question Bank
        </a></Link>
      </>
    )
  }
  else if (session && user.role === 'Student'){
    return (
      <>
   
      You are {session.user.name} <br />logged in with the email {session.user.email} <br /> you are a {user.role} <br />
        <button onClick={() => signOut()}>Sign out</button>
       
      </>
    )
  }
 


  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}

export async function getServerSideProps(context){
  const session = await getSession(context)
  const client = await clientPromise;
  const db = client.db("StudentPortal");  
  const email = session.user.email
  const users = await db.collection("users").findOne({email : email})
  const user = await JSON.parse(JSON.stringify(users))
  console.log(session)
  return {
    props : {
      user , session
    }
  }
}










// import Head from 'next/head'
// import clientPromise from '../lib/mongodb'
// import {signOut} from 'next-auth/react'

// export default function indexPage(){
//   return(
//   <button type='button' onClick= {()=>{signOut({callbackUrl : "/signin"})}}>Sign Out</button>)
// }


// export async function getServerSideProps(context) {
//   try {
//     // client.db() will be the default database passed in the MONGODB_URI
//     // You can change the database by calling the client.db() function and specifying a database like:
//     // const db = client.db("myDatabase");
//     // Then you can execute queries against your database like so:
//     // db.find({}) or any of the MongoDB Node Driver commands
//     await clientPromise
//     return {
//       props: { isConnected: true },
//     }
//   } catch (e) {
//     console.error(e)
//     return {
//       props: { isConnected: false },
//     }
//   }
// }
