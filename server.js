// //      node --watch server
// //  CORS error
// //  CORS = cross-origin resource sharing
// //      npm i cors

// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';

// import Task from './models/Task.js'

// // dotenv.config();

// async function connect() {
//   try {
//     await mongoose.connect(process.env.DB);
//     console.log('Successfully connected to db!')
//   } catch(err) {
//     console.log(err);
//   }
// }
// connect();
// const app = express();

// app.use(cors()) // allows requests from anywhere
// app.use(express.json()) // automatically parse incoming json

// let numbers = [1, 2, 3]

// app.get('/numbers', (req,res) => {
//   res.json(numbers) // converting javascript to json
// })

// /*
//         A mongoose model is an object you can use to interact with a collection.
// */

// app.get('/getAllTasks', (req, res) => {

// })

// app.post('/addTask', async (req, res) => {
//     try {
//         const { title, description, status } = req.body
//         await Task.create({ title, description, status })
//         // https://mongoosejs.com/docs/models.html
//         // https://mongoosejs.com/docs/api/model.html
//         res.send("Success")
//     } catch (err) {
//         res.status(500).send("Error")
//     }
// })

// app.listen(5000, () => {
//   console.log('Now listening...')
// })
