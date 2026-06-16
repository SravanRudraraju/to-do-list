import dotenv from "dotenv";
dotenv.config();
import pg from "pg";
import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import session from "express-session";

const app = express()
const port = process.env.PORT || 3000;

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
// const __dirname = dirname(fileURLToPath(import.meta.url))
app.use(express.json());
app.set("view engine", "ejs")
db.connect()
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);


app.get("/", async (req, res) => {
  // console.log(req.query.sort);
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  let result;
  if (req.query.sort === "deadline") {
    result = await db.query("select * from tasks where completed = false and user_id = $1 order by deadline asc",[req.session.userId])
  } else if (req.query.sort === "priority") {
    // console.log("priority sorting");
    result = await db.query(`select * from tasks where completed = false and user_id = $1 order by case  when priority ='high' then 1 when priority = 'medium' then 2 when priority= 'low' then 3 else 4 end`,[req.session.userId])
  }
  else{
    result = await db.query("SELECT * FROM tasks WHERE completed = false AND user_id = $1",[req.session.userId])
  }
  res.render("index.ejs",{tasks:result.rows});
})


app.get("/completed", async (req, res) => {
  if(!req.session.userId){
    return res.redirect("/login");
}
  const result = await db.query("select * from tasks where completed = true and user_id = $1",[req.session.userId])
  res.render("completed.ejs", { tasks: result.rows })
})

app.get("/signup", (req, res) => {
  res.render("signup.ejs")
})
app.get("/login", (req, res) => {
  res.render("login.ejs")
})
app.get("/logout",(req,res)=>{

    req.session.destroy(()=>{
        res.redirect("/login");
    });

});

app.post("/add-task", async (req, res) => {
  await db.query("insert into tasks (title,description,deadline,priority,user_id) values($1,$2,$3,$4,$5)", [req.body.title, req.body.description, req.body.deadline, req.body.priority, req.session.userId])
  // console.log(req.body);
  res.redirect("/")
})

app.post("/complete/:id", async (req, res) => {
  // console.log(req.params.id);
  await db.query("update tasks set completed = true where id = $1 and user_id = $2", [req.params.id,req.session.userId])
  res.send("ok")
})
app.post("/undo/:id", async (req, res) => {
  // console.log(req.params.id);
  await db.query("update tasks set completed = false where id = $1 and user_id = $2", [req.params.id,req.session.userId])
  res.send("ok")
})

app.post("/delete/:id", async (req, res) => {
  await db.query("delete from tasks where id = $1 and user_id = $2", [req.params.id,req.session.userId])
  res.redirect("/completed")
})

app.post("/edit/:id", async (req, res) => {
  await db.query("update tasks set title = $1 , description = $2 , deadline = $3 , priority = $4  where id = $5 and user_id = $6", [req.body.title, req.body.description, req.body.deadline, req.body.priority, req.params.id,req.session.userId])
  res.redirect("/")
})

app.post("/signup", async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.send("password does not match")
  }
  const existingUser = await db.query("SELECT * FROM users WHERE username = $1", [username]);
  if (existingUser.rows.length > 0) {
    return res.send("Username already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.query("insert into users(username,password) values($1,$2)", [username, hashedPassword])

  res.redirect("/login");
})

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await db.query("select * from users where username = $1", [username])
  if (user.rows.length === 0) {
    return res.send("user does not exist")
  }
  const match = await bcrypt.compare(password, user.rows[0].password)
  if (!match) {
    return res.send("password does not match")
  }
  req.session.userId = user.rows[0].id
  res.redirect("/")
})

app.listen(port, () => {
  console.log(`listening at ${port}`);
})