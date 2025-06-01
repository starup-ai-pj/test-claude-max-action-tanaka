export interface Person {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  payerId: string;
  amount: number;
  currency: string;
  description: string;
  participantIds: string[];
  date: string;
}

export interface Settlement {
  fromId: string;
  toId: string;
  amount: number;
}

export interface ExchangeRate {
  [key: string]: number;
}