import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { usePaystackPayment } from 'react-paystack';



function App() {

  const router= useRouter()
  const{data: {session, user}, status} = useSession()

  
  const [paymentData, setpaymentData] = useState({
    publicKey: process.env.PAYSTACK_PUBLIC_KEY,
    firstName: user.name,
    lastName: user.name,
    email: user.email,
    amount: '100000',
    narration: user.role ? 'School fees' : 'Registration for entrance exam',
  });
 
  const paystack = usePaystackPayment(paymentData)
  // const payWithPaystack=()=>{
     
  //     }
  const createRole = async (response) =>{
    await fetch(      
      `/api/createProfile/${user.email}`,
      { method : 'POST',
       body : JSON.stringify({role : user.role ? null : 'Candidate', payment:{...response, narration: paymentData.narration, amount:paymentData.amount} }),
        headers: {
         'Content-Type': 'application/json'
       }
      })
      .then( 
     router.push('/home'))
      .catch((e)=> {alert(e)})  
  }

     const onSuccess= (response)=> {
        // alert('success')
        createRole(response)

       
        // createRole
       
      }
      const onCancel= ()=> {
        // function callback when payment modal is closed
        //router.push('/signin')
        alert("closed");
      }


  return (
    <div className='App'>
      <div className='container'>
        <p>Pay with Paystack example</p>
        <input
        
          type='text'
          placeholder='firstname'
          onChange={(e) =>
            setpaymentData({ ...paymentData, firstName: e.target.value })
          }
        />
        <input
          name = 'lastname'
          type='text'
          placeholder='lastname'
          onChange={(e) =>
            setpaymentData({ ...paymentData, lastName: e.target.value })
          }
        />
        <input
          value = {user.email}
          type='text'
          placeholder='email'
          onChange={(e) =>
            setpaymentData({ ...paymentData, email: e.target.value })
          }
          disabled
        />
        <input
          value = {1000}
          type='text'
      
           onChange={(e) =>
            setpaymentData({ ...paymentData, amount: e.target.value }) 
          }
          disabled
        />
        <input
        value = {user.role ? 'School fees' : 'Registration for entrance exam'}
          type='text'
          placeholder='description(optional)'
          onChange={(e) =>
            setpaymentData({ ...paymentData, narration: e.target.value })
          } disabled
        />
        <button onClick={() => {
                paystack(onSuccess, onCancel)
            }}>Paystack Hooks Implementation</button>
      </div>
    </div>
  );
}

export default App;
