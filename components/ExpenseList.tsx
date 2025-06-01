'use client'

import { Expense, Participant } from '@/types'

interface ExpenseListProps {
  expenses: Expense[]
  participants: Participant[]
  onRemoveExpense: (id: string) => void
  currency: string
}

export default function ExpenseList({
  expenses,
  participants,
  onRemoveExpense,
  currency,
}: ExpenseListProps) {
  const getParticipantName = (id: string) => {
    return participants.find(p => p.id === id)?.name || '不明'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">支払い一覧</h2>
      
      {expenses.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          支払い記録がありません
        </p>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{expense.description}</h3>
                <button
                  onClick={() => onRemoveExpense(expense.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  削除
                </button>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  金額: {expense.amount.toLocaleString()} {expense.currency}
                </p>
                <p>支払者: {getParticipantName(expense.paidBy)}</p>
                <p>
                  割り勘対象: {expense.splitBetween.map(id => getParticipantName(id)).join(', ')}
                </p>
                <p className="text-xs">
                  1人あたり: {(expense.amount / expense.splitBetween.length).toFixed(2)} {expense.currency}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}