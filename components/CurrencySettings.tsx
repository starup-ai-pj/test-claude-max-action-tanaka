'use client'

interface CurrencySettingsProps {
  currency: string
  onCurrencyChange: (currency: string) => void
  loading: boolean
}

const currencies = [
  { code: 'JPY', name: '日本円' },
  { code: 'USD', name: '米ドル' },
  { code: 'EUR', name: 'ユーロ' },
  { code: 'GBP', name: '英ポンド' },
  { code: 'CNY', name: '中国元' },
  { code: 'KRW', name: '韓国ウォン' },
  { code: 'THB', name: 'タイバーツ' },
]

export default function CurrencySettings({
  currency,
  onCurrencyChange,
  loading,
}: CurrencySettingsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">基準通貨</h2>
      
      <select
        value={currency}
        onChange={(e) => onCurrencyChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {currencies.map((curr) => (
          <option key={curr.code} value={curr.code}>
            {curr.name} ({curr.code})
          </option>
        ))}
      </select>

      {loading && (
        <p className="text-sm text-gray-500 mt-2">
          為替レートを取得中...
        </p>
      )}
    </div>
  )
}