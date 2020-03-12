const db = require('../database')

module.exports = {
    addToCart: (req, res) => {
        let sql = `INSERT INTO tb_cart (userID,productID,stockID,qty,price) values ?;`
        db.query(sql, [req.body.order], (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send(results)
        });

    },
    getCart: (req, res) => {
        let sql = `select c.id,c.userID, u.username, p.name, p.imagepath, sz.size, p.price as productPrice,c.qty, c.price from tb_cart c join tb_users u on c.userID = u.id
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
        console.log(req.query)
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
    }
}