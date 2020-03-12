const db = require('../database');
const { uploader } = require('../helper/uploader');
const fs = require('fs');

module.exports = {
    uploadProduct: (req, res) => {
        console.log('uploader')
        console.log(req.files)
        try {
            const path = '/images'
            const upload = uploader(path, 'IMG').fields([{ name: 'image' }])
            upload(req, res, (err) => {
                if (err) {
                    return res.status(500).send({ message: 'error' })
                }
                const { image } = req.files;
                console.log(image)
                const imagePath = image ? path + '/' + image[0].filename : null
                console.log('add', req.body.data)
                const data = JSON.parse(req.body.data)
                let dataNew = {
                    name: data.name,
                    imagepath: imagePath,
                    materialID: data.materialID,
                    description: data.description,
                    price: data.price
                }
                // data.imagepath = imagePath
                let sql = 'insert into tb_products set ?';
                db.query(sql, dataNew, (err, results) => {
                    if (err) {
                        console.log(err)
                        fs.unlinkSync('./public' + imagePath)//delete file
                        return res.status(500).send({ message: 'error' })
                    }
                    console.log(results.insertId)
                    let sqlAddCategory = `WITH RECURSIVE category_path (id, category, parentId) AS
                    ( SELECT id, category, parentId FROM tb_categories
                      WHERE id = ${data.categoryID} -- child node, id category paling child
                      UNION ALL
                      SELECT c.id, c.category, c.parentid
                      FROM category_path AS cp JOIN tb_categories AS c
                    ON cp.parentId = c.id
                    )
                    SELECT * FROM category_path;`
                    db.query(sqlAddCategory, (err, resultsAddCategory) => {
                        if (err) {
                            res.status(500).send(err)
                        }
                        var arr = []
                        resultsAddCategory.map((val) => {
                            arr.push([results.insertId, val.id])
                        })
                        console.log(arr)
                        let sqlProCat = `INSERT INTO tb_productcat (productID,categoryID) values ?;`
                        db.query(sqlProCat, [arr], (errProCat, resultsProCat) => {
                            if (errProCat) {
                                return res.status(500).send(errProCat)
                            }
                            console.log(resultsProCat)
                            // return res.status(200).send(results)
                        });

                        return res.status(200).send(resultsAddCategory)
                    });
                    // return res.status(200).send(results)
                })
            })
        }
        catch (err) {
            return res.status(500).send({ message: 'error' })
        }
    },
    addStock: (req, res) => {
        console.log(req.body.productID)
        console.log(req.body.stock)
        let sql = `INSERT INTO tb_stock (productID,sizeID,stock) values ?;`
        db.query(sql, [req.body.stock], (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send(results)
        });
    },
    getStock: (req, res) => {
        console.log(req.query)
        let sql = `select p.id,sz.size,s.stock from tb_products p join tb_stock s
        join tb_sizes sz on p.id=s.productID
        and sz.id=s.sizeID ;`
        db.query(sql, (err, results) => {
            if (err) {
                console.log(res.status(500).send(err))
            }
            return res.status(200).send(results)
        });
    },
    getStockDetail: (req, res) => {
        console.log(req.query)
        let sql = `select p.id, sz.id as sizeID, sz.size, s.stock from tb_products p join tb_stock s
        join tb_sizes sz on p.id=s.productID
        and sz.id=s.sizeID where p.id=${req.params.id};`
        db.query(sql, (err, results) => {
            if (err) {
                console.log(res.status(500).send(err))
            }
            return res.status(200).send(results)
        });
    },
    getAllProduct: (req, res) => {
        // console.log(req.query)
        let sql = ''
        if (req.query.category === 'All') {
            sql = `select  p.id, p.name,p.imagepath,m.material,p.description,p.price
            from tb_products p join tb_materials m
            on p.materialID = m.id;`
        } else {
            sql = `select  p.id, p.name,p.imagepath,m.material,p.description,p.price,
            c.category from tb_products p join tb_materials m
            on p.materialID = m.id join tb_productcat pc on p.id=pc.productID
            join tb_categories c on c.id = pc.categoryID where c.category = '${req.query.category}';`
        }
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            return res.status(200).send(results)
        });
    },
    getProductWithLimit: (req, res) => {
        let sql = `select  p.id, p.name,p.imagepath,m.material,p.description,p.price
        from tb_products p join tb_materials m
        on p.materialID = m.id LIMIT ${req.params.start},5;`
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            return res.status(200).send(results)
        });

    },
    getAllSize: (req, res) => {
        console.log(req.query)
        let sql = `SELECT * FROM tb_sizes;`
        db.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send(results)
        });
    },
    getAllMaterial: (req, res) => {
        console.log(req.query)
        let sql = `SELECT * FROM tb_materials;`
        db.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send(results)
        });
    },
    getCategories: (req, res) => {
        let sql = `SELECT c.id, c.category 
        FROM tb_categories c 
        LEFT JOIN tb_categories cc ON cc.parentId = c.id
        WHERE cc.id IS NULL;`
        db.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send(results)
        });
    },
    addCategories: (req, res) => {
        console.log(req.query)
        let sql = `WITH RECURSIVE category_path (id, category, parentId) AS
        (
          SELECT id, category, parentId
            FROM tb_categories
            WHERE id = ${req.params.id} -- child node, id category paling child
          UNION ALL
          SELECT c.id, c.category, c.parentid
            FROM category_path AS cp JOIN tb_categories AS c
              ON cp.parentId = c.id
        )
        SELECT * FROM category_path;`
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            var arr = []
            results.map((val) => {
                arr.push([1, val.id])
            })
            console.log(arr)
            let sqlC = `INSERT INTO tb_productcat (productID,categoryID) values ?;`
            db.query(sqlC, [arr], (errC, resultsC) => {
                if (errC) {
                    return res.status(500).send(errC)
                }
                console.log(resultsC)
                // return res.status(200).send(results)
            });

            return res.status(200).send(results)
        });
    },
    deleteProduct: (req, res) => {
        0
        console.log(req.query)
        let sql = `delete from tb_products where id =${req.query.id} and imagepath='${req.query.imagepath}';`
        db.query(sql, (err, results) => {
            if (err) {
                res.send(err)
            }
            fs.unlinkSync('./public' + req.query.imagepath)
            return res.status(200).send(results)
        })
    },
    getProductById: (req, res) => {
        let sql = `select  p.id, p.name,p.imagepath,m.material,p.description,p.price
        from tb_products p join tb_materials m
        on p.materialID = m.id where p.id=${req.params.id};`
        db.query(sql, (err, results) => {//data gagal akan masuk err, kalo benar masuk results
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send(results)
        })
    },
    editProduct: (req, res) => {
        console.log('uploaderEdit')
        console.log(req.files)
        try {
            const path = '/images'
            const upload = uploader(path, 'IMG').fields([{ name: 'image' }])
            upload(req, res, (err) => {
                if (err) {
                    return res.status(500).send({ message: 'error' })
                }
                const { image } = req.files;
                console.log(image)
                console.log('edit', req.body.data)
                const data = JSON.parse(req.body.data)
                let sql = `UPDATE tb_products SET ? WHERE id = ${req.query.id};`;
                if (image === undefined) {
                    db.query(sql, data, (err, results) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).send({ message: 'error' })
                        }
                        return res.status(200).send(results)
                    })
                } else {
                    let sqlget = `SELECT * FROM tb_products where id =${req.query.id};`
                    db.query(sqlget, (errGet, resultsGet) => {//data gagal akan masuk err, kalo benar masuk results
                        if (errGet) {
                            res.status(500).send(errGet)
                        }
                        else if (resultsGet !== 0) {
                            let oldImage = resultsGet[0].imagepath
                            console.log(oldImage)
                            const imagePath = image ? path + '/' + image[0].filename : null
                            data.imagepath = imagePath
                            db.query(sql, data, (err, results) => {
                                if (err) {
                                    console.log(err)
                                    fs.unlinkSync('./public' + imagePath)//delete file
                                    return res.status(500).send({ message: 'error' })
                                }
                                if (image) {
                                    fs.unlinkSync('./public' + oldImage)//delete file
                                }
                                return res.status(200).send(results)
                            })
                        }
                    })
                }
            })
        }
        catch (err) {
            return res.status(500).send({ message: 'error' })
        }
    }
}
