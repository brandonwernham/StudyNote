const express = require('express');
const app = express();
const mysql = require ('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const database = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "bonyRoot",
    database: "StudyNoteDB",
});


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));


//sign up 
app.post("/api/signUp", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const userType = req.body.userType;

    const sqlInsert = "INSERT INTO UserInfo (Email, UserPassword, UserType) VALUES (?,?,?)"
    database.query(sqlInsert, [email, password, userType], (err, result) => {
        console.log(err);
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