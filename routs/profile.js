
const express = require('express')
const router = express.Router()
const Users = require('../modals/signupmodal')
const Products = require('../modals/addproductmodal')
const AddAddress = require('../modals/addaddressmodal')
const nodemailer = require('nodemailer')


// router.post("/updateaddress", async (req, res, ) => {
//     console.log(req.body, "BODYyyyyyyyyyyyyyyyyyyyy")
//     //update profile address to db
//     Users.updateOne({ "_id": req.body._id }, {
//         address: req.body.address,
//     }, async function (err, result) {
//         if (err) {
//             res.status(500).json({ error: err })
//         } else {
//             const { _id, } = req.body
//             const user = await Users.findOne({ _id })
//             console.log(user, "user")
//             res.status(200).json({ user: user, message: "Your Address has successfully been adated!" })
//         }
//     })

// });


router.get("/getAddress/:userId", (req, res) => {
    // console.log(req.params.userId, "req")
    AddAddress.find({ userId: req.params.userId })
        .then(result => {
            if (!result || result.length === 0) {
                return res.status(409).json({ message: "No data exist" })
            }
            else {
                return res.status(200).json({
                    data: result,
                });
            }
        }).catch(err => {
            console.log("error", err)
            res.status(500).json({ error: err, message: err })
        })
});


router.post("/addAddress", async (req, res, ) => {
    console.log(req.body, "BODYyyyyyyyyyyyyyyyyyyyy")
    //  constructor clone data
    const address = new AddAddress(
        {
            fullName: req.body.fullName,
            phoneNumber: req.body.phoneNumber,
            region: req.body.region,
            postCode: req.body.postCode,
            streetNumber: req.body.streetNumber,
            flatNumber: req.body.flatNumber,
            townCity: req.body.townCity,
            Country: req.body.Country,
            deliveryToInstruction: req.body.deliveryToInstruction,
            numberToAccess: req.body.numberToAccess,
            userId: req.body.userId,
        }
    );
    console.log(address, "Dataaaa")
    //saving address to db
    address.save()
        .then(result => {
            console.log("result", result)
            res.status(200).json({ result: result, message: "Your address has successfully been added!" })
        }).catch(err => {
            console.log("error", err)
            res.status(500).json({ error: err, message: err })
        })
});

router.post("/updateAddress", async (req, res, ) => {
    console.log(req.body, "BODYyyyyyyyyyyyyyyyyyyyy")
    AddAddress.updateOne({ "_id": req.body._id }, {
        fullName: req.body.fullName,
        phoneNumber: req.body.phoneNumber,
        region: req.body.region,
        postCode: req.body.postCode,
        streetNumber: req.body.streetNumber,
        flatNumber: req.body.flatNumber,
        townCity: req.body.townCity,
        Country: req.body.Country,
        deliveryToInstruction: req.body.deliveryToInstruction,
        numberToAccess: req.body.numberToAccess,
        userId: req.body.userId,
    }, function (err, result) {
        if (err) {
            res.status(500).json({ error: err })
        } else {
            res.status(200).json({ message: "Your address has successfully been updated!" })
        }
    })
});


router.delete("/deleteAddress/:objId", async (req, res, ) => {
    AddAddress.deleteOne({ "_id": req.params.objId }, {
    }, function (err, result) {
        if (err) {
            res.status(500).json({ error: err })
        } else {
            res.status(200).json({ message: "Your address has successfully been deleted!" })
        }
    })
});



// router.post("/activateAddress", async (req, res, ) => {
//     console.log(req.body, "BODYyyyyyyyyyyyyyyyyyyyy")

//     AddAddress.find({ userId: req.body.userId })
//         .then(result => {
//             if (!result || result.length === 0) {
//                 return res.status(409).json({ message: "No data exist" })
//             }
//             else {
//                 return res.status(200).json({
//                     data: result,
//                 });
//             }
//         }).catch(err => {
//             console.log("error", err)
//             res.status(500).json({ error: err, message: err })
//         })

// });






router.post("/deleteprofile", async (req, res, ) => {
    console.log(req.body, "BODYyyyyyyyyyyyyyyyyyyyy")
    const { email, _id } = req.body
    //finding user in db
    const user = await Users.findOne({ email })
    // console.log(user, user._id, "user")
    if (user && user._id != null && _id == user._id) {
        //delete profile to db
        Users.deleteOne({ "_id": _id }, {
        }, function (err, result) {
            if (err) {
                res.status(500).json({ error: err })
            } else {
                Products.deleteOne({ "userId": _id }, {
                }, function (err, result) {
                    if (err) {
                        res.status(500).json({ error: err })
                    } else {
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
                            subject: 'We’ve just found out you wanted to delete your account!',
                            html: `Hi,<br/><br/> We’ve just found out you wanted to delete your account! We are sorry to see you leaving :( <br/><br/>We would also be super interested to know why you wanted to leave us.<br/>  If you didn’t want this to happen please email us at ooaaowner@gmail.com <br/><br/>This is the last email you will receive from us. Thank you for checking OOAA out.`
                        }
                        // send mail with defined transport object (CODE WITH 5 MINUTES EXPIRY)
                        transporter.sendMail(mailOptions, function (err, data) {
                            if (err) {
                                res.json({ error: err })
                            } else {
                                res.status(200).json({ message: "Your Profile has successfully been deleted!" })
                            }
                        })

                    }
                })
            }
        })
    }

    else {
        return res.status(409).json({ message: 'Your email is incorrect' })
    }
});


module.exports = router