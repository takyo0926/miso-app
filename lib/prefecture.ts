// 47都道府県マスターデータ
export type Prefecture = {
  code: string       // 'JP-01' 形式
  name: string       // '北海道'
  region: string     // '北海道'
}

export const PREFECTURES: Prefecture[] = [
  { code: 'JP-01', name: '北海道', region: '北海道' },
  { code: 'JP-02', name: '青森県', region: '東北' },
  { code: 'JP-03', name: '岩手県', region: '東北' },
  { code: 'JP-04', name: '宮城県', region: '東北' },
  { code: 'JP-05', name: '秋田県', region: '東北' },
  { code: 'JP-06', name: '山形県', region: '東北' },
  { code: 'JP-07', name: '福島県', region: '東北' },
  { code: 'JP-08', name: '茨城県', region: '関東' },
  { code: 'JP-09', name: '栃木県', region: '関東' },
  { code: 'JP-10', name: '群馬県', region: '関東' },
  { code: 'JP-11', name: '埼玉県', region: '関東' },
  { code: 'JP-12', name: '千葉県', region: '関東' },
  { code: 'JP-13', name: '東京都', region: '関東' },
  { code: 'JP-14', name: '神奈川県', region: '関東' },
  { code: 'JP-15', name: '新潟県', region: '中部' },
  { code: 'JP-16', name: '富山県', region: '中部' },
  { code: 'JP-17', name: '石川県', region: '中部' },
  { code: 'JP-18', name: '福井県', region: '中部' },
  { code: 'JP-19', name: '山梨県', region: '中部' },
  { code: 'JP-20', name: '長野県', region: '中部' },
  { code: 'JP-21', name: '岐阜県', region: '中部' },
  { code: 'JP-22', name: '静岡県', region: '中部' },
  { code: 'JP-23', name: '愛知県', region: '中部' },
  { code: 'JP-24', name: '三重県', region: '近畿' },
  { code: 'JP-25', name: '滋賀県', region: '近畿' },
  { code: 'JP-26', name: '京都府', region: '近畿' },
  { code: 'JP-27', name: '大阪府', region: '近畿' },
  { code: 'JP-28', name: '兵庫県', region: '近畿' },
  { code: 'JP-29', name: '奈良県', region: '近畿' },
  { code: 'JP-30', name: '和歌山県', region: '近畿' },
  { code: 'JP-31', name: '鳥取県', region: '中国' },
  { code: 'JP-32', name: '島根県', region: '中国' },
  { code: 'JP-33', name: '岡山県', region: '中国' },
  { code: 'JP-34', name: '広島県', region: '中国' },
  { code: 'JP-35', name: '山口県', region: '中国' },
  { code: 'JP-36', name: '徳島県', region: '四国' },
  { code: 'JP-37', name: '香川県', region: '四国' },
  { code: 'JP-38', name: '愛媛県', region: '四国' },
  { code: 'JP-39', name: '高知県', region: '四国' },
  { code: 'JP-40', name: '福岡県', region: '九州' },
  { code: 'JP-41', name: '佐賀県', region: '九州' },
  { code: 'JP-42', name: '長崎県', region: '九州' },
  { code: 'JP-43', name: '熊本県', region: '九州' },
  { code: 'JP-44', name: '大分県', region: '九州' },
  { code: 'JP-45', name: '宮崎県', region: '九州' },
  { code: 'JP-46', name: '鹿児島県', region: '九州' },
  { code: 'JP-47', name: '沖縄県', region: '沖縄' },
]

// コードから都道府県名を取得
export function getPrefectureByCode(code: string): Prefecture | undefined {
  return PREFECTURES.find((p) => p.code === code)
}

// 名前からコードを取得
export function getPrefectureByName(name: string): Prefecture | undefined {
  return PREFECTURES.find((p) => p.name === name)
}
