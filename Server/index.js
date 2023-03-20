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



const userExists = async (userId) => {
    const query = 'SELECT COUNT(*) as count FROM users WHERE user_id = ?';
    const [rows] = await database.query(query, [userId]);
    return rows[0].count > 0;
};

const classExists = async (classId) => {
    const query = 'SELECT COUNT(*) as count FROM classes WHERE class_id = ?';
    const [rows] = await database.query(query, [classId]);
    return rows[0].count > 0;
};

const classCodeExists = async (classCode) => {
    const query = 'SELECT COUNT(*) as count FROM classes WHERE class_code = ?';
    const [rows] = await database.query(query, [classCode]);
    return rows[0].count > 0;
}

//sign up 
  
app.post('/api/signUp', async (req, res) => {
    const { user_id, email, password, user_type } = req.body;
    console.log(user_id)
    console.log(18446744000000000000)
    try {
      // Now it will see if the user exists and such
      const exists = await userExists(user_id);
      if (exists) {
        res.status(200).json({ message: 'User already exists' });
      } else {
        const query = 'INSERT INTO users (user_id, email, user_password, user_type) VALUES (?, ?, ?, ?)';
        const result = await database.query(query, [user_id, email, password, user_type]);
        res.status(201).json({ message: 'User created', data: result });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error occurred', error: error.message });
    }
});

app.get('/api/getUserType/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const query = 'SELECT user_type FROM users WHERE user_id = ?';
      const [rows] = await database.query(query, [userId]);
  
      if (rows.length > 0) {
        res.status(200).json({ user_type: rows[0].user_type });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error occurred', error: error.message });
    }
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

app.post("/api/upload", upload.single("note"), (req, res) => {
    const file_path = req.file.path;
    const note_name = req.body.note_name;
    const creator_id = req.body.creator_id;
    const tags = req.body.tags;
    const class_name = req.body.subject_code + req.body.course_code;
    const tagsArr = tags.split(",");


    //search to see if class exists in the database
    database.getConnection().then(conn => {
        const result = conn.query("SELECT * FROM classes WHERE class_name = ?", [class_name]);
        conn.release();
        return result;
    }).then(result => {
        if(result[0].length == 0) {
            //adds class to database if it doesnt exist
            database.getConnection().then(conn => {
                const result = conn.query("INSERT INTO classes (class_name, subject_code, course_code, user_id) VALUES (?, ?, ?, ?)", [class_name, req.body.subject_code, req.body.course_code, creator_id]);
                conn.release();
                return result;
            }).then(result => {
                //do something
            }).catch(err => {
                res.send(err)
            })
        } else {
            //do something
        }
        return
    }).then(()=> {
        //insert note into the database
        database.getConnection().then(conn => {
            const result = conn.query("INSERT INTO notes (note_name, file_path, creator_id, class_name) VALUES (?, ?, ?, ?)", [note_name, file_path, creator_id, class_name]);
            conn.release();
            return result;
        }).then(result => {
            const noteID = result[0].insertId;

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
                            const tagID = result[0].insertId;
                            insertTagNote(tagID, noteID);
                        }).catch(err => {
                            res.send(err)
                        })
                    } else {
                        //get tagID if it exists
                        const tagID = result[0];
                        insertTagNote(tagID, noteID);
                    }
                }).catch(err => {
                    res.send(err)
                })
            })
        }).catch(err => {
            res.send(err)
        })
    }).catch(err => {
        res.send(err)
    })

    function insertTagNote(tagID, noteID) {
        console.log("inserttagnote: " + tagID);

        //inserts into the note_tag table
        database.getConnection().then(conn => {
            const result = conn.query("INSERT INTO note_tags (tag_id, note_id) VALUES (?, ?)", [tagID, noteID]);
            conn.release();
            return result;
        }).then(result => {
            res.send(result)
        }).catch(err => {
            res.send(err)
        })
    }
});






// Adding, joining, and loading classes

