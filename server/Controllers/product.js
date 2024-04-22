import { Notes, Customers, History, Category } from '../Models/models.js'
import { connection as conn } from '../Config/db.js'
import session from 'express-session'
import express from 'express'

const app = express()

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  })
)
export const cate_list = async (req, res) => {}

export const register = async (req, res) => {
  //console.log(req.body)
  let form = req.body
  let data = {
    cus_name: form.cus_name || '',
    cus_email: form.cus_email || '',
    cus_password: form.cus_password || '',
    cus_password2: form.cus_password2 || '',
    cus_tel: form.cus_tel || '',
  }
  try {
    conn.query(
      'INSERT INTO customer(cus_name,cus_email,cus_password,cus_password2,cus_tel) VALUES (?,?,?,?,?)',
      [
        data.cus_name,
        data.cus_email,
        data.cus_password,
        data.cus_password2,
        data.cus_tel,
      ],
      (err, results, fields) => {
        if (err) {
          console.log('Error while inserting data into the database', err)
          return res.status(400).send()
        }
        return res
          .status(201)
          .json({ message: 'New data Customer successfully created' })
      }
    )
  } catch (err) {}
}
export const login = async (req, res) => {
  console.log(req.body)
  let email = req.body.cus_email
  let password = req.body.cus_password

  conn.query(
    'SELECT * FROM customer WHERE cus_email = ? AND cus_password = ?',
    [email, password],
    (error, results, fields) => {
      //console.log(results)
      if (results.length > 0) {
        // หากพบผู้ใช้ที่ตรงกับ username และ password
        if (
          email == results[0].cus_email &&
          password == results[0].cus_password
        ) {
          //console.log(results[0].cus_id)
          req.session['email'] = email
          req.session['name'] = results[0].cus_name
          req.session['cus_id'] = results[0].cus_id
          res.json({
            signedIn: true,
            user_data: results[0].cus_id, //ส่ง Object ไป
          })
        } else {
          console.error('Login failed:', error)
          res
            .json({
              signedIn: false,
              message: 'Invalid username or password',
            })
            .status(401)
        }
      } else {
        res.send(false)
      }
    }
  )
}
export const sessionget = async (req, res) => {
  if (req.session.email) {
    try {
      conn.query('SELECT * FROM category_note', (err, results, fields) => {
        if (err) {
          console.log(err)
          return res
            .status(500)
            .send('Server error can not pull data from cate')
        }
        //console.log(results) // ตรวจสอบว่าผลลัพธ์ที่ได้รับมาจากการสอบถามถูกต้องหรือไม่
        res.json({
          signedIn: true,
          email: req.session.email,
          name: req.session.name,
          cus_id: req.session.cus_id,
          categories: results, // เพิ่มข้อมูลหมวดหมู่ใน response
        })
      })
    } catch (err) {
      console.log(err)
      res.status(500).send('server error with API cate')
    }
  } else {
    res.json({ signedIn: false })
  }
}
// สำหรับการลบข้อมูลใน session เพื่อออกจากระบบ
export const sessiondel = async (req, res) => {
  req.session.destroy((err) => {
    res.json({ signedIn: false })
  })
}

export const createnote = async (req, res) => {
  console.log(req.body, req.session.cus_id)
  let form = req.body
  let customer_id = req.session.cus_id
  let data = {
    cate_id: form.cate_id || '',
    title: form.title || '',
    content: form.content || '',
    created: form.cus_password2 || '',
    updated: form.cus_password2 || '',
    cus_id: customer_id || '',
  }
  try {
    conn.query()
  } catch (err) {}
}

export const update = async (req, res) => {
  try {
    res.send('Hello Update')
  } catch (err) {
    console.log(err)
    res.status(500).send('server error')
  }
}
export const remove = async (req, res) => {
  try {
    res.send('Hello Delete')
  } catch (err) {
    console.log(err)
    res.status(500).send('server error')
  }
}
