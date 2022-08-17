import CredentialsProvider from "next-auth/providers/credentials"
import clientPromise from '../../../lib/mongodb'
import NextAuth from 'next-auth'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook";
import Auth0Provider from "next-auth/providers/auth0"
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import EmailProvider from 'next-auth/providers/email'
import MongoClientPromise from '../../../lib/mongodb'


const THIRTY_DAYS = 30 * 24 * 60 * 60
const THIRTY_MINUTES = 30 * 60

export default NextAuth({
  providers:[
    
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    })
      ,
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    })
    
  ],
  //secret: process.env.JWT_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.SECRET,
  session: {
    strategy: 'jwt',
    maxAge: THIRTY_DAYS,
    updateAge: THIRTY_MINUTES
  },
  //adapter: MongoDBAdapter(MongoClientPromise),
  pages: {
    signIn: '/signin',
    //signOut: '/auth/signout',
   // error: '/auth/error', // Error code passed in query string as ?error=
    //erifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/createProfile' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  session: {
    jwt: true
  },
  jwt: {
    secret: 'asdcvbtjhm'
  },
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.id = user.role
      }
      return token
    },
    async session(session, user, account) {
     // session.user = await users
      return session
    }
  }
 /**callbacks: { 
    async jwt({ token, account }) { 
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },  
    async session( {session, user} ) {
      //session.role = user.role
      // Send properties to the client, like an access_token from a provider.
     // session.user.role = user.role
      return session
    }
  } **/
  
  
})



/** export default NextAuth({
  providers: [
  CredentialsProvider({
    // The name to display on the sign in form (e.g. 'Sign in with...')
    name: ' your Credentials',
    // The credentials is used to generate a suitable form on the sign in page.
    // You can specify whatever fields you are expecting to be submitted.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      username: { label: "credential Username", type: "email", placeholder: "Enter your email" },
      password: {  label: "Password", type: "password" }
    },
    async authorize(credentials, req) {
      const email = credentials.username
      const password = credentials.password
     
                const client = await MongoClient.connect(
                    process.env.MONGODB_URI,
                    { useNewUrlParser: true, useUnifiedTopology: true }
                );
                //Get all the users
                const users = await client.db('StudentPortal').collection('users');
                //Find user with the email  
                const result = await users.findOne({email : email });
                //Not found - send error res
                if (!result) {
                  //  client.close();
                    throw new Error(`No user found with the email ${email}`);
                }
                //Check hased password with DB password
                const checkPassword = await bcrypt.compare(password, result.password);
                //Incorrect password - send response
                if (!checkPassword) {
                  //  client.close();
                    throw new Error('Password doesnt match');
                }else{ return result}
      // If no error and we have user data, return it
      
    }
  }),
  
  EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    }),
     GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }),
  Auth0Provider({
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    issuer: process.env.AUTH0_ISSUER
  })
  
],
  pages : {signIn : '/signin'},
 database :  process.env.MONGODB_URI,
  adapter: MongoDBAdapter(MongoClientPromise),
 secret: 'djdjdkdd',
  callbacks: {
    jwt : ({token, user})=>{
      if(user){ token.id = user.id} return token
  },
    session: ({session, token})=>{
      if(token){ session.id = token.id} return session
    }},
   jwt : {
    secret:'fjdjdjdj',
   encryption : true
  }
})
 









/**import NextAuth from 'next-auth'



import { MongoClient } from 'mongodb'
import { compare } from 'bcryptjs'
import CredentialsProvider from "next-auth/providers/credentials"
import { signIn } from 'next-auth/react'



const THIRTY_DAYS = 30 * 24 * 60 * 60
const THIRTY_MINUTES = 30 * 60

export default NextAuth({
  secret: process.env.SECRET,
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  session: {
    strategy: 'jwt',
    maxAge: THIRTY_DAYS,
    updateAge: THIRTY_MINUTES
  },
 // 
  providers: [CredentialsProvider({
            async authorize(credentials, req) {
                //Connect to DB
              
                const client = await MongoClient.connect(
                    process.env.MONGODB_URI,
                    { useNewUrlParser: true, useUnifiedTopology: true }
                );
                //Get all the users
                const users = await client.db().collection('users');
                //Find user with the email  
                const result = await users.findOne({
                    email: credentials.email,
                });
                //Not found - send error res
                if (!result) {
                    client.close();
                    throw new Error(`No user found with the email ${credentials.email}`);
                }
                //Check hased password with DB password
                const checkPassword = await compare(credentials.password, result.password);
                //Incorrect password - send response
                if (!checkPassword) {
                    client.close();
                    throw new Error('Password doesnt match');
                }else{ return result
                //Else send success response
                
           alert(status);
                client.close();
                return { email: result.email }; 
            }
        }}),  **/ 
   /**  
  ]
}) *







/**
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  })
],
})
**/

