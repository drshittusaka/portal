import {useRouter} from 'next/router';
import Link from 'next/link' 
//import {useState, useEffect} from 'react'
export default function QuestionBank ({data}){
  //const [dataState, setDataState] = useState([])
   const router = useRouter()
   const onDelete= async (quizId)=>{
    const resp = await fetch(`/api/chooseQuiz/${quizId}`,{
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
      <Link href = {`attemptQuiz/${_id}`}><a> Attempt this Quiz </a></Link> 
    </div>  )
    })
   }
   
 </div>
   
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


