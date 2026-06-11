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

db.connect()









app.listen(port,() => {
  console.log(`listening at ${port}`);
})