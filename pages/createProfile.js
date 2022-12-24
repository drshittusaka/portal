
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import Link from "next/link"
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useSession, getSession} from "next-auth/react";
import useSWR from 'swr';
import { useRouter } from "next/router";
import axios from "axios";
import clientPromise from "../lib/mongodb";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



export default function Component({ user, chiefExaminerPass, examinerPass, candidatePass, _id}) {
  const [open, setOpen] = useState(false);
  const router = useRouter()
  const [enteredPassKey, setEnteredPassKey] = useState(" ")
  const {data : session} = useSession()
  const [role, setRole] = useState(' ')
  const [trueRole, setTrueRole] = useState(false)
  const isMounted = useRef(false)



  useEffect(()=>{
    
    if(isMounted.current === true){
      createRole()
      stalePassKey()
      setOpen(false)
    }else{ isMounted.current = !isMounted.current} 
    
  }, [trueRole]) 

  const createRole = async () =>{
    await fetch(      
      `/api/createProfile/${session.user.email}`,
      { method : 'POST',
       body : JSON.stringify({role : role}),
        headers: {
         'Content-Type': 'application/json'
       }
      })
      .then( 
      router.push('/home'))
      .catch((e)=> {alert(e)})  
  }

  const stalePassKey = async () =>{
      await fetch(
        `/api/createPassKey/${_id}`,
        { method : 'PUT',
         body : JSON.stringify(
            {enteredPassKey : enteredPassKey}
         ),
          headers: {
           'Content-Type': 'application/json'
         }
        }) .then( 
          router.push('/home'))
        .catch((e)=> {alert(e)})
    
  }
 
 


  const checkRole= () => {
    if(!enteredPassKey){alert(`Please enter the pass Key for ${role}`)}
  
    if(role === 'Chief Examiner' && enteredPassKey){
     chiefExaminerPass.includes(enteredPassKey) ? setTrueRole(true) : alert('please enter the correct key for Chief Examiner')
     
    // alert(trueRole)
     
     // handleSubmit()
    }
    else  if(role === 'Examiner' && enteredPassKey){
      examinerPass.includes(enteredPassKey) ? setTrueRole(true) : alert('please enter the correct key for Chief Examiner')

     
   //  alert(trueRole)
      
     // handleSubmit()
    }}



    const handleOpen = (e) => {
      if(role){
        if (role === "Candidate"){
          router.push('/paystack')
        }
        else{
        setEnteredPassKey(e.target.value)
        setOpen(true)}
      }else{ alert('Please choose your role')}
     
    }
        
 
 

 const handleClose = () => {
  setOpen(false);
}

  

 


//console.log(passKeys._id)
  
if (session) {

  return (
    <>
 
 <Dialog open={open} onClose={handleClose}>
  <DialogTitle>Confirm your choice role</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Confirm that you are a  by entering your passKey
    </DialogContentText>
    <TextField
      autoFocus
      margin="dense"
      id="name"
      label="Enter the passkey to confirm your role"
      type="text"
      fullWidth
      variant="standard"
      name="passKey"
      value={enteredPassKey}
      onChange={(e)=>setEnteredPassKey(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={checkRole}>Submit</Button>
  </DialogActions>
</Dialog>

<Box sx={{ minWidth: 120 }}>
  <FormControl fullWidth>
    <InputLabel id="demo-simple-select-label">
      Which group do you belong
    </InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={role}
      label="Role"
      onChange={(e) => setRole(e.target.value)}
    >
      <MenuItem value={"Chief Examiner"}>Chief Examiner</MenuItem>
      <MenuItem value={"Examiner"}>Examiner</MenuItem>
      <MenuItem value={"Candidate"}>Candidate</MenuItem>
    </Select>
  </FormControl>
</Box>
<Button variant="outlined" onClick={role === 'Candidate' ? router.push('/paystack') : handleOpen }>
  Submit Form
</Button>
        
      </>
    )
  }

  if(user === null){
    return (
      <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
      </>
    )}


 
}

export async function getServerSideProps(context){
  const session = await getSession(context)
  const client = await clientPromise;
  const db = await client.db("StudentPortal");  
  const email = await session.user.email
  const users = await db.collection("users").findOne({email : email})
  const user = await JSON.parse(JSON.stringify(users))
  let passKeys = await db.collection("Pass Keys").findOne()
  passKeys = await JSON.parse(JSON.stringify(passKeys))
  let {chiefExaminerPass, examinerPass, candidatePass, _id} = passKeys

  if (!session) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props : {
      user , session, chiefExaminerPass, examinerPass, candidatePass, _id
    }
  }
}
