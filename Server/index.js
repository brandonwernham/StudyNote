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

// This is just a temporary way of uploading notes, I will have to figure out
// creating unique ids and such for each note uploaded
// For now, what it does is takes the formData as is, and inserts the first note uploaded

app.post("/api/upload", upload.single("note"), (req, res) => {
    const file_path = req.file.path;
    const note_name = req.body.note_name;
    const creator_id = req.body.creator_id;
    const tags = req.body.tags;
    const class_code = req.body.subject_code + req.body.course_code;
    const tagsArr = tags.split(",");
    var errMessage = "Errors: ";
    var okMessage = "Tags: ";
    var isError = false;

    //search to see if class exists in the database
    database.getConnection().then(conn => {
        const result = conn.query("SELECT * FROM classes WHERE class_name = ?", [class_code]);
        conn.release();
        return result;
    }).then(result => {
        if(result[0].length == 0) {
            //something here about the class not existing, adding a note requires an actual class to exist of course
        } else {
            //insert note into the database
            database.getConnection().then(conn => {
                const result = conn.query("INSERT INTO notes (note_name, file_path, creator_id, class_code) VALUES (?, ?, ?, ?)", [note_name, file_path, creator_id, class_code]);
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
            const result = conn.query("INSERT INTO note_tags (tag_id, note_id) VALUES (?, ?)", [tagID, noteID]);
            conn.release();
            return result;
        }).then(result => {
            //success message to frontened
        }).catch(err => {
            errMessage = errMessage + " || insertNoteTag error: " + err;
            isError = true;
        })
    }
});

app.post("/api/createClass", async (req, res) => {

    const class_id = req.body.class_id;
    const user_id = req.body.user_id;
    const class_name = req.body.class_name;
    const subject_code = req.body.subject_code;
    const course_code = req.body.course_code;

    const class_code = subject_code + " " + course_code;

    if (!class_id || isNaN(class_id)) {
        res.status(400).json({ message: 'Invalid class ID.' });
        return;
    }
    
    try {
        const query = 'SELECT * FROM classes WHERE class_code = ?';
        const [rows] = await database.query(query, [class_code]);
    
        const searchClasses = [];
        if (rows.length > 0) {
          rows.forEach((row) => {
            searchClasses.push({
              class_id: row.class_id,
              user_id: row.user_id,
              class_name: row.class_name,
              subject_code: row.subject_code,
              course_code: row.course_code,
              class_code: row.class_code
            });
          });
          res.status(200).json({ classes: searchClasses });
        } else
          res.status(404).json({ message: 'User not found' });
      } catch (error) {
        res.status(500).json({ message: 'Error occurred', error: error.message });
      }

});

app.post('api/searchClass', async (req, res) => {
    const subject_code = req.body.subject_code;
    const course_code = req.body.course_code;

    const class_code = subject_code + course_code;

    

    try {
        // Now it will see if the class exists and such
        const exists = await classCodeExists(class_id);
    if (exists) {
        let query = "SELECT * FROM classes WHERE class_code = '" + class_code + "'";
        const result = await database.query(query, [class_id, user_id, class_name, class_code]);
        res.status(201).json({ message: 'Pulling classes', data: result });
        
    } else {
        res.status(200).json({ message: 'Not found.' });
        
    }} catch (error) {
        res.status(500).json({ message: 'Error occurred.', error: error.message, data: class_id  });
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