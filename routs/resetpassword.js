const express = require('express')
const router = express.Router()
const ResetPassword = require('../modals/resetpasswordmodal')
const Users = require('../modals/signupmodal')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')

// //@POST send verification code to user for change password
// router.post('/sendcode', async (req, res) => {
//     const email = req.body.email
//     const code = generateCode()

//     //CHECK ACCOUNT IF ALREADY EXISTS OR NOT
//     const user = await Users.findOne({ email })
//     if (!user) {
//         return res.status(409).json({ message: 'No user found' })
//     }
//     // console.log(email, "email")
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
//         to: email,
//         subject: 'Email Verification',
//         text: `Your verification code is ${code}`
//     }

//     // send mail with defined transport object (CODE WITH 5 MINUTES EXPIRY)
//     transporter.sendMail(mailOptions, function (err, data) {
//         if (err) {
//             console.log('error---------->', err)
//             res.json({ error: err })
//         } else {
//             // console.log('response---------->', data.response)
//             // res.json({ response: data.response })
//             //AFTER SENDING CODE TO USER, SAVING IN DATABASE
//             const us = new ResetPassword({
//                 code: code,
//                 email: email,
//             })
//             us.save()
//                 .then(result => {
//                     console.log(result)
//                     res.status(201).json({ message: 'Code sent successfully' })
//                 }).catch(err => {
//                     console.log(err)
//                     res.status(500).json({ error: err })
//                 })

//         }
//     })

// })


// function generateCode() {
//     const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
//         'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'Q', 'R',
//         'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1',
//         '2', '3', '4', '5', '6', '7', '8', '9']
//     let code = ''
//     for (var i = 0; i < 6; i++) {
//         code += arr[Math.floor(Math.random() * 36)]
//     }
//     return code
// }



//@POST send verification code to user for change password
router.post('/sendcode', async (req, res) => {
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
        // text: `Your verification code is ${code}`
        html: `Hi,<br/><br/> We have received a request to reset the password for your OOAA account.<br/><br/> Your verification code can be found below.<br/> <font size="5"> <b>${code}</b></font> <br/><br/><br/>This is an automated email from OOAA.<br/>Please do not reply to this email.<br/>If you have any queries about this email please email us at ooaaowner@gmail.com.<br/>Have an awesome day.<br/><br/> OOAA `
    }

    // send mail with defined transport object (CODE WITH 5 MINUTES EXPIRY)
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            res.json({ error: err })
        } else {
            //AFTER SENDING CODE TO USER, SAVING IN DATABASE
            const userCode = new ResetPassword({
                code: code,
                email: email,
                createdAt: createdAt
            })
            userCode.save()
                .then(result => {
                    res.status(201).json({ message: 'CODE SUCCESSFULLY SENT' })
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



// router.post('/verifycode', async (req, res) => {
//     const { email, code } = req.body

//     console.log(email, code, req.body, "dattttttttttaaaaa")

//     const user = await ResetPassword.findOne({ email, code })

//     if (!user) {
//         return res.status(409).json({ message: "Invalid Code" })
//     }

//     const timestamp = user.createdAt
//     const timenow = new Date().getTime()
//     let time = timenow - timestamp

//     // res.send(time)
//     // console.log(time)
//     if (time > 300000) {
//         return res.status(409).json({ message: "Invalid Code", time: time + ' minutes' })
//     }
//     res.send({ message: 'Code Correct' })

// })



//@POST VERIFYING USER CODE
router.post('/verifycode', async (req, res) => {
    const { email, code, timestampp } = req.body
    console.log(email, code, timestampp, req.body, req, "dattttttttttaaaaa")

    //FIND EMAIL ADDRESS WITH LATEST VERIFICATION CODE
    const user = await ResetPassword.find({ email }).sort({ _id: -1 })

    console.log(user, "userrrrrr")
    // res.send(user[0])

    //DIFFERENCE BETWEEN WHEN THE CODE IS GENERATED AND NOW PRESENT TIME
    const timestamp = user[0].createdAt
    const timenow = timestampp
    let time = timenow - timestamp

    // CHECK IF TIME IS OUT OR CODE IS VALID
    if (time > 300000 || code != user[0].code) {
        return res.status(409).json({ message: "INVALID VERIFICATION CODE" })
    }
    else {
        res.send({ message: 'CODE IS CORRECT' })
    }
})



// router.post('/changepassword', async (req, res) => {
//     const { email, newPassword } = req.body
//     console.log(email, newPassword, "newwwpasss")
//     bcrypt.hash(newPassword, 10, (err, hash) => {
//         if (err) {
//             return res.status(500).json({ error: err })
//         } else {
//             Users.updateOne({ "email": email }, {
//                 password: hash
//             }, function (err, result) {
//                 if (err) {
//                     res.status(500).json({ error: err })
//                 } else {
//                     res.status(200).json({ message: 'Password changed successfully' })
//                 }
//             })
//         }
//     })
// })


//@POST UPDATING PASSWORD
router.post('/changepassword', async (req, res) => {
    const { email, newPassword } = req.body

    //HASHING NEW PASSWORD
    bcrypt.hash(newPassword, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: err })
        } else {
            //UPDATE THE PASSWORD OF USER WHO REQUESTED
            Users.updateOne({ "email": email }, {
                password: hash
            }, function (err, result) {
                if (err) {
                    res.status(500).json({ error: err })
                } else {
                    res.status(200).json({ message: 'Your password has been updated' })
                }
            })
        }
    })
})



//@POST UPDATING PASSWORD
router.post('/changepasswordinsideapp', async (req, res) => {
    const { email, newPassword, currentPassword } = req.body

    const user = await Users.findOne({ email })

    if (!user) {
        return res.status(409).json({ message: 'Your log in information is incorrect' })
    }
    //currentPassword matching
    const match = await bcrypt.compare(currentPassword, user.password)
    if (!match) {
        return res.status(409).json({ message: "Invalid current password" })
    }
    else {
        // // HASHING NEW PASSWORD
        bcrypt.hash(newPassword, 10, (err, hash) => {
            if (err) {
                res.status(500).json({ error: err })
            } else {
                //UPDATE THE PASSWORD OF USER WHO REQUESTED
                Users.updateOne({ "email": email }, {
                    password: hash
                }, function (err, result) {
                    if (err) {
                        res.status(500).json({ error: err })
                    } else {
                        res.status(200).json({ message: 'Your password has been updated' })
                    }
                })
            }
        })
    }


   


})

module.exports = router


// if (res == true) {
//     console.log(res, "RESPONSE")
//     // // HASHING NEW PASSWORD
//     bcrypt.hash(newPassword, 10, (err, hash) => {
//         if (err) {
//             return res.status(500).json({ error: err })
//         } else {
//             //UPDATE THE PASSWORD OF USER WHO REQUESTED
//             Users.updateOne({ "email": email }, {
//                 password: hash
//             }, function (err, result) {
//                 if (err) {
//                     return res.status(500).json({ error: err })
//                 } else {
//                     return res.status(200).json({ message: 'Your password has been updated' })
//                 }
//             })
//         }
//     })
// }