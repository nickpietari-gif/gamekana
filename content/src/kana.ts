export interface Kana {
  readonly symbol: string;
  readonly romaji: string;
}

export interface Level {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly kana: readonly Kana[];
}

export const LEVELS: readonly Level[] = [
  { id: 'vowels', title: 'Sky Garden', subtitle: 'Vowels', kana: [
    { symbol: 'あ', romaji: 'a' }, { symbol: 'い', romaji: 'i' },
    { symbol: 'う', romaji: 'u' }, { symbol: 'え', romaji: 'e' }, { symbol: 'お', romaji: 'o' }
  ] },
  { id: 'k', title: 'Blue Lagoon', subtitle: 'K row', kana: [
    { symbol: 'か', romaji: 'ka' }, { symbol: 'き', romaji: 'ki' },
    { symbol: 'く', romaji: 'ku' }, { symbol: 'け', romaji: 'ke' }, { symbol: 'こ', romaji: 'ko' }
  ] },
  { id: 's', title: 'Cloud Arcade', subtitle: 'S row', kana: [
    { symbol: 'さ', romaji: 'sa' }, { symbol: 'し', romaji: 'shi' },
    { symbol: 'す', romaji: 'su' }, { symbol: 'せ', romaji: 'se' }, { symbol: 'そ', romaji: 'so' }
  ] },
  { id: 't', title: 'Sunlit Coast', subtitle: 'T row', kana: [
    { symbol: 'た', romaji: 'ta' }, { symbol: 'ち', romaji: 'chi' },
    { symbol: 'つ', romaji: 'tsu' }, { symbol: 'て', romaji: 'te' }, { symbol: 'と', romaji: 'to' }
  ] },
  { id: 'n', title: 'Breeze Valley', subtitle: 'N row', kana: [
    { symbol: 'な', romaji: 'na' }, { symbol: 'に', romaji: 'ni' },
    { symbol: 'ぬ', romaji: 'nu' }, { symbol: 'ね', romaji: 'ne' }, { symbol: 'の', romaji: 'no' }
  ] },
  { id: 'h', title: 'Crystal Bay', subtitle: 'H row', kana: [
    { symbol: 'は', romaji: 'ha' }, { symbol: 'ひ', romaji: 'hi' },
    { symbol: 'ふ', romaji: 'fu' }, { symbol: 'へ', romaji: 'he' }, { symbol: 'ほ', romaji: 'ho' }
  ] },
  { id: 'm', title: 'Aurora Plaza', subtitle: 'M row', kana: [
    { symbol: 'ま', romaji: 'ma' }, { symbol: 'み', romaji: 'mi' },
    { symbol: 'む', romaji: 'mu' }, { symbol: 'め', romaji: 'me' }, { symbol: 'も', romaji: 'mo' }
  ] },
  { id: 'y', title: 'Aqua Park', subtitle: 'Y row', kana: [
    { symbol: 'や', romaji: 'ya' }, { symbol: 'ゆ', romaji: 'yu' }, { symbol: 'よ', romaji: 'yo' }
  ] },
  { id: 'r', title: 'Pearl Harbor', subtitle: 'R row', kana: [
    { symbol: 'ら', romaji: 'ra' }, { symbol: 'り', romaji: 'ri' },
    { symbol: 'る', romaji: 'ru' }, { symbol: 'れ', romaji: 're' }, { symbol: 'ろ', romaji: 'ro' }
  ] },
  { id: 'w', title: 'Rainbow Gate', subtitle: 'W and N', kana: [
    { symbol: 'わ', romaji: 'wa' }, { symbol: 'を', romaji: 'wo' }, { symbol: 'ん', romaji: 'n' }
  ] }
] as const;

export const ALL_KANA: readonly Kana[] = LEVELS.flatMap((level) => level.kana);
