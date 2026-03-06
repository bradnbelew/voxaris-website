'use client';

import { useCallback } from 'react';
import { useSendAppMessage } from './use-send-app-message';

/**
 * High-level hooks for Tavus CVI interactions.
 * Wraps useSendAppMessage with typed helpers for common operations.
 */
export const useCVIInteractions = (conversationId: string) => {
	const send = useSendAppMessage();

	/** Make the replica speak arbitrary text (bypasses LLM) */
	const echo = useCallback(
		(text: string) => {
			send({
				message_type: 'conversation',
				event_type: 'conversation.echo',
				conversation_id: conversationId,
				properties: { modality: 'text', text },
			});
		},
		[send, conversationId]
	);

	/** Interrupt the replica mid-speech */
	const interrupt = useCallback(() => {
		send({
			message_type: 'conversation',
			event_type: 'conversation.interrupt',
			conversation_id: conversationId,
		});
	}, [send, conversationId]);

	/** Inject text as if the user said it (goes through LLM) */
	const respond = useCallback(
		(text: string) => {
			send({
				message_type: 'conversation',
				event_type: 'conversation.respond',
				conversation_id: conversationId,
				properties: { text },
			});
		},
		[send, conversationId]
	);

	/** Replace the conversation context entirely */
	const overwriteContext = useCallback(
		(context: string) => {
			send({
				message_type: 'conversation',
				event_type: 'conversation.overwrite_context',
				conversation_id: conversationId,
				properties: { context },
			});
		},
		[send, conversationId]
	);

	/** Append additional context without replacing existing */
	const appendContext = useCallback(
		(context: string) => {
			send({
				message_type: 'conversation',
				event_type: 'conversation.append_context',
				conversation_id: conversationId,
				properties: { context },
			});
		},
		[send, conversationId]
	);

	/** Adjust STT sensitivity on the fly */
	const setSensitivity = useCallback(
		(opts: {
			participant_pause_sensitivity?: 'low' | 'medium' | 'high';
			participant_interrupt_sensitivity?: 'low' | 'medium' | 'high';
		}) => {
			send({
				message_type: 'conversation',
				event_type: 'conversation.sensitivity',
				conversation_id: conversationId,
				properties: opts,
			});
		},
		[send, conversationId]
	);

	return { echo, interrupt, respond, overwriteContext, appendContext, setSensitivity };
};
