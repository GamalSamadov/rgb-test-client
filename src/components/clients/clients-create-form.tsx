'use client'

import { useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { createClient } from '@/lib/api/clients'
import type { CreateClientInput } from '@/types/client'

import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const createClientSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email'),
	phone: z.string().optional(),
})

type CreateClientFormValues = z.infer<typeof createClientSchema>

export function ClientsCreateForm() {
	const queryClient = useQueryClient()
	const nameInputRef = useRef<HTMLInputElement | null>(null)

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<CreateClientFormValues>({
		resolver: zodResolver(createClientSchema),
		defaultValues: { name: '', email: '', phone: '' },
	})

	const createMutation = useMutation({
		mutationFn: (payload: CreateClientInput) => createClient(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['clients'] })
			reset()
			nameInputRef.current?.focus()
		},
	})

	const onSubmit = handleSubmit(values => {
		createMutation.mutate(values)
	})

	useKeyboardShortcuts({
		n: () => {
			nameInputRef.current?.focus()
		},
	})

	return (
		<div className='rounded-xl border border-slate-800 bg-slate-900/80 shadow-sm'>
			<div className='border-b border-slate-800 px-4 py-3'>
				<h2 className='text-sm font-medium text-slate-100'>Create client</h2>
			</div>
			<div className='px-4 py-4'>
				<form onSubmit={onSubmit} className='flex flex-wrap gap-3'>
					{(() => {
						const nameField = register('name')
						return (
							<div className='flex flex-col gap-1'>
								<Input
									placeholder='Name'
									{...nameField}
									ref={el => {
										nameField.ref(el)
										nameInputRef.current = el
									}}
									className='bg-slate-950 text-slate-50 border border-slate-700 placeholder:text-slate-500'
								/>
								{errors.name && (
									<p className='text-xs text-red-400'>{errors.name.message}</p>
								)}
							</div>
						)
					})()}

					<div className='flex flex-col gap-1'>
						<Input
							placeholder='Email'
							type='email'
							{...register('email')}
							className='bg-slate-950 text-slate-50 border border-slate-700 placeholder:text-slate-500'
						/>
						{errors.email && (
							<p className='text-xs text-red-400'>{errors.email.message}</p>
						)}
					</div>

					<div className='flex flex-col gap-1'>
						<Input
							placeholder='Phone (optional)'
							{...register('phone')}
							className='bg-slate-950 text-slate-50 border border-slate-700 placeholder:text-slate-500'
						/>
						{errors.phone && (
							<p className='text-xs text-red-400'>{errors.phone.message}</p>
						)}
					</div>

					<Button
						type='submit'
						disabled={createMutation.isPending}
						className='bg-slate-50 text-slate-900 border border-slate-300 hover:bg-slate-200 transition-colors'
					>
						{createMutation.isPending ? 'Saving...' : 'Add client'}
					</Button>
				</form>

				{createMutation.isError && (
					<p className='mt-2 text-sm text-red-400'>
						Failed to create client (maybe email is already used).
					</p>
				)}
			</div>
		</div>
	)
}
