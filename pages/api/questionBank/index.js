import nc from 'next-connect';
import multer from 'multer';
import clientPromise from "../../../lib/mongodb";
const cloudinary = require ('../../../lib/cloudinary')
import { getSession } from "next-auth/react";


  
  const client = await clientPromise;
  const db = client.db("StudentPortal");
  const upload = multer({
  storage: multer.diskStorage({
  //  destination: './public/uploads',
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

const apiRoute = nc(
  {
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
}
);

apiRoute.use(upload.single('image'));

apiRoute.post(async (req, res) => {
  console.log(req)
  const bodyObject = JSON.parse(req.body.body)
    const session = await getSession(req) 
  //const subject = req.query.subject
  delete bodyObject.image
cloudinary.uploader.upload(req.file.path)
.then(result=>{
  bodyObject.imageUrl = result.url
  db.collection("Question Bank").insertOne(bodyObject)



  res.status(200).json({ data: 'success' });
});
})
export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};







// import { createRouter } from 'next-connect';
// import multer from 'multer';
// const cloudinary = require ('../../../lib/cloudinary')
// import clientPromise from "../../../lib/mongodb";
// import { getSession } from "next-auth/react";
 


//   const client = await clientPromise;
//   const db = client.db("StudentPortal");

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: null,//'./public/uploads',
//     filename: (req, file, cb) => cb(null, file.originalname),
//   }),
// });

// const apiRoute = createRouter({
//   onError(error, req, res) {
   
//     res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
//   },
//   onNoMatch(req, res) {
//     res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
//   },
// });

// apiRoute.use(upload.array('image'));

// apiRoute.post(async (req, res) => {
//   const session = await getSession(req) 
//   //const subject = req.query.subject
// const bodyObject = req.body
// cloudinary.uploader.upload(req.files[0].path)
// .then(result=>{
//   bodyObject.imageUrl = result.url
//   db.collection("Question Bank").insertOne(bodyObject)
// });

//  // console.log(req.files)
//   res.status(200).json({ data: 'success' })
// });

// export default apiRoute;

// export const config = {
//   api: {
//     bodyParser: false, // Disallow body parsing, consume as stream
//   },
// };









// const cloudinary = require ('../../../lib/cloudinary')
// import clientPromise from "../../../lib/mongodb";
// import { getSession } from "next-auth/react";
// const mongodb = require('mongodb')

// export default async function handler(req, res) {
//   //const session = await getSession(req)
// // console.log(session.user.email)
//   const subject = req.query.subject
//   const client = await clientPromise;
//   const db = client.db("StudentPortal");
//   switch (req.method) {
//     case "POST":
//       const data = req.body;
//       console.log('the data not received')
//     //  const {author, subject, questionType, question, answers} = req.values
//       try{
//           const result = await cloudinary.uploader.upload(data, {folder: questionImage})
//           const public_id = result.public_id
//           const url = result.url
//          // const bodyObject = JSON.stringify(values)
//           // let newPost = await db.collection("Question Bank").insertOne(values);
//           console.log (public_id)
//           // console.log('the data not received')
//           //  res.status(400).json('success')
//       }catch(error){ console.log (error.message)}
//       //
//      // res.json(newPost);
//       break;
//     case "GET":
    
//       if (subject){
//         const posts = await db.collection("Question Bank").find({subject : subject}).toArray();
//       res.status(200).json(posts);
//       }
//     else{
//       const posts = await db.collection("Question Bank").find().toArray();
//       res.status(200).json(posts);
//     }
//       break;
//   }
// }


// const micro = require('micro');
// const formidable = require('formidable');
// const multer  = require('multer')
// import nc from 'next-connect'
//import { handleBreakpoints } from "@mui/system";
//import { v2 as cloudinary } from "cloudinary";
//const fs = require('fs')
//import { createRouter } from 'next-connect';


//const nc = createRouter()




// export const config = {
//   api: {
//     bodyParser: false,
//     },
// };

// export default async function handleBreakpoints(req, res){
//   const resp = await cloudinary.uploader.upload(req.file).then(console.log(req.file.path))
//   //     console.log(req.file.path)
// }


// // const storage = multer.diskStorage({
// //   destination: function (req, file, cb) {
// //   //   cb(null, path.join(process.cwd(), 'public', 'uploads'))
// //   // },
// //   // filename: function (req, file, cb) {
// //   //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
// //   //   cb(null, file.fieldname + '-' + uniqueSuffix)
// //   }
// // })

// // const upload = multer({ storage: storage })

// const handler = nc({
//   onError: (err, req, res, next) => {
    
//     res.status(500).end("Something broke!");
//   },
//   onNoMatch: (req, res) => {
//     res.status(404).end("Page is not found");
//   },
// })
//   .use(upload.single('image'))
//   .post(upload.single('image'), async (req, res) => {
//     // use async/await
//     const resp = cloudinary.uploader.upload(req.file.path)
//     console.log(req.file.path)
   
//   })

//   export default handler;
 



// async function endpoint(req, res) {
  
// const data = await new Promise(function (resolve, reject) {
//   const form = new formidable.IncomingForm({ keepExtensions: true });
//   form.parse(req, function (err, fields, files) {
//     if (err) return reject(err);
//     resolve({ fields, files });
//   });
// });
// console.log(data)
// }
  

// export default micro(endpoint);