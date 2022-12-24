

import clientPromise from "../../../lib/mongodb";
const ObjectId = require('mongodb').ObjectId;

export default async function handler(req, res) {
  const {pass} = req.query
 
  
  const client = await clientPromise;
  const db = client.db("StudentPortal");
   let bodyObject = req.body;
  switch (req.method) {
    case "DELETE":
      let newPost = await db.collection("Pass Keys").deleteOne({_id : new ObjectId(pass)});
       res.status(400).json({ success: 'success'})
     // res.json(newPost);
      break;
    case "GET":
      
        const posts = await db.collection("Pass Keys").findOne({_id : new ObjectId(pass) })
      res.status(200).json( posts );
      break;
      
      
       
    case "PUT":
      let bodyObject = req.body;
      if(bodyObject.enteredPassKey){
        try{
    
          db.collection('Pass Keys').updateOne(
            {_id : new ObjectId(pass)},
            { $pull: { chiefExaminerPass: bodyObject.enteredPassKey,
            examinerPass: bodyObject.enteredPassKey,
            candidatePass: bodyObject.enteredPassKey } }
              )
           res.status(200).json({ success: 'success'})
           }
        catch(e){
      
     }
      }
     try{
    
          db.collection('Pass Keys').updateOne(
            {_id : new ObjectId(pass)},
            { $push: { chiefExaminerPass: { $each: bodyObject.chiefExaminerPass },
            examinerPass: { $each: bodyObject.examinerPass },
            candidatePass: { $each: bodyObject.candidatePass } } }
         )


           res.status(200).json({ success: 'success'})
     }catch(e){
        
     }
     // res.json(newPost);
      break;
  }
}










        
  
  
