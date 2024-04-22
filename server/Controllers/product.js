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
    created: form.created ? new Date(Date.parse(form.created)) : new Date(),
    updated: form.updated ? new Date(Date.parse(form.updated)) : new Date(),
    cus_id: customer_id || '',
  }
  conn.query(
    'INSERT INTO note(cate_id,title,content,created,updated,cus_id) VALUES (?,?,?,?,?,?)',
    [
      data.cate_id,
      data.title,
      data.content,
      data.created,
      data.updated,
      data.cus_id,
    ],
    (err, noteResults, fields) => {
      if (err) {
        console.log('Error while inserting data into the note table', err)
        return res.status(400).send()
      }

      // เมื่อข้อมูลถูกเพิ่มในตาราง note สำเร็จแล้ว
      // คุณสามารถใช้ผลลัพธ์ที่ได้จากการเพิ่มข้อมูลในตาราง note
      // เพื่อใช้เป็นข้อมูลสำหรับการเพิ่มในตาราง history_note

      // เพิ่มข้อมูลในตาราง history_note
      conn.query(
        'INSERT INTO history_note(created, cus_id, note_id, cate_id) VALUES (?,?,?,?)',
        [
          data.created,
          data.cus_id,
          noteResults.insertId, // ใช้ ID ของ note ที่ได้จากการเพิ่มล่าสุด
          data.cate_id,
        ],
        (historyErr, historyResults, fields) => {
          if (historyErr) {
            console.log(
              'Error while inserting data into the history_note table',
              historyErr
            )
            return res.status(400).send()
          }

          return res
            .status(201)
            .json({ message: 'New data Note and History successfully created' })
        }
      )
    }
  )
}

export const historylist = async (req, res) => {
  try {
    conn.query(
      `SELECT note.created, customer.cus_name, category_note.cate_name, note.title
      FROM history_note
      JOIN customer ON history_note.cus_id = customer.cus_id
      JOIN category_note ON history_note.cate_id = category_note.category_id
      JOIN note ON history_note.note_id = note.note_id`,
      (err, results, fields) => {
        if (err) {
          console.log(err)
          return res
            .status(500)
            .send('Server error can not pull data from history')
        }
        res.json(results)
      }
    )
  } catch (err) {
    console.log(err)
    res.status(500).send('Server error with API historylist')
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
