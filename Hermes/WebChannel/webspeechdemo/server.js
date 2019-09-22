const express = require('express');
var session = require('express-session');
//var mongo = require('mongodb');
var Promise = require('promise');
const multer = require("multer");
const app = express();
const port = 7000;
const bodyParser = require('body-parser');
var http = require('http');
var path = require("path");
const fs = require("fs");
var querystring = require('querystring');
var userId;
var containerId;
var cors = require('cors')

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'secret',resave: true,saveUninitialized: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public')); // exposes index.html

const mongo = require('mongodb').MongoClient;
const url = "mongodb://adi:adi@localhost:27017/conversationalAI"
const MongoClient = new mongo(url, { useNewUrlParser: true });
const assert = require('assert');
const dbName = 'conversationalAI';
var ObjectId = require('mongodb').ObjectID;

// ___________________________________________________________________________________________________________________________
// https://steemit.com/utopian-io/@morningtundra/storing-and-retreiving-images-in-mongodb-with-nodejs
mongo.connect(url, (err, client) => {
  if (err) return console.log(err)
  db = client.db(dbName); 
})

/** Storage Engine-- SET STORAGE */ 
const storageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function(req, file, cb){
    cb(null,  new Date().getTime().toString()+'-'+file.fieldname+path.extname(file.originalname));
  }
}); 

var validateFile = function(file, cb ){
  allowedFileTypes = /pdf|jpeg|jpg|png|gif/;
  const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType  = allowedFileTypes.test(file.mimetype);
  if(extension && mimeType){
    return cb(null, true);
  }else{
    cb("Invalid file type. Only JPEG, PNG and GIF file are allowed.")
  }
}

const upload_img = multer({ storage: storageEngine , limits: { fileSize:200000 },fileFilter: function(req, file, callback){
    validateFile(file, callback);} })

app.post('/api/upload/v2/', upload_img.single('photo'), (req, res) => {
  if (req.file == null) {
    // If Submit was accidentally clicked with no file selected...
    //res.render('index', { title:'Please select a picture file to submit!'});
    res.send('Please select a picture file to submit!');
    } 
    else {
    var img = fs.readFileSync(req.file.path);
    var portNo = 6000;
    var encode_image = img.toString('base64');
    // Define a JSONobject for the image attributes for saving to database
    image_name = req.file.originalname + '-' + Date.now();
   var finalImg = {
      //name: 'bike',
      name:image_name ,
        contentType: req.file.mimetype,
        image:  new Buffer(encode_image, 'base64')
     };
    db.collection('claims').insertOne(finalImg, (err, result) => {
        if (err) return console.log(err);

        var data = JSON.stringify({
      "email": "aayushku@buffalo.edu",
      "image": image_name
    });
    console.log("server side payload:"+data);
    var responseData = '';
    var options = {
      host: '0.0.0.0',
      port: portNo,
      path: '/chatAI/api/v1/predict/',
      method: 'POST',
      headers: {'Content-Type': 'application/json'}
    };
    var httpreq = http.request(options,function(response, err){
      response.setEncoding('utf8');
      response.on('data',function(chatResponse){
        chatResponse = JSON.parse(chatResponse);
        responseData = chatResponse["text"];
        console.log("Reply from chatBot- node.js side:"+responseData)
        res.send(responseData);
      });
    });
      httpreq.write(data);
      httpreq.end();
      httpreq.on('error', function(e){
        console.log("handling error121---------:"+e);
        chatResponse = {"text":"Something went wrong, while processing image.","contentType":"Plaintext","attachments":[],"action":{}}
        console.log("response from chatBot- node.js side:"+chatResponse, typeof(chatResponse))
        responseData = chatResponse["text"];
        res.send(responseData);
         });
  })// db.collection ends
}// else block ends
})

app.post('/api/upload/v1/', upload_img.single('photo'), (req, res) => {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    // Define a JSONobject for the image attributes for saving to database
  
   var finalImg = {
      name: 'bike',
        contentType: req.file.mimetype,
        image:  new Buffer(encode_image, 'base64')
     };
  db.collection('claims').insertOne(finalImg, (err, result) => {
      console.log(result)
   
      if (err) return console.log(err)
   
      console.log('saved to database')
      //res.redirect('/')
      //res.status(200).contentType("text/plain").end("Uploaded successfully");
      res.send("Uploaded successfully kundan");
     
  })
})

