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
app.set("view engine","ejs")
db.connect()


app.post("/add-task",(req,res)=>{

  db.query("insert into tasks (title,description,deadline,priority) values($1,$2,$3,$4)",[req.body.title,req.body.description,req.body.deadline,req.body.priority])
  console.log(req.body);
  res.redirect("/")
})

app.get("/",async (req,res)=>{
 const result = await db.query("select * from tasks where completed = false")
 res.render("index.ejs",{tasks:result.rows})
})
app.get("/completed",async (req,res)=>{
 const result = await db.query("select * from tasks where completed = true")
 res.render("completed.ejs",{tasks:result.rows})
})

app.post("/complete/:id", async (req,res)=>{
  // console.log(req.params.id);
  await db.query("update tasks set completed = true where id = $1",[req.params.id])
  res.send("ok") 
})
app.post("/undo/:id", async (req,res)=>{
  // console.log(req.params.id);
  await db.query("update tasks set completed = false where id = $1",[req.params.id])
  res.send("ok") 
})

app.post("/delete/:id",async (req,res)=>{
 await db.query("delete from tasks where id = $1",[req.params.id])
 res.redirect("/completed")
})
app.listen(port,() => {
  console.log(`listening at ${port}`);
})