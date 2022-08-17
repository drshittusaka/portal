
import clientPromise from "../../../lib/mongodb";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  //const session = await getSession(req)
// console.log(session.user.email)
  const subject = req.query.subject
  const client = await clientPromise;
  const db = client.db("StudentPortal");
  switch (req.method) {
    case "POST":
      let bodyObject = req.body;
      let newPost = await db.collection("Question Bank").insertOne(bodyObject);
       res.status(400).json('success')
     // res.json(newPost);
      break;
    case "GET":
    
      if (subject){
        const posts = await db.collection("Question Bank").find({subject : subject}).toArray();
      res.status(200).json(posts);
      }
    else{
      const posts = await db.collection("Question Bank").find().toArray();
      res.status(200).json(posts);
    }
      break;
  }
}









 /** import clientPromise from '../../lib/mongodb'

export default async function(res, req){
  const client = await clientPromise
  const db = await client.db('StudentPortal').collections('Question Bank')
  const data = req.body
  
  
  switch (req.method){
    case '' :
    try{
       const newPost = db.insertOne(data);
       res.status(201).json({ success: true, data: newPost });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    default:
      return res.status(400).json({ success: false }); 
    
        
  }} **/
  
