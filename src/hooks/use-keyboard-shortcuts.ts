import { useEffect, useRef } from 'react'

type KeyHandlerMap = Record<string, (event: KeyboardEvent) => void>

interface UseKeyboardShortcutsOptions {
	enabled?: boolean
}

export function useKeyboardShortcuts(
	handlers: KeyHandlerMap,
	options: UseKeyboardShortcutsOptions = {}
) {
	const { enabled = true } = options
	const handlersRef = useRef<KeyHandlerMap>(handlers)

	useEffect(() => {
		handlersRef.current = handlers
	}, [handlers])

	useEffect(() => {
		if (!enabled) return

		const listener = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null
			if (target) {
				const tagName = target.tagName
				const isInputLike =
					tagName === 'INPUT' ||
					tagName === 'TEXTAREA' ||
					tagName === 'SELECT' ||
					target.isContentEditable

				if (isInputLike) return
			}

			const currentHandlers = handlersRef.current
			const keyLower = event.key.toLowerCase()

			const handler =
				currentHandlers[keyLower] ?? currentHandlers[event.key] ?? undefined

			if (handler) {
				event.preventDefault()
				handler(event)
			}
		}

		window.addEventListener('keydown', listener)
		return () => window.removeEventListener('keydown', listener)
	}, [enabled])
}
