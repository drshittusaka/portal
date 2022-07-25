import {useRouter} from 'next/router';
import clientPromise from "../../lib/mongodb";
import Link from 'next/link' 
import { getSession } from 'next-auth/react';
//import {useState, useEffect} from 'react'
export default function QuestionBank ({data}){
  //const [dataState, setDataState] = useState([])
   const router = useRouter()
   const onDelete= async (questionId)=>{
    const resp = await fetch(`/api/questionBank/${questionId}`,{
      method : "DELETE",
    })
    const data = await resp.json()
    router.reload('questionBank')
    
  }   
  
  //useEffect(()=>{setDataState(data)}, [data])
  
  

   return(<div>
   <h1>Question List</h1>
   <div>

 {
    data.map(({_id, subject, question, questionType, answers}, index)=>{
      return(<div key={_id}>
      <h2> Subject {subject}</h2><h2> {questionType} </h2>
      <p>
      {answers.map(({answer, is_correct}, index)=>{
        return (<div key={index}>
          <p>{index} {answer}    {is_correct ? 'True' : null}</p>
        </div>)
      })}
      </p>
      <button type='button' onClick={() => onDelete(_id)}>DELETE</button>
      <Link href = {`questionBank/${_id}`}><a> Edit Question </a></Link> 
    </div>  )
    })
   }
   
 </div>
   <button type='button' onClick={() => router.push('/createQuestion')}>CREATE QUESTION</button>
  </div> )

 }



export async function getServerSideProps(context){
  const client = await clientPromise;
  const db = client.db("StudentPortal");
  const session = await getSession(context)
  const email = session.user.email
  const question = await db.collection("Question Bank").find({author : email}).toArray();
  const questions = await JSON.parse(JSON.stringify(question))
  return {
    props : {
      data : questions
    }
  }
}


