'use client'

import { useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { createDeal } from '@/lib/api/deals'
import type { DealStatus } from '@/types/deal'

import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select'

const statusOptions = ['NEW', 'IN_PROGRESS', 'WON', 'LOST'] as const
type StatusOption = (typeof statusOptions)[number]

const createDealSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	amount: z.number().min(1, 'Amount must be at least 1'),
	status: z.enum(statusOptions),
})

type CreateDealFormValues = z.infer<typeof createDealSchema>

interface ClientDealsFormProps {
	clientId: string
}

export function ClientDealsForm({ clientId }: ClientDealsFormProps) {
	const queryClient = useQueryClient()
	const titleInputRef = useRef<HTMLInputElement | null>(null)

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
		reset,
	} = useForm<CreateDealFormValues>({
		resolver: zodResolver(createDealSchema),
		defaultValues: {
			title: '',
			amount: 1,
			status: 'NEW',
		},
	})

	const status = watch('status')

	const createDealMutation = useMutation({
		mutationFn: (values: CreateDealFormValues) =>
			createDeal({
				title: values.title,
				amount: values.amount,
				status: values.status as DealStatus,
				clientId,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['client', clientId] })
			queryClient.invalidateQueries({ queryKey: ['deals'] })
			reset({ title: '', amount: 1, status: 'NEW' })
			titleInputRef.current?.focus()
		},
	})

	const onSubmit = handleSubmit(values => {
		createDealMutation.mutate(values)
	})

	useKeyboardShortcuts({
		n: () => {
			titleInputRef.current?.focus()
		},
	})

	return (
		<div className='rounded-xl border border-slate-800 bg-slate-900/80 shadow-sm'>
			<div className='border-b border-slate-800 px-4 py-3'>
				<h2 className='text-sm font-medium text-slate-100'>
					Create deal for this client
				</h2>
			</div>
			<div className='px-4 py-4'>
				<form onSubmit={onSubmit} className='flex flex-wrap items-center gap-3'>
					{(() => {
						const titleField = register('title')
						return (
							<div className='flex flex-col gap-1 min-w-[200px]'>
								<Input
									placeholder='Deal title'
									{...titleField}
									ref={el => {
										titleField.ref(el)
										titleInputRef.current = el
									}}
									className='bg-slate-950 text-slate-50 border border-slate-700 placeholder:text-slate-500'
								/>
								{errors.title && (
									<p className='text-xs text-red-400'>{errors.title.message}</p>
								)}
							</div>
						)
					})()}

					<div className='flex flex-col gap-1'>
						<Input
							placeholder='Amount'
							type='number'
							min={1}
							className='w-32 bg-slate-950 text-slate-50 border border-slate-700 placeholder:text-slate-500'
							{...register('amount', { valueAsNumber: true })}
						/>
						{errors.amount && (
							<p className='text-xs text-red-400'>{errors.amount.message}</p>
						)}
					</div>

					<div className='flex flex-col gap-1'>
						<Select
							value={status}
							onValueChange={(value: StatusOption) => setValue('status', value)}
						>
							<SelectTrigger className='w-40 bg-slate-950 text-slate-50 border border-slate-700'>
								<SelectValue placeholder='Status' />
							</SelectTrigger>
							<SelectContent className='bg-slate-900 text-slate-50 border border-slate-700'>
								{statusOptions.map(s => (
									<SelectItem key={s} value={s}>
										{s}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.status && (
							<p className='text-xs text-red-400'>{errors.status.message}</p>
						)}
					</div>

					<Button
						type='submit'
						disabled={createDealMutation.isPending}
						className='bg-slate-50 text-slate-900 border border-slate-300 hover:bg-slate-200 transition-colors'
					>
						{createDealMutation.isPending ? 'Saving...' : 'Add deal'}
					</Button>
				</form>

				{createDealMutation.isError && (
					<p className='mt-2 text-sm text-red-400'>Failed to create deal.</p>
				)}
			</div>
		</div>
	)
}
