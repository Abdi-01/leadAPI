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
    getUserAmount: (req, res) => {
        let sql = `select count(id)-1 as userAmount from tb_users ;`
        db.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send(results)
        })
    },
    getPendingOrderAmount: (req, res) => {
        let sql = `select count(id) as pendingAmount from tb_transactions where status ='Unpaid';`
        db.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send(results)
        })
    },
    getSuccessOrderAmount: (req, res) => {
        let sql = `select count(id) as successAmount from tb_transactions where status ='Paid';`
        db.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send(results)
        })
    },
    getCategorySale: (req, res) => {
        let sql = `select c.category, sum(h.qty) as qty from tb_history h join tb_products p on p.id = h.productID
        join tb_productcat pc on pc.productID = p.id 
        join tb_categories c on c.id = pc.categoryID
        LEFT JOIN tb_categories cc ON cc.parentId = c.id
        WHERE cc.id IS NULL group by c.category;`
        db.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send(results)
        })
    },
}