const express = require("express")
const cors = require("cors")
const file = require("express-fileupload")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const mysql = require("mysql")
const bcrypt = require("bcrypt")
const xlsx = require("xlsx")
const fs = require("fs")

const saltRounds = 10

const app = express()
app.use(file())
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
  })
)
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const mydb = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "root",
  database: "financepeer_jsondata"
})

const maxAge = 24 * 60 * 60
const secret = "Alohomora grifin secret"

const creatToken = (id, email) => {
  return jwt.sign({ id, email }, secret, {
    expiresIn: maxAge
  })
}

app.get("/LoginStatus", async (req, res) => {
  const token = req.cookies.user

  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        console.log(err)
        res.send(err)
      } else {
        res.send(decodedToken)
      }
    })
  } else {
    console.log("no token")
    res.send({ message: "no token" })
  }
})

app.get("/jdatacount", (req, res) => {
  mydb.query("select Count(*) as count from jdata", (err, result) => {
    if (err) {
      console.log(err)
      res.send(err)
    } else {
      res.send(result)
    }
  })
})

app.get("/jdata", (req, res) => {
  mydb.query("SELECT * FROM jdata", (err, result) => {
    if (err) {
      console.log(err)
      res.send(err)
    } else {
      res.send(result)
    }
  })
})

app.get("/userEmails", (req, res) => {
  mydb.query("SELECT email FROM users", (err, result) => {
    if (err) {
      console.log(err)
      res.send(err)
    } else {
      res.send(result)
    }
  })
})

app.post("/upload", async (req, res) => {
  if (req.files === null) {
    res.status(400).send({ message: "No file uploaded" })
  }

  const infile = req.files.file
  const exe = req.body.exe
  const name = `data.${exe}`

  infile.mv(`${__dirname}/client/public/uploads/data.${exe}`, (err) => {
    if (err) {
      console.error(err)
      res.status(500).send(err)
    }
  })

  if (exe === "json") {
    try {
      const jres = fs.readFileSync(
        `${__dirname}/client/public/uploads/${name}`,
        "utf-8"
      )

      const data = JSON.parse(jres)
      var uidp = data.filter((item) => {
        return item["userId"]
      })
      var idp = data.filter((item) => {
        return item["id"]
      })

      if (uidp.length > 0 && idp.length > 0) {
        mydb.query(
          "insert into jdata (id,userId,title,body) value ?",
          [data.map((key) => [key.id, key.userId, key.title, key.body])],
          (err, result) => {
            if (err) {
              console.log(err)
            } else {
              res.send({ ok: "ok" })
            }
          }
        )
      } else {
        res.send({
          message: "Header missmatch! Kindly check the sample template provided"
        })
      }
    } catch (err) {
      console.log(err)
      res.status(500).send(err)
    }
  } else {
    const wb = xlsx.readFile(`${__dirname}/client/public/uploads/${name}`)
    console.log(wb.SheetNames)
    const wsn = wb.SheetNames[0]
    const ws = wb.Sheets[wsn]
    const a1 = ws.A1.v
    const b1 = ws.B1.v
    if (a1 === "userId" && b1 === "id") {
      const data = xlsx.utils.sheet_to_json(ws)

      mydb.query(
        "insert into jdata (id,userId,title,body) value ?",
        [data.map((key) => [key.id, key.userId, key.title, key.body])],
        (err, result) => {
          if (err) {
            console.log(err)
          } else {
            res.send({ ok: "ok" })
            console.log(result)
          }
        }
      )
    } else {
      res.send({
        message: "Header missmatch! Kindly check the sample template provided"
      })
    }
  }
})

app.get("/Logout", (req, res) => {
  res.cookie("user", "", { maxAge: 1 })
  res.redirect("/")
})

app.get("/LoginStatus", async (req, res) => {
  const token = req.cookies.user

  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        console.log(err)
        res.send(err)
      } else {
        res.send(decodedToken)
      }
    })
  } else {
    console.log("no token")
    res.send({ message: "no token" })
  }
})

app.post("/Login", (req, res) => {
  const email = req.body.email
  const password = req.body.password

  mydb.query("select * from users where email = ? ", email, (err, result) => {
    if (err) {
      console.log(err)
      res.status(400).send(err)
    }
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (error, response) => {
        if (response) {
          const id = result[0].id
          const token = creatToken(id, email)
          res.cookie(`user`, token, {
            httpOnly: true,
            maxAge: maxAge * 1000
          })
          res.status(200).send({ ok: "ok" })
        } else {
          res.send({ message: "Incorrect Password! Re-try" })
        }
      })
    } else {
      res.send({ message: "Email doesn't exist" })
    }
  })
})

app.post("/signUp", (req, res) => {
  const fname = req.body.fname
  const lname = req.body.lname
  const email = req.body.email
  const password = req.body.password

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err)
    }

    mydb.query(
      "INSERT INTO users (first_name,last_name,email,password) VALUES (?,?,?,?)",
      [fname, lname, email, hash],
      (err, result) => {
        if (err) {
          console.log(err)
          res.status(500).send(err)
        } else {
          const id = result.insertId
          const token = creatToken(id, email)
          res.cookie(`user`, token, {
            httpOnly: true,
            maxAge: maxAge * 1000
          })
          res.send(result)
        }
      }
    )
  })
})

app.listen(3001, () => {
  console.log("Server running at port 3001")
})
