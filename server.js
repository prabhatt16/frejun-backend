const express = require("express");
const bodyParser = require('body-parser');
const port = process.env.port || 8080
const cors = require("cors");
const mysql = require('mysql');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createPool({
    connectionLimit: 10,
    host: 'sql9.freesqldatabase.com',
    user: 'sql9620070',
    password: '76hCI2wUxd',
    database: 'sql9620070'
  });


app.post("/adduser", function (req, res) {
    const body = req.body;
    console.log(body);
    const sql_insert = `INSERT INTO Users (name, age, mobile, country) VALUES ("${body.name}","${body.age}","${body.mobile}","${body.country}");`;
    db.query(sql_insert, err => {
        if (err) {
            return res.status(400).send('No able to create the user!'); 
        }else{
            res.status(200).send('User added successfully!');
        }
    });
});


app.get("/delete/:id", function (req, res) {
    const id = req.params.id;
    const sql_insert = `DELETE FROM Users WHERE id = ?;`;
    db.query(sql_insert, [id], (err) => {
        if (err) {
            return res.status(400).send({}); 
        }
        else {
            return res.status(200).send('User deleted successfully!');
        }
    });
});


app.get("/user/:id", function (req, res) {
    const id = req.params.id;
    const sql = "SELECT * FROM Users WHERE id = ?";
    db.query(sql, [id], (err, row) => {
        if (err) {
            return res.status(400).send({}); 
        }
        else {
            return res.status(200).send({...row});
        }
    });
});

app.post("/edituser/:id", bodyParser.json(), function (req, res) {
    const id = req.params.id;
    const body = req.body;
    const sql = "SELECT * FROM Users WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
        
            return res.status(500).send({ error: err.message }); 
        } else {
            const sql = "UPDATE Users SET name = ?, age = ?, mobile = ?, country = ? WHERE (id = ?)";
            db.query(sql, [body.name,body.age,body.mobile, body.country, id], err => {
                if (err) {
                    return res.status(400).send({ error: err.message }); 
                }else{
                    return res.status(200).send("successfully updated!");
                }
            });
        }
    });
});

app.get("/users", function (req, res) {
    const sql = "SELECT * FROM Users ORDER BY id"
    db.query(sql, [], (err, result) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        res.status(200).json({
            message: 'success',
            data: result
        });
    });
});

app.listen(port, function () {
    console.log("server running on 8080");
}); 