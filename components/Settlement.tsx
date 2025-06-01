'use client'

import { useMemo } from 'react'
import { Expense, Participant, Settlement as SettlementType, ExchangeRates } from '@/types'

interface SettlementProps {
  expenses: Expense[]
  participants: Participant[]
  currency: string
  exchangeRates: ExchangeRates
}

export default function Settlement({
  expenses,
  participants,
  currency,
  exchangeRates,
}: SettlementProps) {
  const settlements = useMemo(() => {
    const balances: { [key: string]: number } = {}
    
    participants.forEach(p => {
      balances[p.id] = 0
    })

    expenses.forEach(expense => {
      const amountInBaseCurrency = expense.currency === currency
        ? expense.amount
        : expense.amount * (exchangeRates[currency] || 1) / (exchangeRates[expense.currency] || 1)
      
      const perPerson = amountInBaseCurrency / expense.splitBetween.length
      
      balances[expense.paidBy] += amountInBaseCurrency
      
      expense.splitBetween.forEach(participantId => {
        balances[participantId] -= perPerson
      })
    })

    const settlements: SettlementType[] = []
    const creditors = Object.entries(balances)
      .filter(([_, balance]) => balance > 0.01)
      .sort((a, b) => b[1] - a[1])
    const debtors = Object.entries(balances)
      .filter(([_, balance]) => balance < -0.01)
      .sort((a, b) => a[1] - b[1])

    let i = 0, j = 0
    while (i < creditors.length && j < debtors.length) {
      const [creditorId, creditAmount] = creditors[i]
      const [debtorId, debtAmount] = debtors[j]
      
      const amount = Math.min(creditAmount, Math.abs(debtAmount))
      
      if (amount > 0.01) {
        settlements.push({
          from: debtorId,
          to: creditorId,
          amount: Math.round(amount * 100) / 100,
        })
      }
      
      creditors[i][1] -= amount
      debtors[j][1] += amount
      
      if (creditors[i][1] <= 0.01) i++
      if (debtors[j][1] >= -0.01) j++
    }

    return settlements
  }, [expenses, participants, currency, exchangeRates])

  const getParticipantName = (id: string) => {
    return participants.find(p => p.id === id)?.name || '不明'
  }

  const totalExpenses = expenses.reduce((sum, expense) => {
    const amountInBaseCurrency = expense.currency === currency
      ? expense.amount
      : expense.amount * (exchangeRates[currency] || 1) / (exchangeRates[expense.currency] || 1)
    return sum + amountInBaseCurrency
  }, 0)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">精算</h2>
      
      {expenses.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            総費用: {totalExpenses.toLocaleString()} {currency}
          </p>
          {participants.length > 0 && (
            <p className="text-sm text-gray-600">
              1人あたり平均: {(totalExpenses / participants.length).toFixed(2)} {currency}
            </p>
          )}
        </div>
      )}

      {settlements.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          精算が必要な支払いはありません
        </p>
      ) : (
        <div className="space-y-2">
          {settlements.map((settlement, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-blue-50 rounded-md"
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium">
                  {getParticipantName(settlement.from)}
                </span>
                <span className="text-gray-600">→</span>
                <span className="font-medium">
                  {getParticipantName(settlement.to)}
                </span>
              </div>
              <span className="font-semibold text-blue-600">
                {settlement.amount.toLocaleString()} {currency}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}