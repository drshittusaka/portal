

import clientPromise from "../../../lib/mongodb";
const ObjectId = require('mongodb').ObjectId;

export default async function handler(req, res) {
  const {email} = req.query
  
  const client = await clientPromise;
  const db = client.db("StudentPortal");
   let bodyObject = req.body
  
bodyObject.role &&  await db.collection("users").updateOne({email : email}, {$set :{role:bodyObject.role}});
bodyObject.payment && await db.collection('users').updateOne({email: email}, {$push:{payment: bodyObject.payment }})
bodyObject.attemptedQuiz && await db.collection('users').updateOne({email: email}, {$push:{attemptedQuiz: bodyObject.attemptedQuiz }})
bodyObject.manualExam && await db.collection('users').updateOne({email: email}, {$push:{attemptedQuiz: bodyObject }})
res.status(200).json({ success: 'success'})
}










        
  
  
