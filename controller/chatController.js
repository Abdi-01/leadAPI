module.exports = {
    getMessages: (req,res) => {
        res.status(200).send(req.app.arrMsg)
    },
    sendMessage: (req,res) => {
        req.app.arrMsg.push(req.body)
        req.app.io.emit('chat message', req.app.arrMsg)
        res.status(200).send({ message: 'Send Message Success'})
    },
    clearMessages: (req,res) => {
        req.app.arrMsg = []
        req.app.io.emit('chat message', req.app.arrMsg)
        res.status(200).send({ message: 'Clear Messages Success'})
    }
}