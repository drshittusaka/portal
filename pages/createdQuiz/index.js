import {useRouter} from 'next/router';
import clientPromise from "../../lib/mongodb";
import Link from 'next/link' 
import { getSession, useSession } from 'next-auth/react';
import { useEffect} from 'react'
export default function QuestionBank ({data, user}){
  //const [dataState, setDataState] = useState([])
  const {data:session, status} = useSession()
   const router = useRouter()

   
 
   useEffect(()=>{     
     if(!session && status != 'loading'){       
       router.push('/')
     }
     if(status === 'authenticated' && !(user.role ==="Chief Examiner")){
      router.push('/home')}
    //  if (user.role === "Admin" || user.role ==="Chief Examiner" || user.role === 'Examiner'){
    //   router.push('/questionBank')
    //  }
    //  else{router.push('/home')}
   },[session])
 

   const onDelete= async (questionId)=>{
    const resp = await fetch(`/api/questionBank/${questionId}`,{
      method : "DELETE",
    })
    const data = await resp.json()
    router.reload('questionBank')
    
  }   
  
  //useEffect(()=>{setDataState(data)}, [data])


if(session &&  (user.role ==="Chief Examiner")){
   return(<div>
   <h1>Quiz</h1>
   {/* <Link href = {`questionBank/${_id}`}><a> Edit Question </a></Link> */}
   <div>

 {
    data.map(({_id, subject, question, questionType, answers, author}, index)=>{
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
        
    </div>  )
    })
   }
   
 </div>
   
  </div> )}

  if( !session && status != 'loading' ){
    return <><h1>You are not sign in authorized to view this Page</h1><br />
              <h1> Redirecting to sign in Page</h1>
    </>
  }

  if(status === 'authenticated' && !(user.role ==="Chief Examiner")){
  return <>You are not authorized to view this page</>}

 }



export async function getServerSideProps(context){
 
  const client = await clientPromise;
  const db = client.db("StudentPortal");
  const session = await getSession(context)
  const email = session.user.email
  const users = await db.collection("users").findOne({email : email})
  const user = await JSON.parse(JSON.stringify(users))
  const question = (user.role==='Chief Examiner') ?   await db.collection("Quiz").find({author : email}).toArray() : null
 

  

  
  return {
    props : {
      data :  await JSON.parse(JSON.stringify(question)) , user : user
      
    }
  }
}


