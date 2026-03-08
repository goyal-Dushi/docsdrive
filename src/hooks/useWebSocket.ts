import { useCallback, useEffect, useRef, useState } from "react";

export type WsStatus = "connecting" | "connected" | "disconnected" | "error";

export interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
	isStreaming?: boolean;
}

interface UseWebSocketOptions {
	url: string;
	/** Unique key for localStorage, e.g. `chat_INV-001_john` */
	storageKey: string;
	onOpen?: () => void;
	onClose?: () => void;
	onError?: (event: Event) => void;
}

export function useWebSocket({
	url,
	storageKey,
	onOpen,
	onClose,
	onError,
}: UseWebSocketOptions) {
	const wsRef = useRef<WebSocket | null>(null);
	const [status, setStatus] = useState<WsStatus>("disconnected");

	// Restore history from localStorage on mount
	const [messages, setMessages] = useState<ChatMessage[]>(() => {
		try {
			const stored = localStorage.getItem(storageKey);
			return stored ? (JSON.parse(stored) as ChatMessage[]) : [];
		} catch {
			return [];
		}
	});

	// Persist messages to localStorage whenever they change
	useEffect(() => {
		localStorage.setItem(storageKey, JSON.stringify(messages));
	}, [messages, storageKey]);

	// Connect to WebSocket
	useEffect(() => {
		setStatus("connecting");
		const ws = new WebSocket(url);
		wsRef.current = ws;

		ws.onopen = () => {
			setStatus("connected");
			onOpen?.();
		};

		ws.onmessage = (event: MessageEvent) => {
			const rawData = typeof event.data === "string" ? event.data : "";

			setMessages((prev) => {
				const last = prev[prev.length - 1];

				// If the last message is an assistant streaming message, append to it
				if (last && last.role === "assistant" && last.isStreaming) {
					const updated = prev.slice(0, -1);
					// Check for stream end sentinel "[DONE]"
					if (rawData === "[DONE]") {
						return [...updated, { ...last, isStreaming: false }];
					}
					return [...updated, { ...last, content: last.content + rawData }];
				}

				// Start a new streaming assistant message
				if (rawData !== "[DONE]") {
					return [
						...prev,
						{
							id: `assistant-${Date.now()}`,
							role: "assistant",
							content: rawData,
							isStreaming: true,
						},
					];
				}
				return prev;
			});
		};

		ws.onerror = (event: Event) => {
			setStatus("error");
			onError?.(event);
		};

		ws.onclose = () => {
			setStatus("disconnected");
			onClose?.();
		};

		return () => {
			ws.close();
		};
	}, [url, onOpen, onClose, onError]);

	const sendMessage = useCallback((content: string) => {
		if (wsRef.current?.readyState === WebSocket.OPEN) {
			// Optimistically add user message
			const userMsg: ChatMessage = {
				id: `user-${Date.now()}`,
				role: "user",
				content,
			};
			setMessages((prev) => [...prev, userMsg]);
			wsRef.current.send(JSON.stringify({ message: content }));
		}
	}, []);

	/** Disconnect and clear localStorage chat history */
	const disconnect = useCallback(() => {
		wsRef.current?.close();
		localStorage.removeItem(storageKey);
		setMessages([]);
		setStatus("disconnected");
	}, [storageKey]);

	return { messages, status, sendMessage, disconnect };
}
