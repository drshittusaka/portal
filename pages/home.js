import TextField from "@mui/material/TextField";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useSession, signIn, signOut, getSession} from "next-auth/react"
import { useEffect, useState } from "react";
import Link from "next/link"
import clientPromise from "../lib/mongodb";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useRouter } from 'next/router';
import useSWR from "swr";
import axios from 'axios'
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';


export default function Component({ user, passKeys, quiz, attemptedQuiz}) {
  const [open, setOpen] = useState(false);
  const router = useRouter()
  const [quizname, setQuizName] = useState('')
  const [quizpass, setQuizPass] = useState('')
  const [manualExam, setManualExam] = useState({})
  const [attempts, setAttempts] = useState([])
  const [display, setDisplay] = useState(false)
 let {data : session } = useSession()
 //const [quizAttempted, setQuizAttempted] = useState(attemptedQuiz)

 const getAttemptedQuiz = async (quizId) =>{ 
    const attempt = attemptedQuiz.filter((element)=> element.quizId === quizId)
    setAttempts(attempt)
    setDisplay(!display)

 }


 const attemptQuiz = async () => {
  router.push(`attemptQuiz/${quizname}/${quizpass}`)
 }

 const submitManualExam = async () =>{
  await fetch(
    '/api/attemptedQuiz',
    { method : 'POST',
     body : JSON.stringify({
       manualExam
           }),
      headers: {
       'Content-Type': 'application/json'
     }
    })
    .then(router.push('/home'))
    .catch((e)=> {alert(e)}) 

    
    await fetch(
      `/api/createProfile/${manualExam.email}`,
     { method : 'POST',
      body : JSON.stringify({
       manualExam
      }),
       headers: {
        'Content-Type': 'application/json'
      }
     })
     .then(router.push('/home'))
     .catch((e)=> {alert(e)}) 
setManualExam({})
   
   alert('SUBMITTED') 
 }

 const handleClickOpen = () => {
  setOpen(true);
};


 let [passKey, setPassKey] = useState( {
  chiefExaminerPass: Array(3).fill(""),
  examinerPass: Array(3).fill(""),
  candidatePass: Array(3).fill("")
}
);

const onDelete= async (quizId)=>{
  const resp = await fetch(`/api/createQuiz/${quizId}`,{
    method : "DELETE",
  })
  const data = await resp.json()
  router.reload('home')
  
}


//generateKey function to generate Pass Keys, save to database and close the dialog box
const generateKey = async (e) => {

  //e.preventDefault()

  

  let chiefExaminerPass = passKey.chiefExaminerPass.map((e, index) => {
    return (passKey.chiefExaminerPass[index] = Math.random()
      .toString(36)
      .substring(2, 4));
  })
  let examinerPass = passKey.examinerPass.map((e, index) => {
    return (passKey.examinerPass[index] = Math.random()
      .toString(36)
      .substring(2, 4));
  })
  let candidatePass = passKey.candidatePass.map((e, index) => {
    return (passKey.candidatePass[index] = Math.random()
      .toString(36)
      .substring(2, 4));
  })
  setPassKey({
      chiefExaminerPass: chiefExaminerPass,
      examinerPass: examinerPass,
      candidatePass: candidatePass
    }
  );
  savePassKey()
}

const savePassKey = async (e) =>{


  const response = await fetch(
    `/api/createPassKey/${passKeys._id}`,
    { method : 'PUT',
     body : JSON.stringify(
        passKey
     ),
      headers: {
       'Content-Type': 'application/json'
     }
    })
    .then( 
      router.reload(window.location.pathname))
    .catch((e)=> {alert(e)})

}

const handleClose = () => {
  generateKey()
  savePassKey()
  setOpen(false);
}

//console.log(passKeys._id)
  
if (session && user.role === 'Admin') {

  return (
    <>
 
    You are {session.user.name} <br />logged in with the email {session.user.email} <br /> you are an {user.role} <br />
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
      <Stack spacing={2} direction="row">
      <Button variant="contained" onClick={generateKey} size='small'>
        Generate key 
      </Button>
    </Stack>
     <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Are you sure you want to generate a new set of keys. <br/>
           Please note that the existing validation keys 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=> setOpen(false)} autoFocus>Cancel</Button>
          <Button onClick={handleClose} >
            Yes
        </Button>
        </DialogActions>
      </Dialog>
      



      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            Pass Keys
          </TableRow>
        </TableHead>
        <TableBody>
         
        <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Chief Examiner
              </TableCell>
              {passKeys.chiefExaminerPass.map((pass, index) => (
              <TableCell align="right" key={index}>{pass}</TableCell>
              ))}
              
            </TableRow><TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Examiner
              </TableCell>
              {passKeys.examinerPass.map((pass, index) => (
              <TableCell align="right" key={index}>{pass}</TableCell>
              ))}
              
            </TableRow>

         
        </TableBody>
      </Table>
    </TableContainer>





      
    </>
  )
}
  else if (session && user.role === 'Chief Examiner') {
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
        {
    quiz.map(({_id, quizName}, index)=>{
      return(<div key={_id}>
      <h2> Quiz Title {quizName}</h2>
      
      <button type='button' onClick={() => onDelete(_id)}>DELETE QUIZ</button>
      <button type='button' onClick={() => router.push(`createdQuiz/${_id}`)}>Update Quiz</button>
      <Badge badgeContent={attemptedQuiz.filter((element)=> element.quizId ==_id).length} color="primary">   
      <button type='button' onClick={() => getAttemptedQuiz(_id) }>Get the Quiz Attempted</button>
      </Badge>
      <Divider />
    </div>  )
    })
   

   }
<button onClick={() => setDisplay(!display)}>Enter Manual exam score</button>
{ display &&

<div className='App'>
      <div className='container'>
        <p>Enter the scores of the paper conducted exams</p>
        <input        
          type='text'
          placeholder='Exam title'
          onChange={(e) =>
            setManualExam({ ...manualExam, examTitle: e.target.value })
          }
        />
        <input
          name = 'score'
          type='number'
          placeholder='Enter Score'
          onChange={(e) =>
            setManualExam({ ...manualExam, score : e.target.value })
          }
        />
        <input          
          type='email'
          placeholder='email'
          onChange={(e) =>
            setManualExam({ ...manualExam, email: e.target.value })
          }
         />
        
        <button onClick={() => submitManualExam()}>Submit Manual exam score</button>
      </div>
    </div>}


    
   

   { display &&
     attempts.map(({_id, candidate, score}, index)=>{
      return(<div key={_id}>
      <h4>Candidate name: {candidate.name}</h4>
      <h4>Candidate email: {candidate.email}</h4>
      <h4>Candidate score: {candidate.score ? candidate.score: '0%' }</h4>  
      <Divider />   
    </div>  )
    })
   }
   

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
  else if (session && user.role === 'Candidate'){
    return (
      <>
      <Dialog open={open} onClose={handleClose}>
  <DialogTitle>Enter the quiz details</DialogTitle>
  <DialogContent>
    <DialogContentText>
    Enter the quiz details
    </DialogContentText>
    <TextField
      autoFocus
      margin="dense"
      id="name"
      label="Enter the Quiz Name to confirm your role"
      type="text"
      fullWidth
      variant="standard"
      name="quizName"
      value={quizname}
      onChange={(e)=>setQuizName(e.target.value)}
    />
    <TextField
      autoFocus
      margin="dense"
      id="name"
      label="Enter the passkey to confirm your role"
      type="text"
      fullWidth
      variant="standard"
      name="quizPass"
      value={quizpass}
      onChange={(e)=>setQuizPass(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={attemptQuiz}>Submit</Button>
  </DialogActions>
</Dialog>

   
      You are {session.user.name} <br />logged in with the email {session.user.email} <br /> you are a {user.role} <br />
        <button onClick={() => signOut('/')}>Sign out</button>
        <button onClick={() => setOpen(true)}>Attempt Quiz</button>
        <button onClick={() => router.push("/paystack")}>Pay School Fees</button>
        <button onClick={() => setDisplay(!display)}>See attempted Quiz</button>
        { user.attemptedQuiz ? display &&
     user.attemptedQuiz.map(({_id, quizName, score, manualExam}, index)=>{
      return(<div key={_id}>
      <h4>Quiz title: {quizName || manualExam.examTitle}</h4>
     {<h4>Candidate score:{quizName ? (isNaN(score) || score === undefined ? '0%' : score)  : manualExam.score}</h4> }
    
      <Divider />   
    </div>  )
    }) : null
   }
      </>
    )
  }
 


  return (
    <>
      You need to create profile before you proceed <br />
      <Link href='/createProfile'><a>
        Create Profile
      </a></Link>
    </>
  )
}

export async function getServerSideProps(context){
  const {user} = await getSession(context)
  const client = await clientPromise;
  const db = await client.db("StudentPortal");  
  // const email = await session.user.email
  // const users = await db.collection("users").findOne({email : email})
  // const user = await JSON.parse(JSON.stringify(users))
  let passKeys = await db.collection("Pass Keys").findOne()
  passKeys = await JSON.parse(JSON.stringify(passKeys))
  let attemptedQuiz = await db.collection("AttemptedQuiz").find().toArray()
  attemptedQuiz = await JSON.parse(JSON.stringify(attemptedQuiz))
  
  const question = (user.role==='Chief Examiner') ?   await db.collection("Quiz").find({author : email}).toArray() : null
  const quiz = await JSON.parse(JSON.stringify(question))
  return {
    props : {
      user ,  passKeys, quiz : quiz, attemptedQuiz: attemptedQuiz
    }
  }

if (!user) {
  return {
    redirect: { destination: "/" }
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
