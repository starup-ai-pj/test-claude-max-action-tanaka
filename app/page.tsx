'use client'

import { useState, useEffect } from 'react'
import ParticipantList from './components/ParticipantList'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import Settlement from './components/Settlement'
import CurrencySettings from './components/CurrencySettings'
import { Participant, Expense, Currency } from './types'

export default function Home() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [currencies, setCurrencies] = useState<Currency[]>([
    { code: 'JPY', rate: 1, symbol: '¥' }
  ])
  const [baseCurrency, setBaseCurrency] = useState<string>('JPY')
  const [isInternational, setIsInternational] = useState(false)

  useEffect(() => {
    const savedData = localStorage.getItem('travelExpenseData')
    if (savedData) {
      const data = JSON.parse(savedData)
      setParticipants(data.participants || [])
      setExpenses(data.expenses || [])
      setCurrencies(data.currencies || [{ code: 'JPY', rate: 1, symbol: '¥' }])
      setBaseCurrency(data.baseCurrency || 'JPY')
      setIsInternational(data.isInternational || false)
    }
  }, [])

  useEffect(() => {
    const dataToSave = {
      participants,
      expenses,
      currencies,
      baseCurrency,
      isInternational
    }
    localStorage.setItem('travelExpenseData', JSON.stringify(dataToSave))
  }, [participants, expenses, currencies, baseCurrency, isInternational])

  const addParticipant = (name: string) => {
    const newParticipant: Participant = {
      id: Date.now().toString(),
      name
    }
    setParticipants([...participants, newParticipant])
  }

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id))
    setExpenses(expenses.filter(e => 
      e.payerId !== id && !e.splitBetween.includes(id)
    ))
  }

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString()
    }
    setExpenses([...expenses, newExpense])
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id))
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          旅行費用精算アプリ
        </h1>

        <div className="mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isInternational}
              onChange={(e) => setIsInternational(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-lg">海外旅行モード（複数通貨対応）</span>
          </label>
        </div>

        {isInternational && (
          <CurrencySettings
            currencies={currencies}
            setCurrencies={setCurrencies}
            baseCurrency={baseCurrency}
            setBaseCurrency={setBaseCurrency}
          />
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">参加者</h2>
            <ParticipantList
              participants={participants}
              onAdd={addParticipant}
              onRemove={removeParticipant}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">支払い記録</h2>
            {participants.length >= 2 ? (
              <ExpenseForm
                participants={participants}
                currencies={isInternational ? currencies : [{ code: 'JPY', rate: 1, symbol: '¥' }]}
                onAdd={addExpense}
              />
            ) : (
              <p className="text-gray-500">参加者を2人以上追加してください</p>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">支払い一覧</h2>
          <ExpenseList
            expenses={expenses}
            participants={participants}
            currencies={isInternational ? currencies : [{ code: 'JPY', rate: 1, symbol: '¥' }]}
            baseCurrency={baseCurrency}
            onDelete={deleteExpense}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">精算</h2>
          <Settlement
            expenses={expenses}
            participants={participants}
            currencies={isInternational ? currencies : [{ code: 'JPY', rate: 1, symbol: '¥' }]}
            baseCurrency={baseCurrency}
          />
        </div>
      </div>
    </main>
  )
}