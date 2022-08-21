import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("StudentPortal");
  switch (req.method) {
    case "POST":
      let bodyObject = req.body;
      let newPost = await db.collection("AttemptedQuiz").insertOne(bodyObject);
       res.status(200).json('success')
     // res.json(newPost);
      break;
    case "GET":
      const posts = await db.collection("Quiz").find({}).toArray();
      res.status(200).json(posts);
    
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
  
