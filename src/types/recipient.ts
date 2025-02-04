export interface Recipient {
  id: number
  name: string
  email: string
  isSelected: boolean
  type: 'individual' | 'domain'
}

export interface DomainSuggestion {
  id: string
  name: string
  type: 'domain'
  domain: string
}

export type Suggestion = Recipient | DomainSuggestion