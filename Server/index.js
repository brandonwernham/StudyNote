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

app.post("/api/insert", (req, res) => {
    const Email = req.body.Email;
    const UserPassword = req.body.UserPassword;

    const sqlInsert = "INSERT INTO UserInfo (Email, UserPassword) VALUES (?,?)"
    database.query(sqlInsert, [Email, UserPassword], (err, result) => {
        console.log(err);
    })    
});

app.listen(3001, () => {
    console.log("running on port 3001");
})