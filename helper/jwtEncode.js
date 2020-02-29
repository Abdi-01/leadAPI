//untuk generate token baru
//untuk encrip

const jwt = require('jsonwebtoken')

module.exports = {
    createJWTToken: (payload) => {
        return jwt.sign(payload, 'uniqueKey', {//payload = data yang akan di enkrip, uniqueKey = kunci dari data
            expiresIn: '12h'
        })
    }
}