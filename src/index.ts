import express from 'express'
import cookieParser from 'cookie-parser'
import "dotenv/config"

const app = express()
const PORT = 3000



// middleware

app.use(cookieParser())
app.use(express.static('public'))



// routes

app.get('/', (req, res) => {
    res.send("<h1>Hello world!</h1>")
})




// start app

app.listen(PORT, () => {
    console.log("Listening...")
})