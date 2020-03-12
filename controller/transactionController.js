const db = require('../database')
const transporter = require('../helper/nodemailer');
const { uploader } = require('../helper/uploader');
const fs = require('fs');
const hbs = require("nodemailer-express-handlebars")

module.exports = {
    addToTransaction: (req, res) => {
        console.log(req.body)
        var char = `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ`;
        let invoice = '';
        var len = char.length
        for (let i = 0; i < 6; i++) {
            invoice += char[Math.floor(Math.random() * len)];
        }

        let trans = {
            invoice: `LEAD_${invoice}`,
            userID: req.user.id,
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
                subject: 'Payment Order',
                template: 'payment',
                context: {
                    name: req.user.username,
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
                            SELECT 'LEAD_${invoice}', c.userID, c.productID, c.stockID, c.qty, c.price, 'Unpaid', ${results.insertId} 
                            FROM tb_cart c WHERE c.userID =${req.user.id};`
            db.query(sqlMove, (err, results) => {
                if (err) {
                    return res.status(500).send(err)
                }
                let sqlHistory = `Select stockID,qty from tb_history where invoice = 'LEAD_${invoice}';`
                // db.query(sqlUpdateStock, (err, results) => {
                //     if (err) {
                //         res.status(500).send(err)
                //     }
                //     // return res.status(200).send(results)
                // let sqlUpdateStock = `delete from tb_cart where userID = ${req.user.id};`
                // db.query(sqlUpdateStock, (err, results) => {
                //     if (err) {
                //         res.status(500).send(err)
                //     }
                //     // return res.status(200).send(results)
                // })
                // return res.status(200).send(results)
                // let sqlClear = `delete from tb_cart where userID = ${req.user.id};`
                db.query(sqlHistory, (err, results) => {
                    if (err) {
                        res.status(500).send(err)
                    }
                    // return res.status(200).send(results)
                    results.map((val) => {
                        let sqlUpdateStock = `update tb_stock set stock=stock-${val.qty} where id=${val.stockID};`
                        db.query(sqlUpdateStock, (err, resultsUpSt) => {
                            if (err) {
                                res.status(500).send(err)
                            }
                            console.log(resultsUpSt)
                        })
                    })
                })
                return res.status(200).send(results)
            });
        })
    },
    getTransaction: (req, res) => {
        let sql = ''
        if (req.user.role === 'admin') {
            sql = `SELECT t.*,u.username FROM tb_transactions t join tb_users u on t.userID = u.id`
        } else {
            sql = `SELECT t.*,u.username FROM tb_transactions t join tb_users u on t.userID = u.id where t.userID=${req.user.id}`
        }
        db.query(sql, (err, results) => {
            if (err) {
                console.log(res.status(500).send(err))
            }
            // console.log(req.user.username)
            // console.log(results)
            return res.status(200).send(results)
        });
    },
    getDetailTransaction: (req, res) => {
        let sql = ''
        if (req.user.role === 'admin') {
            sql = `select h.id,h.invoice,h.userID, u.username, p.name, p.imagepath, sz.size, p.price as productPrice,h.qty, h.price 
            from tb_transactions t join tb_history h on t.invoice = h.invoice 
            join tb_users u on h.userID = u.id
            join tb_products p on h.productID = p.id 
            join tb_stock st on st.id = h.stockID
            join tb_sizes sz on st.sizeID = sz.id;`
        } else {
            sql = `select h.id,h.invoice,h.userID, u.username, p.name, p.imagepath, sz.size, p.price as productPrice,h.qty, h.price 
            from tb_transactions t join tb_history h on t.invoice = h.invoice 
            join tb_users u on h.userID = u.id
            join tb_products p on h.productID = p.id 
            join tb_stock st on st.id = h.stockID
            join tb_sizes sz on st.sizeID = sz.id where h.userID=${req.user.id}`
        }
        db.query(sql, (err, results) => {
            if (err) {
                console.log(res.status(500).send(err))
            }
            // console.log(req.user.username)
            // console.log(results)
            return res.status(200).send(results)
        });
    },
    getStockUpdate: (req, res) => {
        let sql = `select (st.stock-c.qty) as newStock from tb_stock st join tb_cart c on c.productId = st.productID
        join tb_sizes sz on c.sizeID = sz.id and st.sizeID = c.sizeID where userID=${req.params.id}`
        db.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            var arr = []
            results.map((val) => {
                arr.push(val.newStock)
            })
            console.log(arr)
            let sql = `UPDATE tb_stock set?;`
            db.query(sql, [req.body.order], (err, results) => {
                if (err) {
                    return res.status(500).send(err)
                }
                return res.status(200).send(results)
            });
            return res.status(200).send(results)
        });
    },
    addTransferReceipt: (req, res) => {
        console.log('uploaderEdit')
        console.log(req.query.invoice)
        // console.log(req.files)
        try {
            const path = '/transfers'
            const upload = uploader(path, 'TF').fields([{ name: 'image' }])
            upload(req, res, (err) => {
                if (err) {
                    return res.status(500).send({ message: 'error' })
                }
                const { image } = req.files;
                console.log(image)
                // console.log('edit', req.body.data)
                const imagePath = image ? path + '/' + image[0].filename : null
                // data.imagepayment = imagePath
                let sql = `UPDATE tb_transactions SET imgpayment='${imagePath}' WHERE invoice = '${req.query.invoice}';`;
                db.query(sql, (err, results) => {
                    if (err) {
                        console.log(err)
                        fs.unlinkSync('./public' + imagePath)//delete file
                        return res.status(500).send({ message: 'error' })
                    }
                    return res.status(200).send(results)
                })
            })
        }
        catch (err) {
            return res.status(500).send({ message: 'error' })
        }
    },
    verifieTransaction: (req, res) => {
        console.log(req.body)
        let sql = `UPDATE tb_transactions SET status ='${req.body.status}' WHERE id = ${db.escape(req.query.id)};`;
        db.query(sql, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).send({ message: 'error' })
            }
            return res.status(200).send(results)
        })
    },
    updateStock: (req, res) => {
        console.log(req.body)
        let sql = `update tb_stock set stock=stock-1 where id=;`
        db.query(sql, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).send({ message: 'error' })
            }
            return res.status(200).send(results)
        })
    }
}