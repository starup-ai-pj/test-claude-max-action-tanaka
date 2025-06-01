export interface Participant {
  id: string
  name: string
}

export interface Expense {
  id: string
  description: string
  amount: number
  currency: string
  paidBy: string
  splitBetween: string[]
  createdAt: Date
}

export interface Settlement {
  from: string
  to: string
  amount: number
}

export interface ExchangeRates {
  [key: string]: number
}