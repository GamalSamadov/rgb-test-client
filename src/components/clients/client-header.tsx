import Link from 'next/link'

import type { Client } from '@/types/client'
import { Button } from '@/components/ui/button'

interface ClientHeaderProps {
	client: Client
}

export function ClientHeader({ client }: ClientHeaderProps) {
	return (
		<div className='flex items-center justify-between'>
			<div>
				<h1 className='text-2xl font-semibold tracking-tight'>{client.name}</h1>
				<p className='text-sm text-slate-200'>{client.email}</p>
				{client.phone && (
					<p className='text-sm text-slate-400'>{client.phone}</p>
				)}
				<p className='mt-1 text-xs text-slate-400'>
					Shortcuts: <kbd>N</kbd> new deal, <kbd>B</kbd> back
				</p>
			</div>
			<Link href='/clients'>
				<Button className='bg-slate-50 text-slate-900 border border-slate-300 hover:bg-slate-200 transition-colors'>
					Back to clients
				</Button>
			</Link>
		</div>
	)
}
