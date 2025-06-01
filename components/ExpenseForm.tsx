'use client'

import { useState } from 'react'
import { Participant, Expense } from '@/types'

interface ExpenseFormProps {
  participants: Participant[]
  onAddExpense: (expense: Omit<Expense, 'id'>) => void
  currency: string
}

export default function ExpenseForm({
  participants,
  onAddExpense,
  currency,
}: ExpenseFormProps) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [expenseCurrency, setExpenseCurrency] = useState(currency)
  const [paidBy, setPaidBy] = useState('')
  const [splitBetween, setSplitBetween] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!description || !amount || !paidBy || splitBetween.length === 0) {
      alert('すべての項目を入力してください')
      return
    }

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('金額は正の数値を入力してください')
      return
    }

    onAddExpense({
      description,
      amount: numAmount,
      currency: expenseCurrency,
      paidBy,
      splitBetween,
      createdAt: new Date(),
    })

    setDescription('')
    setAmount('')
    setExpenseCurrency(currency)
    setPaidBy('')
    setSplitBetween([])
  }

  const handleSplitToggle = (participantId: string) => {
    setSplitBetween(prev =>
      prev.includes(participantId)
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    )
  }

  const selectAll = () => {
    setSplitBetween(participants.map(p => p.id))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">支払い追加</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            内容
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="例: 夕食代"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              金額
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              通貨
            </label>
            <select
              value={expenseCurrency}
              onChange={(e) => setExpenseCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="JPY">JPY</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CNY">CNY</option>
              <option value="KRW">KRW</option>
              <option value="THB">THB</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            支払者
          </label>
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">選択してください</option>
            {participants.map((participant) => (
              <option key={participant.id} value={participant.id}>
                {participant.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              割り勘対象者
            </label>
            <button
              type="button"
              onClick={selectAll}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              全員選択
            </button>
          </div>
          <div className="space-y-2">
            {participants.map((participant) => (
              <label
                key={participant.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={splitBetween.includes(participant.id)}
                  onChange={() => handleSplitToggle(participant.id)}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span>{participant.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={participants.length === 0}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300"
        >
          支払いを追加
        </button>
      </form>
    </div>
  )
}