window.onload = () => {
    const socket = io();
    const form = document.querySelector('#form');
    const view = document.querySelector('#view');
    const message = document.querySelector('#message');

    message.focus();
    socket.emit('check');
    socket.emit('list update');

    form.addEventListener('submit', (event) => {
        socket.emit('check');
        event.preventDefault();
        if (message.value == "") return false;
        socket.emit('chat message', message.value);
        message.focus();
        message.value = "";
        view.scrollTop = view.scrollHeight;
    });

    socket.on('server message', (Name, message) => {
        const date = new Date();
        // message = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]${name}:${message}`;
        const msg = `[${Name}] ${message}\n`;
        view.append(msg);
        view.scrollTop = view.scrollHeight;
        // console.log(Name);
        // console.log(message);
        
        // const view2 = document.querySelector('#view2');
        // const box = document.createElement('div');
        // const name = document.createElement('h5');
        // const content = document.createElement('p');
        
        // name.appendChild(document.createTextNode(Name));
        // name.className = ('name');

        // content.appendChild(document.createTextNode(message));
        // content.className = ('content');

        // box.className = ('box');
        // box.appendChild(name);
        // box.appendChild(content);
        // view2.appendChild(box);
    })

    socket.on('not ready', () => {
        window.location.assign('/');
    })

    socket.on('list update', (list) => {
        const member = document.querySelector('#member');
        while(member.firstChild) member.removeChild(member.lastChild);
        let string = list.split(':');
        string.forEach((mem) => {
            member.appendChild(document.createTextNode(mem));
            member.appendChild(document.createElement('br'));
        })
    })

    window.onbeforeunload = () => {
        socket.emit('leave');
    }
}