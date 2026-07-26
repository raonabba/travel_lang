import type { Course, DialogueScenario } from '../types'
import { buildLesson, buildUnit, type Card } from '../courseBuilder'

const greetings1: Card[] = [
  { kr: '안녕하세요', target: 'Здравствуйте', note: 'zdravstvuyte', krPronunciation: '즈드라스트부이쩨', tokens: [{ text: 'Здравствуйте', gloss: '안녕하세요' }] },
  { kr: '감사합니다', target: 'Спасибо', note: 'spasibo', krPronunciation: '스빠시바', tokens: [{ text: 'Спасибо', gloss: '감사합니다' }] },
  { kr: '죄송합니다', target: 'Извините', note: 'izvinite', krPronunciation: '이즈비니쩨', tokens: [{ text: 'Извините', gloss: '죄송합니다' }] },
  { kr: '네', target: 'Да', note: 'da', krPronunciation: '다', tokens: [{ text: 'Да', gloss: '네' }] },
  { kr: '아니요', target: 'Нет', note: 'nyet', krPronunciation: '니옛', tokens: [{ text: 'Нет', gloss: '아니요' }] },
]

const greetings2: Card[] = [
  { kr: '저는 한국에서 왔어요', target: 'Я из Кореи', note: 'ya iz karyei', krPronunciation: '야 이즈 까례이', tokens: [{ text: 'Я', gloss: '저는' }, { text: 'из', gloss: '~에서' }, { text: 'Кореи', gloss: '한국' }] },
  { kr: '영어 할 줄 아세요?', target: 'Вы говорите по-английски?', note: 'vy gavaritye pa-angliyski?', krPronunciation: '브이 가바리쩨 빠안글리스키?', tokens: [{ text: 'Вы', gloss: '당신은' }, { text: 'говорите', gloss: '말하다' }, { text: 'по-английски?', gloss: '영어로?' }] },
  { kr: '러시아어를 조금 해요', target: 'Я немного говорю по-русски', note: 'ya nimnoga gavaryu pa-ruski', krPronunciation: '야 니므노가 가바류 빠루스키', tokens: [{ text: 'Я', gloss: '저는' }, { text: 'немного', gloss: '조금' }, { text: 'говорю', gloss: '말해요' }, { text: 'по-русски', gloss: '러시아어로' }] },
  { kr: '다시 말씀해 주세요', target: 'Повторите, пожалуйста', note: 'paftaritye, pazhalusta', krPronunciation: '빠프따리쩨, 빠잘루스따', tokens: [{ text: 'Повторите,', gloss: '반복해주세요,' }, { text: 'пожалуйста', gloss: '부탁합니다' }] },
  { kr: '천천히 말씀해 주세요', target: 'Говорите медленнее, пожалуйста', note: 'gavaritye myedlyennyeye, pazhalusta', krPronunciation: '가바리쩨 미들롄니예, 빠잘루스따', tokens: [{ text: 'Говорите', gloss: '말해주세요' }, { text: 'медленнее,', gloss: '더 천천히,' }, { text: 'пожалуйста', gloss: '부탁합니다' }] },
]

const airport1: Card[] = [
  { kr: '공항이 어디예요?', target: 'Где аэропорт?', note: 'gdye aeraport?', krPronunciation: '그졔 아에라뽀르뜨?', tokens: [{ text: 'Где', gloss: '어디에' }, { text: 'аэропорт?', gloss: '공항이?' }] },
  { kr: '제 여권입니다', target: 'Вот мой паспорт', note: 'vot moy paspart', krPronunciation: '봇 모이 빠스빠르뜨', tokens: [{ text: 'Вот', gloss: '여기' }, { text: 'мой', gloss: '제' }, { text: 'паспорт', gloss: '여권입니다' }] },
  { kr: '짐은 어디서 찾나요?', target: 'Где получить багаж?', note: 'gdye paluchit bagazh?', krPronunciation: '그졔 빨루치찌 바가쥐?', tokens: [{ text: 'Где', gloss: '어디서' }, { text: 'получить', gloss: '찾다' }, { text: 'багаж?', gloss: '짐을?' }] },
  { kr: '탑승구가 어디예요?', target: 'Где выход на посадку?', note: 'gdye vykhad na pasadku?', krPronunciation: '그졔 브이하드 나 빠사드꾸?', tokens: [{ text: 'Где', gloss: '어디에' }, { text: 'выход', gloss: '출구가' }, { text: 'на', gloss: '~로 가는' }, { text: 'посадку?', gloss: '탑승?' }] },
  { kr: '환전할 수 있나요?', target: 'Могу я обменять деньги?', note: 'magu ya abmyenyat dyengi?', krPronunciation: '마구 야 아브미냐찌 젠기?', tokens: [{ text: 'Могу', gloss: '할 수 있나요' }, { text: 'я', gloss: '제가' }, { text: 'обменять', gloss: '환전하다' }, { text: 'деньги?', gloss: '돈을?' }] },
]

