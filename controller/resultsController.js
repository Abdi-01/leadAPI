const db = require('../database');

module.exports = {
    getBestSaler: (req, res) => {
        let sql = `select h.invoice,p.*,m.material,sum(h.qty) as saleAmount from tb_history h 
        join tb_products p on p.id = h.productID join tb_materials m
        on p.materialID = m.id group by productID LIMIT 3;`
        db.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send(results)
        })
    },
    getSalesAmount: (req, res) => {
        let sql = `select sum(payment) as salesAmount from tb_transactions ;`
        db.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send(results)
        })
    },
}