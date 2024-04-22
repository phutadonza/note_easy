import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { baseUrl } from '../App'
export default function Register() {
  const form = useRef()
  const textPswd = useRef()
  const textPswd2 = useRef()
  const navigate = useNavigate()

  const onBlurPassword = () => {
    let pswd = textPswd.current.value
    if (pswd !== '' && !pswd.match(/^[0-9a-zA-Z]+$/)) {
      textPswd.current.value = ''
      alert('ต้องเป็น 0-9 หรือ a-z หรือ A-Z เท่านั้น')
    }
  }

  const onBlurPassword2 = () => {
    let pswd1 = textPswd.current.value
    let pswd2 = textPswd2.current.value
    if (pswd1 !== pswd2) {
      textPswd2.current.value = ''
      alert('รหัสผ่านทั้งสองช่องไม่ตรงกัน')
    }
  }

  const onSubmitForm = (event) => {
    event.preventDefault()
    const formData = new FormData(form.current)
    const formEnt = Object.fromEntries(formData.entries())

    // ทำการส่งข้อมูลฟอร์มไปยังเซิร์ฟเวอร์
    fetch('/api/note/register', {
      method: 'POST',
      body: JSON.stringify(formEnt),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json()) // แก้ไขให้เรียก .json() เพื่อให้ได้ข้อมูลเป็น JSON
      .then((result) => {
        // ตรวจสอบว่าการสมัครสำเร็จหรือไม่
        if (result.message === 'New data Customer successfully created') {
          alert('successfully created')
          navigate('/login')
        } else if (result.message === 'Email already exists') {
          alert('Email already exists. Please use another email.')
        } else {
          // กรณีอื่นๆ ที่ไม่ได้ระบุไว้ในเงื่อนไขข้างต้น
          alert('An error occurred. Please try again later.')
        }
      })
      .catch((err) => alert(err))
  }

  return (
    <>
      <div
        className="card mt-4 mx-auto p-3 rounded"
        style={{ width: '400px', background: '#cee' }}
      >
        <h1 className="card-header text-center mt-3">Register</h1>
        <form ref={form} onSubmit={onSubmitForm}>
          <div className="form-group mb-2">
            <label>Name</label>
            <input
              type="text"
              name="cus_name"
              required
              maxLength="50"
              className="form-control form-control-sm"
            />
          </div>
          <div className="form-group mb-2">
            <label>Email</label>
            <input
              type="email"
              name="cus_email"
              required
              className="form-control form-control-sm"
            />
          </div>
          <div className="form-group mb-2">
            <label>Password</label>
            <input
              type="password"
              name="cus_password"
              required
              maxLength="10"
              className="form-control form-control-sm"
              ref={textPswd}
              onBlur={onBlurPassword}
            />
          </div>
          <div className="form-group mb-2">
            <label>Re-Password</label>
            <input
              type="password"
              name="cus_password2"
              required
              className="form-control form-control-sm"
              ref={textPswd2}
              onBlur={onBlurPassword2}
            />
          </div>
          <div className="form-group mb-4">
            <label>Tel</label>
            <input
              type="text"
              name="cus_tel"
              required
              maxLength={10}
              className="form-control form-control-sm"
            />
          </div>
          <div className="text-center">
            <button className="btn btn-sm px-4 btn-primary" type="submit">
              OK
            </button>
            <Link to="/login" className="btn btn-sm px-4 btn-primary ms-3">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
