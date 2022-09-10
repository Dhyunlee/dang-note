const url = 'http://localhost:5001';
const buildedUrl = 'https://hyun.pw';

import isDate from './util/isDate.js';

let elements = {};
let months;
let days;

//current date
function dailyInfo() {
  const today = new Date();
  const YY = today.getFullYear();
  const MM = today.getMonth() + 1;
  const DD = today.getDate();

  const current_date = {};
  current_date.year = YY;
  current_date.month = MM;
  current_date.day = DD;
  return current_date;
}

//두자리이하 값 처리
function makeNumberTwo(num) {
  //월이 10이하이면 0추가
  let zero = `${num}`.length < 2 && '0';
  // A && B → A 가 false이면 B 를 반환
  // 불린값을 숫자와 더하면 0(false) 또는 1(true)로 변함
  return zero + num;
}

//---

// header title 생성하는 함수 정의 (ex_ 2021년 07월)
function makeMonthTable(year, month) {
  months = makeNumberTwo(month);
  elements.days.innerHTML = '';
  elements.monthlabel.innerText = `${year}년 ${months}월`;
  let today = 31;
  for (let i = 0; i < today; i++) {
    let day = today - i;
    days = makeNumberTwo(day);
    if (!isDate(`${year}${months}${days}`)) {
      makeDayline(year, month, day);
    }
  }
}

// dayline contents 생성하는 함수 정의
function makeDayline(year, month, day) {
  let is_today = false;

  if (
    dailyInfo().year === year &&
    dailyInfo().month === month &&
    dailyInfo().day === day
  ) {
    is_today = true;
  }
  let reqday = `${year}${makeNumberTwo(month)}${makeNumberTwo(day)}`;

  let todayy = `${dailyInfo().year}${makeNumberTwo(
    dailyInfo().month,
  )}${makeNumberTwo(dailyInfo().day)}`;
  //   console.log(reqday, todayy, todayy < reqday);

  if (todayy < reqday) {
    return; //내일 날짜는 출력안되게
  }
  let line = document.createElement('div');
  line.classList.add('dayline');
  if (is_today) {
    line.classList.add('today'); //오늘 날짜면 today 클래스명 추가
  }
  line.innerHTML = `
    ${days}일 혈당 <input type="text" name="text"/> 투약 <input type="checkbox" name="checkbox"/>
  `;
  elements.days.appendChild(line);

  // 데이터 전송
  let inputs = line.querySelectorAll('input');
  console.log(inputs[0]);
  // keyup, chave 이벤트가 발생할 때 서버측에 요청
  // 여기서는 get방식으로 요청(이걸 post방식으로 변경)

  //input[type=text]
  inputs[0].addEventListener('keyup', function () {
    console.log('keyup 이벤트 동작');
    fetch(
      `${url}/save?date=` +
        `${year}_${month}_${day}` +
        '&mode=text&value=' +
        inputs[0].value,
    )
      .then(res => res.json())
      .then(data => {
        console.log('저장됨', data);
      });
  });

  //input[type=check]
  inputs[1].addEventListener('change', function () {
    let value = inputs[1].checked ? 'true' : '';
    fetch(
      `${url}/save?date=` +
        `${year}_${month}_${day}` +
        '&mode=check&value=' +
        value,
    )
      .then(res => res.json())
      .then(data => {
        console.log('저장됨', data);
      });
  });

  //input[type=text]
  let countFetch = 0;
  fetch(`${url}/load?date=` + `${year}_${month}_${day}` + '&mode=text')
    .then(res => res.json())
    .then(data => {
      console.log(data.result);
      inputs[0].value = data.result;
    });

  //input[type=check]
  fetch(`${url}/load?date=` + `${year}_${month}_${day}` + '&mode=check')
    .then(res => res.json())
    .then(data => {
      inputs[1].checked = data.result;
    });
}

let date_cursor = dailyInfo();
delete date_cursor.day;
//year, month 속성만 사용하므로
//day 속성은 삭제(안해도 되지만 불필요한 데이터이므로)

// 이전달 버튼 이벤트처리
const preMonth = () => {
  date_cursor.month--;
  if (date_cursor.month < 1) {
    date_cursor.month = 12;
    // 이전달 12월은 0으로 표시되므로 12로 저장
    date_cursor.year--;
    // 이전년도로 넘어가므로 년도수도 하나 감소
  }
  makeMonthTable(date_cursor.year, date_cursor.month);
};

const nextMonth = () => {
  let reqday = `${date_cursor.year}${makeNumberTwo(date_cursor.month)}`;
  let todayy = `${dailyInfo().year}${makeNumberTwo(dailyInfo().month)}`;
  if (reqday >= todayy) {
    //이전일이 금(오늘)일보다 크거나 같다면
    return;
  }
  date_cursor.month++;
  if (date_cursor.month > 12) {
    console.log(date_cursor.month);
    date_cursor.month = 1;
    // 다음달 1월이 13월로 표시되므로 1로 저장
    date_cursor.year++;
    // 다음년도로 넘어가므로 년도수도 하나 증가
  }
  makeMonthTable(date_cursor.year, date_cursor.month);
};

// rendering
window.addEventListener('load', e => {
  elements.days = document.querySelector('#days');
  elements.monthlabel = document.querySelector('#monthlabel');
  elements.prevbtn = document.querySelector('.prevbtn');
  elements.nextbtn = document.querySelector('.nextbtn');

  // 다음달 버튼 이벤트처리
  elements.prevbtn.addEventListener('click', preMonth);
  elements.nextbtn.addEventListener('click', nextMonth);

  makeMonthTable(dailyInfo().year, dailyInfo().month);
});
