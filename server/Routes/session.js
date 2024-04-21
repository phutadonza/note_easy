import express from 'express'
import session from 'express-session'
const router = express.Router()

//http://localhost:5000/api/note

router.use(
  session({ secret: 'reactrestapi', resave: false, saveUninitialized: false })
)

router.get('/api/session/get', (req, res) => {
  // ตรวจสอบว่ามีข้อมูลจัดเก็บไว้ใน sessions หรือไม่
  let s = req.session.email ? true : false
  res.json({ signedIn: s })
})

router.post('/api/session/set', (req, res) => {
  // ถ้าส่งข้อมูลมาจาก form เข้ามา ตรวจสอบแค่ password
  // โดย password ถูกต้อง ก็ให้เก็บค่า email ไว้ใน session เพื่อตรวจสอบในภายหลัง
  // แล้วส่งค่ากลับไปว่าได้เข้าสู่ระบบแล้ว
  let email = req.body.email || ''
  let password = req.body.password || ''
  if (password === '1234') {
    req.session['email'] = email
    res.json({ signedIn: true })
  } else {
    res.json({ signedIn: false })
  }
})

export default router
