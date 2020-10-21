const express = require("express");
// const bodyParser = require("body-parser");
// const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const { cors } = require("./security/security");

const port = process.env.PORT || 4000;

//View engine setup

app.use(express.json());
app.use(cors);
app.use(express.urlencoded({ extended: false }));

app.post("/send-email", async (req, res) => {
  const { userName, userEmail, userMessage } = req.body;

  const output = `
    <h2>You have a new contact request<h2>
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${userName}</li>
        <li>Email: ${userEmail}</li>
    </ul>
    <h3>Message</h3>
    <p>${userMessage}</p>

    `;
  const transporter = nodemailer.createTransport({
    host: "smtp.strato.de",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "contact@federicoientile.com", // generated ethereal user
      pass: "quiriopanchi1983", // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: `Website <contact@federicoientile.com>`,
    to: "contact@federicoientile.com",
    subject: "You have a new email",
    html: output,
  });
  res.redirect("https://federicoientile.com/thanks.html");
});

app.listen(port, () => console.log("server started in PORT:", port));
