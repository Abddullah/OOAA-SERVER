const port = process.env.PORT || 3002;

//import modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
// const multer = require("multer");
// const GridFsStorage = require("multer-gridfs-storage");
// const Grid = require("gridfs-stream");
// const crypto = require("crypto");

//middleware 
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
// app.use(express.urlencoded({ extended: true }))


//cluster connection 
const mongoURI = "mongodb+srv://abdullah:abcd123456@cluster0-9ml1p.mongodb.net/test?retryWrites=true&w=majority"
// const mongoURI = "mongodb+srv://OOAA:<password>@clusterooaa-wg30u.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(mongoURI, { useNewUrlParser: true });
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log('>>>>>>>>>======================== we re connected! to mongoose ========================>>>>>>>>>')
});

//route connect with main server file
app.use('/', require('./routs/index'))
app.listen(port, () => console.log(`Server is listening on port ${port}`))
