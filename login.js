const mysql = require('mysql');
const express = require("express");
const bodyParser = require("body-parser");
const encoder=bodyParser.urlencoded();
const json = require('json');

const app = express();

app.use(bodyParser.json());

const connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "password",
    database : "nodejs",
    multipleStatements : true
});

//database connection
connection.connect(function(err){
    if(err)
    {
        console.log("connection to database is failed"+JSON.stringify(err,undefined,2));
    }
    else
    {
        console.log("connection to database is success ");
    }
});


app.get("/signin",function(req,res){
    res.sendFile(__dirname + "/index.html");

})

 app.post("/signin",encoder,function(req,res){
    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;
    var phoneno = req.body.phoneno;
    var dob = req.body.dob;


    connection.query("select * from loginuser where email = ? and password = ? and name = ? and phoneno = ? and dob = ? ",[email,password,name,phoneno,dob],function(err,results,fields){
        if (!err) {
            res.redirect("/welcome");
        } 
        else {
            res.redirect("/");
        }
        res.end();
    })
})

//when login is success
app.get("/welcome",function(req,res){
    res.sendFile(__dirname + "/welcome.html");
});

//--------------------

app.get("/database",function(req,res){
    connection.query("SELECT * FROM loginuser",function(err,rows,fields){
        if(!err)        
        res.send(rows);      
        else
        console.log(err);        
    })   
});

app.post("/database",function(req,res){
    let e = req.body;
    var sql = "SET @userid = ?; SET @email = ? ; SET @password = ? ; \
    SET @name = ?;SET @phoneno = ?;SET @dob = ?  CALL update(@userid,@email,@password,@name,@phoneno,@dob);";
    connection.query(sql,[e.userid,e.email,e.password,e.name,e.phoneno,e.dob],function(err,rows,fields){
        if(!err)
        rows.forEach(element => {
            if(element.constructor == Array)
            res.send('Inserted new userid'+element[0].userid);            
        });
        else
        console.log(err);
    })
});

app.put("/database",function(req,res){
    let e = req.body;
    var sql = "SET @userid = ?; SET @email = ? ; SET @password = ? ; \
    SET @name = ?;SET @phoneno = ?;SET @dob = ?  CALL update(@userid,@email,@password,@name,@phoneno,@dob);";
    connection.query(sql,[e.userid,e.email,e.password,e.name,e.phoneno,e.dob],function(err,rows,fields){
        if(!err)
        res.send("Updated successfully");
        else
        console.log(err);
    })
})

app.listen(3000);
