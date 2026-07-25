import type { Course } from '../types'
import { buildLesson, buildUnit, type Card } from '../courseBuilder'

const greetings1: Card[] = [
  { kr: '안녕하세요', target: 'こんにちは', krPronunciation: '곤니치와', tokens: [{ text: 'こんにちは', gloss: '안녕하세요' }] },
  { kr: '감사합니다', target: 'ありがとうございます', krPronunciation: '아리가토- 고자이마스', tokens: [{ text: 'ありがとう', gloss: '고마워요' }, { text: 'ございます', gloss: '(공손한 어미)' }] },
  { kr: '죄송합니다', target: 'すみません', krPronunciation: '스미마센', tokens: [{ text: 'すみません', gloss: '죄송합니다' }] },
  { kr: '네', target: 'はい', krPronunciation: '하이', tokens: [{ text: 'はい', gloss: '네' }] },
  { kr: '아니요', target: 'いいえ', krPronunciation: '이이에', tokens: [{ text: 'いいえ', gloss: '아니요' }] },
]

const greetings2: Card[] = [
  { kr: '저는 여행객입니다', target: '私は旅行者です', note: 'わたしはりょこうしゃです', krPronunciation: '와타시와 료코-샤 데스', tokens: [{ text: '私は', gloss: '저는' }, { text: '旅行者', gloss: '여행자' }, { text: 'です', gloss: '~입니다' }] },
  { kr: '처음 뵙겠습니다', target: 'はじめまして', krPronunciation: '하지메마시테', tokens: [{ text: 'はじめまして', gloss: '처음 뵙겠습니다' }] },
  { kr: '잘 부탁드립니다', target: 'よろしくお願いします', note: 'よろしくおねがいします', krPronunciation: '요로시쿠 오네가이시마스', tokens: [{ text: 'よろしく', gloss: '잘' }, { text: 'お願いします', gloss: '부탁드립니다' }] },
  { kr: '실례합니다', target: '失礼します', note: 'しつれいします', krPronunciation: '시츠레-시마스', tokens: [{ text: '失礼します', gloss: '실례합니다' }] },
  { kr: '괜찮습니다', target: '大丈夫です', note: 'だいじょうぶです', krPronunciation: '다이죠-부 데스', tokens: [{ text: '大丈夫', gloss: '괜찮음' }, { text: 'です', gloss: '~입니다' }] },
]

const airport1: Card[] = [
  { kr: '공항이 어디예요?', target: '空港はどこですか？', note: 'くうこうはどこですか？', krPronunciation: '쿠-코-와 도코데스카', tokens: [{ text: '空港は', gloss: '공항은' }, { text: 'どこ', gloss: '어디' }, { text: 'ですか', gloss: '~인가요?' }] },
  { kr: '여권을 보여주세요', target: 'パスポートを見せてください', note: 'パスポートをみせてください', krPronunciation: '파스포-토오 미세테 쿠다사이', tokens: [{ text: 'パスポートを', gloss: '여권을' }, { text: '見せて', gloss: '보여줘' }, { text: 'ください', gloss: '~해주세요' }] },
  { kr: '이 버스는 역에 가나요?', target: 'このバスは駅に行きますか？', note: 'このバスはえきにいきますか？', krPronunciation: '코노 바스와 에키니 이키마스카', tokens: [{ text: 'この', gloss: '이' }, { text: 'バスは', gloss: '버스는' }, { text: '駅に', gloss: '역에' }, { text: '行きますか', gloss: '가나요?' }] },
  { kr: '표는 어디서 사요?', target: '切符はどこで買いますか？', note: 'きっぷはどこでかいますか？', krPronunciation: '킷푸와 도코데 카이마스카', tokens: [{ text: '切符は', gloss: '표는' }, { text: 'どこで', gloss: '어디서' }, { text: '買いますか', gloss: '사나요?' }] },
  { kr: '다음 역은 어디예요?', target: '次の駅はどこですか？', note: 'つぎのえきはどこですか？', krPronunciation: '츠기노 에키와 도코데스카', tokens: [{ text: '次の', gloss: '다음' }, { text: '駅は', gloss: '역은' }, { text: 'どこ', gloss: '어디' }, { text: 'ですか', gloss: '~인가요?' }] },
]

