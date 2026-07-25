import type { Course } from '../types'
import { buildLesson, buildUnit, type Card } from '../courseBuilder'

const greetings1: Card[] = [
  { kr: '안녕하세요', target: 'Здравствуйте', note: 'zdravstvuyte', tokens: ['Здравствуйте'] },
  { kr: '감사합니다', target: 'Спасибо', note: 'spasibo', tokens: ['Спасибо'] },
  { kr: '죄송합니다', target: 'Извините', note: 'izvinite', tokens: ['Извините'] },
  { kr: '네', target: 'Да', note: 'da', tokens: ['Да'] },
  { kr: '아니요', target: 'Нет', note: 'nyet', tokens: ['Нет'] },
]

const greetings2: Card[] = [
  { kr: '저는 한국에서 왔어요', target: 'Я из Кореи', note: 'ya iz karyei', tokens: ['Я', 'из', 'Кореи'] },
  { kr: '영어 할 줄 아세요?', target: 'Вы говорите по-английски?', note: 'vy gavaritye pa-angliyski?', tokens: ['Вы', 'говорите', 'по-английски?'] },
  { kr: '러시아어를 조금 해요', target: 'Я немного говорю по-русски', note: 'ya nimnoga gavaryu pa-ruski', tokens: ['Я', 'немного', 'говорю', 'по-русски'] },
  { kr: '다시 말씀해 주세요', target: 'Повторите, пожалуйста', note: 'paftaritye, pazhalusta', tokens: ['Повторите,', 'пожалуйста'] },
  { kr: '천천히 말씀해 주세요', target: 'Говорите медленнее, пожалуйста', note: 'gavaritye myedlyennyeye, pazhalusta', tokens: ['Говорите', 'медленнее,', 'пожалуйста'] },
]

const airport1: Card[] = [
  { kr: '공항이 어디예요?', target: 'Где аэропорт?', note: 'gdye aeraport?', tokens: ['Где', 'аэропорт?'] },
  { kr: '제 여권입니다', target: 'Вот мой паспорт', note: 'vot moy paspart', tokens: ['Вот', 'мой', 'паспорт'] },
  { kr: '짐은 어디서 찾나요?', target: 'Где получить багаж?', note: 'gdye paluchit bagazh?', tokens: ['Где', 'получить', 'багаж?'] },
  { kr: '탑승구가 어디예요?', target: 'Где выход на посадку?', note: 'gdye vykhad na pasadku?', tokens: ['Где', 'выход', 'на', 'посадку?'] },
  { kr: '환전할 수 있나요?', target: 'Могу я обменять деньги?', note: 'magu ya abmyenyat dyengi?', tokens: ['Могу', 'я', 'обменять', 'деньги?'] },
]

const airport2: Card[] = [
  { kr: '택시를 불러주세요', target: 'Вызовите такси, пожалуйста', note: 'vyzavitye taksi, pazhalusta', tokens: ['Вызовите', 'такси,', 'пожалуйста'] },
  { kr: '이 버스는 시내로 가나요?', target: 'Этот автобус едет в центр?', note: 'etat aftobus yedyet f tsentr?', tokens: ['Этот', 'автобус', 'едет', 'в', 'центр?'] },
  { kr: '표는 얼마예요?', target: 'Сколько стоит билет?', note: 'skolka stoit bilyet?', tokens: ['Сколько', 'стоит', 'билет?'] },
  { kr: '심카드는 어디서 사요?', target: 'Где купить сим-карту?', note: 'gdye kupit sim-kartu?', tokens: ['Где', 'купить', 'сим-карту?'] },
  { kr: '화장실이 어디예요?', target: 'Где туалет?', note: 'gdye tualyet?', tokens: ['Где', 'туалет?'] },
]

const car1: Card[] = [
  { kr: '차를 렌트하고 싶어요', target: 'Я хочу арендовать машину', note: 'ya khachu aryendavat mashinu', tokens: ['Я', 'хочу', 'арендовать', 'машину'] },
  { kr: '예약했습니다', target: 'У меня есть бронь', note: 'u minya yest bron', tokens: ['У', 'меня', 'есть', 'бронь'] },
  { kr: '국제 운전면허증이 있어요', target: 'У меня есть международные права', note: 'u minya yest myezhdunarodnyye prava', tokens: ['У', 'меня', 'есть', 'международные', 'права'] },
  { kr: '보험을 포함해 주세요', target: 'Включите страховку, пожалуйста', note: 'fklyuchitye strakhofku, pazhalusta', tokens: ['Включите', 'страховку,', 'пожалуйста'] },
  { kr: '기름은 어디서 넣나요?', target: 'Где заправить машину?', note: 'gdye zapravit mashinu?', tokens: ['Где', 'заправить', 'машину?'] },
]

const car2: Card[] = [
  { kr: '주유소가 어디예요?', target: 'Где заправка?', note: 'gdye zapravka?', tokens: ['Где', 'заправка?'] },
  { kr: '이 길이 맞나요?', target: 'Это правильная дорога?', note: 'eta pravilnaya daroga?', tokens: ['Это', 'правильная', 'дорога?'] },
  { kr: '직진하세요', target: 'Езжайте прямо', note: 'yezzhaytye pryama', tokens: ['Езжайте', 'прямо'] },
  { kr: '왼쪽으로 도세요', target: 'Поверните налево', note: 'pavyernitye nalyeva', tokens: ['Поверните', 'налево'] },
  { kr: '여기 주차할 수 있나요?', target: 'Можно здесь припарковаться?', note: 'mozhna zdyes pripmarkavatsa?', tokens: ['Можно', 'здесь', 'припарковаться?'] },
]

