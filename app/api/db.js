const mysql = require('mysql2/promise')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'codeuni',
    password: 'stardust'
})

export default connection