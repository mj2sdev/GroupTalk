const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
// const io = require('./my_modules/socket.js')(http);
const io = require('socket.io')(http);
const sessionMiddleware = session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }});
const PORT = process.env.PORT || 443;
const https = require('https');
const fs = require('fs');

const option = {
  cert: fs.readFileSync('ssl/certificate.crt'),
  key: fs.readFileSync('ssl/private.key'),
}

app.use(sessionMiddleware);
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});


let users = [];
// route
app.get('/', (req, res) => res.render('login'));

app.post('/login', (req, res) => {
    if (users.indexOf(req.body.nickname) != -1) {
        res.send('<script>alert("이미 사용중인 닉네임 입니다."); location.href = "/"; </script>');
    } else {
        req.session.nickname = req.body.nickname;
        res.redirect('/chat');
    }
});

app.get('/chat', (req, res) => {
    if (req.session.nickname === undefined) { res.redirect('/'); }
    res.render('newchat');
});



io.on('connection', (socket) => { 
    if (socket.request.session.nickname === undefined) {
        socket.emit('redirect', '/');
    }

    socket.emit('success', socket.request.session.nickname);
    if (users.indexOf(socket.request.session.nickname) == -1) {
        users.push(socket.request.session.nickname);
    }

    io.emit('preview', users);
    io.emit('message', { name:'system', content:`${socket.request.session.nickname}이(가) 접속했습니다.`});
    

    socket.on('broadcast', message => {
        io.emit('message', { name:message.name, content:message.content });
    });

    socket.on('close', nickname => {
        io.emit('message', { name: 'system', content: `${nickname}님이 나갔습니다.`});
    });
})

app.get('/*', (req, res) => res.render('PageNotFound'));

// server on
http.listen(3000, () => console.log('server on...'));
https.createServer(option, app).listen(443, () => {
  console.log('HTTPS Server Started');
})