app.get('/photos', (req, res) => {
db.collection('claims').find().toArray((err, result) => {
 
      const imgArray= result.map(element => element._id);
            console.log(imgArray);
 
   if (err) return console.log(err)
   res.send(imgArray)
 
  })
});

app.get('/photo/:id', (req, res) => { // http://localhost:7000/photo/bike (url to call this)
var filename = req.params.id;
console.log("file name:"+filename, typeof(filename),filename.length);
dd = filename.trim();
console.log("file after trimming:"+dd, typeof(dd),dd.length);
var query = {'name':filename};
console.log("mongo query:",query, typeof(query));
db.collection('claims').findOne(query, (err, result) => {
 
    if (err) return console.log(err);
   
   console.log("result from db:"+ result);
   res.contentType('image/jpeg');
   res.send(result.image.buffer)
   
    
  })
})

// ______________________________________________________________________________________________________________________
const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "/Users/apple/Documents/projects/zishan_wipro/ConversationAI/WebChannel/webspeechdemo"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

// https://stackoverflow.com/questions/15772394/how-to-upload-display-and-save-images-using-node-js-and-express
app.post("/api/upload/org",
  upload.single("photo" /* name attribute of <file> element in your form */),
  (req, res) => {
    const tempPath = req.file.path;
    console.log("temp path:"+ tempPath);
    const targetPath = path.join(__dirname, "./uploads/image.png");
    console.log("target path:"+ targetPath);
    console.log("Extension check:",path.extname(req.file.originalname).toLowerCase());

    if (path.extname(req.file.originalname).toLowerCase() === ".jpeg") {
      console.log("V1")
      fs.rename(tempPath, targetPath, err => {
        if (err) console.log('ERROR: ' + err); //return handleError(err, res);

        //res.status(200).contentType("text/plain").end("File uploaded!");

        res.sendFile(path.join(__dirname+'/public/upload_success.html'));
      });
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);

        res
          .status(403)
          .contentType("text/plain")
          .end("Only .png files are allowed!");
      });
    }
  }
);

app.get("/image.png", (req, res) => {
  res.sendFile(path.join(__dirname, "./uploads/image.png"));
});
// ________________________________________________________________________________________________________________________


app.get('/webChat', function (request, response) {
  //console.log("server rendering html page");
  response.sendFile(path.join(__dirname+'/public/demo.html'));
});

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname + '/public/login.html'));
});


app.get('/home', function(request, response) {
  response.sendFile(path.join(__dirname + '/public/demo.html'));
  response.end();
});

// chat API
app.post('/startChat', function(req,res){
  console.log("in server side payload");
    console.log(req.body);
  var portNo = 5000;
  var email = req.body.email;
  var message = req.body.message;
  var data = JSON.stringify({"text": message});
  console.log("server side payload:"+data);
  var responseData = '';
  var options = {
    host: '0.0.0.0',
    port: portNo,
    path: '/api/v1/text/predict/',
    method: 'POST',
    headers: {'Content-Type': 'application/json'}
  };
  var httpreq = http.request(options,function(response, err){
    response.setEncoding('utf8');
    console.log("handling error---------:"+err);
    response.on('data',function(chatResponse){
      chatResponse = JSON.parse(chatResponse);
      res.send(chatResponse);
    });
    console.log("handling error1---------:"+err);
  });
  httpreq.write(data);
  httpreq.end();
  httpreq.on('error', function(e){
    console.log("handling error121---------:"+e);
    chatResponse = {"text":"Something went wrong, please try after some time.","contentType":"Plaintext","attachments":[],"action":{}}
    console.log("response from chatBot- node.js side:"+chatResponse, typeof(chatResponse))
    responseData = chatResponse
    res.send(responseData);
     });
})

app.post('/api/upload/v144/', function(req,res){
  console.log("in server side payload");
    console.log(req.body);
    res.send("Uploaded successfully kundan123");
  })

app.listen(port, () => console.log(`WebChannel app listening on port ${port}!`))
