const express = require('express')
const router = express.Router()
const Products = require('../modals/addproductmodal')

router.get("/getproduct/:userId", (req, res) => {
    Products.find({ userId: req.params.userId })
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

router.delete("/deleteproduct/:_id", (req, res) => {
    Products.findOneAndDelete({ _id: req.params._id })
        .then(result => {
            if (result === null) {
                return res.status(409).json({ data: result, message: "Already Deleted this product" })
            }
            else {
                return res.status(200).json({ data: result, message: "Product Delete" })
            }
        }).catch(err => {
            console.log("error", err)
            return res.status(500).json({ error: err, message: err })
        })
});

router.get('/demo', (req, res) => {
    res.send("Working")
})

// router.get("/getallproducts/", (req, res) => {
//     let categoryType = []
//     console.log(categoryType, "category")
//     Products.find({ categoryType: "Food" }).skip(0).limit(4)
//         .then(Food => {
//             categoryType.push(Food)
//             Products.find({ categoryType: "Popular" }).skip(0).limit(4)
//                 .then(Popular => {
//                     categoryType.push(Popular)
//                     Products.find({ categoryType: "Seasonal" }).skip(0).limit(4)
//                         .then(Seasonal => {
//                             categoryType.push(Seasonal)
//                             Products.find({ categoryType: "Home" }).skip(0).limit(4)
//                                 .then(Home => {
//                                     categoryType.push(Home)
//                                     return res.status(200).json({ data: categoryType, message: "Products" })
//                                 }).catch(err => {
//                                     console.log("error", err)
//                                     return res.status(500).json({ error: err, message: err })
//                                 })
//                         }).catch(err => {
//                             console.log("error", err)
//                             return res.status(500).json({ error: err, message: err })
//                         })
//                 }).catch(err => {
//                     console.log("error", err)
//                     return res.status(500).json({ error: err, message: err })
//                 })
//         }).catch(err => {
//             console.log("error", err)
//             return res.status(500).json({ error: err, message: err })
//         })
// });

// router.get("/getproductcategorywise/:categoryType/:offset/:limit", (req, res) => {
//     Products.find({ categoryType: req.params.categoryType }).skip(Number(req.params.offset)).limit(Number(req.params.limit))
//         .then(result => {
//             return res.status(200).json({ data: result, message: "Products" })
//         }).catch(err => {
//             console.log("error", err)
//             return res.status(500).json({ error: err, message: err })
//         })
// });





router.get("/getallproductswithtags/:offset", (req, res) => {
    let categoryType = []
    let count = 0
    Products.find()
        .then(result => {
            let tags = []
            let i;
            for (i = 0; i < result.length; i++) {
                if (result[i].tags) {
                    // console.log(result[i].tags[0], "TAG_NAME")
                    let matchingTag = (tags.indexOf(result[i].tags[Number(req.params.offset)]) > -1);
                    if (matchingTag === false) {
                        tags.push(result[i].tags[Number(req.params.offset)])
                    }
                }
            }
            let j;
            for (j = 0; j < tags.length; j++) {
                Products.find({ tags: tags[j] }).skip(0).limit(4)
                    .then(result => {
                        // console.log("DATA_RETURN_ACCORDING_TO_FIRST_TAG", result)
                        categoryType.push(result)
                        count++;
                        if (count === tags.length) {
                            res.status(200).json({ data: categoryType, tags: tags, message: "Products" })
                        }
                    }).catch(err => {
                        console.log("error", err)
                        res.status(500).json({ error: err, message: err })
                    })
            }
        }).catch(err => {
            console.log("error", err)
            res.status(500).json({ error: err, message: err })
        })
});

router.get("/getproductcategorywiseAccTags/:tagName/:offset/:limit", (req, res) => {
    Products.find({ tags: req.params.tagName }).skip(Number(req.params.offset)).limit(Number(req.params.limit))
        .then(result => {
            return res.status(200).json({ data: result, message: "Products" })
        }).catch(err => {
            console.log("error", err)
            return res.status(500).json({ error: err, message: err })
        })
});

router.post("/getShopsItems/", (req, res) => {
    // router.get("/getShopsItems/:itemCode", (req, res) => {
    let itemsCode = req.body
    console.log(itemsCode, "BODYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY")

    Products.find({
        _id: {
            // $in: ['5dcead24c3c6e800177111c4 ', '5dceb71ac3c6e8001771121a', "5dceafcfc3c6e800177111d3"]
            $in: itemsCode
        }
    })
        .then(result => {
            return res.status(200).json({ data: result, message: "Products" })
        }).catch(err => {
            console.log("error", err)
            return res.status(500).json({ error: err, message: err })
        })
});



module.exports = router