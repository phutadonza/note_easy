import mongoose from 'mongoose'

const noteSchema = mongoose.Schema({
  title: String,
  content: String,
  date_added: Date,
})
const Notes = mongoose.model('Notes', noteSchema)

const customerSchema = mongoose.Schema({
  cus_name: String,
  email: String,
  tel: String,
})
const Customers = mongoose.model('Customers', customerSchema)

const historySchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId, // ประเภทข้อมูล ObjectId
    ref: 'Notes', // ชื่อของโมเดลที่เชื่อมโยง
  },
  action: String,
})
const History = mongoose.model('History', historySchema)

const categorySchema = mongoose.Schema({
  title: String,
  content: String,
})
const Category = mongoose.model('Category', categorySchema)

export { Notes, Customers, History, Category }
