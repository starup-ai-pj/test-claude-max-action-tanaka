'use client'

import { useState } from 'react'
import { Participant, Currency, Expense } from '@/types'

interface ExpenseFormProps {
  participants: Participant[]
  currencies: Currency[]
  onAddExpense: (expense: Omit<Expense, 'id'>) => void
}

export default function ExpenseForm({
  participants,
  currencies,
  onAddExpense,
}: ExpenseFormProps) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState(currencies[0]?.code || 'JPY')
  const [paidBy, setPaidBy] = useState('')
  const [sharedBy, setSharedBy] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!description.trim()) {
      newErrors.description = '説明を入力してください'
    }

    const amountNum = parseFloat(amount)
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = '有効な金額を入力してください'
    }

    if (!paidBy) {
      newErrors.paidBy = '支払者を選択してください'
    }

    if (sharedBy.length === 0) {
      newErrors.sharedBy = '少なくとも1人は選択してください'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onAddExpense({
      description: description.trim(),
      amount: amountNum,
      currency,
      paidBy,
      sharedBy,
      date: new Date().toISOString(),
    })

    setDescription('')
    setAmount('')
    setPaidBy('')
    setSharedBy([])
    setSelectAll(false)
    setErrors({})
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSharedBy([])
    } else {
      setSharedBy(participants.map(p => p.id))
    }
    setSelectAll(!selectAll)
  }

  const toggleSharedBy = (id: string) => {
    if (sharedBy.includes(id)) {
      setSharedBy(sharedBy.filter(pid => pid !== id))
    } else {
      setSharedBy([...sharedBy, id])
    }
  }

  if (participants.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        参加者を追加してから支払いを記録してください
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          説明
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="例: 夕食代"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            通貨
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {currencies.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.code} ({curr.symbol})
              </option>
            ))}
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">選択してください</option>
          {participants.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {errors.paidBy && (
          <p className="text-red-500 text-sm mt-1">{errors.paidBy}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          割り勘する人
        </label>
        <div className="mb-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="mr-2"
            />
            <span className="text-sm">全員選択</span>
          </label>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {participants.map((p) => (
            <label key={p.id} className="flex items-center">
              <input
                type="checkbox"
                checked={sharedBy.includes(p.id)}
                onChange={() => toggleSharedBy(p.id)}
                className="mr-2"
              />
              <span>{p.name}</span>
            </label>
          ))}
        </div>
        {errors.sharedBy && (
          <p className="text-red-500 text-sm mt-1">{errors.sharedBy}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
      >
        支払いを追加
      </button>
    </form>
  )
}