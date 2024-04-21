import { useEffect, useContext, useRef } from 'react'
import { dataContext, userContext } from '../App'

function Note() {
  const form = useRef()
  let category = ['study', 'work']
  let [signedIn, setSignedIn] = useContext(userContext)
  let [data, setData] = useContext(dataContext)

  useEffect(() => {
    fetch('/api/note/sessionget')
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        setSignedIn(result.signedIn)
        setData(result.cus_id)
      })
      .catch((err) => alert(err.message))
  }, [])

  useEffect(() => {
    fetch('/api/note/sessionget')
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        setSignedIn(result.signedIn)
      })
      .catch((err) => alert(err.message))
  }, [])

  const onSubmitForm = (event) => {
    event.preventDefault()
    const formData = new FormData(form.current)
    const formEnt = Object.fromEntries(formData.entries())
    const combinedData = { ...formEnt, cus_id: data }
    console.log(combinedData)

    // fetch('/api/note/createnote', {
    //   method: 'POST',
    //   body: JSON.stringify(formEnt),
    //   headers: { 'Content-Type': 'application/json' },
    // })
    //   .then((res) => res.json())
    //   .then((result) => {
    //     alert('successfully created note')
    //   })
    //   .catch((err) => alert(err))
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
              <select
                className="btn btn-sm btn-light border mb-4"
                name="status"
                defaultValue={category[0]}
                style={{ height: '30px' }}
              >
                {category.map((item, i) => (
                  <option key={i + 1} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <div className="form-group mb-4">
                <input
                  type="text"
                  name="cate_name"
                  required
                  placeholder="Enter Category"
                  maxLength="50"
                  className="form-control form-control-sm"
                />
              </div>
              <div className="form-group mb-4">
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
