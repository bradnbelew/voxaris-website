'use client';

import { useCallback } from 'react';
import { useDaily } from '@daily-co/daily-react';

export interface CVISendMessage {
	message_type: 'conversation';
	event_type: string;
	conversation_id: string;
	properties?: Record<string, unknown>;
}

/**
 * Send app-message interactions to the Tavus CVI (echo, interrupt, respond, context injection, sensitivity).
 */
export const useSendAppMessage = (): ((msg: CVISendMessage) => void) => {
	const daily = useDaily();

	return useCallback(
		(msg: CVISendMessage) => {
			if (!daily) {
				console.warn('Cannot send app message — Daily not connected');
				return;
			}
			daily.sendAppMessage(msg, '*');
		},
		[daily]
	);
};
