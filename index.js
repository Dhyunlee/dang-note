const express = require('express');
const fs = require('fs');
const app = express();
const port = 5001;

app.use('/', express.static(__dirname + '/static'));

//기록한 거 저장
app.get('/save', function (req, res) {
  let filename = null;
  // console.log('req', req);
  res.setHeader('Access-Control-Allow-Origin', '*');

  filename = `${req.query.mode}_${req.query.date}`;
  // console.log('filename', filename);
  fs.writeFile(`./uploads/${filename}.txt`, `${req.query.value}`, err => {
    res.send({
      result: !err ? true : false,
    });
  });
});

//저장된 거 로딩
app.get('/load', function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // -> 브라우저에 리소스에 접근하는 임의의 출처로부터 요청 코드를 허용함
  let filename = `${req.query.mode}_${req.query.date}`;
  // console.log('filename', filename);
  fs.readFile(`./uploads/${filename}.txt`, (err, _res) => {
    if (err) {
      if (req.query.mode === 'text') {
        res.send({
          result: '',
        });
      } else {
        res.send({
          result: false,
        });
      }
    } else {
      if (req.query.mode === 'text') {
        res.send({
          result: _res.toString(),
        });
      } else {
        res.send({
          result: _res.toString() === 'true',
        });
      }
    }
  });
  return;
});

//데이터 출력
app.get('/getdata', function (req, res) {
  console.log('getdata_req', req.query.date);

  let data = {};
  let count = 0;
  let loop = 31;
  function checkcomplete() {
    count++;
    if (count === loop * 2) {
      //loop * 2 → 기록, 투약여부 (31 * 2 = 62)
      res.send(data);
    }
  }
  for (let i = 1; i <= loop; i++) {
    const text = `text_${req.query.date}_${i}`;
    const check = `check_${req.query.date}_${i}`;
    console.log('data', { text, check });

    data[`${req.query.date}_${i}`] = {};

    fs.readFile(`./uploads/${text}.txt`, (err, _res) => {
      // console.log(`${req.query.date}_${i}`);
      data[`${req.query.date}_${i}`].text = err ? '' : _res.toString();
      checkcomplete();
    });

    fs.readFile(`./uploads/${check}.txt`, (err, _res) => {
      data[`${req.query.date}_${i}`].check = err
        ? false
        : _res.toString() === 'true';
      checkcomplete();
    });
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});

if (0) {
  fetch('https://hyun.pw/')
    .then(res => res.json())
    .then(data => {
      console.log(data);
    });
}
