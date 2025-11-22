import type { Metadata } from 'next'
import './globals.css'
import { ReactQueryProvider } from '@/components/providers/react-query-provider'

export const metadata: Metadata = {
	title: 'RGB CRM Test',
	description: 'Clients & Deals CRUD app',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en'>
			<body className='min-h-screen bg-slate-950 text-slate-50'>
				<ReactQueryProvider>
					<main className='mx-auto w-full max-w-6xl'>{children}</main>
				</ReactQueryProvider>
			</body>
		</html>
	)
}
