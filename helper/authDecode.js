//mendecode username dan password dari front end
//mengecek token benar atau tidak
//untuk dekrip
const jwt = require('jsonwebtoken')

module.exports = {
    auth: (req, res, next) => {
        if (req.method !== 'OPTIONS') {
            jwt.verify(req.token, 'uniqueKey', (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        message: "User Not Authorized"
                    })
                }
                req.user = decoded  // hasil decode dari token
                console.log(req.user)
                next()
            })
        } else {
            next()
        }
    }
}