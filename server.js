const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
const ENV = require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(cors({
    origin: ENV.parsed.ORIGIN
}));
app.use(express.json());
app.use("/", router);
app.listen(port , () => console.log("Server Running"));

const contactEmail = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
        user: ENV.parsed.SECRET_MAIL,
        pass: ENV.parsed.SECRET_PASS
    },
    requireTLS: true,
    tls: {
        ciphers: 'SSLv3'
    }
});

contactEmail.verify((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Ready to send");
    }
});

router.post("/contact", (req, res) => {
    console.log('req', req)
    const name = req.body.firstName +  ' ' + req.body.LastName;
    const email = req.body.email;
    const message = req.body.message;
    const phone = req.body.phone;
    const mail = {
        from: name,
        to: ENV.parsed.SECRET_MAIL,
        subject: "Contact Form Submission - Portfolio",
        html: `
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Phone: ${phone}</p>
            <p>Message: ${message}</p>
        `,
    };
    contactEmail.sendMail(mail, (error) => {
        if (error) {
            res.json(error);
        } else {
            res.json({ code: 200, status: "Message Sent" });
        }
    });
});
