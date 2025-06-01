'use client'

import { Expense, Participant, Currency } from '@/types'

interface ExpenseListProps {
  expenses: Expense[]
  participants: Participant[]
  currencies: Currency[]
  baseCurrency: string
  onRemoveExpense: (id: string) => void
}

export default function ExpenseList({
  expenses,
  participants,
  currencies,
  baseCurrency,
  onRemoveExpense,
}: ExpenseListProps) {
  const getParticipantName = (id: string) => {
    return participants.find(p => p.id === id)?.name || '不明'
  }

  const getCurrencySymbol = (code: string) => {
    return currencies.find(c => c.code === code)?.symbol || code
  }

  const convertToBaseCurrency = (amount: number, fromCurrency: string) => {
    if (fromCurrency === baseCurrency) return amount
    
    const fromRate = currencies.find(c => c.code === fromCurrency)?.rate || 1
    const toRate = currencies.find(c => c.code === baseCurrency)?.rate || 1
    
    return (amount / fromRate) * toRate
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        まだ支払い記録がありません
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => {
        const convertedAmount = convertToBaseCurrency(expense.amount, expense.currency)
        const baseCurrencySymbol = getCurrencySymbol(baseCurrency)
        
        return (
          <div
            key={expense.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-800">{expense.description}</h3>
              <button
                onClick={() => onRemoveExpense(expense.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                削除
              </button>
            </div>
            
            <div className="text-sm text-gray-600 space-y-1">
              <div>
                <span className="font-medium">金額:</span>{' '}
                {getCurrencySymbol(expense.currency)}{expense.amount.toFixed(2)}
                {expense.currency !== baseCurrency && (
                  <span className="text-gray-500">
                    {' '}({baseCurrencySymbol}{convertedAmount.toFixed(2)})
                  </span>
                )}
              </div>
              
              <div>
                <span className="font-medium">支払者:</span>{' '}
                {getParticipantName(expense.paidBy)}
              </div>
              
              <div>
                <span className="font-medium">割り勘:</span>{' '}
                {expense.sharedBy.map(id => getParticipantName(id)).join(', ')}
              </div>
              
              <div className="text-gray-500">
                {formatDate(expense.date)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}