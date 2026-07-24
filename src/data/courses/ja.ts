import type { Course } from '../types'
import { buildLesson, buildUnit, type Card } from '../courseBuilder'

const greetings1: Card[] = [
  { kr: '안녕하세요', target: 'こんにちは', note: 'konnichiwa', tokens: ['こんにちは'] },
  { kr: '감사합니다', target: 'ありがとうございます', note: 'arigatou gozaimasu', tokens: ['ありがとう', 'ございます'] },
  { kr: '죄송합니다', target: 'すみません', note: 'sumimasen', tokens: ['すみません'] },
  { kr: '네', target: 'はい', note: 'hai', tokens: ['はい'] },
  { kr: '아니요', target: 'いいえ', note: 'iie', tokens: ['いいえ'] },
]

const greetings2: Card[] = [
  { kr: '저는 여행객입니다', target: '私は旅行者です', note: 'watashi wa ryokousha desu', tokens: ['私は', '旅行者', 'です'] },
  { kr: '처음 뵙겠습니다', target: 'はじめまして', note: 'hajimemashite', tokens: ['はじめまして'] },
  { kr: '잘 부탁드립니다', target: 'よろしくお願いします', note: 'yoroshiku onegaishimasu', tokens: ['よろしく', 'お願いします'] },
  { kr: '실례합니다', target: '失礼します', note: 'shitsurei shimasu', tokens: ['失礼します'] },
  { kr: '괜찮습니다', target: '大丈夫です', note: 'daijoubu desu', tokens: ['大丈夫', 'です'] },
]

const airport1: Card[] = [
  { kr: '공항이 어디예요?', target: '空港はどこですか？', note: 'kuukou wa doko desu ka', tokens: ['空港は', 'どこ', 'ですか'] },
  { kr: '여권을 보여주세요', target: 'パスポートを見せてください', note: 'pasupo-to wo misete kudasai', tokens: ['パスポートを', '見せて', 'ください'] },
  { kr: '이 버스는 역에 가나요?', target: 'このバスは駅に行きますか？', note: 'kono basu wa eki ni ikimasu ka', tokens: ['この', 'バスは', '駅に', '行きますか'] },
  { kr: '표는 어디서 사요?', target: '切符はどこで買いますか？', note: 'kippu wa doko de kaimasu ka', tokens: ['切符は', 'どこで', '買いますか'] },
  { kr: '다음 역은 어디예요?', target: '次の駅はどこですか？', note: 'tsugi no eki wa doko desu ka', tokens: ['次の', '駅は', 'どこ', 'ですか'] },
]

const airport2: Card[] = [
  { kr: '택시를 불러주세요', target: 'タクシーを呼んでください', note: 'takushi- wo yonde kudasai', tokens: ['タクシーを', '呼んで', 'ください'] },
  { kr: '이 짐을 맡길 수 있나요?', target: 'この荷物を預けられますか？', note: 'kono nimotsu wo azukeraremasu ka', tokens: ['この', '荷物を', '預け', 'られますか'] },
  { kr: '탑승구가 어디예요?', target: '搭乗口はどこですか？', note: 'toujouguchi wa doko desu ka', tokens: ['搭乗口は', 'どこ', 'ですか'] },
  { kr: '얼마예요?', target: 'いくらですか？', note: 'ikura desu ka', tokens: ['いくら', 'ですか'] },
  { kr: '환승해야 하나요?', target: '乗り換えが必要ですか？', note: 'norikae ga hitsuyou desu ka', tokens: ['乗り換えが', '必要', 'ですか'] },
]

const hotel1: Card[] = [
  { kr: '예약했습니다', target: '予約しました', note: 'yoyaku shimashita', tokens: ['予約', 'しました'] },
  { kr: '체크인하고 싶어요', target: 'チェックインしたいです', note: 'chekkuin shitai desu', tokens: ['チェックイン', 'したいです'] },
  { kr: '와이파이 비밀번호가 뭐예요?', target: 'Wi-Fiのパスワードは何ですか？', note: 'waifai no pasuwa-do wa nan desu ka', tokens: ['Wi-Fiの', 'パスワードは', '何', 'ですか'] },
  { kr: '화장실이 어디예요?', target: 'トイレはどこですか？', note: 'toire wa doko desu ka', tokens: ['トイレは', 'どこ', 'ですか'] },
  { kr: '체크아웃은 몇 시예요?', target: 'チェックアウトは何時ですか？', note: 'chekkuauto wa nanji desu ka', tokens: ['チェックアウトは', '何時', 'ですか'] },
]

