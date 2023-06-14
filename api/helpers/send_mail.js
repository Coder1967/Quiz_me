const nodemailer = require('nodemailer')
require('dotenv').config()
const Bull = require('bull')
const myFirstQueue = new Bull('my-first-queue');

async function sendEmail(email, subject, text){
    const job = await myFirstQueue.add(
    {
        email,
        subject,
        text
    });
}

myFirstQueue.process(async (job, done) => {
    job = job.data;
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PWD
        }
    });
    
    let mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: job.email,
        subject: job.email,
        text: job.text
    }
    
    transporter.sendMail(mailOptions, (err, res)=>{
        if (err) console.log(err)
    })
    done()
});

module.exports = sendEmail;