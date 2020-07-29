module.exports = function (http) {
    const fs = require('fs');
    const io = require('socket.io')(http);
    const moment = require('moment');

    const users = new Map();
    const log_filename = moment().format('YYYY-MM-DD HH.mm.ss');

    const log = (data) => {
        const text = `[${moment().format('HH:mm:ss')}]${data}\n`;
        fs.appendFile('logs/'+log_filename+'.txt', text, (error) => {
            if (error) throw error;
        });
    }

    const list_update = () => {
        let members = "";
            users.forEach((value, key, MapObject) => members += value + ':');
            io.emit('list update', members);
    }

    io.on('connection', (socket) =>  {
        let address = socket.handshake.address;
        
        console.log('connected>' + address);
        if (users.has(address)) socket.emit('already');
        
        socket.on('login', (name) => {
            users.set(address, name);
            let message = `${name}님이 채팅방에 들어왔습니다.`;
            console.log(message);
            io.emit('server message', '알림', message);
            log(message);
        });

        socket.on('check', () => {
            if (!users.has(address)) socket.emit('not ready');
        });

        socket.on('chat message', (msg) => {
            if (users.get(address) == undefined) return; 
            let message = users.get(address) + ':' + msg;
            console.log(message);
            io.emit('server message', users.get(address), msg);
            log(message);
        });

        socket.on('leave', () => {
            if (users.get(address) == undefined) return;
            let message = users.get(address) + "님이 채팅방을 나갔습니다.";
            users.delete(address);
            console.log(message);
            io.emit('server message', '[알림]', message);
            log(message);
            list_update();
        })

        socket.on('disconnect', () => {
            console.log('disconnect>' + address);
        });

        socket.on('list update', () => list_update());
    });

    return io;
}