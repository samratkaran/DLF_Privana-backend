const express = require('express');
const cors = require('cors');
require('dotenv').config();  // Loads variables from .env file (if needed)
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();

// Use the port from environment, or fallback to 5000 for local development
const PORT = process.env.PORT || 5000;

// CORS configuration (allowing all origins for testing)
app.use(cors({
    origin: '*',  // Allow all origins for now (can be restricted in production)
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));

// Middleware for parsing JSON and form data
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const fromemail = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

// Simple GET route for testing
app.get("/", (req, res) => {
    res.send("Welcome to the backend! It's running properly.");
});
app.get("/check", (req, res) => {
  res.send("Welcome to the Check Route.");
});


// POST route to handle form submissions
app.post('/form', (req, res) => {
    const { name, number } = req.body;
    console.log(`Received Name: ${name}, Phone Number: ${number}`);

    // Example of sending email using Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: fromemail,  // From .env file
            pass: pass,  // From .env file
        },
    });

    const mailOptions = {
        from: 'karan@ebaseinfra.com',  // Sender email
        to: 'info@ebaseinfra.com',     // Recipient email
        subject: 'DLF Privana North Enquiry',
        html:`<table width='60%' style='border:1px solid black;'>
                  <th style='background-color:#0051A4;color:#FFFFFF;text-align: center;'>Description</th>
                  <th style='background-color:#0051A4;color:#FFFFFF;text-align: center;'>Value</th>
          
                  <tr style='background-color:#AAD4FF;'>
                    <td width='65%'>Name</td>
                    <td>${name}</td>
                  </tr>
                  
                  <tr style='background-color:#AAD4FF;'>
                    <td width='65%'>Phone</td>
                    <td>${number}</td> 
                  </tr>
                  
                 
                  </table>`,
    };

    // Sending email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email.');
        } else {
            console.log('Email sent:', info.response);
            return res.status(200).send('Form submitted and email sent successfully.');
        }
    });
});

// Start the server (Hostinger will automatically handle the port)
app.listen(process.env.PORT, async () => {
    try {
      console.log(`Listening at port ${process.env.PORT}`);
    } catch (error) {
      console.log(error);
    }
  });
