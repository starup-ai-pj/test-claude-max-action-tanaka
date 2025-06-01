'use client';

import { useState } from 'react';

interface CurrencySettingsProps {
  baseCurrency: string;
  onBaseCurrencyChange: (currency: string) => void;
  onFetchRates: () => void;
  isLoading: boolean;
}

export default function CurrencySettings({ 
  baseCurrency, 
  onBaseCurrencyChange, 
  onFetchRates,
  isLoading 
}: CurrencySettingsProps) {
  const currencies = ['JPY', 'USD', 'EUR', 'GBP', 'CNY', 'KRW', 'THB', 'SGD'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">通貨設定</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            基準通貨
          </label>
          <select
            value={baseCurrency}
            onChange={(e) => onBaseCurrencyChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onFetchRates}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? '取得中...' : '最新の為替レートを取得'}
        </button>

        <p className="text-sm text-gray-600">
          複数の通貨で支払いを記録した場合、精算時に基準通貨に換算されます。
        </p>
      </div>
    </div>
  );
}