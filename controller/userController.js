const db = require('../database')
const { createJWTToken } = require('../helper/jwtEncode')
const transporter = require('../helper/nodemailer');
const Crypto = require("crypto")
const hbs = require("nodemailer-express-handlebars")

module.exports = {
    getUsers: (req, res) => {//req/request = data yang diambil dari front end, res = respons
        let sql = 'SELECT * FROM tb_users;'
        // console.log(req.query)
        db.query(sql, (err, results) => {//data gagal akan masuk err, kalo benar masuk results==========> db = hasil export dari mysql yang diakses pada folder databes
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send(results)
        })
    },
    login: (req, res) => {
        const { username, password } = req.body
        let hashPassword = Crypto.createHmac("sha256", "uniqueKey").update(password).digest("hex")
        // console.log(hashPassword)
        let sql = ''
        if (username.includes("@") === false) {
            sql = `SELECT * FROM tb_users where username='${username}' and password='${hashPassword}';`
        } else {
            sql = `SELECT * FROM tb_users where email='${username}' and password='${hashPassword}';`
        }
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            // console.log(results)
            if (results.length !== 0) {
                let { id, username, email, phone, password, role, status } = results[0]
                const token = createJWTToken({ id, username, email, phone, password, role, status })
                // console.log(token)
                return res.status(200).send({ id, username, email, phone, role, token, status })
            }
            else {
                return res.status(500).send("invalid")
            }
        })
    },
    keepLogin: (req, res) => {
        // // console.log('Masuk')
        // // console.log(req.user.id)
        let sql = `Select * from tb_users where id=${req.user.id};`
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            // console.log(results)
            if (results.length !== 0) {
                let { id, username, email, phone, password, role, status } = results[0]
                const token = createJWTToken({ id, username, email, phone, password, role, status })
                return res.status(200).send({ id, username, email, phone, role, status, token })
            }
        })
    },
    editProfile: (req, res) => {
        // // console.log(res.query.id)
        // let sqlget = `SELECT * FROM tb_users where id=${req.user.id};` //diambil dari hasil decode auth token
        let sqlget = `SELECT * FROM tb_users where id=${req.user.id};`
        db.query(sqlget, (err, resultsGet) => {//data gagal akan masuk err, kalo benar masuk results
            if (err) {
                res.status(500).send(err)
            }
            else if (resultsGet && resultsGet.length > 0) {
                // res.status(200).send(resultsGet[0].username)
                let { newuser, newemail, newphone } = req.body
                let sqledit = `UPDATE tb_users SET username = '${newuser}', email = '${newemail}', phone = '${newphone}' WHERE id=${req.user.id};`
                db.query(sqledit, (err, results) => {
                    if (err) {
                        res.status(500).send(err)
                    }
                    let sqlget2 = `SELECT * FROM tb_users where username='${newuser}';`
                    db.query(sqlget2, (err, resultsNew) => {
                        if (err) {
                            res.status(500).send(err)
                        }
                        // res.status(200).send(resultsUpdate)
                        let { id, username, email, phone, password, role, status } = resultsNew[0]
                        const token = createJWTToken({ id, username, email, phone, password, role, status })
                        return res.status(200).send({ id, username, email, phone, role, status, token })
                    })
                })
            }
            else {
                res.status(200).send('<h2>USER GAG ADA</h2>')
            }
        })
    },
    editPassword: (req, res) => {
        // // console.log(res.query.id)
        let { oldpass, newpass } = req.body
        let hashPassword = Crypto.createHmac("sha256", "uniqueKey").update(oldpass).digest("hex")
        let hashPasswordNew = Crypto.createHmac("sha256", "uniqueKey").update(newpass).digest("hex")
        let sqlget = `SELECT * FROM tb_users where id=${req.user.id} and password='${hashPassword}';`
        db.query(sqlget, (err, resultsGet) => {//data gagal akan masuk err, kalo benar masuk results
            if (err) {
                res.status(500).send(err)
            }
            else if (resultsGet && resultsGet.length > 0) {
                // res.status(200).send(resultsGet[0].username)
                let sqledit = `UPDATE tb_users SET password = '${hashPasswordNew}' WHERE id=${req.user.id};`
                db.query(sqledit, (err, results) => {
                    if (err) {
                        res.status(500).send(err)
                    }
                    let sqlget2 = `SELECT * FROM tb_users where id=${req.user.id};`
                    db.query(sqlget2, (err, resultsNew) => {
                        if (err) {
                            res.status(500).send(err)
                        }
                        let { id, username, email, phone, password, role, status } = resultsNew[0]
                        const token = createJWTToken({ id, username, email, phone, password, role, status })
                        return res.status(200).send({ id, username, email, phone, role, status, token })
                    })
                })
            }
            else {
                res.status(200).send('wrong')
            }
        })
    },
    register: (req, res) => {
        // // console.log(req.body)
        let { username, password, phone, email, role } = req.body

        let hashPassword = Crypto.createHmac("sha256", "uniqueKey").update(password).digest("hex")
        // console.log(hashPassword)

        var karakter = `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`;
        let OTP = '';
        var len = karakter.length
        for (let i = 0; i < 6; i++) {
            OTP += karakter[Math.floor(Math.random() * len)];
        }

        let sqlinsert = `INSERT into tb_users (username,email,phone,password,role,status) values ('${username}','${email}','${phone}','${hashPassword}','${role}','${OTP}');`
        db.query(sqlinsert, req.body, (err, results) => {//data gagal akan masuk err, kalo benar masuk insert
            if (err) {
                res.status(500).send(err)
            }
            let sql = `SELECT * from tb_users where username='${username}';`
            db.query(sql, (err, results) => {
                if (err) {
                    return res.status(500).send(err)
                }
                // // console.log(results)
                var { id, username, email, phone, password, role, status } = results[0]
                const token = createJWTToken({ id, username, email, phone, password, role, status })
                // console.log('success')
                // // console.log(status)
                // let verificationLink = `http://localhost:3000/verification?username=${username}&password=${hashPassword}`//link kehalaman verification
                let verificationLink = `http://localhost:3000/verification?${token}`//link kehalaman verification

                const handlebarOptions = {
                    viewEngine: {
                        extName: '.html',
                        partialsDir: './emailHTML',
                        layoutsDir: './emailHTML',
                        defaultLayout: 'verify-email.html',
                    },
                    viewPath: './emailHTML',
                    extName: '.html',
                };

                transporter.use('compile', hbs(handlebarOptions))

                let mailOptions = {
                    from: 'Admin <leadwear01@gmail.com>',
                    to: email,
                    subject: 'Confirmation Register',
                    template: 'verify-email',
                    context: {
                        name: username,
                        action_url: verificationLink,
                        otp: OTP
                    }
                }
                transporter.sendMail(mailOptions, (err, resB) => {
                    if (err) {
                        // console.log(err)
                        return res.status(500).send({ message: err })
                    }// return res.status(200).send({
                    //     id,
                    //     username,
                    //     email,
                    //     phone,
                    //     role,
                    //     status,
                    //     token
                    // })
                })
                return res.status(200).send(results)
            })

        })
    },
    getUsersSearch: (req, res) => {
        // console.log('cari', req.params.search)
        let sql = `SELECT * FROM tb_users where username='${req.query.user}' and email='${req.query.email}';`
        db.query(sql, (err, results) => {//data gagal akan masuk err, kalo benar masuk results
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send(results)
        })
    },
    emailVerification: (req, res) => {
        let sqlget = `SELECT * FROM tb_users where username='${req.user.username}' and password='${req.user.password}';`

        db.query(sqlget, (err, results) => {
            if (err) {
                // console.log(err)
                return res.status(500).send(err)
            }
            // console.log(results)
            let sqlverified = `update tb_users set status = 'Verified' where username = '${req.user.username}' and status='${req.body.otp}';`
            db.query(sqlverified, (erra, resultsB) => {
                if (erra) {
                    return res.status(500).send(erra)
                }
                // console.log('Verified Success')
                // // console.log(resultsB.message)
                // return res.status(200).send(resultsB)
                // console.log('av', results)
                let { id, username, email, phone, password, role, status } = results[0]
                const token = createJWTToken({ id, username, email, phone, password, role, status })
                return res.status(200).send({ id, username, email, phone, role, status, token })
            })
        })
    }
}
