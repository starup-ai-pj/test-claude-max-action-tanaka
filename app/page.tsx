'use client'

import { useState, useEffect } from 'react'
import ParticipantList from '@/components/ParticipantList'
import ExpenseForm from '@/components/ExpenseForm'
import ExpenseList from '@/components/ExpenseList'
import Settlement from '@/components/Settlement'
import CurrencySettings from '@/components/CurrencySettings'
import { Participant, Expense, ExchangeRates } from '@/types'

export default function Home() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [currency, setCurrency] = useState('JPY')
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedParticipants = localStorage.getItem('participants')
    const savedExpenses = localStorage.getItem('expenses')
    const savedCurrency = localStorage.getItem('currency')
    
    if (savedParticipants) setParticipants(JSON.parse(savedParticipants))
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses))
    if (savedCurrency) setCurrency(savedCurrency)
  }, [])

  useEffect(() => {
    localStorage.setItem('participants', JSON.stringify(participants))
  }, [participants])

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem('currency', currency)
  }, [currency])

  const fetchExchangeRates = async () => {
    if (currency === 'JPY') {
      setExchangeRates({})
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`https://api.exchangerate.host/latest?base=${currency}`)
      const data = await response.json()
      setExchangeRates(data.rates)
    } catch (error) {
      console.error('為替レートの取得に失敗しました:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchExchangeRates()
  }, [currency])

  const addParticipant = (name: string) => {
    const newParticipant: Participant = {
      id: Date.now().toString(),
      name,
    }
    setParticipants([...participants, newParticipant])
  }

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id))
    setExpenses(expenses.map(expense => ({
      ...expense,
      splitBetween: expense.splitBetween.filter(pid => pid !== id)
    })).filter(expense => expense.splitBetween.length > 0))
  }

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    }
    setExpenses([...expenses, newExpense])
  }

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id))
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          旅行費用精算アプリ
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ParticipantList
              participants={participants}
              onAddParticipant={addParticipant}
              onRemoveParticipant={removeParticipant}
            />

            <CurrencySettings
              currency={currency}
              onCurrencyChange={setCurrency}
              loading={loading}
            />

            <ExpenseForm
              participants={participants}
              onAddExpense={addExpense}
              currency={currency}
            />
          </div>

          <div className="space-y-6">
            <ExpenseList
              expenses={expenses}
              participants={participants}
              onRemoveExpense={removeExpense}
              currency={currency}
            />

            <Settlement
              expenses={expenses}
              participants={participants}
              currency={currency}
              exchangeRates={exchangeRates}
            />
          </div>
        </div>
      </div>
    </main>
  )
}