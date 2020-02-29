//sandi = wbistkitwtxcxyfr ======= email leadwear01@gmail.com
//nodemailer digunakan untuk memberikan verifikasi kepada user melalui password
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'leadwear01@gmail.com',
        pass: 'wbistkitwtxcxyfr'
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter;