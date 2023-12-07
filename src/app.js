import 'dotenv/config';
import express from "express";
import hbs from "hbs";
import Register from "./models/registers.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";


//path module
import path from 'path';
import {fileURLToPath} from 'url';

//custom file
import './db/conn.js';

const app = express();
const port = process.env.PORT || 3000;

// use path module in ES6 in node && express
const __filename = fileURLToPath(import.meta.url);
console.log('__filename: ', __filename);
const __dirname = path.dirname(__filename);
console.log('__dirname: ', __dirname);

// use path module
const static_path = path.join(__dirname, '../public');
const templates_path = path.join(__dirname, '../templates/views');

//using partials path
const partials_path = path.join(__dirname, '../templates/partials');
console.log(static_path);

//use html form data by using urlencoded
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// use public static page
app.use(express.static(static_path));

//use hbs
app.set("view engine", "hbs");
app.set("views", templates_path);

//use hbs file in express
hbs.registerPartials(partials_path);

// console.log(process.env.SECRET_KEY);

//hasing password 
const securePassword = async (password) => {
    const passwordHash = await bycrypt.hash(password , 10);
    console.log(passwordHash);


    const passwordMatch = await bycrypt.compare("manish@123", passwordHash);
    console.log(passwordMatch);
};

securePassword("manish@123");

// use root folder
app.get('/', (req, res) => {
    // res.send("<h1>Hello manish</h2>")
    //for the use for webpage use render method insted of send
    res.render("index");
});

app.get('/register', (req, res) => {
    res.render("register");
});

//create a new user in a database 
app.post("/register",  async (req, res) => {
    try {
        // console.log(req.body.name);
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;
        if(password === confirmpassword) {
            const registerEmployee = new Register({
                name : req.body.name,
                email : req.body.email,
                phone : req.body.mobile_no,
                password : password,
                confirmpassword : confirmpassword,
            });

            console.log("the success part " + registerEmployee);

            // call the function
            const token = await registerEmployee.generateAuthToken();
            console.log("the token part " + token);


            // some error occures

            //The res.cookie() function is used to set the cookies name to value
            // The value parameter may be a string or object converted to JSON.
            res.cookie("jwt", token).send("jwt token");
            // console.log("cookies store " + cookie);

            //create a collection
            const registered = await registerEmployee.save();
            console.log("the page part" + registered);
            res.status(201).render("index");
        }else{
            res.send("password are not matching!")
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/login', (req, res) => {
    res.render("login");
});

//login by email and password
app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userEmail = await Register.findOne({email:email});
        const passwordMatch = await bycrypt.compare(password, userEmail.password);

        // call the function
        const token = await userEmail.generateAuthToken();
        console.log("the token part " + token);

        //generate cookies after this
        // res.cookie("jwt", )

        if(passwordMatch) {
            res.render("index");
        }else{
            res.send("Invalid login details!..");
        }
    } catch (error) {
        res.status(400).send("Invalid EMail");
    }
});

//listen server 
app.listen(port, ()=> {
    console.log(`server is runnning on the port no ${port}`)
});