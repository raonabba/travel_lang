import type { Course } from '../types'
import { buildLesson, buildUnit, type Card } from '../courseBuilder'

const greetings1: Card[] = [
  { kr: '안녕하세요', target: 'Hello', krPronunciation: '헬로우', tokens: [{ text: 'Hello', gloss: '안녕하세요' }] },
  { kr: '감사합니다', target: 'Thank you', krPronunciation: '땡큐', tokens: [{ text: 'Thank', gloss: '고마워' }, { text: 'you', gloss: '당신' }] },
  { kr: '죄송합니다', target: "I'm sorry", krPronunciation: '아임 쏘리', tokens: [{ text: "I'm", gloss: '나는 ~이다' }, { text: 'sorry', gloss: '미안한' }] },
  { kr: '네', target: 'Yes', krPronunciation: '예스', tokens: [{ text: 'Yes', gloss: '네' }] },
  { kr: '아니요', target: 'No', krPronunciation: '노우', tokens: [{ text: 'No', gloss: '아니요' }] },
]

const greetings2: Card[] = [
  { kr: '제 이름은 민수입니다', target: 'My name is Minsu', krPronunciation: '마이 네임 이즈 민수', tokens: [{ text: 'My', gloss: '나의' }, { text: 'name', gloss: '이름' }, { text: 'is', gloss: '~이다' }, { text: 'Minsu', gloss: '민수' }] },
  { kr: '만나서 반갑습니다', target: 'Nice to meet you', krPronunciation: '나이스 투 미츄', tokens: [{ text: 'Nice', gloss: '좋은' }, { text: 'to', gloss: '~하게' }, { text: 'meet', gloss: '만나다' }, { text: 'you', gloss: '당신을' }] },
  { kr: '저는 한국에서 왔어요', target: "I'm from Korea", krPronunciation: '아임 프럼 코리아', tokens: [{ text: "I'm", gloss: '나는' }, { text: 'from', gloss: '~출신' }, { text: 'Korea', gloss: '한국' }] },
  { kr: '실례합니다', target: 'Excuse me', krPronunciation: '익스큐즈 미', tokens: [{ text: 'Excuse', gloss: '양해해줘' }, { text: 'me', gloss: '나를' }] },
  { kr: '천만에요', target: "You're welcome", krPronunciation: '유어 웰컴', tokens: [{ text: "You're", gloss: '당신은' }, { text: 'welcome', gloss: '환영/천만에요' }] },
]

const airport1: Card[] = [
  { kr: '공항이 어디예요?', target: 'Where is the airport?', krPronunciation: '웨어 이즈 디 에어포트?', tokens: [{ text: 'Where', gloss: '어디' }, { text: 'is', gloss: '~있다' }, { text: 'the', gloss: '그' }, { text: 'airport?', gloss: '공항?' }] },
  { kr: '여권을 보여주세요', target: 'Please show me your passport', krPronunciation: '플리즈 쇼우 미 유어 패스포트', tokens: [{ text: 'Please', gloss: '부디' }, { text: 'show', gloss: '보여줘' }, { text: 'me', gloss: '나에게' }, { text: 'your', gloss: '당신의' }, { text: 'passport', gloss: '여권' }] },
  { kr: '이 버스는 역에 가나요?', target: 'Does this bus go to the station?', krPronunciation: '더즈 디스 버스 고우 투 더 스테이션?', tokens: [{ text: 'Does', gloss: '~하나요' }, { text: 'this', gloss: '이' }, { text: 'bus', gloss: '버스' }, { text: 'go', gloss: '가다' }, { text: 'to', gloss: '~로' }, { text: 'the', gloss: '그' }, { text: 'station?', gloss: '역?' }] },
  { kr: '표는 어디서 사요?', target: 'Where can I buy a ticket?', krPronunciation: '웨어 캔 아이 바이 어 티켓?', tokens: [{ text: 'Where', gloss: '어디서' }, { text: 'can', gloss: '~할 수 있다' }, { text: 'I', gloss: '나는' }, { text: 'buy', gloss: '사다' }, { text: 'a', gloss: '한' }, { text: 'ticket?', gloss: '표?' }] },
  { kr: '다음 역은 어디예요?', target: 'What is the next station?', krPronunciation: '왓 이즈 더 넥스트 스테이션?', tokens: [{ text: 'What', gloss: '무엇' }, { text: 'is', gloss: '~이다' }, { text: 'the', gloss: '그' }, { text: 'next', gloss: '다음' }, { text: 'station?', gloss: '역?' }] },
]

