// const mysql = require('mysql')
// const db = mysql.createConnection({
//     host:'www.codeaddict.my.id',
//     user:'codeaddi_al',
//     password:'AkuLeadProject',
//     database:`codeaddi_lead`,
//     port:3306,
//     multipleStatements:true
// })

// module.exports= db
const mysql = require('mysql')
const db = mysql.createConnection({
    host:'localhost',
    user:'AL',
    password:'007@001',
    database:`db-lead`,
    port:3306,
    multipleStatements:true
})

module.exports= db