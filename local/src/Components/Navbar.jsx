import { useEffect, useState, useContext } from 'react'
import reactlogo from '../assets/react.svg'
import { userContext, userDataContext, dataContext } from '../App'
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  let [signedIn, setSignedIn] = useContext(userContext)
  let [userData, setUserData] = useContext(userDataContext)
  let [data, setData] = useContext(dataContext)

  useEffect(() => {
    fetch('/api/note/sessionget')
      .then((res) => res.json())
      .then((result) => {
        //console.log(result)
        setSignedIn(result.signedIn)
        setUserData(result.name)
        setData(result.id)
        //console.log(data)
      })
      .catch((err) => alert(err.message))
  }, [data])

  const onClickLink = (event) => {
    event.preventDefault()
    if (!window.confirm('Confirm logout')) {
      return
    }
    fetch('/api/note/delete')
      .then((res) => res.text())
      .then((result) => {
        navigate('/login')
        setSignedIn(false)
      })
      .catch((err) => alert(err))
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <span className="navbar-brand">
          <img src={reactlogo} />
        </span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link active" aria-current="page" to="/">
                Note
              </NavLink>
            </li>
          </ul>
          {signedIn ? (
            <>
              Welcome :{userData}&nbsp;
              <button
                className="btn btn-outline-danger"
                onClick={(e) => onClickLink(e)}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="btn btn-outline-success"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