const airport2: Card[] = [
  { kr: '택시를 불러주세요', target: 'Вызовите такси, пожалуйста', note: 'vyzavitye taksi, pazhalusta', krPronunciation: '브이자비쩨 딱시, 빠잘루스따', tokens: [{ text: 'Вызовите', gloss: '불러주세요' }, { text: 'такси,', gloss: '택시를,' }, { text: 'пожалуйста', gloss: '부탁합니다' }] },
  { kr: '이 버스는 시내로 가나요?', target: 'Этот автобус едет в центр?', note: 'etat aftobus yedyet f tsentr?', krPronunciation: '에땃 아프또부스 예졧 프 쩬뜨르?', tokens: [{ text: 'Этот', gloss: '이' }, { text: 'автобус', gloss: '버스는' }, { text: 'едет', gloss: '가다' }, { text: 'в', gloss: '~로' }, { text: 'центр?', gloss: '시내?' }] },
  { kr: '표는 얼마예요?', target: 'Сколько стоит билет?', note: 'skolka stoit bilyet?', krPronunciation: '스꼴까 스또잇 빌롓?', tokens: [{ text: 'Сколько', gloss: '얼마' }, { text: 'стоит', gloss: '~인가요' }, { text: 'билет?', gloss: '표가?' }] },
  { kr: '심카드는 어디서 사요?', target: 'Где купить сим-карту?', note: 'gdye kupit sim-kartu?', krPronunciation: '그졔 꾸삐찌 심카르뚜?', tokens: [{ text: 'Где', gloss: '어디서' }, { text: 'купить', gloss: '사다' }, { text: 'сим-карту?', gloss: '심카드를?' }] },
  { kr: '화장실이 어디예요?', target: 'Где туалет?', note: 'gdye tualyet?', krPronunciation: '그졔 뚜알롓?', tokens: [{ text: 'Где', gloss: '어디에' }, { text: 'туалет?', gloss: '화장실이?' }] },
]

const car1: Card[] = [
  { kr: '차를 렌트하고 싶어요', target: 'Я хочу арендовать машину', note: 'ya khachu aryendavat mashinu', krPronunciation: '야 하추 아린다바찌 마시누', tokens: [{ text: 'Я', gloss: '저는' }, { text: 'хочу', gloss: '원해요' }, { text: 'арендовать', gloss: '렌트하는 것을' }, { text: 'машину', gloss: '차를' }] },
  { kr: '예약했습니다', target: 'У меня есть бронь', note: 'u minya yest bron', krPronunciation: '우 미냐 예스찌 브론', tokens: [{ text: 'У', gloss: '~에게' }, { text: 'меня', gloss: '저' }, { text: 'есть', gloss: '있다' }, { text: 'бронь', gloss: '예약이' }] },
  { kr: '국제 운전면허증이 있어요', target: 'У меня есть международные права', note: 'u minya yest myezhdunarodnyye prava', krPronunciation: '우 미냐 예스찌 미쥬두나로드니예 쁘라바', tokens: [{ text: 'У', gloss: '~에게' }, { text: 'меня', gloss: '저' }, { text: 'есть', gloss: '있다' }, { text: 'международные', gloss: '국제' }, { text: 'права', gloss: '운전면허증이' }] },
  { kr: '보험을 포함해 주세요', target: 'Включите страховку, пожалуйста', note: 'fklyuchitye strakhofku, pazhalusta', krPronunciation: '프클류치쩨 스트라호프꾸, 빠잘루스따', tokens: [{ text: 'Включите', gloss: '포함해주세요' }, { text: 'страховку,', gloss: '보험을,' }, { text: 'пожалуйста', gloss: '부탁합니다' }] },
  { kr: '기름은 어디서 넣나요?', target: 'Где заправить машину?', note: 'gdye zapravit mashinu?', krPronunciation: '그졔 자프라비찌 마시누?', tokens: [{ text: 'Где', gloss: '어디서' }, { text: 'заправить', gloss: '주유하다' }, { text: 'машину?', gloss: '차를?' }] },
]

