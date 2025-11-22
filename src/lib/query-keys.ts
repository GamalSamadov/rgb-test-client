import type { DealStatus } from '@/types/deal'

enum QueryKey {
	Clients = 'clients',
	Client = 'client',
	Deals = 'deals',
}

export const queryKeys = {
	clients: (page: number, limit: number) =>
		[QueryKey.Clients, page, limit] as const,
	client: (id: string) => [QueryKey.Client, id] as const,
	deals: (filters?: { status?: DealStatus; clientId?: string }) =>
		[QueryKey.Deals, filters] as const,
}
