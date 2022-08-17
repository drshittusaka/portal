import clientPromise from "../../../lib/mongodb";
const ObjectId = require('mongodb').ObjectId;

export default async function handler(req, res) {
  const {quizId} = req.query
  const {subject} = req.query
  
  const client = await clientPromise;
  const db = client.db("StudentPortal");
   let bodyObject = req.body;
  switch (req.method) {
    case "DELETE":
      let newPost = await db.collection("Quiz").deleteOne({_id : new ObjectId(quizId)});
       res.status(400).json({ success: 'success'})
     // res.json(newPost);
      break;
    case "GET":
      
        const posts = await db.collection("Quiz").findOne({_id : new ObjectId(quizId) })
      res.status(200).json( posts );
      break;
      
   case "PUT":
      let bodyObject = req.body;
      const newPut = await db.collection("Quiz")
    .findOneAndUpdate({_id : new ObjectId(quizId)}, {$set : { 
    author : bodyObject.author,
    quizName : bodyObject.quizName,
    timeAllowed : bodyObject.timeAllowed,
    quizPass : bodyObject.quizPass,
     questions : bodyObject.questions.map((question)=>{
      return question  })}});
       res.status(400).json({ success: 'success'})
     // res.json(newPost);
      break; 
  }
}










        
  
  