const airport2: Card[] = [
  { kr: '택시를 불러주세요', target: 'Please call a taxi', krPronunciation: '플리즈 콜 어 택시', tokens: [{ text: 'Please', gloss: '부디' }, { text: 'call', gloss: '불러줘' }, { text: 'a', gloss: '한' }, { text: 'taxi', gloss: '택시' }] },
  { kr: '이 짐을 맡길 수 있나요?', target: 'Can I check this bag?', krPronunciation: '캔 아이 체크 디스 백?', tokens: [{ text: 'Can', gloss: '~할 수 있다' }, { text: 'I', gloss: '나는' }, { text: 'check', gloss: '맡기다' }, { text: 'this', gloss: '이' }, { text: 'bag?', gloss: '가방?' }] },
  { kr: '탑승구가 어디예요?', target: 'Where is the gate?', krPronunciation: '웨어 이즈 더 게이트?', tokens: [{ text: 'Where', gloss: '어디' }, { text: 'is', gloss: '~있다' }, { text: 'the', gloss: '그' }, { text: 'gate?', gloss: '탑승구?' }] },
  { kr: '얼마예요?', target: 'How much is it?', krPronunciation: '하우 머치 이즈 잇?', tokens: [{ text: 'How', gloss: '얼마나' }, { text: 'much', gloss: '많이' }, { text: 'is', gloss: '~이다' }, { text: 'it?', gloss: '그것이?' }] },
  { kr: '환승해야 하나요?', target: 'Do I need to transfer?', krPronunciation: '두 아이 니드 투 트랜스퍼?', tokens: [{ text: 'Do', gloss: '~하나요' }, { text: 'I', gloss: '나는' }, { text: 'need', gloss: '필요하다' }, { text: 'to', gloss: '~하는 것을' }, { text: 'transfer?', gloss: '환승?' }] },
]

const hotel1: Card[] = [
  { kr: '예약했습니다', target: 'I have a reservation', krPronunciation: '아이 해브 어 레저베이션', tokens: [{ text: 'I', gloss: '나는' }, { text: 'have', gloss: '가지고 있다' }, { text: 'a', gloss: '한' }, { text: 'reservation', gloss: '예약' }] },
  { kr: '체크인하고 싶어요', target: "I'd like to check in", krPronunciation: '아이드 라익 투 체크인', tokens: [{ text: "I'd", gloss: '나는 ~하고 싶다' }, { text: 'like', gloss: '좋아하다' }, { text: 'to', gloss: '~하는 것을' }, { text: 'check', gloss: '체크' }, { text: 'in', gloss: '인' }] },
  { kr: '와이파이 비밀번호가 뭐예요?', target: 'What is the Wi-Fi password?', krPronunciation: '왓 이즈 더 와이파이 패스워드?', tokens: [{ text: 'What', gloss: '무엇' }, { text: 'is', gloss: '~이다' }, { text: 'the', gloss: '그' }, { text: 'Wi-Fi', gloss: '와이파이' }, { text: 'password?', gloss: '비밀번호?' }] },
  { kr: '화장실이 어디예요?', target: 'Where is the restroom?', krPronunciation: '웨어 이즈 더 레스트룸?', tokens: [{ text: 'Where', gloss: '어디' }, { text: 'is', gloss: '~있다' }, { text: 'the', gloss: '그' }, { text: 'restroom?', gloss: '화장실?' }] },
  { kr: '체크아웃은 몇 시예요?', target: 'What time is check-out?', krPronunciation: '왓 타임 이즈 체크아웃?', tokens: [{ text: 'What', gloss: '무엇' }, { text: 'time', gloss: '시간' }, { text: 'is', gloss: '~이다' }, { text: 'check-out?', gloss: '체크아웃?' }] },
]

