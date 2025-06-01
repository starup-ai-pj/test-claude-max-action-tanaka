'use client'

import { useState, useEffect } from 'react'
import { Currency } from '@/types'

interface CurrencySettingsProps {
  currencies: Currency[]
  baseCurrency: string
  onAddCurrency: (currency: Currency) => void
  onUpdateRate: (code: string, rate: number) => void
  onChangeBaseCurrency: (code: string) => void
}

const COMMON_CURRENCIES = [
  { code: 'USD', symbol: '$', name: '米ドル' },
  { code: 'EUR', symbol: '€', name: 'ユーロ' },
  { code: 'GBP', symbol: '£', name: '英ポンド' },
  { code: 'CNY', symbol: '¥', name: '人民元' },
  { code: 'KRW', symbol: '₩', name: 'ウォン' },
  { code: 'THB', symbol: '฿', name: 'バーツ' },
  { code: 'SGD', symbol: 'S$', name: 'シンガポールドル' },
  { code: 'AUD', symbol: 'A$', name: '豪ドル' },
]

export default function CurrencySettings({
  currencies,
  baseCurrency,
  onAddCurrency,
  onUpdateRate,
  onChangeBaseCurrency,
}: CurrencySettingsProps) {
  const [selectedCurrency, setSelectedCurrency] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const availableCurrencies = COMMON_CURRENCIES.filter(
    c => !currencies.some(existing => existing.code === c.code)
  )

  const fetchExchangeRate = async (fromCurrency: string, toCurrency: string) => {
    try {
      setIsLoading(true)
      setError('')
      
      const response = await fetch(
        `https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}`
      )
      
      if (!response.ok) {
        throw new Error('レート取得に失敗しました')
      }
      
      const data = await response.json()
      
      if (!data.success || !data.result) {
        throw new Error('有効なレートが取得できませんでした')
      }
      
      return data.result
    } catch (err) {
      setError('為替レートの取得に失敗しました。手動で入力してください。')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCurrency = async () => {
    if (!selectedCurrency) return
    
    const currencyInfo = COMMON_CURRENCIES.find(c => c.code === selectedCurrency)
    if (!currencyInfo) return
    
    const rate = await fetchExchangeRate(selectedCurrency, baseCurrency)
    
    onAddCurrency({
      code: currencyInfo.code,
      symbol: currencyInfo.symbol,
      rate: rate || 1,
    })
    
    setSelectedCurrency('')
  }

  const handleRateChange = (code: string, value: string) => {
    const rate = parseFloat(value)
    if (!isNaN(rate) && rate > 0) {
      onUpdateRate(code, rate)
    }
  }

  const handleRefreshRate = async (currency: Currency) => {
    const rate = await fetchExchangeRate(currency.code, baseCurrency)
    if (rate) {
      onUpdateRate(currency.code, rate)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          基準通貨
        </label>
        <select
          value={baseCurrency}
          onChange={(e) => onChangeBaseCurrency(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.code} ({currency.symbol})
            </option>
          ))}
        </select>
      </div>

      {availableCurrencies.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            通貨を追加
          </label>
          <div className="flex gap-2">
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">選択してください</option>
              {availableCurrencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.name} ({currency.code})
                </option>
              ))}
            </select>
            <button
              onClick={handleAddCurrency}
              disabled={!selectedCurrency || isLoading}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:bg-gray-300"
            >
              {isLoading ? '取得中...' : '追加'}
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          為替レート (1 {baseCurrency} = )
        </h4>
        <div className="space-y-2">
          {currencies
            .filter(c => c.code !== baseCurrency)
            .map((currency) => (
              <div key={currency.code} className="flex items-center gap-2">
                <span className="w-16 text-sm font-medium">
                  {currency.code}:
                </span>
                <input
                  type="number"
                  value={currency.rate}
                  onChange={(e) => handleRateChange(currency.code, e.target.value)}
                  step="0.0001"
                  min="0"
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={() => handleRefreshRate(currency)}
                  disabled={isLoading}
                  className="text-primary-500 hover:text-primary-700 text-sm"
                >
                  更新
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}