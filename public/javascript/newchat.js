let mynickname;
$(document).ready( init => {
    
    M.AutoInit();

    let socket = io();
    
    socket.on('message', (message) => {
        if (message.name == 'system') {
            $(".view")[0].innerHTML += `<div class="information center"><span>${message.content}</span></div>`;
        } else if (message.name == mynickname) {
            $(".view")[0].innerHTML += `<div class="myself"><div class="profile"><i class="material-icons small blue-grey white-text">person</i></div><div class="content"><div id="name">${message.name}</div><div class="blue-grey-text" id="date">${new Date().getHours()}:${new Date().getMinutes()}</div><div id="message">${message.content}</div></div></div>`;
        } else {
            $(".view")[0].innerHTML += `<div class="someone"><div class="profile"><i class="material-icons small blue-grey white-text">person</i></div><div class="content"><div id="name">${message.name}</div><div class="blue-grey-text" id="date">${new Date().getHours()}:${new Date().getMinutes()}</div><div id="message">${message.content}</div></div></div>`;
            if (Notification.permission == 'default') {
                Notification.requestPermission();
            } else if (Notification.permission == 'granted') {
                let notification = new Notification(message.name, { body: message.content });
                setTimeout(notification.close.bind(notification), 4000);
            }
        }
        if (message.name != 'system') {
            let target;
            $(".face").each( (index, item) => {
                    console.log($(item).children("div").text());
                    console.log(message.name);
                if ($(item).children("div").text() == message.name) {
                    target = $(item).children("i");
                    return;
                }
            });
            $(target).attr("data-tooltip", message.content.replace(/(.{10})/g,"$1<br>"));
            var instances = M.Tooltip.init(target);
            instances[0].open();
            setTimeout(() => {
                instances[0].close();
                setTimeout(()=> {
                    instances[0].destroy()
                }, 500);
            }, 5000);
        }
        $(".view").eq(0).scrollTop($(".view")[0].scrollHeight);
    })
    socket.on('preview', (users) => {
        $(".preview").empty();
        for (let item of users) {
            $(".preview").append(`<div class="face"><i class="material-icons white tooltipped" data-position="top" data-tooltip="...">person</i><div class="white-text">${item}</div></div>`)
        }
    })
    socket.on('success', (nickname) => {
        mynickname = nickname;
    })

    socket.on('redirect', (url) => {
        location.href = url;
    })

    $("#send-field").submit( event => {
        event.preventDefault();
        socket.emit('broadcast', { name: mynickname, content: $("#input").val()});
        $("#input").val("");
    });

    $(window).bind("beforeunload", function (e){
        socket.emit("close", mynickname);
    });
});

