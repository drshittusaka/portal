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
            <form onSubmit={handleSubmit}>
            <label> Your Role
      <input type="text" name='role' value={role} onChange={(e)=>setRole(e.target.value)}  />
      </label> <br />
      
      <button type="submit">Update Profile</button>
    </form>
          </>
        )
      }
      return null
}
export default createProfile