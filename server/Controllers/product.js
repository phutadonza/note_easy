import { connection as conn } from '../Config/db.js'
import session from 'express-session'
import express from 'express'
import bcrypt from 'bcrypt'

const app = express()

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  })
)
export const register = async (req, res) => {
  let form = req.body
  let data = {
    cus_name: form.cus_name || '',
    cus_email: form.cus_email || '',
    cus_tel: form.cus_tel || '',
  }

  try {
    // ตรวจสอบว่ามีอีเมลนี้อยู่ในระบบหรือไม่
    conn.query(
      'SELECT * FROM customer WHERE cus_email = ?',
      [data.cus_email],
      (err, results, fields) => {
        if (err) {
          console.log('Error while checking email in the database', err)
          return res.status(500).send()
        }

        // ถ้ามีผลลัพธ์คือมีอีเมลนี้อยู่ในระบบแล้ว
        if (results.length > 0) {
          return res.json({ message: 'Email already exists' })
        } else {
          // แปลงรหัสผ่านเป็นแฮช
          const saltRounds = 10
          bcrypt.hash(form.cus_password, saltRounds, (err, hash) => {
            if (err) {
              console.log('Error while hashing password', err)
              return res.status(500).send()
            }

            // บันทึกข้อมูลผู้ใช้ (รวมกับรหัสผ่านที่ถูกแปลงแล้ว) ลงในฐานข้อมูล
            conn.query(
              'INSERT INTO customer(cus_name,cus_email,cus_password,cus_tel) VALUES (?,?,?,?)',
              [
                data.cus_name,
                data.cus_email,
                hash, // ใช้รหัสผ่านที่ถูกแปลงแล้ว
                data.cus_tel,
              ],
              (err, results, fields) => {
                if (err) {
                  console.log(
                    'Error while inserting data into the database',
                    err
                  )
                  return res.status(400).send('')
                }
                return res
                  .status(201)
                  .json({ message: 'New data Customer successfully created' })
              }
            )
          })
        }
      }
    )
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}

export const login = async (req, res) => {
  //console.log(req.body)
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
        //console.log(results)
        res.json({
          signedIn: true,
          email: req.session.email,
          name: req.session.name,
          cus_id: req.session.cus_id,
          categories: results,
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
  //console.log(req.body, req.session.cus_id)
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

      conn.query(
        'INSERT INTO history_note(created, cus_id, note_id, cate_id,note_content) VALUES (?,?,?,?,?)',
        [
          data.created,
          data.cus_id,
          noteResults.insertId, // ใช้ ID ของ note ที่ได้จากการเพิ่มล่าสุด
          data.cate_id,
          data.content,
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
      `SELECT note.created, customer.cus_name, category_note.cate_name, note.title,note.content
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
