'use client'

import { Expense, Participant, Currency, Settlement } from '@/types'

interface SettlementViewProps {
  participants: Participant[]
  expenses: Expense[]
  currencies: Currency[]
  baseCurrency: string
}

export default function SettlementView({
  participants,
  expenses,
  currencies,
  baseCurrency,
}: SettlementViewProps) {
  const convertToBaseCurrency = (amount: number, fromCurrency: string) => {
    if (fromCurrency === baseCurrency) return amount
    
    const fromRate = currencies.find(c => c.code === fromCurrency)?.rate || 1
    const toRate = currencies.find(c => c.code === baseCurrency)?.rate || 1
    
    return (amount / fromRate) * toRate
  }

  const calculateBalances = () => {
    const balances: Record<string, number> = {}
    
    participants.forEach(p => {
      balances[p.id] = 0
    })

    expenses.forEach(expense => {
      const convertedAmount = convertToBaseCurrency(expense.amount, expense.currency)
      const perPersonAmount = convertedAmount / expense.sharedBy.length
      
      balances[expense.paidBy] += convertedAmount
      
      expense.sharedBy.forEach(personId => {
        balances[personId] -= perPersonAmount
      })
    })

    return balances
  }

  const calculateSettlements = (): Settlement[] => {
    const balances = calculateBalances()
    const settlements: Settlement[] = []
    
    const creditors = Object.entries(balances)
      .filter(([_, balance]) => balance > 0.01)
      .sort(([_, a], [__, b]) => b - a)
      .map(([id, balance]) => ({ id, balance }))
    
    const debtors = Object.entries(balances)
      .filter(([_, balance]) => balance < -0.01)
      .sort(([_, a], [__, b]) => a - b)
      .map(([id, balance]) => ({ id, balance: Math.abs(balance) }))

    let i = 0, j = 0
    
    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i]
      const debtor = debtors[j]
      
      const amount = Math.min(creditor.balance, debtor.balance)
      
      if (amount > 0.01) {
        settlements.push({
          from: debtor.id,
          to: creditor.id,
          amount: Math.round(amount * 100) / 100,
          currency: baseCurrency,
        })
      }
      
      creditor.balance -= amount
      debtor.balance -= amount
      
      if (creditor.balance < 0.01) i++
      if (debtor.balance < 0.01) j++
    }
    
    return settlements
  }

  const getParticipantName = (id: string) => {
    return participants.find(p => p.id === id)?.name || '不明'
  }

  const getCurrencySymbol = (code: string) => {
    return currencies.find(c => c.code === code)?.symbol || code
  }

  const settlements = calculateSettlements()
  const balances = calculateBalances()
  const baseCurrencySymbol = getCurrencySymbol(baseCurrency)

  const totalExpenses = expenses.reduce((sum, expense) => {
    return sum + convertToBaseCurrency(expense.amount, expense.currency)
  }, 0)

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        支払い記録がないため、精算するものがありません
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-700 mb-2">概要</h3>
        <div className="text-sm space-y-1">
          <div>
            <span className="font-medium">総支出:</span>{' '}
            {baseCurrencySymbol}{totalExpenses.toFixed(2)}
          </div>
          <div>
            <span className="font-medium">参加者数:</span>{' '}
            {participants.length}人
          </div>
          <div>
            <span className="font-medium">1人あたり平均:</span>{' '}
            {baseCurrencySymbol}{(totalExpenses / participants.length).toFixed(2)}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-3">個人別収支</h3>
        <div className="space-y-2">
          {participants.map(participant => {
            const balance = balances[participant.id] || 0
            const isPositive = balance > 0.01
            const isNegative = balance < -0.01
            
            return (
              <div
                key={participant.id}
                className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-md"
              >
                <span className="font-medium">{participant.name}</span>
                <span
                  className={`font-semibold ${
                    isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  {isPositive && '+'}
                  {baseCurrencySymbol}{balance.toFixed(2)}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-3">精算方法</h3>
        {settlements.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            精算の必要はありません
          </p>
        ) : (
          <div className="space-y-2">
            {settlements.map((settlement, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200 rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-primary-800">
                    {getParticipantName(settlement.from)}
                  </span>
                  <span className="text-primary-600">→</span>
                  <span className="font-medium text-primary-800">
                    {getParticipantName(settlement.to)}
                  </span>
                </div>
                <span className="font-bold text-primary-700">
                  {baseCurrencySymbol}{settlement.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}