const car2: Card[] = [
  { kr: '주유소가 어디예요?', target: 'Где заправка?', note: 'gdye zapravka?', krPronunciation: '그졔 자프라프까?', tokens: [{ text: 'Где', gloss: '어디에' }, { text: 'заправка?', gloss: '주유소가?' }] },
  { kr: '이 길이 맞나요?', target: 'Это правильная дорога?', note: 'eta pravilnaya daroga?', krPronunciation: '에따 쁘라빌나야 다로가?', tokens: [{ text: 'Это', gloss: '이것이' }, { text: 'правильная', gloss: '맞는' }, { text: 'дорога?', gloss: '길인가요?' }] },
  { kr: '직진하세요', target: 'Езжайте прямо', note: 'yezzhaytye pryama', krPronunciation: '예좌이쩨 쁘랴마', tokens: [{ text: 'Езжайте', gloss: '가세요' }, { text: 'прямо', gloss: '똑바로' }] },
  { kr: '왼쪽으로 도세요', target: 'Поверните налево', note: 'pavyernitye nalyeva', krPronunciation: '빠비르니쩨 날례바', tokens: [{ text: 'Поверните', gloss: '도세요' }, { text: 'налево', gloss: '왼쪽으로' }] },
  { kr: '여기 주차할 수 있나요?', target: 'Можно здесь припарковаться?', note: 'mozhna zdyes pripmarkavatsa?', krPronunciation: '모쥬나 즈졔시 프리빠르까바짜?', tokens: [{ text: 'Можно', gloss: '될까요' }, { text: 'здесь', gloss: '여기에' }, { text: 'припарковаться?', gloss: '주차해도?' }] },
]

const food1: Card[] = [
  { kr: '두 명이에요', target: 'Столик на двоих', note: 'stolik na dvaikh', krPronunciation: '스똘릭 나 드바이흐', tokens: [{ text: 'Столик', gloss: '테이블을' }, { text: 'на', gloss: '~을 위한' }, { text: 'двоих', gloss: '두 명' }] },
  { kr: '메뉴판 좀 주세요', target: 'Меню, пожалуйста', note: 'myenyu, pazhalusta', krPronunciation: '미뉴, 빠잘루스따', tokens: [{ text: 'Меню,', gloss: '메뉴판,' }, { text: 'пожалуйста', gloss: '부탁합니다' }] },
  { kr: '이거 주세요', target: 'Я возьму это', note: 'ya vazmu eta', krPronunciation: '야 바지무 에따', tokens: [{ text: 'Я', gloss: '저는' }, { text: 'возьму', gloss: '가질게요' }, { text: 'это', gloss: '이것을' }] },
  { kr: '맛있어요', target: 'Это вкусно', note: 'eta fkusna', krPronunciation: '에따 프꾸스나', tokens: [{ text: 'Это', gloss: '이것은' }, { text: 'вкусно', gloss: '맛있어요' }] },
  { kr: '계산해 주세요', target: 'Счёт, пожалуйста', note: 'shchot, pazhalusta', krPronunciation: '쑈뜨, 빠잘루스따', tokens: [{ text: 'Счёт,', gloss: '계산서,' }, { text: 'пожалуйста', gloss: '부탁합니다' }] },
]

const food2: Card[] = [
  { kr: '물 좀 주세요', target: 'Воды, пожалуйста', note: 'vady, pazhalusta', krPronunciation: '바디, 빠잘루스따', tokens: [{ text: 'Воды,', gloss: '물을,' }, { text: 'пожалуйста', gloss: '부탁합니다' }] },
  { kr: '매운 음식을 못 먹어요', target: 'Я не ем острое', note: 'ya nye yem ostraye', krPronunciation: '야 니 옘 오스트라예', tokens: [{ text: 'Я', gloss: '저는' }, { text: 'не', gloss: '~않아요' }, { text: 'ем', gloss: '먹다' }, { text: 'острое', gloss: '매운 것을' }] },
  { kr: '추천 메뉴가 뭐예요?', target: 'Что вы порекомендуете?', note: 'shto vy parikamyenduyetye?', krPronunciation: '쉬또 브이 빠리까민두예쩨?', tokens: [{ text: 'Что', gloss: '무엇을' }, { text: 'вы', gloss: '당신은' }, { text: 'порекомендуете?', gloss: '추천하나요?' }] },
  { kr: '채식 메뉴가 있나요?', target: 'Есть вегетарианское меню?', note: 'yest vyegyetarianskaye myenyu?', krPronunciation: '예스찌 비게따리안스꼬예 미뉴?', tokens: [{ text: 'Есть', gloss: '있나요' }, { text: 'вегетарианское', gloss: '채식' }, { text: 'меню?', gloss: '메뉴가?' }] },
  { kr: '포장 가능한가요?', target: 'Можно на вынос?', note: 'mozhna na vynas?', krPronunciation: '모쥬나 나 브이나스?', tokens: [{ text: 'Можно', gloss: '될까요' }, { text: 'на', gloss: '~로' }, { text: 'вынос?', gloss: '포장?' }] },
]

