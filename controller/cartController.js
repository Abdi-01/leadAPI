const db = require('../database')
const { uploader } = require('../helper/uploader');
const fs = require('fs');
module.exports = {
    addToCart: (req, res) => {
        let sqlInsert = `INSERT INTO tb_cart (id,userID,productID,stockID,qty,price) values ?
        on duplicate key update qty=values(qty),price=values(price)
        ;`
        db.query(sqlInsert, [req.body.order], (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).send(err)
            }
            return res.status(200).send(results)
        });

    },
    getCart: (req, res) => {
        let sql = `select c.id,c.userID, u.username, c.productID, c.stockID,p.name, p.imagepath, sz.size, p.price as productPrice,c.qty, c.price from tb_cart c join tb_users u on c.userID = u.id
        join tb_products p on c.productID = p.id 
        join tb_stock st on st.id = c.stockID 
        join tb_sizes sz on sz.id = st.sizeID where u.id = ${req.user.id};`
        db.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send(results)
        });
    },
    checkoutCart: (req, res) => {
        // console.log(req.query)
        let sqlMove = `INSERT INTO tb_history SELECT * FROM tb_cart WHERE userID = ${req.params.id};`
        db.query(sqlMove, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            let sqlClear = `delete from tb_cart where userID = ${req.params.id};`
            db.query(sqlClear, (err, results) => {
                if (err) {
                    res.send(err)
                }
            })
            return res.status(200).send(results)
        });
    },
    deleteCart: (req, res) => {
        let sqlClear = `delete from tb_cart where id = ${req.params.id};`
        db.query(sqlClear, (err, results) => {
            if (err) {
                res.send(err)
            }
            return res.status(200).send(results)
        })
    },
    deleteCustomOrder: (req, res) => {
        let sqlClear = `delete from tb_custom where id = ${req.params.id};`
        db.query(sqlClear, (err, results) => {
            if (err) {
                res.send(err)
            }
            return res.status(200).send(results)
        })
    },
    customOrder: (req, res) => {
        // console.log('uploader')
        // console.log(req.files)
        try {
            const path = '/customOrder'
            const upload = uploader(path, 'IMG').fields([{ name: 'image' }])
            upload(req, res, (err) => {
                if (err) {
                    return res.status(500).send({ message: 'error' })
                }
                const { image } = req.files;
                console.log(image)
                const imagePath = image ? path + '/' + image[0].filename : null
                // console.log('customOrder', req.body.data)
                const data = JSON.parse(req.body.data)
                data.imagepath = imagePath

                let sql = `INSERT INTO tb_custom set ?;`
                db.query(sql, data, (err, results) => {
                    if (err) {
                        console.log(err)
                        fs.unlinkSync('./public' + imagePath)//delete file
                        return res.status(500).send({ message: 'error' })
                    }
                    // console.log(results.insertId)
                    return res.status(200).send(results)
                })
            })
        }
        catch (err) {
            console.log(err)
            return res.status(500).send({ message: 'error' })
        }
    },
    getCustomOrder: (req, res) => {
        let sql = `select * from tb_custom where userID = ${req.user.id};`
        db.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send(results)
        });
    },
}