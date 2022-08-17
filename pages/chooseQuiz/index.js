import {useRouter} from 'next/router';
import Link from 'next/link' 
//import {useState, useEffect} from 'react'
export default function QuestionBank ({data}){
  //const [dataState, setDataState] = useState([])
   const router = useRouter()
   const onDelete= async (quizId)=>{
    const resp = await fetch(`/api/createQuiz/${quizId}`,{
      method : "DELETE",
    })
    const data = await resp.json()
    router.reload('chooseQuiz')
    
  }   
  
  //useEffect(()=>{setDataState(data)}, [data])
  
  

   return(<div>
   <h1>Question List</h1>
   <div>

 {
    data.map(({_id, quizName}, index)=>{
      return(<div key={_id}>
      <h2> Quiz Title {quizName}</h2>
      
      <button type='button' onClick={() => onDelete(_id)}>DELETE QUIZ</button>
      <Link href = {`chooseQuiz/${_id}`}><a>  </a></Link> 
    </div>  )
    })
   }
   
 </div>
   <button type='button' onClick={() => router.push('/createQuiz')}>CREATE QUESTION</button>
  </div> )

 }



export async function getServerSideProps(context){
  const resp = await fetch ('http://localhost:3000/api/createQuiz', {
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


