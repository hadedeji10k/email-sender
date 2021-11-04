const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express()

// EXPRESS MIDDLEWRARES SETUP
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// To accept JSON objects
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.get("/", (req, res) => {
  return res.status(201).json({
    message: "Welcome to the home route of the Backend E-mail sender",
    success: true,
  });
})

app.post("/send", (req, res) => {
  try {
    let { organizationEmail, subject, message } = req.body;

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let mailOptions = {
      from: process.env.GMAIL,
      to: organizationEmail,
      subject: subject,
      html: `
          <p>${message}</p>
          `,
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    return res.status(201).json({
      message: "Message sent Successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on ${port} `));

