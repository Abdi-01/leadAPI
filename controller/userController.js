const db = require('../database')
const { createJWTToken } = require('../helper/jwtEncode')
const transporter = require('../helper/nodemailer');
const Crypto = require("crypto")
const hbs = require("nodemailer-express-handlebars")
module.exports = {
    getUsers: (req, res) => {//req/request = data yang diambil dari front end, res = respons
        let sql = 'SELECT * FROM tb_users;'
        console.log(req.query)
        db.query(sql, (err, results) => {//data gagal akan masuk err, kalo benar masuk results==========> db = hasil export dari mysql yang diakses pada folder databes
            if (err) {
                res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },
    login: (req, res) => {
        const { username, password } = req.body
        let hashPassword = Crypto.createHmac("sha256", "uniqueKey").update(password).digest("hex")
        console.log(hashPassword)
        let sql = `SELECT * FROM tb_users where username='${username}' and password='${hashPassword}';`
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            console.log(results)
            // if (results.length !== 0) {
            //     let { id, username, email, phone, password, role, status } = results[0]
            //     const token = createJWTToken({
            //         id,
            //         username,
            //         password,
            //         email,
            //         role
            //     })
            //     console.log(token)
            //     return res.status(200).send({ id, username, email, phone, role, token, status })
            // }
            // else {
            //     return res.status(200).send("invalid")
            // }
        })
    },
    keepLogin: (req, res) => {
        console.log('Masuk')
        console.log(req.user)
        let sql = `Select * from tb_users where id=${req.user.id};`
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            if (results.length !== 0) {
                let { id, username, email, phone, role, status } = results[0]
                const token = createJWTToken({ id, username })
                return res.status(200).send({ id, username, email, phone, role, token, status })
            }
        })
    },
    editProfile: (req, res) => {
        // console.log(res.query.id)
        // let sqlget = `SELECT * FROM tb_users where id=${req.user.id};` //diambil dari hasil decode auth token
        let sqlget = `SELECT * FROM tb_users where id=${req.params.id};`
        db.query(sqlget, (err, resultsGet) => {//data gagal akan masuk err, kalo benar masuk results
            if (err) {
                res.status(500).send(err)
            }
            else if (resultsGet && resultsGet.length > 0) {
                // res.status(200).send(resultsGet[0].username)
                let { newuser, newemail, newphone } = req.body
                let sqledit = `UPDATE tb_users SET username = '${newuser}', email = '${newemail}', phone = '${newphone}' WHERE id=${req.params.id};`
                db.query(sqledit, (err, results) => {
                    if (err) {
                        res.status(500).send(err)
                    }
                    let sqlget2 = `SELECT * FROM tb_users where username='${usernameNew}';`
                    db.query(sqlget2, (err, resultsUpdate) => {
                        if (err) {
                            res.status(500).send(err)
                        }
                        res.status(200).send(resultsUpdate)
                    })
                })
            }
            else {
                res.status(200).send('<h2>USER GAG ADA</h2>')
            }
        })
    },
    editPassword: (req, res) => {
        // console.log(res.query.id)
        let { oldpass, newpass } = req.body
        let hashPassword = Crypto.createHmac("sha256", "uniqueKey").update(oldpass).digest("hex")
        let hashPasswordNew = Crypto.createHmac("sha256", "uniqueKey").update(newpass).digest("hex")
        let sqlget = `SELECT * FROM tb_users where id=${req.params.id} and password='${hashPassword}';`
        db.query(sqlget, (err, resultsGet) => {//data gagal akan masuk err, kalo benar masuk results
            if (err) {
                res.status(500).send(err)
            }
            else if (resultsGet && resultsGet.length > 0) {
                // res.status(200).send(resultsGet[0].username)
                let sqledit = `UPDATE tb_users SET password = '${hashPasswordNew}' WHERE id=${req.params.id};`
                db.query(sqledit, (err, results) => {
                    if (err) {
                        res.status(500).send(err)
                    }
                    let sqlget2 = `SELECT * FROM tb_users where id=${req.params.id};`
                    db.query(sqlget2, (err, resultsUpdate) => {
                        if (err) {
                            res.status(500).send(err)
                        }
                        res.status(200).send(resultsUpdate)
                    })
                })
            }
            else {
                res.status(200).send('<h2>USER GAG ADA</h2>')
            }
        })
    },
    register: (req, res) => {
        console.log(req.body)
        let { username, password, phone, email, role } = req.body

        let hashPassword = Crypto.createHmac("sha256", "uniqueKey").update(password).digest("hex")
        console.log(hashPassword)

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
                    res.status(500).send(err)
                }
                console.log(results)
                var { id, username, email, phone, password, role, status } = results[0]
                const token = createJWTToken({ id, username, email, phone, password, role })
                console.log('success')
                // console.log(status)
                // return res.status(200).send({
                //     id,
                //     username,
                //     email,
                //     phone,
                //     role,
                //     token,
                //     status
                // })
                // let verificationLink = `http://localhost:3000/verification?username=${username}&password=${hashPassword}`//link kehalaman verification
                let verificationLink = `http://localhost:3000/verification?${token}?${username}`//link kehalaman verification

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
                    to: 'abdialghi@gmail.com',
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
                        console.log(err)
                        return res.status(500).send({ message: err })
                    }

                })
            })

        })
    },
    getUsersSearch: (req, res) => {
        console.log('cari', req.params.search)
        let sql = `SELECT * FROM tb_users where username='${req.params.search}';`
        db.query(sql, (err, results) => {//data gagal akan masuk err, kalo benar masuk results
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send(results)
        })
    },
    emailVerification: (req, res) => {
        let { username, password, otp } = req.body
        console.log(username, password, otp)
        let sqlget = `SELECT * FROM tb_users where username='${username}' and password='${password}';`

        db.query(sqlget, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).send(err)
            }
            console.log(results)
            let sqlverified = `update tb_users set status = 'Verified' where username = '${username}' and status='${otp}';`
            db.query(sqlverified, (erra, resultsB) => {
                if (erra) {
                    return res.status(500).send(erra)
                }
                console.log('Verified Success')
                console.log(resultsB.message)
                return res.status(200).send(resultsB)
            })
        })
    }
}
