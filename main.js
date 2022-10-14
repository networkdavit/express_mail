const express = require('express')
const sqlite3 = require('sqlite3')
const bodyparser = require('body-parser')
const crypto = require('crypto')
const jsonparser = bodyparser.json()
const nodemailer = require('nodemailer');
const app = express()
require('dotenv').config() 
const port = 3000
app.use(jsonparser)
const from_email = process.env.EMAIL
const email_password = process.env.PASSWORD

let db = new sqlite3.Database('main.db')
db.run("CREATE TABLE IF NOT EXISTS users (username STRING,email STRING, password STRING)")

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req, res) => {
    const username = req.body.username 
    const email = req.body.email 
    const password = req.body.password
    const hashed_password = crypto.createHash('sha256').update(password).digest('hex');
    let sql = ("INSERT INTO users (username, email, password) VALUES (?, ?, ?)")
    db.run(sql, username, email,hashed_password, function(err){
        if(err){
            res.send(JSON.stringify({status: "Error registering"}))
        }
        res.send(JSON.stringify({status: "Registered"}))
    } )
    send_node_email(email)
  })


function send_node_email(email){
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: from_email,
        pass: email_password
    }
    });
    
    const mailOptions = {
    from: from_email,
    to: email,
    subject: 'Welcome',
    text: 'Thanks for registering'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
}


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})