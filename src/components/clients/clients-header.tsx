import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function ClientsHeader() {
	return (
		<div className='flex items-center justify-between'>
			<div>
				<h1 className='text-2xl font-semibold tracking-tight'>Clients</h1>
				<p className='mt-1 text-xs text-slate-400'>
					Shortcuts: <kbd>N</kbd> new client, <kbd>←</kbd>/<kbd>→</kbd>{' '}
					paginate, <kbd>D</kbd> deals
				</p>
			</div>
			<Link href='/deals'>
				<Button className='bg-slate-50 text-slate-900 border border-slate-300 hover:bg-slate-200 transition-colors'>
					Go to Deals
				</Button>
			</Link>
		</div>
	)
}
