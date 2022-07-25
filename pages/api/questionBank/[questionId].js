

import clientPromise from "../../../lib/mongodb";
const ObjectId = require('mongodb').ObjectId;

export default async function handler(req, res) {
  const {questionId} = req.query
  const {subject} = req.query
  
  const client = await clientPromise;
  const db = client.db("StudentPortal");
   let bodyObject = req.body;
  switch (req.method) {
    case "DELETE":
      let newPost = await db.collection("Question Bank").deleteOne({_id : new ObjectId(questionId)});
       res.status(400).json({ success: 'success'})
     // res.json(newPost);
      break;
    case "GET":
      if(questionId){
        const posts = await db.collection("Question Bank").findOne({_id : new ObjectId(questionId) })
      res.status(200).json( posts );
      break;
      }
      if(subject){
        const posts = await db.collection("Question Bank").findOne({subject : new ObjectId(subject) })
      res.status(200).json( posts );
      break;
      }
    case "PUT":
      let bodyObject = req.body;
      const newPut = await db.collection("Question Bank")
    .findOneAndUpdate({_id : new ObjectId(questionId)}, {$set : { subject : bodyObject.subject,
    questionType : bodyObject.questionType,
    question : bodyObject.question,
    answers : bodyObject.answers.map(({answer, is_correct})=>{
      return {answer : answer, is_correct : is_correct}  })}});
       res.status(400).json({ success: 'success'})
     // res.json(newPost);
      break;
  }
}










        
  
  
