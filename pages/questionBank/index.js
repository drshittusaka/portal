import {useRouter} from 'next/router';
import Link from 'next/link' 
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
  const resp = await fetch ('http://localhost:3000/api/questionBank', {
    method : 'GET',
    headers: {
     'Content-Type' : 'application/json' 
    }
  })
  const questions = await resp.json() //JSON.parse(JSON.stringify(resp))
  return {
    props : {
      data : questions
    }
  }
}


