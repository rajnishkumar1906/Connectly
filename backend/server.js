// There are two types of communication - staTELESS AND STATEfull
// for development mode we use nodemon run server.js
// for production mode we use node run server.js
// if type is module then use import insted of require

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDb from "./config/db.js";
import router from "./router/userRouter.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());   

// To handle the imgae data
app.use(express.urlencoded({extended:false}))

connectDb();

const PORT = process.env.PORT || 4000;

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

































// // params format
// app.get("/show1/:username", (req, res) => {
//     const { username } = req.params   //used {} because of json data passing format
//     res.send(`API running for ${username}`)
// }
// )

// // body format
// app.get("/show2", (req, res, next) => {
//     const { data } = req.body
//     // store data for middleware
//     req.data = data
//     next()   //used to use below middleware
// })
// // middleware is a function
// app.use((req, res, next) => {
//     const data = req.data
//     if (data !== undefined) {

//         if (typeof data == "string") {
//             return res.status(200).send("Data sent is in string format")
//         }
//         return res.status(400).send("Data sent is not string.")
//     }
//     next()
// })

// // let's do for query format
// // use middleware to limit lenght of string if it's mor ethan 5 then error 
// app.get("/show3/",(req,res,next)=>{
//     const {data} = req.query
//     req.data = data
//     next()
// })

// app.use((req,res,next)=>{
//     if(req.data !== undefined)
//     {
//         const value = String(req.data)
//         if(value.length <= 5) return res.status(200).json({'status' : "Successful"})
    
//         return res.status(400).json({'status' : "Failed"})
//     }
//     next()
// })