const food1: Card[] = [
  { kr: '두 명이에요', target: 'Столик на двоих', note: 'stolik na dvaikh', tokens: ['Столик', 'на', 'двоих'] },
  { kr: '메뉴판 좀 주세요', target: 'Меню, пожалуйста', note: 'myenyu, pazhalusta', tokens: ['Меню,', 'пожалуйста'] },
  { kr: '이거 주세요', target: 'Я возьму это', note: 'ya vazmu eta', tokens: ['Я', 'возьму', 'это'] },
  { kr: '맛있어요', target: 'Это вкусно', note: 'eta fkusna', tokens: ['Это', 'вкусно'] },
  { kr: '계산해 주세요', target: 'Счёт, пожалуйста', note: 'shchot, pazhalusta', tokens: ['Счёт,', 'пожалуйста'] },
]

const food2: Card[] = [
  { kr: '물 좀 주세요', target: 'Воды, пожалуйста', note: 'vady, pazhalusta', tokens: ['Воды,', 'пожалуйста'] },
  { kr: '매운 음식을 못 먹어요', target: 'Я не ем острое', note: 'ya nye yem ostraye', tokens: ['Я', 'не', 'ем', 'острое'] },
  { kr: '추천 메뉴가 뭐예요?', target: 'Что вы порекомендуете?', note: 'shto vy parikamyenduyetye?', tokens: ['Что', 'вы', 'порекомендуете?'] },
  { kr: '채식 메뉴가 있나요?', target: 'Есть вегетарианское меню?', note: 'yest vyegyetarianskaye myenyu?', tokens: ['Есть', 'вегетарианское', 'меню?'] },
  { kr: '포장 가능한가요?', target: 'Можно на вынос?', note: 'mozhna na vynas?', tokens: ['Можно', 'на', 'вынос?'] },
]

const local1: Card[] = [
  { kr: '이거 얼마예요?', target: 'Сколько это стоит?', note: 'skolka eta stoit?', tokens: ['Сколько', 'это', 'стоит?'] },
  { kr: '너무 비싸요', target: 'Это слишком дорого', note: 'eta slishkam doraga', tokens: ['Это', 'слишком', 'дорого'] },
  { kr: '조금 깎아주세요', target: 'Сделайте скидку, пожалуйста', note: 'sdyelaytye skidku, pazhalusta', tokens: ['Сделайте', 'скидку,', 'пожалуйста'] },
  { kr: '카드로 결제할 수 있나요?', target: 'Можно оплатить картой?', note: 'mozhna aplatit kartay?', tokens: ['Можно', 'оплатить', 'картой?'] },
  { kr: '환전소가 어디예요?', target: 'Где обменник?', note: 'gdye abmyennik?', tokens: ['Где', 'обменник?'] },
]

const local2: Card[] = [
  { kr: '도와주세요', target: 'Помогите, пожалуйста', note: 'pamagitye, pazhalusta', tokens: ['Помогите,', 'пожалуйста'] },
  { kr: '길을 찾도록 도와주세요', target: 'Помогите найти дорогу', note: 'pamagitye nayti darogu', tokens: ['Помогите', 'найти', 'дорогу'] },
  { kr: '병원이 어디예요?', target: 'Где больница?', note: 'gdye balnitsa?', tokens: ['Где', 'больница?'] },
  { kr: '경찰을 불러주세요', target: 'Вызовите полицию', note: 'vyzavitye palitsiyu', tokens: ['Вызовите', 'полицию'] },
  { kr: '와이파이 비밀번호가 뭐예요?', target: 'Какой пароль от Wi-Fi?', note: 'kakoy paral at Wi-Fi?', tokens: ['Какой', 'пароль', 'от', 'Wi-Fi?'] },
]

export const ruCourse: Course = {
  id: 'ru',
  title: '러시아어',
  flag: '🇰🇿',
  tagline: '알마티 여행을 위한 러시아어',
  color: 'violet',
  speechLang: 'ru-RU',
  units: [
    buildUnit('ru-u1', '인사 & 기본 표현', '기본 인사말과 의사소통 표현을 배워요', '🙏', [
      buildLesson('ru-u1-l1', '기본 인사', greetings1),
      buildLesson('ru-u1-l2', '자기소개', greetings2),
    ]),
    buildUnit('ru-u2', '공항', '알마티 공항 도착부터 이동까지', '✈️', [
      buildLesson('ru-u2-l1', '공항에서', airport1),
      buildLesson('ru-u2-l2', '시내 이동', airport2),
    ]),
    buildUnit('ru-u3', '렌터카 & 도로', '차량 렌트부터 운전까지', '🚗', [
      buildLesson('ru-u3-l1', '렌터카 예약하기', car1),
      buildLesson('ru-u3-l2', '주유 & 길 위에서', car2),
    ]),
    buildUnit('ru-u4', '식당 & 음식', '주문부터 계산까지', '🍽️', [
      buildLesson('ru-u4-l1', '식당에서 주문하기', food1),
      buildLesson('ru-u4-l2', '취향과 계산', food2),
    ]),
    buildUnit('ru-u5', '현지 필수 표현', '시장, 환전, 도움 요청까지', '🧭', [
      buildLesson('ru-u5-l1', '시장 & 환전', local1),
      buildLesson('ru-u5-l2', '도움 요청하기', local2),
    ]),
  ],
}
