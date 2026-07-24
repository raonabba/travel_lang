import type { Course } from '../types'
import { buildLesson, buildUnit, type Card } from '../courseBuilder'

const greetings1: Card[] = [
  { kr: '안녕하세요', target: 'Hello', tokens: ['Hello'] },
  { kr: '감사합니다', target: 'Thank you', tokens: ['Thank', 'you'] },
  { kr: '죄송합니다', target: "I'm sorry", tokens: ["I'm", 'sorry'] },
  { kr: '네', target: 'Yes', tokens: ['Yes'] },
  { kr: '아니요', target: 'No', tokens: ['No'] },
]

const greetings2: Card[] = [
  { kr: '제 이름은 민수입니다', target: 'My name is Minsu', tokens: ['My', 'name', 'is', 'Minsu'] },
  { kr: '만나서 반갑습니다', target: 'Nice to meet you', tokens: ['Nice', 'to', 'meet', 'you'] },
  { kr: '저는 한국에서 왔어요', target: "I'm from Korea", tokens: ["I'm", 'from', 'Korea'] },
  { kr: '실례합니다', target: 'Excuse me', tokens: ['Excuse', 'me'] },
  { kr: '천만에요', target: "You're welcome", tokens: ["You're", 'welcome'] },
]

const airport1: Card[] = [
  { kr: '공항이 어디예요?', target: 'Where is the airport?', tokens: ['Where', 'is', 'the', 'airport?'] },
  { kr: '여권을 보여주세요', target: 'Please show me your passport', tokens: ['Please', 'show', 'me', 'your', 'passport'] },
  { kr: '이 버스는 역에 가나요?', target: 'Does this bus go to the station?', tokens: ['Does', 'this', 'bus', 'go', 'to', 'the', 'station?'] },
  { kr: '표는 어디서 사요?', target: 'Where can I buy a ticket?', tokens: ['Where', 'can', 'I', 'buy', 'a', 'ticket?'] },
  { kr: '다음 역은 어디예요?', target: 'What is the next station?', tokens: ['What', 'is', 'the', 'next', 'station?'] },
]

const airport2: Card[] = [
  { kr: '택시를 불러주세요', target: 'Please call a taxi', tokens: ['Please', 'call', 'a', 'taxi'] },
  { kr: '이 짐을 맡길 수 있나요?', target: 'Can I check this bag?', tokens: ['Can', 'I', 'check', 'this', 'bag?'] },
  { kr: '탑승구가 어디예요?', target: 'Where is the gate?', tokens: ['Where', 'is', 'the', 'gate?'] },
  { kr: '얼마예요?', target: 'How much is it?', tokens: ['How', 'much', 'is', 'it?'] },
  { kr: '환승해야 하나요?', target: 'Do I need to transfer?', tokens: ['Do', 'I', 'need', 'to', 'transfer?'] },
]

const hotel1: Card[] = [
  { kr: '예약했습니다', target: 'I have a reservation', tokens: ['I', 'have', 'a', 'reservation'] },
  { kr: '체크인하고 싶어요', target: "I'd like to check in", tokens: ["I'd", 'like', 'to', 'check', 'in'] },
  { kr: '와이파이 비밀번호가 뭐예요?', target: 'What is the Wi-Fi password?', tokens: ['What', 'is', 'the', 'Wi-Fi', 'password?'] },
  { kr: '화장실이 어디예요?', target: 'Where is the restroom?', tokens: ['Where', 'is', 'the', 'restroom?'] },
  { kr: '체크아웃은 몇 시예요?', target: 'What time is check-out?', tokens: ['What', 'time', 'is', 'check-out?'] },
]

const hotel2: Card[] = [
  { kr: '이 길이 맞나요?', target: 'Is this the right way?', tokens: ['Is', 'this', 'the', 'right', 'way?'] },
  { kr: '똑바로 가세요', target: 'Go straight ahead', tokens: ['Go', 'straight', 'ahead'] },
  { kr: '왼쪽으로 도세요', target: 'Turn left', tokens: ['Turn', 'left'] },
  { kr: '여기서 멀어요?', target: 'Is it far from here?', tokens: ['Is', 'it', 'far', 'from', 'here?'] },
  { kr: '지도를 보여주세요', target: 'Please show me the map', tokens: ['Please', 'show', 'me', 'the', 'map'] },
]

const food1: Card[] = [
  { kr: '두 명이에요', target: 'Table for two', tokens: ['Table', 'for', 'two'] },
  { kr: '메뉴판 좀 주세요', target: 'Can I get a menu?', tokens: ['Can', 'I', 'get', 'a', 'menu?'] },
  { kr: '이거 주세요', target: "I'll have this", tokens: ["I'll", 'have', 'this'] },
  { kr: '맛있어요', target: "It's delicious", tokens: ["It's", 'delicious'] },
  { kr: '계산해 주세요', target: 'Check, please', tokens: ['Check,', 'please'] },
]

const food2: Card[] = [
  { kr: '물 좀 주세요', target: 'Can I get some water?', tokens: ['Can', 'I', 'get', 'some', 'water?'] },
  { kr: '매운 음식을 못 먹어요', target: "I can't eat spicy food", tokens: ['I', "can't", 'eat', 'spicy', 'food'] },
  { kr: '추천 메뉴가 뭐예요?', target: 'What do you recommend?', tokens: ['What', 'do', 'you', 'recommend?'] },
  { kr: '잘 먹었습니다', target: 'That was a great meal', tokens: ['That', 'was', 'a', 'great', 'meal'] },
  { kr: '포장 가능한가요?', target: 'Can I get this to go?', tokens: ['Can', 'I', 'get', 'this', 'to', 'go?'] },
]

export const enCourse: Course = {
  id: 'en',
  title: '영어',
  flag: '🇺🇸',
  tagline: '여행하며 배우는 영어',
  color: 'blue',
  speechLang: 'en-US',
  units: [
    buildUnit('en-u1', '인사 & 기본 표현', '기본 인사말과 예의 표현을 배워요', '🙏', [
      buildLesson('en-u1-l1', '기본 인사', greetings1),
      buildLesson('en-u1-l2', '자기소개', greetings2),
    ]),
    buildUnit('en-u2', '공항 & 교통', '공항에서 목적지까지 이동해봐요', '✈️', [
      buildLesson('en-u2-l1', '공항에서', airport1),
      buildLesson('en-u2-l2', '대중교통 이용', airport2),
    ]),
    buildUnit('en-u3', '숙소 & 길찾기', '체크인부터 길 묻기까지', '🏨', [
      buildLesson('en-u3-l1', '호텔 체크인', hotel1),
      buildLesson('en-u3-l2', '길 찾기', hotel2),
    ]),
    buildUnit('en-u4', '식당 & 음식', '주문부터 계산까지 완벽하게', '🍔', [
      buildLesson('en-u4-l1', '식당에서 주문하기', food1),
      buildLesson('en-u4-l2', '취향과 계산', food2),
    ]),
  ],
}
