const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
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
    const class_name = req.body.subject_code + req.body.course_code;
    const tagsArr = tags.split(",");
    var errMessage = "Errors: ";
    var okMessage = "Tags: ";
    var isError = false;

    //search to see if class exists in the database
    database.getConnection().then(conn => {
        const result = conn.query("SELECT * FROM classes WHERE class_name = ?", [class_name]);
        conn.release();
        return result;
    }).then(result => {
        if(result[0].length == 0) {
            //something here about the class not existing, adding a note requires an actual class to exist of course
        } else {
            //insert note into the database
            database.getConnection().then(conn => {
                const result = conn.query("INSERT INTO notes (note_name, file_path, creator_id, class_name) VALUES (?, ?, ?, ?)", [note_name, file_path, creator_id, class_name]);
                conn.release();
                return result;
            }).then(result => {
                const noteID = result[0].insertID;

                //loops through every tag recieved from client
                tagsArr.forEach(tag => {
                    tag = tag.trim();

                    //search to see if tag exists in the database
                    database.getConnection().then(conn => {
                        const result = conn.query("SELECT * FROM tags WHERE tag_name = ?", [tag]);
                        conn.release();
                        return result;
                    }).then(result => {
                        if(result[0].length == 0) {
                            //adds tag if it doesn't exist
                            database.getConnection().then(conn => {
                                const result = conn.query("INSERT INTO tags (tag_name) VALUES (?)", [tag]);
                                conn.release();
                                return result;
                            }).then(result => {
                                const tagID = result[0].insertID;
                                insertTagNote(tagID, noteID);
                            }).catch(err => {
                                errMessage = errMessage + " || insertTag error: " + err;
                                isError = true;
                            })
                        } else {
                            //get tagID if it exists
                            const tagID = result[0];
                            insertTagNote(tagID, noteID);
                        }
                    }).catch(err => {
                        errMessage = errMessage + " || selectTags error: " + err;
                        isError = true;
                    })
                })
            }).catch(err => {
                errMessage = errMessage + " || insertNote error: " + err;
                isError = true;
            })
        }
    }).catch(err => {
        errMessage = errMessage + " || classCheck error: " + err;
        isError = true;
    })

    function insertTagNote(tagID, noteID) {
        console.log("inserttagnote: " + tagID);

        //inserts into the note_tag table
        database.getConnection().then(conn => {
            const result = conn.query("INSERT INTO note_tags (tag id, note_id) VALUES (?, ?)", [tagID, noteID]);
            conn.release();
            return result;
        }).then(result => {
            //temp console test below?
            //console.log(tag + "added successfully");
        }).catch(err => {
            errMessage = errMessage + " || insertNoteTag error: " + err;
            isError = true;
        })
    }
});

//keeping as zuhayr's work until I (Rohan) end up
//merging the search to work with tags as db table
//keep in mind this shouldn't work at the moment
//as its built around tags as an array and old sql version
app.post("api/getNote", (req, res) => {
    const tags = req.body.tags;
    const subject_code = req.body.subject_code;
    const course_code = req.body.course_code;

    let query = "SELECT * FROM notes";
    const whereConditions = [];

    if(tags.length > 0) {
        //const tagArray = splitTags(tags);
        const tagArray = [];
        whereConditions.push(tagArray.map(tag => "tags LIKE '%" + tag + "%'").join(" OR "));
    }

    if(course_code) {
        whereConditions.push("course_code = '" + course_code + "'");
    }

    if(subject_code) {
        whereConditions.push("subject code = '" + subject_code + "'");
    }

    if(whereConditions.length > 0) {
        query += " WHERE " + whereConditions.join(" AND ");
    }

    database.query(query, (err, result) => {
        if(err) {
            res.send({err: err});
        } else if(result.length > 0) {
            const resultsArray = result.map(r => ({
                id: r.id,
                note_name: r.note_name,
                file_path: r.file_path,
                tags: r.tags,
                subject_code: r.subject_code,
                course_code: r.course_code,
                created_at: r.created_at
            }));
            res.send(resultsArray);
        }
    })
});

//ethan's old getNote that will be merged to work 
//with above when using tags as db table
/*app.post("/api/getNote", (req, res) => {
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
});*/

app.delete("/api/upload/delete", (req, res) => {
    console.log("file was deleted");
    return res.status(200).json({ result: true, msg: 'file was deleted'});
});


app.use('/notes', express.static('notes'))
app.listen(3001, () => {
    console.log("running on port 3001");
})