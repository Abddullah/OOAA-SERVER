const express = require('express')
const router = express.Router()
const Users = require('../modals/signupmodal')
const bcrypt = require('bcrypt')

router.post('/', async (req, res) => {
    // console.log("Body", req.body, res)
    const { email, password } = req.body

    //finding user in db
    const user = await Users.findOne({ email })
    if (!user) {
        return res.status(409).json({ message: 'Your log in information is incorrect' })
    }

    //password matching
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        return res.status(409).json({ message: "Invalid password" })
    }

    //finding user is activate?
    if (user.verified === false) {
        return res.status(402).json({ message: 'Please activate your account' })
    }
    else {
        res.status(200).json(user)
    }

})

module.exports = router