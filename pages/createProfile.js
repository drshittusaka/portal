import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
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
import { useSession } from "next-auth/react";
import useSWR from 'swr';
import { useRouter } from "next/router";
import axios from "axios";


 

export default function BasicTextFields() {
  //const fetcher = (...args) => fetch(...args).then(resp=> resp.json())
  //const url = "http://localhost:3000/api/createPassKey"
 /** const fetcher = url => axios.get(url).then(res => res.data)
  const {passKey, error} = useSWR("http://localhost:3000/api/createPassKey", fetcher) **/
  const {data : session} = useSession()
  const [role, setRole] = useState("");
  const [open, setOpen] = useState(false);
  const [passKey, setPassKey] = useState("");
  const [enteredPassKey, setEnteredPassKey] = useState(" ");
  const [trueRole, setTrueRole] = useState(false)
  const isMounted = useRef(false)
  //const url = "/api/createPassKey"
  let chiefExaminerPass= passKey.chiefExaminerPass
  let examinerPass= passKey.examinerPass
const router = useRouter()

useEffect(()=>{
      axios.get("/api/createPassKey").then(resp=> setPassKey(resp.data)).catch(error=> console.log(error.message))
   // alert('passKey.chiefExaminer[2]')
  }, []) 
/**  useEffect(()=>{
    if(isMounted.current === true){
      if(trueRole){      
        fetch(      
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
    fetch(
      `/api/createPassKey/${passKey._id}`,
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
  
      setOpen(false)  
    }
      else { 
        alert(`You are likely not a ${role}. Kindly enter correct pass key to confirm you are a ${role}` )
        setOpen(true)
    }
    }  else{ isMounted.current = true}
    
  }, [trueRole]) 
  **/
   const checkRole= () => {
  
      if(role === 'Chief Examiner' && enteredPassKey){
        let check = chiefExaminerPass.includes(enteredPassKey)
        setTrueRole(check)
       
       // handleSubmit()
      }
      else  if(role === 'Examiner' && enteredPassKey){
        let check = examinerPass.includes(enteredPassKey)
        setTrueRole(check)
        
       // handleSubmit()
      }
          
   }
   const handleCheckRole = () =>{
    checkRole()
   }

  const handleClickOpen = (e) => {
    if(role){
     // setEnteredPassKey(e.target.value)
      setOpen(true);
    }else{ alert('Please choose your role')}
   
  };

  const handleClose = () => {
    setOpen(false);
  };



  const handleSubmit = async (e) => {
    if(trueRole){      
      fetch(      
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
  fetch(
    `/api/createPassKey/${passKey._id}`,
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

    setOpen(false)  
  }
    else { 
      alert(`You are likely not a ${role}. Kindly enter correct pass key to confirm you are a ${role}` )
      setOpen(true)
  }
  }; 
console.log(trueRole)
 // fetcher()
  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" }
      }}
      noValidate
      autoComplete="off"
      onSubmit={() => alert(role)}
    >
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm your choice role</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm that you are a {role} by entering your passKey
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
          <Button onClick={handleCheckRole}>Submit</Button>
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
      <Button variant="outlined" onClick={role === 'Candidate' ? handleSubmit : handleClickOpen}>
        Submit Form
      </Button>
     
    </Box>
    
  );
}






/**
 import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {useRouter} from 'next/router';
import { useSession } from "next-auth/react"
import { useState } from "react"
const createProfile = () => {
    const {data : session} = useSession()
    const [role, setRole] = useState('')
    const router = useRouter()
    console.log(session)
    const handleSubmit=async (e)=>{
        e.preventDefault();
        let values={
                role
        }
        const response = await fetch(
            `http://localhost:3000/api/createProfile/${session.user.email}`
            ,
            { method : 'PUT',
             body : JSON.stringify(values),
              headers: {
               'Content-Type': 'application/json'
             }
            })
            .then( router.push('/home'))
            .catch((e)=> {alert(e)})
    }
    
    if (session) {
        return (
          <>
            Signed in as {session.user.name}  <br/>
            <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField id="outlined-basic" label="Outlined" variant="outlined" name='role' value = {role} onChange={(e)=> e.value.target} />
      
    </Box>
          </>
        )
      }
      return null
}
export default createProfile












 */