//날짜 출력 처리 함수
export default function isDate(yyyymmdd) {
  /* 
       input 값
       → yyyymmdd, yyyy-mm-dd, yyyy/mm/dd 이러한 형식으로 작성
  
       output 
      → 0: 정상, 
        1: 해당월의 날짜 넘음, 
        2: 존재하지 않는 달, 
        3: 포맷 안맞음, 
        4: -인 날짜(?) 
    */
  let y, m, d;
  if (yyyymmdd.length == 8) {
    if (!yyyymmdd.match(/[0-9]{8}/g)) return 3;

    y = yyyymmdd.substring(0, 4);
    m = yyyymmdd.substring(4, 6);
    d = yyyymmdd.substring(6, 8);
  } else if (yyyymmdd.length == 10) {
    if (!yyyymmdd.match(/[0-9]{4}[-/][0-9]{2}[-/][0-9]{2}/g)) return 3;

    y = yyyymmdd.split('-')[0];
    m = yyyymmdd.split('-')[1];
    d = yyyymmdd.split('-')[2];
  } else {
    return 3;
  }

  let limit_day;
  switch (Number(m)) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      limit_day = 31;
      break;
    case 2:
      if ((y - 2008) % 4 == 0) limit_day = 29;
      else limit_day = 28;
      break;
    case 4:
    case 6:
    case 9:
    case 11:
      limit_day = 30;
      break;
    default:
      return 2;
  }
  if (Number(d) > limit_day) {
    return 1;
  }
  if (Number(d) < 1) {
    return 4;
  }
  return 0;
}
