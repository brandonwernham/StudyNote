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

    database.query("SELECT * FROM note_tags", (err, result) => {
        if (err){
            res.send({err: err})
        }

    })    
    
   //res.send({message: "the server is sending this message."})
})


//file uploading
const upload = multer({dest: "notes/"});

// This is just a temporary way of uploading notes, I will have to figure out
// creating unique ids and such for each note uploaded
// For now, what it does is takes the formData as is, and inserts the first note uploaded
app.post("/api/upload", upload.single("note"), (req, res) => {
    const file_path = req.file.path;
    const note_name = req.body.note_name;
    const creator_id = req.body.creator_id;
    const tags = req.body.tags;
    var noteID = null;
    var tagID = null;

    

    
    const sqlInsert = "INSERT INTO notes (note_name, file_path, creator_id) VALUES (?, ?, ?)" //note ID is created inside the database and auto incremented - in thise case its the "insertId"
    database.query(sqlInsert, [note_name, file_path, creator_id], (err, result) => {
        if (err) {
            res.send({err: err}) //this will be returned when duplicate entry in database, among with other errrs.
        } else {
            console.log(result.insertId);
            res.send({message: "Insert ID:  " + result.insertId}) //sent to client
            noteID = result.insertId;
        }
    })




    //tags
    var tagsArr = tags.split(",")
    for (var tag of tagsArr){
        tag = tag.trim();

        const sqlTagsQuery = "SELECT * FROM tags WHERE tag_name = ?"
        database.query(sqlTagsQuery, [tag], (err, result) => {
        if (err) {
            res.send({err: err}) 
        } else {
            if (result.length == 0){
                database.query("INSERT INTO tags (tag_name) VALUES (?)", [tag], (err, result) =>{
                    if (err) {
                        res.send({err: err})
                    }
                    tagID = result.insertId;
                })
                
            }
            else{
                tagID = result[0].tag_id;
            }
        }
        })
        console.log(noteID)

        const sqlTagsInsert = "INSERT INTO note_tags (tag_id, note_id) VALUES (?, ?)";
        database.query(sqlTagsInsert, [tagID, noteID], (err, result) => {
        if (err) {
            res.send({err: err})
        } else {

        }
        })
    }
    




    


});

// z test work (HASNT BEEN TESTED)
app.post("/api/getCertainNote", (req, res) => {
    function splitTags(tags) {
        // Split the input string into separate words by spaces or commas
        const tagArray = tags.split(/[ ,]+/);
        return tagArray;
    }

    // Split the given tags
    const tags = splitTags(req.body.tags);

    // Search in file_path from notes where
    // The split tags exist somewhere in the keyword saved for the notes (if the note was saved with "PHYSICS AND ASTRONOMY", a search query of "SPACE AND ASTRONOMY" would be returned)
    // Where the note_id exists somewhere in the database (SE4450 or 4450 returns 4450)
    const searchQuery = "SELECT file_path FROM notes WHERE " + tags.map(tag => "file_path LIKE '%" + tag + "%' OR note_id LIKE '%" + tag + "%'").join(" OR ");

    database.query(sqlInsert, searchQuery, (err, result) => {
        if (err){
            res.send({err: err})
        }
        else{
            console.log(result[0].FilePath);
            res.send(result[0].FilePath);
        }
    })
})

app.post("/api/getNote", (req, res) => {
    const tags = req.body.tags;

    const sqlInsert = "SELECT file_path FROM notes WHERE note_id = ?"
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