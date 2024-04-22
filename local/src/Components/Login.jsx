import { useContext, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { baseUrl, dataContext, userDataContext } from '../App'

export default function Login() {
  const navigate = useNavigate()
  const form = useRef()
  const textPswd = useRef()
  let [data, setData] = useContext(dataContext)
  let [userData, setUserData] = useContext(userDataContext)

  const onBlurPassword = () => {
    let pswd = textPswd.current.value
    if (pswd !== '' && !pswd.match(/^[0-9a-zA-Z]+$/)) {
      textPswd.current.value = ''
      alert('ต้องเป็น 0-9 หรือ a-z หรือ A-Z เท่านั้น')
    }
  }

  const onSubmitForm = (event) => {
    event.preventDefault()
    const formData = new FormData(form.current)
    const formEnt = Object.fromEntries(formData.entries())

    //console.log(formEnt)
    fetch('/api/note/login', {
      method: 'POST',
      body: JSON.stringify(formEnt),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result)
        if (!result) {
          alert('User not found')
        } else {
          setData(result.user_data)
          //console.log(result.user_data)
          alert('Login successfully')
          navigate('/')
        }
      })
      .catch((err) => alert(err))
  }

  return (
    <div className="container justify-content-center align-items-center h-100">
      <div className="text-center mt-3">
        <h1>Login</h1>
      </div>
      <div
        className="mt-4 mx-auto p-3 rounded "
        style={{ width: '400px', background: '#cee' }}
      >
        <form ref={form} onSubmit={onSubmitForm}>
          <div className="form-group mb-2">
            <label>Email</label>
            <input
              type="email"
              name="cus_email"
              className="form-control form-control-sm"
              required
            />
          </div>
          <div className="form-group mb-2">
            <label>Password</label>
            <input
              type="password"
              name="cus_password"
              maxLength="10"
              className="form-control form-control-sm"
              ref={textPswd}
              onBlur={onBlurPassword}
              required
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-sm px-4 btn-primary">
              OK
            </button>
            <Link to="/register" className="btn btn-sm px-4 btn-primary ms-3">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
