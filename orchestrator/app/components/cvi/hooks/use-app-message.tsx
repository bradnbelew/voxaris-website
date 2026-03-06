'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useDaily } from '@daily-co/daily-react';

export interface CVIAppMessage {
	event_type: string;
	conversation_id?: string;
	properties?: Record<string, unknown>;
}

/**
 * Listen for app-message events from the Tavus CVI (replica utterances, tool calls, perception, etc.)
 */
export const useAppMessage = (
	onMessage: (message: CVIAppMessage) => void
): void => {
	const daily = useDaily();
	const callbackRef = useRef(onMessage);
	callbackRef.current = onMessage;

	useEffect(() => {
		if (!daily) return;

		const handler = (event: { data: CVIAppMessage; fromId: string }) => {
			callbackRef.current(event.data);
		};

		daily.on('app-message', handler);
		return () => {
			daily.off('app-message', handler);
		};
	}, [daily]);
};
