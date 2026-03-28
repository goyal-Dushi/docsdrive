import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import { GoBackIcon, SendIcon } from "@/assets";
import { Button } from "@/components/button";
import { useWebSocket } from "@/hooks/useWebSocket";
import { StatusBadge } from "./components";

const WS_BASE_URL = import.meta.env.VITE_WS_URL;

interface ChatPageProps {}

const ChatPage: React.FC<ChatPageProps> = () => {
	const [, navigate] = useLocation();
	const { billNo } = useParams<{ billNo: string }>();
	const storageKey = `chat_${billNo}`;

	const { messages, status, sendMessage, disconnect } = useWebSocket({
		billNo,
		url: WS_BASE_URL,
		storageKey,
	});

	const [input, setInput] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const handleBeforeUnload = useCallback(() => {
		console.log("disconnecting");
		disconnect();
	}, [disconnect]);

	// Auto-scroll to latest message
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	// Disconnect on window close / tab close
	useEffect(() => {
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [handleBeforeUnload]);

	const handleSend = () => {
		const trimmed = input.trim();
		if (!trimmed || status !== "connected") return;

		sendMessage(trimmed);
		setInput("");
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleGoBack = () => {
		disconnect();
		navigate("/");
	};

	return (
		<div className="min-h-screen bg-bg-page flex flex-col">
			<main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">
				{/* Page title & status */}
				<div className="flex items-center justify-between gap-4">
					<div>
						<GoBackIcon onClick={handleGoBack} />
						<h1 className="text-3xl font-extrabold text-text-heading mb-1">
							AI Assistant
						</h1>
						<p className="text-sm text-text-muted font-medium">
							Ask anything about your documents and appliance details.
						</p>
					</div>
					<StatusBadge status={status} />
				</div>

				{/* Chat box */}
				<div
					className="flex-1 bg-bg-card rounded-3xl border border-border flex flex-col overflow-hidden shadow-xl"
					style={{ minHeight: "65vh" }}
				>
					{/* Messages */}
					<div className="flex-1 overflow-y-auto px-6 sm:px-8 py-8 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-gray-200">
						{messages.length === 0 && (
							<div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
								<p className="text-base font-bold text-text-muted">
									No messages yet.
								</p>
								<p className="text-sm text-text-muted mt-1">
									Ask about warranty, manuals, or parts replacement!
								</p>
							</div>
						)}
						{messages.map((msg) => (
							<div
								key={msg.id}
								className={clsx(
									"flex items-end gap-4",
									msg.role === "user" ? "flex-row-reverse" : "flex-row",
								)}
							>
								<div
									className={clsx(
										"max-w-[80%] sm:max-w-[70%] rounded-2xl px-5 py-3.5 text-sm font-medium leading-relaxed shadow-sm",
										msg.role === "assistant"
											? "bg-primary text-white rounded-bl-sm"
											: "bg-bg-page text-text-body rounded-br-sm border border-border",
									)}
								>
									{msg.content}
									{msg.isStreaming && (
										<span className="inline-block ml-2 w-2 h-4 bg-white opacity-40 animate-pulse rounded-full align-middle" />
									)}
								</div>
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>

					{/* Input bar */}
					<div className="p-6 sm:p-8 bg-bg-card border-t border-border">
						<div className="flex items-center gap-3 bg-bg-page rounded-2xl border border-border px-5 py-3 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
							<input
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder="Ask about warranty, manuals, or parts..."
								disabled={status !== "connected"}
								className="flex-1 bg-transparent text-sm font-bold text-text-body placeholder:text-text-muted focus:outline-none disabled:opacity-50"
							/>
							<div className="flex items-center gap-2">
								<button
									type="button"
									onClick={handleSend}
									disabled={!input.trim() || status !== "connected"}
									className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-lg shadow-blue-500/20 active:scale-95"
									aria-label="Send message"
								>
									<SendIcon />
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Go Back button */}
				<div className="flex justify-center pb-6">
					<Button
						label="Exit Chat"
						variant="secondary"
						className="text-error! border-error! hover:bg-error-bg! py-3 min-w-[160px] font-bold"
						icon={<GoBackIcon />}
						iconPosition="start"
						onClick={handleGoBack}
					/>
				</div>
			</main>
		</div>
	);
};

export default ChatPage;
