import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function DealsHeader() {
	return (
		<div className='flex items-center justify-between'>
			<div>
				<h1 className='text-2xl font-semibold tracking-tight'>Deals</h1>
				<p className='mt-1 text-xs text-slate-400'>
					Shortcuts: <kbd>C</kbd> clients
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