const hotel2: Card[] = [
  { kr: '이 길이 맞나요?', target: 'Is this the right way?', krPronunciation: '이즈 디스 더 라잇 웨이?', tokens: [{ text: 'Is', gloss: '~인가요' }, { text: 'this', gloss: '이것이' }, { text: 'the', gloss: '그' }, { text: 'right', gloss: '맞는' }, { text: 'way?', gloss: '길?' }] },
  { kr: '똑바로 가세요', target: 'Go straight ahead', krPronunciation: '고우 스트레이트 어헤드', tokens: [{ text: 'Go', gloss: '가라' }, { text: 'straight', gloss: '똑바로' }, { text: 'ahead', gloss: '앞으로' }] },
  { kr: '왼쪽으로 도세요', target: 'Turn left', krPronunciation: '턴 레프트', tokens: [{ text: 'Turn', gloss: '돌아라' }, { text: 'left', gloss: '왼쪽으로' }] },
  { kr: '여기서 멀어요?', target: 'Is it far from here?', krPronunciation: '이즈 잇 파 프럼 히어?', tokens: [{ text: 'Is', gloss: '~인가요' }, { text: 'it', gloss: '그것이' }, { text: 'far', gloss: '먼' }, { text: 'from', gloss: '~부터' }, { text: 'here?', gloss: '여기?' }] },
  { kr: '지도를 보여주세요', target: 'Please show me the map', krPronunciation: '플리즈 쇼우 미 더 맵', tokens: [{ text: 'Please', gloss: '부디' }, { text: 'show', gloss: '보여줘' }, { text: 'me', gloss: '나에게' }, { text: 'the', gloss: '그' }, { text: 'map', gloss: '지도' }] },
]

const food1: Card[] = [
  { kr: '두 명이에요', target: 'Table for two', krPronunciation: '테이블 포 투', tokens: [{ text: 'Table', gloss: '테이블' }, { text: 'for', gloss: '~을 위한' }, { text: 'two', gloss: '두 명' }] },
  { kr: '메뉴판 좀 주세요', target: 'Can I get a menu?', krPronunciation: '캔 아이 겟 어 메뉴?', tokens: [{ text: 'Can', gloss: '~할 수 있다' }, { text: 'I', gloss: '나는' }, { text: 'get', gloss: '받다' }, { text: 'a', gloss: '한' }, { text: 'menu?', gloss: '메뉴?' }] },
  { kr: '이거 주세요', target: "I'll have this", krPronunciation: '아일 해브 디스', tokens: [{ text: "I'll", gloss: '나는 ~할 것이다' }, { text: 'have', gloss: '먹을게요' }, { text: 'this', gloss: '이것' }] },
  { kr: '맛있어요', target: "It's delicious", krPronunciation: '잇츠 딜리셔스', tokens: [{ text: "It's", gloss: '그것은 ~이다' }, { text: 'delicious', gloss: '맛있는' }] },
  { kr: '계산해 주세요', target: 'Check, please', krPronunciation: '첵, 플리즈', tokens: [{ text: 'Check,', gloss: '계산서,' }, { text: 'please', gloss: '부탁해요' }] },
]

const food2: Card[] = [
  { kr: '물 좀 주세요', target: 'Can I get some water?', krPronunciation: '캔 아이 겟 썸 워터?', tokens: [{ text: 'Can', gloss: '~할 수 있다' }, { text: 'I', gloss: '나는' }, { text: 'get', gloss: '받다' }, { text: 'some', gloss: '약간의' }, { text: 'water?', gloss: '물?' }] },
  { kr: '매운 음식을 못 먹어요', target: "I can't eat spicy food", krPronunciation: '아이 캔트 잇 스파이시 푸드', tokens: [{ text: 'I', gloss: '나는' }, { text: "can't", gloss: '~할 수 없다' }, { text: 'eat', gloss: '먹다' }, { text: 'spicy', gloss: '매운' }, { text: 'food', gloss: '음식' }] },
  { kr: '추천 메뉴가 뭐예요?', target: 'What do you recommend?', krPronunciation: '왓 두 유 레커멘드?', tokens: [{ text: 'What', gloss: '무엇을' }, { text: 'do', gloss: '~하나요' }, { text: 'you', gloss: '당신은' }, { text: 'recommend?', gloss: '추천하나요?' }] },
  { kr: '잘 먹었습니다', target: 'That was a great meal', krPronunciation: '댓 워즈 어 그레이트 밀', tokens: [{ text: 'That', gloss: '그것은' }, { text: 'was', gloss: '~였다' }, { text: 'a', gloss: '한' }, { text: 'great', gloss: '훌륭한' }, { text: 'meal', gloss: '식사' }] },
  { kr: '포장 가능한가요?', target: 'Can I get this to go?', krPronunciation: '캔 아이 겟 디스 투 고우?', tokens: [{ text: 'Can', gloss: '~할 수 있다' }, { text: 'I', gloss: '나는' }, { text: 'get', gloss: '가져가다' }, { text: 'this', gloss: '이것을' }, { text: 'to', gloss: '~으로' }, { text: 'go?', gloss: '포장?' }] },
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
