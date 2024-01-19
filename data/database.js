const mysql =require('mysql2');
const pool=mysql.createPool({
    host:'localhost',
    database:'blog-project',
    user:'root',
    password:'root'
});
module.exports=pool;