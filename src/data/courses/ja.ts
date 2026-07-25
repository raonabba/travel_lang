import type { Course } from '../types'
import { buildLesson, buildUnit, type Card } from '../courseBuilder'

const greetings1: Card[] = [
  { kr: '안녕하세요', target: 'こんにちは', tokens: ['こんにちは'] },
  { kr: '감사합니다', target: 'ありがとうございます', tokens: ['ありがとう', 'ございます'] },
  { kr: '죄송합니다', target: 'すみません', tokens: ['すみません'] },
  { kr: '네', target: 'はい', tokens: ['はい'] },
  { kr: '아니요', target: 'いいえ', tokens: ['いいえ'] },
]

const greetings2: Card[] = [
  { kr: '저는 여행객입니다', target: '私は旅行者です', note: 'わたしはりょこうしゃです', tokens: ['私は', '旅行者', 'です'] },
  { kr: '처음 뵙겠습니다', target: 'はじめまして', tokens: ['はじめまして'] },
  { kr: '잘 부탁드립니다', target: 'よろしくお願いします', note: 'よろしくおねがいします', tokens: ['よろしく', 'お願いします'] },
  { kr: '실례합니다', target: '失礼します', note: 'しつれいします', tokens: ['失礼します'] },
  { kr: '괜찮습니다', target: '大丈夫です', note: 'だいじょうぶです', tokens: ['大丈夫', 'です'] },
]

const airport1: Card[] = [
  { kr: '공항이 어디예요?', target: '空港はどこですか？', note: 'くうこうはどこですか？', tokens: ['空港は', 'どこ', 'ですか'] },
  { kr: '여권을 보여주세요', target: 'パスポートを見せてください', note: 'パスポートをみせてください', tokens: ['パスポートを', '見せて', 'ください'] },
  { kr: '이 버스는 역에 가나요?', target: 'このバスは駅に行きますか？', note: 'このバスはえきにいきますか？', tokens: ['この', 'バスは', '駅に', '行きますか'] },
  { kr: '표는 어디서 사요?', target: '切符はどこで買いますか？', note: 'きっぷはどこでかいますか？', tokens: ['切符は', 'どこで', '買いますか'] },
  { kr: '다음 역은 어디예요?', target: '次の駅はどこですか？', note: 'つぎのえきはどこですか？', tokens: ['次の', '駅は', 'どこ', 'ですか'] },
]

const airport2: Card[] = [
  { kr: '택시를 불러주세요', target: 'タクシーを呼んでください', note: 'タクシーをよんでください', tokens: ['タクシーを', '呼んで', 'ください'] },
  { kr: '이 짐을 맡길 수 있나요?', target: 'この荷物を預けられますか？', note: 'このにもつをあずけられますか？', tokens: ['この', '荷物を', '預け', 'られますか'] },
  { kr: '탑승구가 어디예요?', target: '搭乗口はどこですか？', note: 'とうじょうぐちはどこですか？', tokens: ['搭乗口は', 'どこ', 'ですか'] },
  { kr: '얼마예요?', target: 'いくらですか？', tokens: ['いくら', 'ですか'] },
  { kr: '환승해야 하나요?', target: '乗り換えが必要ですか？', note: 'のりかえがひつようですか？', tokens: ['乗り換えが', '必要', 'ですか'] },
]

const hotel1: Card[] = [
  { kr: '예약했습니다', target: '予約しました', note: 'よやくしました', tokens: ['予約', 'しました'] },
  { kr: '체크인하고 싶어요', target: 'チェックインしたいです', tokens: ['チェックイン', 'したいです'] },
  { kr: '와이파이 비밀번호가 뭐예요?', target: 'Wi-Fiのパスワードは何ですか？', note: 'Wi-Fiのパスワードはなんですか？', tokens: ['Wi-Fiの', 'パスワードは', '何', 'ですか'] },
  { kr: '화장실이 어디예요?', target: 'トイレはどこですか？', tokens: ['トイレは', 'どこ', 'ですか'] },
  { kr: '체크아웃은 몇 시예요?', target: 'チェックアウトは何時ですか？', note: 'チェックアウトはなんじですか？', tokens: ['チェックアウトは', '何時', 'ですか'] },
]

const hotel2: Card[] = [
  { kr: '이 길이 맞나요?', target: 'この道で合っていますか？', note: 'このみちであっていますか？', tokens: ['この道で', '合って', 'いますか'] },
  { kr: '똑바로 가세요', target: 'まっすぐ行ってください', note: 'まっすぐいってください', tokens: ['まっすぐ', '行って', 'ください'] },
  { kr: '왼쪽으로 도세요', target: '左に曲がってください', note: 'ひだりにまがってください', tokens: ['左に', '曲がって', 'ください'] },
  { kr: '여기서 멀어요?', target: 'ここから遠いですか？', note: 'ここからとおいですか？', tokens: ['ここから', '遠い', 'ですか'] },
  { kr: '지도를 보여주세요', target: '地図を見せてください', note: 'ちずをみせてください', tokens: ['地図を', '見せて', 'ください'] },
]

const food1: Card[] = [
  { kr: '두 명이에요', target: '二人です', note: 'ふたりです', tokens: ['二人', 'です'] },
  { kr: '메뉴판 좀 주세요', target: 'メニューをください', tokens: ['メニューを', 'ください'] },
  { kr: '이거 주세요', target: 'これをください', tokens: ['これを', 'ください'] },
  { kr: '맛있어요', target: 'おいしいです', tokens: ['おいしい', 'です'] },
  { kr: '계산해 주세요', target: 'お会計をお願いします', note: 'おかいけいをおねがいします', tokens: ['お会計を', 'お願いします'] },
]

const food2: Card[] = [
  { kr: '물 좀 주세요', target: 'お水をください', note: 'おみずをください', tokens: ['お水を', 'ください'] },
  { kr: '매운 음식을 못 먹어요', target: '辛い食べ物が食べられません', note: 'からいたべものがたべられません', tokens: ['辛い', '食べ物が', '食べられません'] },
  { kr: '추천 메뉴가 뭐예요?', target: 'おすすめは何ですか？', note: 'おすすめはなんですか？', tokens: ['おすすめは', '何', 'ですか'] },
  { kr: '잘 먹었습니다', target: 'ごちそうさまでした', tokens: ['ごちそうさまでした'] },
  { kr: '포장 가능한가요?', target: '持ち帰りできますか？', note: 'もちかえりできますか？', tokens: ['持ち帰り', 'できますか'] },
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