const hotel2: Card[] = [
  { kr: '이 길이 맞나요?', target: 'この道で合っていますか？', note: 'kono michi de atteimasu ka', tokens: ['この道で', '合って', 'いますか'] },
  { kr: '똑바로 가세요', target: 'まっすぐ行ってください', note: 'massugu itte kudasai', tokens: ['まっすぐ', '行って', 'ください'] },
  { kr: '왼쪽으로 도세요', target: '左に曲がってください', note: 'hidari ni magatte kudasai', tokens: ['左に', '曲がって', 'ください'] },
  { kr: '여기서 멀어요?', target: 'ここから遠いですか？', note: 'koko kara tooi desu ka', tokens: ['ここから', '遠い', 'ですか'] },
  { kr: '지도를 보여주세요', target: '地図を見せてください', note: 'chizu wo misete kudasai', tokens: ['地図を', '見せて', 'ください'] },
]

const food1: Card[] = [
  { kr: '두 명이에요', target: '二人です', note: 'futari desu', tokens: ['二人', 'です'] },
  { kr: '메뉴판 좀 주세요', target: 'メニューをください', note: 'menyu- wo kudasai', tokens: ['メニューを', 'ください'] },
  { kr: '이거 주세요', target: 'これをください', note: 'kore wo kudasai', tokens: ['これを', 'ください'] },
  { kr: '맛있어요', target: 'おいしいです', note: 'oishii desu', tokens: ['おいしい', 'です'] },
  { kr: '계산해 주세요', target: 'お会計をお願いします', note: 'okaikei wo onegaishimasu', tokens: ['お会計を', 'お願いします'] },
]

const food2: Card[] = [
  { kr: '물 좀 주세요', target: 'お水をください', note: 'omizu wo kudasai', tokens: ['お水を', 'ください'] },
  { kr: '매운 음식을 못 먹어요', target: '辛い食べ物が食べられません', note: 'karai tabemono ga taberaremasen', tokens: ['辛い', '食べ物が', '食べられません'] },
  { kr: '추천 메뉴가 뭐예요?', target: 'おすすめは何ですか？', note: 'osusume wa nan desu ka', tokens: ['おすすめは', '何', 'ですか'] },
  { kr: '잘 먹었습니다', target: 'ごちそうさまでした', note: 'gochisousama deshita', tokens: ['ごちそうさまでした'] },
  { kr: '포장 가능한가요?', target: '持ち帰りできますか？', note: 'mochikaeri dekimasu ka', tokens: ['持ち帰り', 'できますか'] },
]

export const jaCourse: Course = {
  id: 'ja',
  title: '일본어',
  flag: '🇯🇵',
  tagline: '여행하며 배우는 일본어',
  color: 'orange',
  units: [
    buildUnit('ja-u1', '인사 & 기본 표현', '기본 인사말과 예의 표현을 배워요', '🙏', [
      buildLesson('ja-u1-l1', '기본 인사', greetings1),
      buildLesson('ja-u1-l2', '자기소개', greetings2),
    ]),
    buildUnit('ja-u2', '공항 & 교통', '공항에서 목적지까지 이동해봐요', '✈️', [
      buildLesson('ja-u2-l1', '공항에서', airport1),
      buildLesson('ja-u2-l2', '대중교통 이용', airport2),
    ]),
    buildUnit('ja-u3', '숙소 & 길찾기', '체크인부터 길 묻기까지', '🏨', [
      buildLesson('ja-u3-l1', '호텔 체크인', hotel1),
      buildLesson('ja-u3-l2', '길 찾기', hotel2),
    ]),
    buildUnit('ja-u4', '식당 & 음식', '주문부터 계산까지 완벽하게', '🍜', [
      buildLesson('ja-u4-l1', '식당에서 주문하기', food1),
      buildLesson('ja-u4-l2', '취향과 계산', food2),
    ]),
  ],
}
