const express = require('express');
const app = express();
const mysql = require ('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

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

/*app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', `*`) ;
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Auth-Token');
    res.header('Access-Control-Allow-Methods', '*');
    next();
});*/

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));


//sign up 
app.post("/api/signUp", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const userType = req.body.userType;

    const sqlInsert = "INSERT INTO UserInfo (Email, UserPassword, UserType) VALUES (?,?,?)"
    database.query(sqlInsert, [email, password, userType], (err, result) => {
        if (err) {
            res.send({err: err}) //this will be returned when duplicate entry in database, among with other errrs.
        } else {
            console.log(result);
            res.send({message: "User " + email + "added successfully"}) //sent to client
        }
    })
});

//login
app.post("/api/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const sqlInsert = "SELECT * FROM UserInfo WHERE Email = ? AND UserPassword = ?"
    database.query(sqlInsert, [email, password], (err, result) => {
        if (err){
            res.send({err: err})
        }
        else if (result.length > 0){
            res.send(result);
        } else{
            res.send({message: "User not found. Please ensure correct information is entered."})
        }
        
    })    
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

// this is just a temporary backend simulating the file upload
app.post("/api/upload", (req, res) => {
    setTimeout(() => {
        console.log('file has been uploaded');
        return res.status(200).json({ result: true, msg: 'file has been uploaded'});
    }, 3000);
});

app.delete("/api/upload", (req, res) => {
    console.log("file was deleted");
    return res.status(200).json({ result: true, msg: 'file was deleted'});
});

app.listen(3001, () => {
    console.log("running on port 3001");
})