app.post('/api/createClass', async (req, res) => {
    const { class_id, user_id, class_name } = req.body;
    const subject_code = req.body.subject_code;
    const course_code = req.body.course_code;

    const class_code = subject_code + " " + course_code;
  
    try {
      const exists = await classExists(class_id);
      if (exists) {
        res.status(200).json({ message: 'Class already exists' });
      } else {
        const query = 'INSERT INTO classes (class_id, user_id, class_name, class_code) VALUES (?, ?, ?, ?)';
        const result = await database.query(query, [class_id, user_id, class_name, class_code]);
        res.status(201).json({ message: 'Class created', data: result });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error occurred', error: error.message });
    }
});

app.post('/api/searchClass', async (req, res) => {
    const subject_code = req.body.subject_code;
    const course_code = req.body.course_code;

    const class_code = subject_code + " " + course_code;

    database.getConnection().then(conn => {
        const result = conn.query("SELECT * FROM classes WHERE class_code = ?", [class_code]);
        conn.release();
        return result;
    }).then(result => {
        if(result[0].length == 0) {
            //no notes with the selected classes
            returnNoClasses();
        } else {
            returnFoundClasses(result);
        }
    }).catch(err => {
        res.send(err)
    })

    //respond to frontend with note data
    function returnFoundClasses(result) {
        const classesFoundArray = result[0][0];
        res.send(classesFoundArray);
    }

    //if there is no matching notes to given request
    function returnNoClasses() { 
        res.send("No classes found.");
    }

})

app.get('/api/loadClass', async (req, res) => {

    const user_id = req.body.user_id;

    let query = ("SELECT * FROM classes WHERE user_id = ?", [class_code]);
    database.query(query, (err, result) => {
        if(err) {
            res.send({err: err});
        } else if(result.length > 0) {
            const searchClassArray = result.map(r => ({
                class_id: r.class_id,
                user_id: r.user_id,
                class_name: r.class_name,
                class_code: r.class_code,
            }));
            res.send(searchClassArray);
        }
    })

})

//note searching
app.post("/api/getNote", (req, res) => {
    const tags = req.body.tags;
    const class_code = req.body.subject_code + req.body.course_code;

    //if no tags were entered, return all notes from the class selected
    if(tags == "") {
        database.getConnection().then(conn => {
            const result = conn.query("SELECT * FROM notes WHERE class_name = ?", [class_code]);
            conn.release();
            return result;
        }).then(result => {
            if(result[0].length == 0) {
                //no notes with the selected classes
                returnNoNotes();
            } else {
                returnFoundNotes(result);
            }
        }).catch(err => {
            res.send(err)
        })
    //otherwise if tags were entered
    } else {
        database.getConnection().then(conn => {
            const result = conn.query("SELECT * FROM tags WHERE tag_name = ?", [tags]);
            conn.release();
            return result;
        }).then(result => {
            if(result[0].length == 0) {
                //tag(s) don't exist
                returnNoNotes();
            } else {
                const tagID = result[0][0].tag_id;
                database.getConnection().then(conn => {
                    const result = conn.query("SELECT * FROM note_tags WHERE tag_id = ?", [tagID]);
                    conn.release();
                    return result;
                }).then(result => {
                    if(result[0].length == 0) {
                        //no notes with selected tags
                        returnNoNotes();
                    } else {
                        const noteID = result[0][0].note_id;
                        database.getConnection().then(conn => {
                            const result = conn.query("SELECT * FROM notes WHERE note_id = ? AND class_name = ?", [noteID, class_code]);
                            conn.release();
                            return result;
                        }).then(result => {
                            if(result[0].length == 0) {
                                //no notes with the selected classes
                                returnNoNotes();
                            } else {
                                returnFoundNotes(result);
                            }
                        }).catch(err => {
                            res.send(err)
                        })
                    }
                }).catch(err => {
                    res.send(err)
                })
            }
        }).catch(err => {
            res.send(err)
        })
    }

    //respond to frontend with note data
    function returnFoundNotes(result) {
        const resultsArray = result[0][0];
        res.send(resultsArray);
    }
    
    //if there is no matching notes to given request
    function returnNoNotes() {
        res.send("No matching notes found.");
    }
});

app.delete("/api/upload/delete", (req, res) => {
    console.log("file was deleted");
    return res.status(200).json({ result: true, msg: 'file was deleted'});
});


app.use('/notes', express.static('notes'))
app.listen(3001, () => {
    console.log("running on port 3001");
})