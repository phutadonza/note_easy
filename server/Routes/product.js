import express from 'express'
import {
  cate_list,
  update,
  remove,
  register,
  login,
  sessionget,
  sessiondel,
  createnote,
} from '../Controllers/product.js'

const router = express.Router()

//http://localhost:5000/api/note

router.get('/note/cate_list', cate_list)
router.get('/note/sessionget', sessionget)
router.post('/note/register', register)
router.get('/note/delete', sessiondel)
router.post('/note/createnote', createnote)
router.post('/note/login', login)
router.put('/note', update)
router.delete('/note/:id', remove)

export default router
