import pg from "pg";
import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express()
const port = 3000

const db = new pg.Client({
    user : "postgres",
    host : "localhost",
    database : "to-do",
    password  : "varma0408",
    port : 5432
})
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
// const __dirname = dirname(fileURLToPath(import.meta.url))
app.set("views engine","ejs")
db.connect()

app.get("/",(req,res)=>[
  res.render("index.ejs")
])

app.post("/add-task",(req,res)=>{

  db.query("insert into tasks (title,description,deadline,priority) values($1,$2,$3,$4)",[req.body.title,req.body.description,req.body.deadline,req.body.priority])
  console.log(req.body);
  res.redirect("/")
})




app.listen(port,() => {
  console.log(`listening at ${port}`);
})