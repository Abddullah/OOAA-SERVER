// const express = require('express')
// const router = express.Router()
// const nodemailer = require('nodemailer')

// router.post('/', (req, res) => {
//     const code = generateCode()
//     //create reusable transporter object using the default SMTP transport
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: 'ooaa.app2019@gmail.com',
//             pass: 'Abcd@123456'
//         }
//     })
//     //info about sender, reciever, text with subject
//     const mailOptions = {
//         from: "ooaa.app2019@gmail.com",
//         to: req.body.email,
//         subject: 'Email Verification',
//         html: `Hi,<br/><br/> We have received a request to activate your OOAA account.<br/><br/> Your verification code can be found below.<br/> <font size="5"> <b>${code}</b></font> <br/><br/><br/>This is an automated email from OOAA.<br/>Please do not reply to this email.<br/>If you have any queries about this email please email us at ooaaowner@gmail.com.<br/>Have an awesome day.<br/><br/> OOAA `
//     }

//     // send mail with defined transport object (CODE WITH 5 MINUTES EXPIRY)
//     transporter.sendMail(mailOptions, function (err, data) {
//         if (err) {
//             res.json({ error: err })
//         } else {
//             //AFTER SENDING CODE TO USER, SAVING IN DATABASE
//             res.status(200).json({ code: code, message: 'USER CREATE AND ACTIVATION CODE SUCCESSFULLY SENT' })
//         }
//     })


//     //GENERATING RANDOM 6 DIGITS VALIDATION CODE
//     function generateCode() {
//         const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
//             'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'Q', 'R',
//             'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1',
//             '2', '3', '4', '5', '6', '7', '8', '9']
//         let code = ''
//         for (var i = 0; i < 6; i++) {
//             code += arr[Math.floor(Math.random() * 36)]
//         }
//         return code
//     }

// })



// // //@POST VERIFYING USER CODE
// // router.post('/activateaccount', async (req, res) => {
// //     const { email, code, timestampp } = req.body
// //     // console.log(email, code, timestampp, "dattttttttttaaaaa")

// //     //FIND EMAIL ADDRESS WITH LATEST VERIFICATION CODE
// //     const user = await ActivateAccount.find({ email }).sort({ _id: -1 })

// //     // console.log(user, "userrrrrr")
// //     // res.send(user[0])

// //     //DIFFERENCE BETWEEN WHEN THE CODE IS GENERATED AND NOW PRESENT TIME
// //     const timestamp = user[0].createdAt
// //     const timenow = timestampp
// //     let time = timenow - timestamp

// //     // CHECK IF TIME IS OUT OR CODE IS VALID
// //     if (time > 300000 || code != user[0].code) {
// //         return res.status(409).json({ message: "INVALID VERIFICATION CODE" })
// //     }
// //     else {

// //         // res.send({ message: 'CODE IS CORRECT' })
// //         Signup.updateOne({ "email": email }, {
// //             verified: true
// //         }, function (err, result) {
// //             if (err) {
// //                 res.status(500).json({ error: err })
// //             } else {
// //                 res.status(200).json({ message: 'Account activate successfully' })
// //             }
// //         })


// //     }
// // })




// module.exports = router