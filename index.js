const mysql = require("mysql2");
const session = require('express-session');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const path=require("path");

app.set("view engine" , "ejs");
app.set("views",path.join(__dirname,"/views"));




const connection = mysql.createConnection(
    {
        host:"localhost",
        user:"root",
        database:"nodeexpresscrudsql",
        password:""
    }
);


app.get("/login",(req,res)=>{
    let message=req.query.message;
    res.render("login.ejs",{message});
});

app.post("/logined",(req,res)=>{
    let {email,password} = req.body;
    let q=`select * from registration where email=?`;
    connection.query(q,[email],(err,result)=>{
        if(err)
            res.send("Error in Email");
        console.log(email);
        if(result[0].email === email)
        {
        if(result[0].password === password)
        {
             res.redirect("/");
        }
        else{
             res.redirect("/login?message:Wrong Password");
        }
    }
    else{
        res.redirect("/login?message:Wrong Email");
    }

        
    })
});

app.post("/logout",(req,res)=>{
    let message=req.query.message;
    res.redirect("/login");
})

app.get("/",(req,res)=>{
    res.render("home.ejs");
})


app.get("/register",(req,res)=>{
    res.render("registration.ejs");
});


app.post("/registered",(req,res)=>{
    let {email,password,name,address,city,state,pincode} =req.body;
    let q=`insert into registration (email,password,name,address,city,state,pincode) value (?,?,?,?,?,?,?)`;
    try{
        connection.query(q,[email,password,name,address,city,state,pincode],(err,result)=>{
            if(err)
                res.send("error");
            res.redirect("/login?message:Registration successfully");
        });
    } 
    catch{
        res.send("error catch");
    }
});

app.get("/view", (req, res) => {
    let q = "SELECT * FROM user";
    let message = req.query.message;
    try{
    connection.query(q, (err, result) => {
        if (err) 
            return res.send("Connection Failed");
        res.render("show.ejs", { data: result, message: message });
    });
    }
    catch{
        res.send("Failed");
    }
});

app.get("/:id/edit",(req,res)=>{
        let {id}= req.params;
        const q= `select * from user where id=?`;
        try{
            connection.query(q,[id],(err,result)=>{
               if(err)
                res.send("Error ok");
            console.log(result);
               res.render("edit.ejs",{data: result[0]});
            });
        }
        catch{
            res.send("connection failed");
        }
});
 
app.post("/:id/update",(req,res)=>{
    let {productname,address,quantity,date} = req.body;
    let {id}=req.params;
    const q=`update user set productname=?,address=?,quantity=?,date=? where id =?`;
    try{
    connection.query(q,[productname,address,quantity,date,id],(err,result)=>{
    if(err)
        res.send("error");
    res.redirect(`/view?message=Data%20updated%20Successfully`);
    });
    }
    catch{
        res.send("error catch");
    }
});



app.post("/:id/delete",(req,res)=>{
    let {id}=req.params;
    const q=`Delete from user where id =?`;
    try{
    connection.query(q,[id],(err,result)=>{
    if(err)
        res.send("error");
    res.redirect(`/view?message=Data%20Deleted%20Successfully`);
    });
    }
    catch{
        res.send("error catch");
    }
});

app.get("/add",(err,res)=>{
res.render("add.ejs");
});

app.post("/addproduct",(req,res)=>{
    let {productname,address,quantity,date} =req.body;
    let q=`insert into user (productname,address,quantity,date) value (?,?,?,?)`;
    try{
        connection.query(q,[productname,address,quantity,date],(err,result)=>{
            if(err)
                res.send("error");
            console.log(result);
            res.redirect("/view?message:Ordered successfully");
        });
    } 
    catch{
        res.send("error catch")
    }
});






















app.listen("8080",()=>{
    console.log("server is listenting port 8080");
});