const local1: Card[] = [
  { kr: '이거 얼마예요?', target: 'Сколько это стоит?', note: 'skolka eta stoit?', krPronunciation: '스꼴까 에따 스또잇?', tokens: [{ text: 'Сколько', gloss: '얼마나' }, { text: 'это', gloss: '이것이' }, { text: 'стоит?', gloss: '드나요?' }] },
  { kr: '너무 비싸요', target: 'Это слишком дорого', note: 'eta slishkam doraga', krPronunciation: '에따 슬리쉬깜 도라가', tokens: [{ text: 'Это', gloss: '이것은' }, { text: 'слишком', gloss: '너무' }, { text: 'дорого', gloss: '비싸요' }] },
  { kr: '조금 깎아주세요', target: 'Сделайте скидку, пожалуйста', note: 'sdyelaytye skidku, pazhalusta', krPronunciation: '즈졜라이쩨 스끼드꾸, 빠잘루스따', tokens: [{ text: 'Сделайте', gloss: '해주세요' }, { text: 'скидку,', gloss: '할인을,' }, { text: 'пожалуйста', gloss: '부탁합니다' }] },
  { kr: '카드로 결제할 수 있나요?', target: 'Можно оплатить картой?', note: 'mozhna aplatit kartay?', krPronunciation: '모쥬나 아쁠라찌찌 까르또이?', tokens: [{ text: 'Можно', gloss: '될까요' }, { text: 'оплатить', gloss: '결제하다' }, { text: 'картой?', gloss: '카드로?' }] },
  { kr: '환전소가 어디예요?', target: 'Где обменник?', note: 'gdye abmyennik?', krPronunciation: '그졔 아브몐닉?', tokens: [{ text: 'Где', gloss: '어디에' }, { text: 'обменник?', gloss: '환전소가?' }] },
]

const local2: Card[] = [
  { kr: '도와주세요', target: 'Помогите, пожалуйста', note: 'pamagitye, pazhalusta', krPronunciation: '빠마기쩨, 빠잘루스따', tokens: [{ text: 'Помогите,', gloss: '도와주세요,' }, { text: 'пожалуйста', gloss: '부탁합니다' }] },
  { kr: '길을 찾도록 도와주세요', target: 'Помогите найти дорогу', note: 'pamagitye nayti darogu', krPronunciation: '빠마기쩨 나이찌 다로구', tokens: [{ text: 'Помогите', gloss: '도와주세요' }, { text: 'найти', gloss: '찾는 것을' }, { text: 'дорогу', gloss: '길을' }] },
  { kr: '병원이 어디예요?', target: 'Где больница?', note: 'gdye balnitsa?', krPronunciation: '그졔 발니짜?', tokens: [{ text: 'Где', gloss: '어디에' }, { text: 'больница?', gloss: '병원이?' }] },
  { kr: '경찰을 불러주세요', target: 'Вызовите полицию', note: 'vyzavitye palitsiyu', krPronunciation: '브이자비쩨 빨리찌유', tokens: [{ text: 'Вызовите', gloss: '불러주세요' }, { text: 'полицию', gloss: '경찰을' }] },
  { kr: '와이파이 비밀번호가 뭐예요?', target: 'Какой пароль от Wi-Fi?', note: 'kakoy paral at Wi-Fi?', krPronunciation: '까꼬이 빠롤 앗 와이파이?', tokens: [{ text: 'Какой', gloss: '무슨' }, { text: 'пароль', gloss: '비밀번호인가요' }, { text: 'от', gloss: '~의' }, { text: 'Wi-Fi?', gloss: '와이파이?' }] },
]

