import { useEffect, useContext, useRef, useState } from 'react'
import { dataContext, userContext, userDataContext } from '../App'

function Note() {
  const form = useRef()
  const [categories, setCategories] = useState([])
  let category = ['study', 'work']
  let [signedIn, setSignedIn] = useContext(userContext)
  let [data, setData] = useContext(dataContext)
  let [userData, setUserData] = useContext(userDataContext)

  useEffect(() => {
    fetch('/api/note/sessionget')
      .then((res) => res.json())
      .then((result) => {
        console.log('-->' + result)
        setSignedIn(result.signedIn)
        setData(result.cus_id)

        setCategories(result.categories)
      })
  }, [])

  const onSubmitForm = (event) => {
    event.preventDefault()
    const formData = new FormData(form.current)
    const formEnt = Object.fromEntries(formData.entries())
    const combinedData = { ...formEnt, cus_id: data }
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
      </>
    )
  }
}

export default Note
