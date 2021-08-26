
const express = require('express')
const router = express.Router()
const ResetPassword = require('../modals/resetpasswordmodal')
const Users = require('../modals/signupmodal')
const nodemailer = require('nodemailer')
const ActivateAccount = require('../modals/activateaccountmodal')


//@POST send verification code to user for change password
router.post('/', async (req, res) => {
    const { email, createdAt } = req.body
    const code = generateCode()
    // console.log(email, createdAt, "sendCode")

    //CHECK ACCOUNT IF ALREADY EXISTS OR NOT
    const user = await Users.findOne({ email })
    if (!user) {
        return res.status(409).json({ message: 'ACCOUNT NOT FOUND, PLEASE AGAIN' })
    }

    //create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ooaa.app2019@gmail.com',
            pass: 'Abcd@123456'
        }
    })


    //info about sender, reciever, text with subject
    const mailOptions = {
        from: "ooaa.app2019@gmail.com",
        to: email,
        subject: 'Email Verification',
        html: `Hi,<br/><br/> We have received a request to activate your OOAA account.<br/><br/> Your verification code can be found below.<br/> <font size="5"> <b>${code}</b></font> <br/><br/><br/>This is an automated email from OOAA.<br/>Please do not reply to this email.<br/>If you have any queries about this email please email us at ooaaowner@gmail.com.<br/>Have an awesome day.<br/><br/> OOAA `
    }

    // send mail with defined transport object (CODE WITH 5 MINUTES EXPIRY)
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            res.json({ error: err })
        } else {
            //AFTER SENDING CODE TO USER, SAVING IN DATABASE
            const userCode = new ActivateAccount({
                code: code,
                email: email,
                createdAt: createdAt
            })
            userCode.save()
                .then(result => {
                    res.status(201).json({ message: 'ACTIVATION CODE SUCCESSFULLY SENT' })
                }).catch(err => {
                    res.status(500).json({ error: err })
                })
        }
    })
})


//GENERATING RANDOM 6 DIGITS VALIDATION CODE
function generateCode() {
    const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
        'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1',
        '2', '3', '4', '5', '6', '7', '8', '9']
    let code = ''
    for (var i = 0; i < 6; i++) {
        code += arr[Math.floor(Math.random() * 36)]
    }
    return code
}


module.exports = router