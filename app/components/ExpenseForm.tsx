import { useState } from 'react'
import { Participant, Expense, Currency } from '../types'

interface Props {
  participants: Participant[]
  currencies: Currency[]
  onAdd: (expense: Omit<Expense, 'id'>) => void
}

export default function ExpenseForm({ participants, currencies, onAdd }: Props) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState(currencies[0]?.code || 'JPY')
  const [payerId, setPayerId] = useState('')
  const [splitBetween, setSplitBetween] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('正しい金額を入力してください')
      return
    }

    if (!payerId) {
      alert('支払者を選択してください')
      return
    }

    if (splitBetween.length === 0) {
      alert('割り勘対象者を選択してください')
      return
    }

    onAdd({
      description,
      amount: numAmount,
      currency,
      payerId,
      splitBetween
    })

    setDescription('')
    setAmount('')
    setCurrency(currencies[0]?.code || 'JPY')
    setPayerId('')
    setSplitBetween([])
    setSelectAll(false)
  }

  const toggleParticipant = (id: string) => {
    setSplitBetween(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSplitBetween([])
    } else {
      setSplitBetween(participants.map(p => p.id))
    }
    setSelectAll(!selectAll)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">内容</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="例: 夕食代"
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">金額</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="0.01"
              step="0.01"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">通貨</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-sm font-medium mb-1">支払者</label>
          <select
            value={payerId}
            onChange={(e) => setPayerId(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium">割り勘対象者</label>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              {selectAll ? '全て解除' : '全て選択'}
            </button>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {participants.map((participant) => (
              <label
                key={participant.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={splitBetween.includes(participant.id)}
                  onChange={() => toggleParticipant(participant.id)}
                  className="w-4 h-4"
                />
                <span>{participant.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          追加
        </button>
      </form>
    </div>
  )
}