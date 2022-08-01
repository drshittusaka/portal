
import clientPromise from "../../../lib/mongodb";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  //const session = await getSession(req)
// console.log(session.user.email)
 
  const client = await clientPromise;
  const db = client.db("StudentPortal");
  let bodyObject = req.body;
  let newPost = await db.collection("Pass Keys").findOne();
   res.status(200).json(newPost)
}








