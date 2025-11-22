import { Button } from '@/components/ui/button'

interface ClientsPaginationProps {
	page: number
	totalPages: number
	canGoNext: boolean
	onChangePage: (page: number) => void
}

export function ClientsPagination({
	page,
	totalPages,
	canGoNext,
	onChangePage,
}: ClientsPaginationProps) {
	return (
		<div className='mt-2 flex items-center justify-between'>
			<Button
				disabled={page === 1}
				onClick={() => page > 1 && onChangePage(page - 1)}
				className='bg-slate-50 text-slate-900 border border-slate-300 hover:bg-slate-200 transition-colors disabled:opacity-40'
			>
				Previous
			</Button>
			<span className='text-sm text-slate-400'>
				Page {page} of {totalPages}
			</span>
			<Button
				disabled={!canGoNext}
				onClick={() => canGoNext && onChangePage(page + 1)}
				className='bg-slate-50 text-slate-900 border border-slate-300 hover:bg-slate-200 transition-colors disabled:opacity-40'
			>
				Next
			</Button>
		</div>
	)
}
