import type { Client } from './client'

export type DealStatus = 'NEW' | 'IN_PROGRESS' | 'WON' | 'LOST'

export interface Deal {
	id: string
	title: string
	amount: number
	status: DealStatus
	client: Client
	createdAt: string
	updatedAt: string
}

export interface CreateDealInput {
	title: string
	amount: number
	status: DealStatus
	clientId: string
}
