// Main starting point of the app
// This syntax either needs .mjs file extension
// import express    from 'express'
// import http       from 'http'
// import bodyParser from 'body-parser'
// import morgan     from 'morgan'

// const app = express()

// Older syntax
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const router = require('./router')
const mongoose = require('mongoose')
const cors = require('cors')

// DB setup
mongoose.connect('mongodb://localhost:auth/auth', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const connection = mongoose.connection;

connection.on("connected", function() {
  console.log("connected to db");
});

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// App Setup
app.use(morgan('combined'))
app.use(cors(corsOptions))
app.use(bodyParser.json({ type: '*/*' }))
router(app)


// Server Setup
const port = process.env.PORT || 3090
const server = http.createServer(app)
server.listen(port)
console.log('Listening on: ', port)