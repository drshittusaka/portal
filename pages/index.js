
import {signIn, useSession} from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"





export default function Component() {
 
  const{data: session, status} = useSession()
  const router = useRouter()

  useEffect(()=>{
    
    if(session){
      
      router.push('/home')
    }
  },[session])

  if (!session && status==='loading'){
    return <h1>Page is Loading.........</h1>
   }

 if(status != "loading" &&  !session){
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )}
  if(session){
    return (
      <>
        <h1>You are signed in </h1> <br />
       <h1> You are being redirected to the home page</h1>
      </>)
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
