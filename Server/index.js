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
    user: "root",
    password: "luna",
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

    const sqlInsert = "INSERT INTO users (email, user_password, user_type) VALUES (?,?,?)"
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

    const sqlInsert = "SELECT * FROM users WHERE email = ? AND user_password = ?"
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

    const sqlInsert = "SELECT * FROM users"
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

    const sqlInsert = "SELECT * FROM notes"
    database.query(sqlInsert, (err, result) => {
        if (err){
            res.send({err: err})
        }
        else if (result.length > 0){
            res.send(result);
        } else{
            res.send({message: "no notes"})
        }
    })    
    
   //res.send({message: "the server is sending this message."})
})


//file uploading
const upload = multer({dest: "notes/"});

// This is just a temporary way of uploading notes, I will have to figure out
// creating unique ids and such for each note uploaded
// For now, what it does is takes the formData as is, and inserts the first note uploaded
app.post("/api/upload", upload.fields([
    {name: 'note_id'},
    {name: 'note_name'},
    {name: 'note'},
    {name: 'tags'},
    {name: 'course_code'},
    {name: 'subject_code'},
    {name: 'creator_id'}
]), (req, res) => {
    const note_id = req.body.note_id;
    const note_name = req.body.note_name;
    const file_path = req.files.note[0].path;
    const tags = req.body.tags;
    const course_code = req.body.course_code;
    const subject_code = req.body.subject_code;
    const creator_id = req.body.creator_id;

    const sqlInsert = "INSERT INTO notes (note_id, note_name, file_path, tags, course_code, subject_code, creator_id) VALUES (?, ?, ?, ?, ?, ?, ?)"
    database.query(sqlInsert, [note_id, note_name, file_path, tags, course_code, subject_code, creator_id], (err, result) => {
        if (err) {
            res.send({err: err}) //this will be returned when duplicate entry in database, among with other errrs.
        } else {
            console.log(result.insertId);
            res.send({message: "Insert ID:  " + result.insertId}) //sent to client
        }
    })
});



function splitTags(tags) {
    // Split the input string into separate words by spaces or commas
    const tagArray = tags.split(/[ ,]+/);
    return tagArray;
  }

  app.post("/api/getNote", (req, res) => {
    const tags = req.body.tags;
    const subject_code = req.body.subject_code;
    const course_code = req.body.course_code;
  
    let query = "SELECT * FROM notes";
    const whereConditions = [];
  
    if (tags.length > 0) {
        const tagArray = splitTags(tags);
        whereConditions.push(tagArray.map(tag => "tags LIKE '%" + tag + "%'").join(" OR "));
      }
  
    if (course_code) {
      whereConditions.push("course_code = '" + course_code + "'");
    }
  
    if (subject_code) {
      whereConditions.push("subject_code = '" + subject_code + "'");
    }
  
    if (whereConditions.length > 0) {
      query += " WHERE " + whereConditions.join(" AND ");
    }
  
    database.query(query, (err, result) => {
      if (err) {
        res.send({err: err});
      } else if (result.length > 0) {
        const resultsArray = result.map(r => ({
          id: r.id,
          file_path: r.file_path,
          tags: r.tags,
          course_code: r.course_code,
          subject_code: r.subject_code,
          created_at: r.created_at
        }));
        res.send(resultsArray);
      } else {
        res.send("No matching notes found.");
      }
    });
  });


app.delete("/api/upload/delete", (req, res) => {
    console.log("file was deleted");
    return res.status(200).json({ result: true, msg: 'file was deleted'});
});


app.use('/notes', express.static('notes'))
app.listen(3001, () => {
    console.log("running on port 3001");
})