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
const Addservice = require('../modals/addservicemodal')

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

router.post("/Addservice", upload.array("imgs", 15), (req, res, err) => {
    console.log(req.body, "Dataaaa")
    // new Date().toLocaleTimeString()
    // function formatAMPM(date) {
    //     var hours = date.getHours();
    //     var minutes = date.getMinutes();
    //     var ampm = hours >= 12 ? 'pm' : 'am';
    //     hours = hours % 12;
    //     hours = hours ? hours : 12; // the hour '0' should be '12'
    //     minutes = minutes < 10 ? '0'+minutes : minutes;
    //     var strTime = hours + ':' + minutes + ' ' + ampm;
    //     return strTime;
    //   }
    //   console.log(formatAMPM(new Date));
    if (req.files[0]) {
        // res.status(200).json({ message: "IF" })
        let imgArr = []
        req.files
        let i;
        for (i = 0; i < req.files.length; i++) {
            // imgArr.push("https://safe-bayou-42516.herokuapp.com/addservice/" + req.files[i].filename)
            imgArr.push("http://localhost:3002/addservice/" + req.files[i].filename)
        }
        //constructor clone data
        const service = new Addservice(
            {
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                shopeName: req.body.shopeName,
                catogery: req.body.catogery,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                userId: req.body.userId,
                serviceImage: imgArr,
            }
        );
        //saving service to db
        service.save()
            .then(result => {
                console.log("result", result)
                res.status(200).json({ result: result, message: "Your service has successfully been posted!" })
            }).catch(err => {
                console.log("error", err)
                res.status(500).json({ error: err, message: err })
            })
    }
    else {
        res.status(200).json({ message: "Please attach image" })
    }
});

router.get("/getService/:userId", (req, res) => {
    Addservice.find({ userId: req.params.userId })
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

router.get("/getSameBrand/:itemsCode", (req, res) => {
    Addservice.find(
        { items: { $gt: { productId: req.params.itemsCode, } } }
    ).then((result) => {
        return res.status(200).json({ data: result, message: "Same Brand" })
    }).catch(err => {
        console.log("error", err)
        return res.status(500).json({ error: err, message: err })
    })
});


router.get("/getSameService/:itemsCat", (req, res) => {
    Addservice.find(
        { catogery: req.params.itemsCat }
    ).then((result) => {
        return res.status(200).json({ data: result, message: "Same Service" })
    }).catch(err => {
        console.log("error", err)
        return res.status(500).json({ error: err, message: err })
    })
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