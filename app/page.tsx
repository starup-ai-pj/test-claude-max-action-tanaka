'use client';

import { useState, useEffect } from 'react';
import PersonList from '@/components/PersonList';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import SettlementView from '@/components/SettlementView';
import CurrencySettings from '@/components/CurrencySettings';
import { Person, Expense, ExchangeRate } from '@/types/expense';
import { calculateSettlements } from '@/utils/settlement';

export default function Home() {
  const [people, setPeople] = useState<Person[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [baseCurrency, setBaseCurrency] = useState('JPY');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate>({});
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  const currencies = ['JPY', 'USD', 'EUR', 'GBP', 'CNY', 'KRW', 'THB', 'SGD'];

  // Load data from localStorage on mount
  useEffect(() => {
    const savedPeople = localStorage.getItem('travel-expense-people');
    const savedExpenses = localStorage.getItem('travel-expense-expenses');
    const savedCurrency = localStorage.getItem('travel-expense-currency');
    const savedRates = localStorage.getItem('travel-expense-rates');

    if (savedPeople) setPeople(JSON.parse(savedPeople));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedCurrency) setBaseCurrency(savedCurrency);
    if (savedRates) setExchangeRates(JSON.parse(savedRates));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('travel-expense-people', JSON.stringify(people));
  }, [people]);

  useEffect(() => {
    localStorage.setItem('travel-expense-expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('travel-expense-currency', baseCurrency);
  }, [baseCurrency]);

  useEffect(() => {
    localStorage.setItem('travel-expense-rates', JSON.stringify(exchangeRates));
  }, [exchangeRates]);

  const handleAddPerson = (name: string) => {
    const newPerson: Person = {
      id: Date.now().toString(),
      name,
    };
    setPeople([...people, newPerson]);
  };

  const handleRemovePerson = (id: string) => {
    setPeople(people.filter(p => p.id !== id));
    // Also remove related expenses
    setExpenses(expenses.filter(e => 
      e.payerId !== id && !e.participantIds.includes(id)
    ));
  };

  const handleAddExpense = (expenseData: {
    payerId: string;
    amount: number;
    currency: string;
    description: string;
    participantIds: string[];
  }) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      ...expenseData,
      date: new Date().toISOString(),
    };
    setExpenses([...expenses, newExpense]);
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const fetchExchangeRates = async () => {
    setIsLoadingRates(true);
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
      const data = await response.json();
      
      // Convert rates to be relative to base currency
      const rates: ExchangeRate = {};
      currencies.forEach(currency => {
        if (currency === baseCurrency) {
          rates[currency] = 1;
        } else {
          rates[currency] = 1 / (data.rates[currency] || 1);
        }
      });
      
      setExchangeRates(rates);
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      alert('為替レートの取得に失敗しました');
    } finally {
      setIsLoadingRates(false);
    }
  };

  const settlements = calculateSettlements(people, expenses, exchangeRates, baseCurrency);

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          旅行費用精算アプリ
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <PersonList 
              people={people}
              onAddPerson={handleAddPerson}
              onRemovePerson={handleRemovePerson}
            />
            
            {people.length > 0 && (
              <ExpenseForm
                people={people}
                onAddExpense={handleAddExpense}
                currencies={currencies}
              />
            )}
          </div>

          <div className="space-y-6">
            <CurrencySettings
              baseCurrency={baseCurrency}
              onBaseCurrencyChange={setBaseCurrency}
              onFetchRates={fetchExchangeRates}
              isLoading={isLoadingRates}
            />
            
            <ExpenseList
              expenses={expenses}
              people={people}
              onRemoveExpense={handleRemoveExpense}
            />
            
            {expenses.length > 0 && (
              <SettlementView
                settlements={settlements}
                people={people}
                baseCurrency={baseCurrency}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}