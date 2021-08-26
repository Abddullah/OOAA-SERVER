const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const crypto = require("crypto");
const router = express.Router()
const Addproduct = require('../modals/addproductmodal')

const app = express();

app.use(bodyParser.json());
app.use(cors());

//Connect to DB
const mongoURI = "mongodb+srv://abdullah:abcd123456@cluster0-9ml1p.mongodb.net/test?retryWrites=true&w=majority"
const conn = mongoose.createConnection(mongoURI);
mongoose.connect(mongoURI, { useNewUrlParser: true });

let gfs;

conn.once("open", () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("image");
    console.log("Connection Successful");
});

// Create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = file.originalname;
                const fileInfo = {
                    filename: Date.now() + "_" + filename,
                    bucketName: "image"
                };
                resolve(fileInfo);
            });
        });
    }
});

router.get('/demo', (req, res) => {
    res.send("Working")
})

const upload = multer({ storage });

router.post("/", upload.array("imgs", 15), (req, res, err) => {
    console.log(req.body, "Dataaaa")
    let imgObj = []
    req.files

    let i;
    for (i = 0; i < req.files.length; i++) {
        console.log(req.files[i], "looooopppp")
        imgObj.push("https://safe-bayou-42516.herokuapp.com/addproduct/" + req.files[i].filename)
    }

    //constructor clone data
    const product = new Addproduct(
        {
            packing: req.body.packing,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            address: req.body.address,
            phone: req.body.phone,
            categoryType: req.body.categoryType,
            subcatory: req.body.subcatory,
            userId: req.body.userId,
            waight: req.body.waight,
            waightUnit: req.body.waightUnit,
            productImage: imgObj,
        }
    );

    console.log(product, "Dataaaa")

    //saving product to db
    product.save()
        .then(result => {
            console.log("result", result)
            res.status(200).json({ result: result, message: "Your product has successfully been posted!" })
        }).catch(err => {
            console.log("error", err)
            res.status(500).json({ error: err, message: err })
        })
});



router.post("/update", upload.array("imgs", 15), (req, res, err) => {

    let imgObj = []
    req.files

    if (req.files.length != 0) {
        let indexCount = req.files.length
        let productImage = req.body.productImage

        let i;
        for (i = 0; i < req.files.length; i++) {
            imgObj.push("https://safe-bayou-42516.herokuapp.com/addproduct/" + req.files[i].filename)
        }
    }

    else {
        imgObj = JSON.parse(req.body.productImage)
    }


    console.log(req.body, "BODYyyyyyyyyyyyyyyyyyyyy")

    //update product to db
    Addproduct.updateOne({ "_id": req.body._id }, {
        packing: req.body.packing,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        address: req.body.address,
        phone: req.body.phone,
        categoryType: req.body.categoryType,
        subcatory: req.body.subcatory,
        userId: req.body.userId,
        waight: req.body.waight,
        waightUnit: req.body.waightUnit,
        productImage: imgObj,
    }, function (err, result) {
        if (err) {
            res.status(500).json({ error: err })
        } else {
            res.status(200).json({ message: "Your product has successfully been updated!" })
        }
    })


    // let imgObj = {}
    // req.files

    // if (req.files.length != 0) {

    //     let indexCount = req.files.length
    //     let productImage = JSON.parse(req.body.productImage)


    //     let i;
    //     for (i = 0; i < req.files.length; i++) {
    //         imgObj[`image${i + 1}Url`] = "https://safe-bayou-42516.herokuapp.com/addproduct/" + req.files[i].filename
    //     }

    //     for (var key in productImage) {
    //         console.log(productImage, "productttt")
    //         imgObj[`image${indexCount + 1}Url`] = productImage[key]
    //     }
    // }

    // else {
    //     imgObj = req.body.productImage
    // }


    // console.log(req.body, "BODYyyyyyyyyyyyyyyyyyyyy")

    // //update product to db
    // Addproduct.updateOne({ "_id": req.body._id }, {
    //     packing: req.body.packing,
    //     title: req.body.title,
    //     description: req.body.description,
    //     price: req.body.price,
    //     address: req.body.address,
    //     phone: req.body.phone,
    //     categoryType: req.body.categoryType,
    //     subcatory: req.body.subcatory,
    //     userId: req.body.userId,
    //     waight: req.body.waight,
    //     waightUnit: req.body.waightUnit,
    //     productImage: imgObj,
    // }, function (err, result) {
    //     if (err) {
    //         res.status(500).json({ error: err })
    //     } else {
    //         res.status(200).json({ message: "Your product has successfully been updated!" })
    //     }
    // })
});



router.get("/:filename", (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: "No file exists"
            });
        }

        // Check if image
        if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
            // Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({
                err: "Not an image"
            });
        }
    });
});



module.exports = router