import type { VocabWord } from './types'

// "기적의 말하기 영단어 1000" DAY 02. Entries 01-34 are missing (only their
// names are known from the review checklist, not the meanings or example
// sentences), so only 35-50 are transcribed for now.
export const day2Words: VocabWord[] = [
  {
    id: 'day2-35',
    day: 2,
    word: 'nervous',
    pronunciation: '널버스',
    partOfSpeech: '형',
    meaning: '긴장한, 과민한',
    examples: [
      { en: "I'm not nervous.", kr: '난 긴장되지 않아.' },
      { en: "I'm not that nervous.", kr: '난 그렇게 긴장되지 않아.' },
    ],
  },
  {
    id: 'day2-36',
    day: 2,
    word: 'in the mood',
    pronunciation: '인 더 무-드',
    meaning: '~할 기분인, ~할 생각인',
    examples: [
      { en: "I'm not in the mood for a movie.", kr: '나 영화 볼 기분이 아니야.' },
      { en: "I'm not in the mood to do it.", kr: '나 그걸 할 기분이 아니야.' },
    ],
  },
  {
    id: 'day2-37',
    day: 2,
    word: 'feel sick',
    pronunciation: '퓔 씩',
    meaning: '몸[상태]이 좋지 않다',
    examples: [
      { en: 'I feel sick.', kr: '나 몸 상태가 좋지 않아.' },
      { en: 'I feel a little sick.', kr: '나 몸 상태가 약간 좋지 않아.' },
    ],
  },
  {
    id: 'day2-38',
    day: 2,
    word: 'disappointed',
    pronunciation: '디써포인티드',
    partOfSpeech: '형',
    meaning: '실망한',
    examples: [
      { en: 'I am not disappointed.', kr: '나 실망하지 않았어.' },
      { en: 'I was disappointed by the news.', kr: '나 그 소식에 실망했었어.' },
    ],
  },
  {
    id: 'day2-39',
    day: 2,
    word: 'feel sad',
    pronunciation: '퓔 새드',
    meaning: '슬프다',
    examples: [
      { en: 'I feel sad.', kr: '나 슬퍼.' },
      { en: "I don't want to feel sad anymore.", kr: '난 더 이상 슬프고 싶지 않아.' },
    ],
  },
  {
    id: 'day2-40',
    day: 2,
    word: 'feel bad',
    pronunciation: '퓔 배드',
    meaning: '속상하다, 유감이다',
    note: '안타까워서 속상하다는 의미. 화나서 속상한 경우 be upset을 주로 쓴다.',
    examples: [
      { en: 'I feel bad.', kr: '나 속상해.' },
      { en: 'I feel bad about it.', kr: '나 그것 때문에 속상해.' },
    ],
  },
  {
    id: 'day2-41',
    day: 2,
    word: 'feel stuffy',
    pronunciation: '퓔 스터퓌',
    meaning: '(숨이 막힐 듯이) 답답하다',
    examples: [
      { en: 'I feel stuffy.', kr: '나 숨 막혀.' },
      { en: 'I feel stuffy in this office.', kr: '이 사무실에선 숨이 막혀.' },
    ],
  },
  {
    id: 'day2-42',
    day: 2,
    word: 'stubborn',
    pronunciation: '스터번',
    partOfSpeech: '형',
    meaning: '(성격이) 답답한, 고집스러운',
    note: 'stubborn(고집스러운) ↔ open(개방적인), flexible(융통성 있는)',
    examples: [
      { en: 'He is stubborn.', kr: '걔는 성격이 답답해.' },
      { en: "They don't think they are stubborn.", kr: '그들은 스스로 답답하다고 생각하지 않아.' },
    ],
  },
  {
    id: 'day2-43',
    day: 2,
    word: 'small',
    pronunciation: '스몰',
    partOfSpeech: '형',
    meaning: '(공간이) 좁은, 소규모의',
    examples: [
      { en: 'This place is too small.', kr: '이곳은 너무 좁아.' },
      { en: 'This room is too small for me.', kr: '이 방은 나에게 너무 좁아.' },
    ],
  },
  {
    id: 'day2-44',
    day: 2,
    word: 'serious',
    pronunciation: '씨리어쓰',
    partOfSpeech: '형',
    meaning: '진지한, 심각한',
    examples: [
      { en: "Don't be serious.", kr: '심각하게 생각하지 마.' },
      { en: "You don't have to be serious about it.", kr: '그것에 대해 심각하게 생각할 필요 없어.' },
    ],
  },
  {
    id: 'day2-45',
    day: 2,
    word: 'confused',
    pronunciation: '컨퓨우즈드',
    partOfSpeech: '형',
    meaning: '혼란스러운',
    examples: [
      { en: "I'm not confused.", kr: '난 혼란스럽지 않아.' },
      { en: 'He was confused about it.', kr: '그는 그것에 대해 헷갈려 했어.' },
    ],
  },
  {
    id: 'day2-46',
    day: 2,
    word: 'feel mistreated',
    pronunciation: '퓔 미쓰트리디드',
    meaning: '억울해 하다',
    note: 'treat(대우하다, 대하다), mistreat(잘못 대우하다, 학대하다), mistreated(부당한 대우를 받은)',
    examples: [
      { en: 'I feel mistreated.', kr: '나 억울해.' },
      { en: 'Some of them felt mistreated.', kr: '그들 중 일부가 억울해 했어요.' },
    ],
  },
  {
    id: 'day2-47',
    day: 2,
    word: 'unfair',
    pronunciation: '언풰얼',
    partOfSpeech: '형',
    meaning: '불공평한, 부당한',
    note: 'fair(공평한, 공정한), fairly(꽤, 상당히, 공정하게)',
    examples: [
      { en: 'This is unfair.', kr: '이건 공평하지 않아.' },
      { en: 'I think this is unfair.', kr: '이거 불공평한 것 같아.' },
    ],
  },
  {
    id: 'day2-48',
    day: 2,
    word: 'let down',
    pronunciation: '렛 다운',
    conjugation: 'let-let-let',
    meaning: '실망시키다',
    examples: [
      { en: "Don't let me down.", kr: '날 실망시키지 마.' },
      { en: "I'll never let you down.", kr: '절대 널 실망시키지 않을 거야.' },
    ],
  },
  {
    id: 'day2-49',
    day: 2,
    word: 'feel relieved',
    pronunciation: '퓔 륄리-브드',
    meaning: '안심하다, 한숨 돌리다',
    examples: [
      { en: 'I really feel relieved.', kr: '정말 안심이야.' },
      { en: 'Did you feel relieved?', kr: '안심이 되었어?' },
    ],
  },
  {
    id: 'day2-50',
    day: 2,
    word: 'bother',
    pronunciation: '바덜',
    conjugation: 'bother-bothered-bothered',
    meaning: '귀찮게 하다, 괴롭히다',
    examples: [
      { en: 'Does it bother you?', kr: '그게 너에게 걸리적거려?' },
      { en: "Don't bother me anymore.", kr: '날 더 이상 귀찮게 하지 마.' },
    ],
  },
]