const dialogues: DialogueScenario[] = [
  {
    id: 'ru-d-immigration',
    title: '공항 입국 심사',
    turns: [
      { speaker: 'staff', kr: '방문 목적이 무엇인가요?', target: 'Цель вашего визита?', krPronunciation: '첼 바셰바 비지타?' },
      { speaker: 'user', kr: '관광이요.', target: 'Туризм.', krPronunciation: '뚜리즘' },
      { speaker: 'staff', kr: '며칠 머무르실 건가요?', target: 'Сколько дней вы пробудете?', krPronunciation: '스꼴까 드녜이 브이 쁘라부졔쩨?' },
      { speaker: 'user', kr: '일주일이요.', target: 'Одна неделя.', krPronunciation: '아드나 니젤랴' },
    ],
  },
  {
    id: 'ru-d-car-rental',
    title: '렌터카 대여',
    turns: [
      { speaker: 'staff', kr: '안녕하세요! 어떤 차를 렌트하고 싶으세요?', target: 'Здравствуйте! Что вы хотите арендовать?', krPronunciation: '즈드라스트부이쩨! 쉬또 브이 하찌쩨 아린다바찌?' },
      { speaker: 'user', kr: '차를 렌트하고 싶어요.', target: 'Я хочу арендовать машину.', krPronunciation: '야 하추 아린다바찌 마시누' },
      { speaker: 'staff', kr: '국제 운전면허증 있으세요?', target: 'У вас есть международные права?', krPronunciation: '우 바스 예스찌 미쥬두나로드니예 쁘라바?' },
      { speaker: 'user', kr: '네, 여기 있어요.', target: 'Да, вот они.', krPronunciation: '다, 봇 아니' },
    ],
  },
  {
    id: 'ru-d-restaurant',
    title: '식당에서 주문하기',
    turns: [
      { speaker: 'staff', kr: '안녕하세요! 몇 분이세요?', target: 'Здравствуйте! Сколько вас?', krPronunciation: '즈드라스트부이쩨! 스꼴까 바스?' },
      { speaker: 'user', kr: '두 명이요.', target: 'Двое, пожалуйста.', krPronunciation: '드보예, 빠잘루스따' },
      { speaker: 'staff', kr: '주문하시겠어요?', target: 'Что будете заказывать?', krPronunciation: '쉬또 부졔쩨 자까지바찌?' },
      { speaker: 'user', kr: '보르시와 차 주세요.', target: 'Борщ и чай, пожалуйста.', krPronunciation: '보르쉬 이 차이, 빠잘루스따' },
    ],
  },
  {
    id: 'ru-d-hotel-checkin',
    title: '호텔 체크인',
    turns: [
      { speaker: 'staff', kr: '안녕하세요! 예약하셨나요?', target: 'Здравствуйте! У вас есть бронь?', krPronunciation: '즈드라스트부이쩨! 우 바스 예스찌 브론?' },
      { speaker: 'user', kr: '네, 예약했어요.', target: 'Да, у меня есть бронь.', krPronunciation: '다, 우 미냐 예스찌 브론' },
      { speaker: 'staff', kr: '여기 열쇠입니다.', target: 'Вот ваш ключ.', krPronunciation: '봇 바쉬 클류치' },
      { speaker: 'user', kr: '정말 감사합니다.', target: 'Спасибо большое.', krPronunciation: '스빠시바 발쇼예' },
    ],
  },
  {
    id: 'ru-d-market',
    title: '시장에서 흥정하기',
    turns: [
      { speaker: 'user', kr: '이거 얼마예요?', target: 'Сколько это стоит?', krPronunciation: '스꼴까 에따 스또잇?' },
      { speaker: 'staff', kr: '5천 텡게입니다.', target: 'Пять тысяч тенге.', krPronunciation: '뺘찌 띠샤치 뗀게' },
      { speaker: 'user', kr: '너무 비싸요. 조금 깎아주세요.', target: 'Это слишком дорого. Сделайте скидку, пожалуйста.', krPronunciation: '에따 슬리쉬깜 도라가. 즈졜라이쩨 스끼드꾸, 빠잘루스따' },
      { speaker: 'staff', kr: '알겠습니다, 할인해드릴게요.', target: 'Хорошо, для вас скидка.', krPronunciation: '하라쇼, 들랴 바스 스끼드까' },
    ],
  },
]

export const ruCourse: Course = {
  id: 'ru',
  title: '러시아어',
  flag: '🇰🇿',
  tagline: '알마티 여행을 위한 러시아어',
  color: 'violet',
  speechLang: 'ru-RU',
  dialogues,
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
