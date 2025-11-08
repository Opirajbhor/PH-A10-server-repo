const express = require('express')
const mongoose = require('mongoose')
const connectDB = require("./src/Database.js")
require("dotenv").config();
const app = express()
const port = 3000


// database connect
connectDB();
// ---------------



app.get('/', (req, res) => {
  res.send('Hello World! opi')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})





