'use client'

import { useState } from 'react'
import ParticipantList from '@/components/ParticipantList'
import ExpenseForm from '@/components/ExpenseForm'
import ExpenseList from '@/components/ExpenseList'
import SettlementView from '@/components/SettlementView'
import CurrencySettings from '@/components/CurrencySettings'
import { Participant, Expense, Currency } from '@/types'

export default function Home() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [currencies, setCurrencies] = useState<Currency[]>([
    { code: 'JPY', rate: 1, symbol: '¥' }
  ])
  const [baseCurrency, setBaseCurrency] = useState<string>('JPY')
  const [activeTab, setActiveTab] = useState<'expenses' | 'settlement'>('expenses')

  const addParticipant = (name: string) => {
    const newParticipant: Participant = {
      id: Date.now().toString(),
      name,
    }
    setParticipants([...participants, newParticipant])
  }

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id))
    setExpenses(expenses.filter(e => e.paidBy !== id))
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

  const addCurrency = (currency: Currency) => {
    setCurrencies([...currencies, currency])
  }

  const updateCurrencyRate = (code: string, rate: number) => {
    setCurrencies(currencies.map(c => 
      c.code === code ? { ...c, rate } : c
    ))
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          旅行費用精算アプリ
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">参加者</h2>
              <ParticipantList
                participants={participants}
                onAddParticipant={addParticipant}
                onRemoveParticipant={removeParticipant}
              />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">通貨設定</h2>
              <CurrencySettings
                currencies={currencies}
                baseCurrency={baseCurrency}
                onAddCurrency={addCurrency}
                onUpdateRate={updateCurrencyRate}
                onChangeBaseCurrency={setBaseCurrency}
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="flex border-b">
                <button
                  className={`flex-1 px-6 py-4 font-medium transition-colors ${
                    activeTab === 'expenses'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveTab('expenses')}
                >
                  支払い記録
                </button>
                <button
                  className={`flex-1 px-6 py-4 font-medium transition-colors ${
                    activeTab === 'settlement'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveTab('settlement')}
                >
                  精算
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'expenses' ? (
                  <>
                    <ExpenseForm
                      participants={participants}
                      currencies={currencies}
                      onAddExpense={addExpense}
                    />
                    <ExpenseList
                      expenses={expenses}
                      participants={participants}
                      currencies={currencies}
                      baseCurrency={baseCurrency}
                      onRemoveExpense={removeExpense}
                    />
                  </>
                ) : (
                  <SettlementView
                    participants={participants}
                    expenses={expenses}
                    currencies={currencies}
                    baseCurrency={baseCurrency}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}