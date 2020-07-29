const fs = require('fs');

fs.readFile('text.txt', 'utf8', (err, data) => {
    console.log(data);
    console.log(err);
})


let data = 'hello filesystem\n';

fs.appendFile('logs/text.txt', data, 'utf8', (err) => {
    console.log('비동기 파일 쓰기 완료');
    console.log(err);
})