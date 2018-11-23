const {ChatModel} = require('../db/models');
module.exports = function (server) {
    const io = require('socket.io')(server);

    io.on('connection', (socket) => {
        socket.on('sendMsg', ({from, to, content}) => {
            console.log('接收消息', {from, to, content});
            //保存消息
            const chatModel = new ChatModel({
                chat_id: [from, to].sort().join('_'),
                create_time: Date.now(),
                from,
                to,
                content
            });
            chatModel.save((err, chatMsg) => {
                console.log(chatMsg);
                //向所有连接上的客户端发消息
                io.emit('receiveMsg', chatMsg);
            })
        })
    })
};