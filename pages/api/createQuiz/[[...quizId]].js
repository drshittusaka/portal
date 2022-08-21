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
    
      if(quizId.length === 1){
        let newPost = await db.collection("Quiz").deleteOne({_id : new ObjectId(quizId[0])});
       res.status(200).json({ success: 'success'})
      }
     // res.json(newPost);
    if (quizId.length === 2){
     
      await db.collection("Quiz").updateOne( { _id: ObjectId(quizId[0]) }, { $pull: { 'questions' : { _id: ObjectId(quizId[1]) } } }, false, true );
      res.status(200).json()

    }
      break;
    case "GET":
     
        const posts = await db.collection("Quiz").findOne({_id : new ObjectId(quizId[0]) })
      res.status(200).json( posts );
      break;
      
   case "PUT":
   
      const quest = await db.collection("Quiz").findOne({_id : new ObjectId(quizId[0]) })
      
      const newPut = await db.collection("Quiz")
    .updateOne({_id : new ObjectId(quizId[0])}, {$set : { 
    author : bodyObject.author,
    quizName : bodyObject.quizName,
    timeAllowed : bodyObject.timeAllowed,
    quizPass : bodyObject.quizPass,
    negFacSba: bodyObject.negFacSba,
    negFacMc:  bodyObject.negFacMc
    }});

   await db.collection("Quiz").updateOne({_id : new ObjectId(quizId[0])}, {$push:{questions :{$each: bodyObject.questions}}});
   await db.collection("Quiz").updateOne({_id : new ObjectId(quizId[0])}, {$push:{quizPass :{$each: bodyObject.quizPass}}});

       res.status(400).json({ success: 'success'})
     // res.json(newPost);
      break; 
      case "POST":
        let bodyObject = req.body
               await db.collection("Quiz").insertOne(bodyObject);
               res.status(400).json('success')
             // res.json(newPost);
              break;
  }
}

 

// import clientPromise from "../../../lib/mongodb";

// export default async function handler(req, res) {
//   const client = await clientPromise;
//   const db = client.db("StudentPortal");
//   switch (req.method) {
//     case "POST":
//       let bodyObject = req.body;
//       let newPost = await db.collection("Quiz").insertOne(bodyObject);
//        res.status(400).json('success')
//      // res.json(newPost);
//       break;
//     case "GET":
//       const posts = await db.collection("Quiz").find({}).toArray();
//       res.status(200).json(posts);
    
//       break;
//   }
// }