const airport2: Card[] = [
  { kr: '택시를 불러주세요', target: 'タクシーを呼んでください', note: 'タクシーをよんでください', krPronunciation: '타쿠시-오 욘데 쿠다사이', tokens: [{ text: 'タクシーを', gloss: '택시를' }, { text: '呼んで', gloss: '불러' }, { text: 'ください', gloss: '~해주세요' }] },
  { kr: '이 짐을 맡길 수 있나요?', target: 'この荷物を預けられますか？', note: 'このにもつをあずけられますか？', krPronunciation: '코노 니모츠오 아즈케라레마스카', tokens: [{ text: 'この', gloss: '이' }, { text: '荷物を', gloss: '짐을' }, { text: '預け', gloss: '맡기다' }, { text: 'られますか', gloss: '~할 수 있나요?' }] },
  { kr: '탑승구가 어디예요?', target: '搭乗口はどこですか？', note: 'とうじょうぐちはどこですか？', krPronunciation: '토-죠-구치와 도코데스카', tokens: [{ text: '搭乗口は', gloss: '탑승구는' }, { text: 'どこ', gloss: '어디' }, { text: 'ですか', gloss: '~인가요?' }] },
  { kr: '얼마예요?', target: 'いくらですか？', krPronunciation: '이쿠라 데스카', tokens: [{ text: 'いくら', gloss: '얼마' }, { text: 'ですか', gloss: '~인가요?' }] },
  { kr: '환승해야 하나요?', target: '乗り換えが必要ですか？', note: 'のりかえがひつようですか？', krPronunciation: '노리카에가 히츠요- 데스카', tokens: [{ text: '乗り換えが', gloss: '환승이' }, { text: '必要', gloss: '필요' }, { text: 'ですか', gloss: '~인가요?' }] },
]

const hotel1: Card[] = [
  { kr: '예약했습니다', target: '予約しました', note: 'よやくしました', krPronunciation: '요야쿠 시마시타', tokens: [{ text: '予約', gloss: '예약' }, { text: 'しました', gloss: '했습니다' }] },
  { kr: '체크인하고 싶어요', target: 'チェックインしたいです', krPronunciation: '첵쿠인 시타이데스', tokens: [{ text: 'チェックイン', gloss: '체크인' }, { text: 'したいです', gloss: '하고 싶어요' }] },
  { kr: '와이파이 비밀번호가 뭐예요?', target: 'Wi-Fiのパスワードは何ですか？', note: 'Wi-Fiのパスワードはなんですか？', krPronunciation: '와이파이노 파스와-도와 난데스카', tokens: [{ text: 'Wi-Fiの', gloss: '와이파이의' }, { text: 'パスワードは', gloss: '비밀번호는' }, { text: '何', gloss: '무엇' }, { text: 'ですか', gloss: '~인가요?' }] },
  { kr: '화장실이 어디예요?', target: 'トイレはどこですか？', krPronunciation: '토이레와 도코데스카', tokens: [{ text: 'トイレは', gloss: '화장실은' }, { text: 'どこ', gloss: '어디' }, { text: 'ですか', gloss: '~인가요?' }] },
  { kr: '체크아웃은 몇 시예요?', target: 'チェックアウトは何時ですか？', note: 'チェックアウトはなんじですか？', krPronunciation: '첵쿠아우토와 난지데스카', tokens: [{ text: 'チェックアウトは', gloss: '체크아웃은' }, { text: '何時', gloss: '몇 시' }, { text: 'ですか', gloss: '~인가요?' }] },
]

const hotel2: Card[] = [
  { kr: '이 길이 맞나요?', target: 'この道で合っていますか？', note: 'このみちであっていますか？', krPronunciation: '코노 미치데 앗테이마스카', tokens: [{ text: 'この道で', gloss: '이 길로' }, { text: '合って', gloss: '맞음' }, { text: 'いますか', gloss: '~있나요?' }] },
  { kr: '똑바로 가세요', target: 'まっすぐ行ってください', note: 'まっすぐいってください', krPronunciation: '맛스구 잇테 쿠다사이', tokens: [{ text: 'まっすぐ', gloss: '똑바로' }, { text: '行って', gloss: '가서' }, { text: 'ください', gloss: '~해주세요' }] },
  { kr: '왼쪽으로 도세요', target: '左に曲がってください', note: 'ひだりにまがってください', krPronunciation: '히다리니 마갓테 쿠다사이', tokens: [{ text: '左に', gloss: '왼쪽으로' }, { text: '曲がって', gloss: '돌아서' }, { text: 'ください', gloss: '~해주세요' }] },
  { kr: '여기서 멀어요?', target: 'ここから遠いですか？', note: 'ここからとおいですか？', krPronunciation: '코코카라 토-이데스카', tokens: [{ text: 'ここから', gloss: '여기서' }, { text: '遠い', gloss: '먼' }, { text: 'ですか', gloss: '~인가요?' }] },
  { kr: '지도를 보여주세요', target: '地図を見せてください', note: 'ちずをみせてください', krPronunciation: '치즈오 미세테 쿠다사이', tokens: [{ text: '地図を', gloss: '지도를' }, { text: '見せて', gloss: '보여줘' }, { text: 'ください', gloss: '~해주세요' }] },
]

