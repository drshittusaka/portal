

import clientPromise from "../../../lib/mongodb";
const ObjectId = require('mongodb').ObjectId;

export default async function handler(req, res) {
  const {email} = req.query
  
  const client = await clientPromise;
  const db = client.db("StudentPortal");
   let bodyObject = req.body
  
      const newPut = await db.collection("users")
    .findOneAndUpdate({email : email}, {$set :{role:bodyObject.role}
});
console.log({role:bodyObject.role})
console.log(email)
       res.status(400).json({ success: 'success'})
     // res.json(newPost);
 
  
}










        
  
  
