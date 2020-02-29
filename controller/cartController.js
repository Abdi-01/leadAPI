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
        let sql = `select c.id,c.userID,s.username, p.name, p.imagepath, sz.size, c.qty, c.price 
        from tb_users s join tb_cart c join tb_products p 
        on s.id = c.userID and p.id = c.productID 
        join tb_sizes sz join tb_stock st 
        on sz.id = st.sizeID and c.id = st.id where s.id = ${req.params.id};`
        db.query(sql, (err, results) => {
            if (err) {
                console.log(res.status(500).send(err))
            }
            res.status(200).send(results)
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