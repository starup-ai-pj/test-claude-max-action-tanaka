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
  sharedBy: string[]
  date: string
}

export interface Currency {
  code: string
  rate: number
  symbol: string
}

export interface Settlement {
  from: string
  to: string
  amount: number
  currency: string
}