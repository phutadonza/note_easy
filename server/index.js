import express from 'express'
import morgan from 'morgan'
import session from 'express-session'
// import cors from 'cors'

import { connection as conn } from './Config/db.js'
import { readdirSync } from 'fs'

const app = express()
app.use(
  session({ secret: 'reactrestapi', resave: false, saveUninitialized: false })
)
app.use(morgan('dev'))
//app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const files = readdirSync('./Routes')
files.map(async (r) => {
  let fs = await import(`./Routes/${r}`)
  app.use('/api', fs.default)
})

app.listen(5000, () => console.log('server is running on port 5000'))
