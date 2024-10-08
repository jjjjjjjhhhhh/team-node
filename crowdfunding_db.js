const mysql = require('mysql2/promise');
const config = require('./db_default.js');

async function connectData() {
    try {
        return await mysql.createConnection({
            host: config.db.host,    // 数据库地址
            user: config.db.user, // 数据库用户名
            database: config.db.database, // 数据库名
            password: '', // 数据库密码
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        })
    } catch (e) {
        console.log(e);

    }
}

module.exports = connectData;