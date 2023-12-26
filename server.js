const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json()); // Parse JSON request bodies


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'database'
});

connection.connect((err)=>{
    if(err) throw new Error(err);
    console.log("Connected")
    connection.query('CREATE DATABASE IF NOT EXISTS mydb', (err) => {
        if(err) throw new Error(err);
        console.log("Database created");
        connection.changeUser({database : 'mydb'},(err)=>{
            if(err) throw new Error(err);
            createTable();
        })
    })
})

function createTable(){
    connection.query(`
    CREATE TABLE IF NOT EXISTS EconomicData (
        RegionalMember VARCHAR(255),
        Year INT,
        GDP_growth DECIMAL(5, 2),
        Unit_of_Measurement VARCHAR(50),
        Subregion VARCHAR(255),
        Country_Code VARCHAR(3)
    )`,(err)=>{
        if(err) throw new Error(err);
        console.log("Table created/ exists");
    })
}


app.get("/gdp",(req, res) => {
    connection.query('SELECT * FROM economicdata',(err,rows)=>{
        if(err) throw new Error(err);
        res.send(rows);
    })
})

app.get("/search",(req, res) => {
    const countryselected = req.query.country;
    connection.query('SELECT * FROM economicdata WHERE RegionalMember=?',[countryselected],(err,rows)=>{
        if(err) throw new Error(err);
        res.send(rows);
    })
})

app.get("/gdpyear",(req, res) => {
    const yearselected = req.query.year;
    connection.query('SELECT * FROM economicdata WHERE Year=?',[yearselected],(err,rows)=>{
        if(err) throw new Error(err);
        res.send(rows);
    })
})

app.post("/update",(req, res) => {
    const regionalselected = req.body.regional;
    const yearselected = req.body.year;
    const growthselected = req.body.growth;
    const subregionselected = req.body.subregion;
    const countryselected = req.body.countrycode;
    const unitselected = "%"
    connection.query('INSERT INTO economicdata (RegionalMember,Year,GDP_growth,Unit_of_Measurement,Subregion,Country_Code) VALUES (?,?,?,?,?,?)',[regionalselected,yearselected,growthselected, unitselected, subregionselected, countryselected],(err,rows)=>{
        if(err) throw new Error(err);
        res.send(rows);
    })
})

app.delete("/delete",(req, res) => {
    const yearselected = req.query.year;
    const countryselected = req.query.country;
    connection.query('DELETE FROM economicdata WHERE Year=? AND RegionalMember=?',[yearselected,countryselected],(err,rows)=>{
        if(err) throw new Error(err);
        res.send(rows);
    })
})

app.listen(8000,()=>{
    console.log("Connected to Backend!")
})