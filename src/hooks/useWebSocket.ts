import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { getIdToken } from "@/utils";

export type WsStatus = "connecting" | "connected" | "disconnected" | "error";

export interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
	isStreaming?: boolean;
}

interface UseWebSocketOptions {
	url: string;
	billNo: string;
	/** Unique key for localStorage, e.g. `chat_INV-001_john` */
	storageKey: string;
	onOpen?: () => void;
	onClose?: () => void;
	onError?: (event: Event) => void;
}

export function useWebSocket({
	url,
	billNo,
	storageKey,
	onOpen,
	onClose,
	onError,
}: UseWebSocketOptions) {
	const wsRef = useRef<WebSocket | null>(null);
	const [, navigate] = useLocation();
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
	// biome-ignore lint/correctness/useExhaustiveDependencies: <>
	useEffect(() => {
		setStatus("connecting");

		(async () => {
			const idToken = await getIdToken();

			if (!idToken) {
				console.error("Not able to fetch id token");
				navigate("/login");
				return;
			}

			const wsUrl = `${url}?token=${idToken}&billNo=${billNo}`;
			const ws = new WebSocket(wsUrl);
			wsRef.current = ws;

			ws.onopen = () => {
				setStatus("connected");
				onOpen?.();
			};

			ws.onmessage = (event: MessageEvent) => {
				let parsed = null;

				try {
					parsed = JSON.parse(event.data);
				} catch {
					return;
				}

				console.log("parsed: ", parsed);

				setMessages((prev) => {
					const last = prev[prev.length - 1];

					if (parsed.action === "stream") {
						if (last && last.role === "assistant" && last.isStreaming) {
							const updated = prev.slice(0, -1);
							return [
								...updated,
								{
									...last,
									content: last.content + parsed.text,
								},
							];
						}

						return [
							...prev,
							{
								id: `assistant-${Date.now()}`,
								role: "assistant",
								content: parsed.text,
								isStreaming: true,
							},
						];
					}

					if (parsed.action === "done" || !parsed?.action) {
						if (last?.isStreaming) {
							const updated = prev.slice(0, -1);
							return [...updated, { ...last, isStreaming: false }];
						}
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

				setTimeout(() => {
					if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
						setStatus("connecting");
					}
				}, 4000);
			};
		})();

		return () => {
			wsRef.current?.close();
		};
	}, [url, billNo, navigate]);

	const sendMessage = useCallback(
		(content: string) => {
			if (wsRef.current?.readyState === WebSocket.OPEN) {
				// Optimistically add user message
				const userMsg: ChatMessage = {
					id: `user-${Date.now()}`,
					role: "user",
					content,
				};
				setMessages((prev) => [...prev, userMsg]);
				wsRef.current.send(
					JSON.stringify({
						action: "ragchat",
						query: content,
						billNo,
					}),
				);
			}
		},
		[billNo],
	);

	/** Disconnect and clear localStorage chat history */
	const disconnect = useCallback(() => {
		wsRef.current?.close();
		localStorage.removeItem(storageKey);
		setMessages([]);
		setStatus("disconnected");
	}, [storageKey]);

	return { messages, status, sendMessage, disconnect };
}
