import mysql from 'mysql'

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'note_easy',
})

connection.connect((err) => {
  if (err) {
    console.log('MySQL connection failed:', err)
    process.exit(1) // หยุดการทำงานของโปรแกรมเมื่อเชื่อมต่อล้มเหลว
  }
  console.log('MySQL connected!')
})

export { connection }