const food1: Card[] = [
  { kr: '두 명이에요', target: '二人です', note: 'ふたりです', krPronunciation: '후타리데스', tokens: [{ text: '二人', gloss: '두 명' }, { text: 'です', gloss: '~입니다' }] },
  { kr: '메뉴판 좀 주세요', target: 'メニューをください', krPronunciation: '메뉴-오 쿠다사이', tokens: [{ text: 'メニューを', gloss: '메뉴를' }, { text: 'ください', gloss: '주세요' }] },
  { kr: '이거 주세요', target: 'これをください', krPronunciation: '코레오 쿠다사이', tokens: [{ text: 'これを', gloss: '이것을' }, { text: 'ください', gloss: '주세요' }] },
  { kr: '맛있어요', target: 'おいしいです', krPronunciation: '오이시-데스', tokens: [{ text: 'おいしい', gloss: '맛있는' }, { text: 'です', gloss: '~입니다' }] },
  { kr: '계산해 주세요', target: 'お会計をお願いします', note: 'おかいけいをおねがいします', krPronunciation: '오카이케-오 오네가이시마스', tokens: [{ text: 'お会計を', gloss: '계산을' }, { text: 'お願いします', gloss: '부탁드립니다' }] },
]

const food2: Card[] = [
  { kr: '물 좀 주세요', target: 'お水をください', note: 'おみずをください', krPronunciation: '오미즈오 쿠다사이', tokens: [{ text: 'お水を', gloss: '물을' }, { text: 'ください', gloss: '주세요' }] },
  { kr: '매운 음식을 못 먹어요', target: '辛い食べ物が食べられません', note: 'からいたべものがたべられません', krPronunciation: '카라이 타베모노가 타베라레마센', tokens: [{ text: '辛い', gloss: '매운' }, { text: '食べ物が', gloss: '음식을' }, { text: '食べられません', gloss: '못 먹어요' }] },
  { kr: '추천 메뉴가 뭐예요?', target: 'おすすめは何ですか？', note: 'おすすめはなんですか？', krPronunciation: '오스스메와 난데스카', tokens: [{ text: 'おすすめは', gloss: '추천은' }, { text: '何', gloss: '무엇' }, { text: 'ですか', gloss: '~인가요?' }] },
  { kr: '잘 먹었습니다', target: 'ごちそうさまでした', krPronunciation: '고치소-사마데시타', tokens: [{ text: 'ごちそうさまでした', gloss: '잘 먹었습니다' }] },
  { kr: '포장 가능한가요?', target: '持ち帰りできますか？', note: 'もちかえりできますか？', krPronunciation: '모치카에리 데키마스카', tokens: [{ text: '持ち帰り', gloss: '포장' }, { text: 'できますか', gloss: '가능한가요?' }] },
]

export const jaCourse: Course = {
  id: 'ja',
  title: '일본어',
  flag: '🇯🇵',
  tagline: '여행하며 배우는 일본어',
  color: 'orange',
  speechLang: 'ja-JP',
  units: [
    buildUnit(
      'ja-u1',
      '인사 & 기본 표현',
      '기본 인사말과 예의 표현을 배워요',
      '🙏',
      [
        buildLesson('ja-u1-l1', '기본 인사', greetings1),
        buildLesson('ja-u1-l2', '자기소개', greetings2),
      ],
      { videoId: 'HrXSR7WcDho', title: '일본어 인사말 (아침,점심,저녁)' },
    ),
    buildUnit(
      'ja-u2',
      '공항 & 교통',
      '공항에서 목적지까지 이동해봐요',
      '✈️',
      [
        buildLesson('ja-u2-l1', '공항에서', airport1),
        buildLesson('ja-u2-l2', '대중교통 이용', airport2),
      ],
      { videoId: '6D44Um8dMH0', title: '공항에서 쓰는 일본어 표현 7가지' },
    ),
    buildUnit(
      'ja-u3',
      '숙소 & 길찾기',
      '체크인부터 길 묻기까지',
      '🏨',
      [
        buildLesson('ja-u3-l1', '호텔 체크인', hotel1),
        buildLesson('ja-u3-l2', '길 찾기', hotel2),
      ],
      { videoId: 'nTPWW0UDHW4', title: '호텔 체크인 필수 일본어 문장' },
    ),
    buildUnit(
      'ja-u4',
      '식당 & 음식',
      '주문부터 계산까지 완벽하게',
      '🍜',
      [
        buildLesson('ja-u4-l1', '식당에서 주문하기', food1),
        buildLesson('ja-u4-l2', '취향과 계산', food2),
      ],
      { videoId: 'EdCzDXIQ7II', title: '일본 식당 직원에게 반드시 듣는 말' },
    ),
  ],
}
