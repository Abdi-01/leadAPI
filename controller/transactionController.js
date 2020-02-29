const db = require('../database')
const transporter = require('../helper/nodemailer');
const hbs = require("nodemailer-express-handlebars")

module.exports = {
    addToTransaction: (req, res) => {
        console.log(req.body)
        var char= `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ`;
        let invoice = '';
        var len = char.length
        for (let i = 0; i < 6; i++) {
            invoice += char[Math.floor(Math.random() * len)];
        }

        let trans = {
            invoice:`LEAD#${invoice}`,
            userID: req.body.userID,
            cartPrice: req.body.cartPrice,
            shippingPrice: req.body.shippingPrice,
            payment: req.body.payment,
            address: req.body.address,
            courier: req.body.courier,
            note: req.body.note
        }
        let sql = 'insert into tb_transactions set ?';
        db.query(sql, trans, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).send(err)
            }
            const handlebarOptions = {
                viewEngine: {
                    extName: '.html',
                    partialsDir: './emailHTML',
                    layoutsDir: './emailHTML',
                    defaultLayout: 'payment.html',
                },
                viewPath: './emailHTML',
                extName: '.html',
            };

            transporter.use('compile', hbs(handlebarOptions))

            let mailOptions = {
                from: 'Admin <leadwear01@gmail.com>',
                to: 'abdialghi@gmail.com',
                subject: 'Payment',
                template: 'payment',
                context: {
                    name: req.body.username,
                    totalPayment: req.body.payment,
                    pva: req.body.mva
                }
            }
            transporter.sendMail(mailOptions, (err, resB) => {
                if (err) {
                    console.log(err)
                    return res.status(500).send({ message: err })
                }
                console.log('Successfully send payment virtual account')
            })
            let sqlMove = `INSERT INTO tb_history ( invoice, userID, productID, stockID, qty, price, status, transactionID ) 
                            SELECT 'LEAD#${invoice}', c.userID, c.productID, c.stockID, c.qty, c.price, 'Unpaid', ${results.insertId} 
                            FROM tb_cart c WHERE c.userID =${req.params.uID};`
            db.query(sqlMove, (err, results) => {
                if (err) {
                    return res.status(500).send(err)
                }
                let sqlClear = `delete from tb_cart where userID = ${req.params.uID};`
                db.query(sqlClear, (err, results) => {
                    if (err) {
                        res.status(500).send(err)
                    }
                    // return res.status(200).send(results)
                })
                return res.status(200).send(results)
            });
        })
    },
    getTransaction:(req,res)=>{
        let sql = `SELECT * FROM tb_transactions where userID=${req.user.id}`
        db.query(sql, (err, results) => {
            if (err) {
                console.log(res.status(500).send(err))
            }
            console.log(req.user.username)
            console.log(results)
            return res.status(200).send(results)
        });
    }
}