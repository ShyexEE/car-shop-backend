import express from "express";
import bodyParser from "body-parser";
import porsche from "./porsche.js"
import cors from "cors"
import pg from "pg";
import bcrypt from "bcrypt"
import session from "express-session"
import passport from "passport"
import env from "dotenv"

const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10;
env.config();

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });
db.connect();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized: true,
}))
app.use(passport.initialize());
app.use(passport.session());



app.get("/model/:id", async (req, res) => {
    console.log("This is the params : "+ req.params.id)
    console.log("this is the length: ", porsche.taycan.models.length)
     if(req.params.id === "taycan"){
     res.send(model(porsche.taycan))
      }
    if(req.params.id === "cross-turismo"){
        res.send(model(porsche.crossturismo))
        }
    if(req.params.id === "sport-turismo"){
        res.send(model(porsche.sportturismo))
        }
    if(req.params.id === "cayman"){
        res.send(model(porsche.cayman))
            }
    if(req.params.id ==="cayman-gt4-rs"){
        res.send(model(porsche.caymangt4rs))
    }
    if(req.params.id ==="718-spyder-rs"){
        res.send(model(porsche.spyderRS))
    }
    if(req.params.id ==="911-carrera"){
        res.send(model(porsche.carrera))
    }
    if(req.params.id ==="911-turbo"){
        res.send(model(porsche.turbo))
    }
    if(req.params.id ==="911-turbo-s"){
        res.send(model(porsche.turboS))
    }
    if(req.params.id ==="911-dakar"){
        res.send(model(porsche.dakar))
    }
    if(req.params.id ==="911-gt3"){
        res.send(model(porsche.gt3))
    }
    if(req.params.id ==="911-gt3-rs"){
        res.send(model(porsche.gt3RS))
    }
    if(req.params.id ==="911-st"){
        res.send(model(porsche.ST))
    }
    if(req.params.id ==="911-targa"){
        res.send(model(porsche.targa))
    }
})

//add per ex:  porsche.taycan 
function model(porscheCar){
    return {
        image: porscheCar.image,
        title: porscheCar.title,
        price: porscheCar.price,
        acceleration:  porscheCar.acceleration,
        logo: porscheCar.logo,
        kw: porscheCar.kw,
        ps: porscheCar.ps,
        speed: porscheCar.speed,
        imageFront: porscheCar.imageFront,
        imageFirst: porscheCar.imageFirst,
        imageSecond: porscheCar.imageSecond,
        imageCard: porscheCar.imageCard,
        emissions: porscheCar.emissions,
        models:  porscheCar.models,
        links:porscheCar.links
    }
}

app.get("/details", async (req, res)=> {
     try{
      const result = await db.query("SELECT * FROM porscheusers WHERE id=$1",[currentId.id]);
      console.log("Database name is: ", result.rows[0].name)
      const details = JSON.parse(result.rows[0].details)
      console.log(details)
      res.send({
        name:result.rows[0].name,
        details: details
    })
     }catch(err){
        console.log(err)
     }
})


app.get("/custom", async (req, res) => {
    res.send(status)
})


app.post("/custom", async (req, res)=>{
  try{
    const result = await db.query("SELECT details FROM porscheusers WHERE id=$1",[currentId.id]);
    if(result.rows[0].details){  //if one object its already in the array push the new one in the array
      const details = req.body
      const dbArrayofObject =  JSON.parse(result.rows[0].details)      
      dbArrayofObject.push(details)
     const Json = JSON.stringify(dbArrayofObject)
      await db.query("UPDATE porscheusers SET details=$1 WHERE id=$2",[Json, currentId.id]); 
    }
    else{         //push the first  array of Json
    const details = req.body
    let arrayy=[]
    arrayy.push(details)
    const JsonDetails = JSON.stringify(arrayy)
    await db.query("UPDATE porscheusers SET details=$1 WHERE id=$2",[JsonDetails, currentId.id]); 
    }
    }catch(err){
      console.log(err)
    }
});


app.get("/signup", async (req, res)=>{
    res.send(accountExists)
})
var accountExists = {status: false}

app.post("/signup", async (req, res)=>{
    const body = req.body
    if(body.mName.length===0){var fullName = body.fName+" "+ body.lName}
    else{var fullName =  body.fName+" "+body.mName+" "+ body.lName}
    const email = body.email
    const password = body.password1  

    try{
     const result  = await db.query("SELECT * FROM porscheusers WHERE email = $1",[email])
     if(result.rows.length>0){
         console.log("User already exists")
         accountExists.status=true
     }else{
        //hashing Password
        bcrypt.hash(password, saltRounds, async (err, hash)=>{
        if (err){
            console.log("Error Hashing password:", err)
        }else{   
                console.log("Hashed Password:", hash);
                await db.query("INSERT INTO porscheusers (email, password, name) VALUES ($1, $2, $3)",
                [email, hash, fullName]);   
            }
        });
        console.log("Succesfully signed up")
        }
     }  catch(err){
        console.log(err)
    }
});

app.post("/signout", async (req, res)=>{
    status.status=false
})

app.get("/isLoggedIn", async (req, res)=>{
    res.send(status)
})


app.get("/login-password", async function(req, res){
    res.send(status)
})

var status = {status: false}
var currentId = {id:""}



app.post("/login-password", async function(req, res){
   const email = req.body.email
   const loginPassword = req.body.password 
   console.log(email, loginPassword)
   try{
    const result = await db.query("SELECT * FROM porscheusers WHERE email=$1",[
        email
    ]);
    
    console.log("This is Login resukt",result.rows[0].email)
     if(result.rows.length > 0){
      const user = result.rows[0];
        var storedHashedPassword = user.password;
     bcrypt.compare(loginPassword, storedHashedPassword, (err, result)=>{
        if (err){
            console.log("Error comparing passwords", err)
        }else{
            if(result){
                console.log("Logged in Succesfully")
                status.status=true
                currentId.id = user.id
                console.log("This is the current id: ", currentId)
            }else{
               console.log("Incorrect Password")
          }
        }
      });
   }else{
    console.log("User not found")
    }
   }catch(err){
    console.log(err)
  }
})


//res.json({"users": ["Taycan its the best"]})
app.listen(port, () => {
    console.log("Server is running on port "+ port);
})





