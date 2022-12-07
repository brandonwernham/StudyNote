const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');

const database = mysql.createPool({
    host: "localhost",
    user: "server",
    password: "Rohan123",
    database: "StudyNoteDB",
});

var corsOption = {
    origin: '*',
    methods: ["GET", "POST"],
    credentials: true
}
app.use(cors(corsOption));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', `*`) ;
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Auth-Token');
    res.header('Access-Control-Allow-Methods', '*');
    next();
});

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(session({
    key: "userId",
    secret: "guessThis", 
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24 * 7,
    },
}));

//sign up 
app.post("/api/signUp", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const userType = req.body.userType;

    const sqlInsert = "INSERT INTO UserInfo (Email, UserPassword, UserType) VALUES (?,?,?)"
    database.query(sqlInsert, [email, password, userType], (err, result) => {
        if(err) {
            res.send({err: err}) //this will be returned when duplicate entry in database, among with other errrs.
        } else {
            console.log(result);
            res.send({message: "User " + email + " added successfully"}) //sent to client
        }
    })
});

//login
app.post("/api/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const sqlInsert = "SELECT * FROM UserInfo WHERE Email = ? AND UserPassword = ?"
    database.query(sqlInsert, [email, password], (err, result) => {
        if(err) {
            res.send({err: err})
        } else if (result.length > 0) {
            req.session.user = result;
            console.log(req.session.user);
            res.send(result); 
        } else {
            res.send({message: "User not found."})
        }
        
    })    
});

app.get("/api/login", (req, res) => {
    if(req.session.user) {
        res.send({loggedIn: true, user: req.session.user});
    } else {
        res.send({loggedIn: false})
    }
});


app.get("/api/showDB", (req, res) => {

    const sqlInsert = "SELECT * FROM UserInfo"
    database.query(sqlInsert, (err, result) => {
        if (err){
            res.send({err: err})
        }
        else if (result.length > 0){
            res.send(result);
        } else{
            res.send({message: "DB empty"})
        }
    })    
});

app.get("/api/test", (req, res) => {
    res.send({message: "the server is sending this message."})
})


//file uploading
const upload = multer({dest: "notes/"});

app.post("/api/upload", upload.single("note"), (req, res) => {
    const filePath = req.file.path;

    const sqlInsert = "INSERT INTO NotesTable (FilePath) VALUES (?)"
    database.query(sqlInsert, [filePath], (err, result) => {
        if (err) {
            res.send({err: err}) //this will be returned when duplicate entry in database, among with other errrs.
        } else {
            console.log(result.insertId);
            res.send({message: "Insert ID:  " + result.insertId}) //sent to client
        }
    })
});



app.post("/api/getNote", (req, res) => {
    const tags = req.body.tags;

    const sqlInsert = "SELECT FilePath FROM NotesTable WHERE FileID = ?"
    database.query(sqlInsert, tags, (err, result) => {
        if (err){
            res.send({err: err})
        }
        else{
            console.log(result[0].FilePath);
            res.send(result[0].FilePath);
        }
    })
});



app.delete("/api/upload/delete", (req, res) => {
    console.log("file was deleted");
    return res.status(200).json({ result: true, msg: 'file was deleted'});
});


app.use('/notes', express.static('notes'))
app.listen(3001, () => {
    console.log("running on port 3001");
})