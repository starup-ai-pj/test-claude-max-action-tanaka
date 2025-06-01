import { useState, useEffect } from 'react'
import { Currency } from '../types'

interface Props {
  currencies: Currency[]
  setCurrencies: (currencies: Currency[]) => void
  baseCurrency: string
  setBaseCurrency: (currency: string) => void
}

const COMMON_CURRENCIES = [
  { code: 'JPY', symbol: '¥', name: '日本円' },
  { code: 'USD', symbol: '$', name: '米ドル' },
  { code: 'EUR', symbol: '€', name: 'ユーロ' },
  { code: 'GBP', symbol: '£', name: '英ポンド' },
  { code: 'KRW', symbol: '₩', name: '韓国ウォン' },
  { code: 'CNY', symbol: '¥', name: '人民元' },
  { code: 'THB', symbol: '฿', name: 'タイバーツ' },
  { code: 'TWD', symbol: 'NT$', name: '台湾ドル' },
]

export default function CurrencySettings({ currencies, setCurrencies, baseCurrency, setBaseCurrency }: Props) {
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [customRate, setCustomRate] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (currencies.length === 1 && currencies[0].code === 'JPY') {
      addCurrency('USD')
    }
  }, [])

  const fetchExchangeRate = async (from: string, to: string): Promise<number | null> => {
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${to}`)
      const data = await response.json()
      return data.rates[from] || null
    } catch (error) {
      console.error('為替レート取得エラー:', error)
      return null
    }
  }

  const addCurrency = async (code: string) => {
    if (currencies.find(c => c.code === code)) {
      alert('この通貨は既に追加されています')
      return
    }

    setIsLoading(true)
    const rate = await fetchExchangeRate(code, baseCurrency)
    setIsLoading(false)

    if (rate) {
      const currencyInfo = COMMON_CURRENCIES.find(c => c.code === code)
      const newCurrency: Currency = {
        code,
        rate,
        symbol: currencyInfo?.symbol || code
      }
      setCurrencies([...currencies, newCurrency])
    } else {
      alert('為替レートの取得に失敗しました。手動で入力してください。')
    }
  }

  const addCustomCurrency = () => {
    const code = selectedCurrency
    const rate = parseFloat(customRate)

    if (isNaN(rate) || rate <= 0) {
      alert('正しいレートを入力してください')
      return
    }

    if (currencies.find(c => c.code === code)) {
      alert('この通貨は既に追加されています')
      return
    }

    const currencyInfo = COMMON_CURRENCIES.find(c => c.code === code)
    const newCurrency: Currency = {
      code,
      rate,
      symbol: currencyInfo?.symbol || code
    }
    setCurrencies([...currencies, newCurrency])
    setCustomRate('')
  }

  const updateRates = async () => {
    setIsLoading(true)
    const updatedCurrencies = await Promise.all(
      currencies.map(async (currency) => {
        if (currency.code === baseCurrency) {
          return { ...currency, rate: 1 }
        }
        const rate = await fetchExchangeRate(currency.code, baseCurrency)
        return rate ? { ...currency, rate } : currency
      })
    )
    setCurrencies(updatedCurrencies)
    setIsLoading(false)
  }

  const removeCurrency = (code: string) => {
    if (code === baseCurrency) {
      alert('基準通貨は削除できません')
      return
    }
    setCurrencies(currencies.filter(c => c.code !== code))
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">通貨設定</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">基準通貨</label>
        <select
          value={baseCurrency}
          onChange={(e) => {
            setBaseCurrency(e.target.value)
            updateRates()
          }}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.code} ({currency.symbol})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">登録済み通貨</h4>
          <button
            onClick={updateRates}
            disabled={isLoading}
            className="text-sm text-blue-500 hover:text-blue-600 disabled:text-gray-400"
          >
            {isLoading ? '更新中...' : 'レート更新'}
          </button>
        </div>
        <div className="space-y-2">
          {currencies.map((currency) => (
            <div key={currency.code} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>
                {currency.code} ({currency.symbol})
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  1 {currency.code} = {(1 / currency.rate).toFixed(4)} {baseCurrency}
                </span>
                {currency.code !== baseCurrency && (
                  <button
                    onClick={() => removeCurrency(currency.code)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    削除
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">通貨を追加</h4>
        <div className="flex gap-2">
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {COMMON_CURRENCIES
              .filter(c => !currencies.find(curr => curr.code === c.code))
              .map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
          </select>
          <button
            onClick={() => addCurrency(selectedCurrency)}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? '取得中...' : '自動取得'}
          </button>
        </div>
        
        <div className="flex gap-2">
          <input
            type="number"
            value={customRate}
            onChange={(e) => setCustomRate(e.target.value)}
            placeholder={`1 ${selectedCurrency} = ? ${baseCurrency}`}
            min="0.0001"
            step="0.0001"
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addCustomCurrency}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            手動追加
          </button>
        </div>
      </div>
    </div>
  )
}