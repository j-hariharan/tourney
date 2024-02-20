import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import { engine } from 'express-handlebars'
import "dotenv/config"

import login_routes from './routes/login'
import home_routes from './routes/home'

import auth_middleware from './helpers/auth'


const app = express()
const PORT = 3000



// middleware

app.use(cookieParser())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(auth_middleware)




// handlebars

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', 'views')


// routes

app.use(home_routes)
app.use(login_routes)



// start app

app.listen(PORT, () => {
    console.log("Listening...")
})