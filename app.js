const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");
const nodemailer = require("nodemailer");
require('dotenv').config();

const app = express();

//View engine setup

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Static Folder
app.use("/public", express.static(path.join(__dirname, "public")));

// Body Parser Middleware
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(bodyParser.json());

// app.get("/", (req, res) => {
//   res.render("contact");
// });

app.post("/send", (req, res) => {
    console.log(req.body);
    const output = `
    <h2>You have a new contact request<h2>
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>

    `;
    let transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: process.env.PORT_MAIL,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_EMISOR, // generated ethereal user
            pass: process.env.EMAIL_PASS, // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    // send mail with defined transport object
    let mailOptions = {
        from: `${req.body.name} <${req.body.email}>`, // sender address
        to: process.env.EMAIL_RECEIVER, // list of receivers
        subject: "You have a new email", // Subject line
        // text: "Hello world?", // plain text body
        html: output, // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        res.redirect("http://127.0.0.1:5500/index.html");
    });
});

app.listen(3000, () => console.log("server started..."));