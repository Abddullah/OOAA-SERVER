const express = require('express')
const router = express.Router()
const Tags = require('../modals/addtagsmodal')

//@POST ADD TAGS
router.post('/', async (req, res) => {
    const { count, name } = req.body

    //finding user in db
    const tags = await Tags.findOne({ name })
    if (!tags) {
        //constructor clone data
        const tags = new Tags(
            {
                count,
                name,
            }
        );
        //saving tags to db
        tags.save()
            .then(result => {
                console.log("result", result)
                res.status(200).json({ result: result, message: "Your tags has been successfully created!" })
            }).catch(err => {
                console.log("error", err)
                res.status(500).json({ error: err, message: err })
            })
    }

    else {
        let updateCount = tags.count + 1
        Tags.updateOne({ "name": name }, {
            count: updateCount,
        }, function (err, result) {
            if (err) {
                res.status(500).json({ error: err })
            } else {
                Tags.find({ "name": name })
                    .then(result => {
                        return res.status(200).json({ data: result, message: "Your tags has been successfully updated!" })
                    }).catch(err => {
                        console.log("error", err)
                        res.status(500).json({ error: err, message: err })
                    })
            }
        })


    }
})




// // //@GET WORKING HOUR
// router.get("/getworkinghours", (req, res) => {
//     console.log(req.body.userId, "data")
//     WorkingHour.find({ userId: req.body.userId })
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

module.exports = router