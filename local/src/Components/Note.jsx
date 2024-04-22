import { useEffect, useContext, useRef, useState } from 'react'
import { dataContext, userContext, userDataContext } from '../App'
import { useNavigate } from 'react-router-dom'

function Note() {
  const form = useRef()
  const [categories, setCategories] = useState([])
  const [historyData, setHistoryData] = useState([])
  let [signedIn, setSignedIn] = useContext(userContext)
  let [data_id, setData_id] = useState()
  let [update, setUpdate] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/note/sessionget')
      .then((res) => res.json())
      .then((result) => {
        setData_id(result.cus_id)
        setSignedIn(result.signedIn)
        setCategories(result.categories)
      })
  }, [])

  useEffect(() => {
    fetch('/api/historylist')
      .then((res) => res.json())
      .then((result) => {
        setHistoryData(result)
      })
  }, [update])

  const onSubmitForm = (event) => {
    event.preventDefault()
    const formData = new FormData(form.current)
    const formEnt = Object.fromEntries(formData.entries())
    const combinedData = { ...formEnt, cus_id: data_id }
    //console.log(data.cus_id)
    //console.log(combinedData)

    fetch('/api/note/createnote', {
      method: 'POST',
      body: JSON.stringify(formEnt),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((result) => {
        alert('successfully created note')
        setUpdate(result)
        form.current.reset()
      })
      .catch((err) => alert(err))
  }

  if (!signedIn) {
    return (
      <>
        <>Please Enter your username and password</>
      </>
    )
  } else {
    return (
      <>
        <div className="container justify-content-center align-items-center h-100">
          <div className="text-center mt-3">
            <h1>Note</h1>
          </div>
          <div
            className="mt-4 mx-auto p-3 rounded "
            style={{ width: '400px', background: '#cee' }}
          >
            <form ref={form} onSubmit={onSubmitForm}>
              <div>
                Category
                <br />
                <select
                  className="btn btn-sm btn-light border"
                  name="cate_id"
                  defaultValue={categories[0]?.id}
                  style={{ height: '30px' }}
                >
                  {categories.map((item, i) => (
                    <option key={i + 1} value={item.category_id}>
                      {item.cate_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group mb-4 mt-4">
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Enter Title"
                  maxLength="50"
                  className="form-control form-control-sm"
                />
              </div>
              <div className="form-group mb-2">
                <textarea
                  type="text"
                  name="content"
                  required
                  placeholder="Enter content"
                  className="form-control form-control-sm"
                />
              </div>
              <div className="form-group mb-2">
                <label>Date</label>
                <input
                  type="date"
                  name="created"
                  required
                  className="form-control form-control-sm"
                />
              </div>
              <div className="text-center">
                <button className="btn btn-sm px-4 btn-primary" type="submit">
                  OK
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="container mt-5">
          <h2>History Notes</h2>
          <div className="row">
            {historyData.map((item, index) => {
              let dt = new Date(Date.parse(item.created))
              let df = (
                <>
                  {dt.getDate()}/{dt.getMonth() + 1}/{dt.getFullYear()}
                </>
              )
              return (
                <div key={index} className="col-md-4 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Title : {item.title}</h5>
                      <p className="card-text">Content : {item.content}</p>
                      <p className="card-text">User : {item.cus_name}</p>
                      <p className="card-text">Category : {item.cate_name}</p>
                      <p className="card-text">Created : {df}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </>
    )
  }
}

export default Note
