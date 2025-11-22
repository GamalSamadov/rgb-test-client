import type { Deal } from './deal'

export interface Client {
	id: string
	name: string
	email: string
	phone?: string | null
	createdAt: string
	updatedAt: string
	deals?: Deal[]
}

export interface CreateClientInput {
	name: string
	email: string
	phone?: string
}
