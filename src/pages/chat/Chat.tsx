import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/button";
import { useWebSocket } from "@/hooks/useWebSocket";
import { StatusBadge } from "./components";

const WS_BASE_URL = import.meta.env.VITE_WS_URL || "wss://echo.websocket.org";

interface BillReference {
	billNo: string;
	invoice: string;
	products: string;
	uname: string;
}

const DUMMY_REF: BillReference = {
	billNo: "1",
	invoice: "Invoice #01/15/2023",
	products: "Samsung Front Load Washer, Samsung Heat Pump Dryer",
	uname: "user",
};

export default function ChatPage() {
	const params = useParams<{ billNo: string }>();
	const [, navigate] = useLocation();
	const billNo = params.billNo ?? "unknown";
	const ref = DUMMY_REF;
	const storageKey = `chat_${billNo}_${ref.uname}`;

	const wsUrl = `${WS_BASE_URL}?billNo=${billNo}`;
	const { messages, status, sendMessage, disconnect } = useWebSocket({
		url: wsUrl,
		storageKey,
	});

	const [input, setInput] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to latest message
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	// Disconnect on window close / tab close
	useEffect(() => {
		const handleBeforeUnload = () => disconnect();
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [disconnect]);

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
		<div className="min-h-screen bg-[var(--color-bg-page)] flex flex-col">
			<main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">
				{/* Page title & status */}
				<div className="flex items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-extrabold text-[var(--color-text-heading)] mb-1">
							AI Assistant
						</h1>
						<p className="text-sm text-[var(--color-text-muted)] font-medium">
							Ask anything about your documents and appliance details.
						</p>
					</div>
					<StatusBadge status={status} />
				</div>

				{/* Chat box */}
				<div
					className="flex-1 bg-[var(--color-bg-card)] rounded-3xl border border-[var(--color-border)] flex flex-col overflow-hidden shadow-xl"
					style={{ minHeight: "65vh" }}
				>
					{/* Bill Reference Bar */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-8 py-6 border-b border-[var(--color-border)] bg-[var(--color-primary-light)]/30 backdrop-blur-sm">
						<div>
							<p className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest mb-1 opacity-80">
								Current Reference
							</p>
							<p className="text-base font-extrabold text-[var(--color-text-heading)] leading-none">
								{ref.invoice}
							</p>
						</div>
						<div className="sm:text-right">
							<p className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest mb-1 opacity-80">
								Covered Products
							</p>
							<p className="text-sm font-bold text-[var(--color-text-body)] leading-snug">
								{ref.products}
							</p>
						</div>
					</div>

					{/* Messages */}
					<div className="flex-1 overflow-y-auto px-6 sm:px-8 py-8 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-gray-200">
						{messages.length === 0 && (
							<div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
								<div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center mb-4 border border-[var(--color-border)]">
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
									</svg>
								</div>
								<p className="text-base font-bold text-[var(--color-text-muted)]">
									No messages yet.
								</p>
								<p className="text-sm text-[var(--color-text-muted)] mt-1">
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
								{/* Avatar (AI only) */}
								{msg.role === "assistant" && (
									<div className="w-10 h-10 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
										<svg
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											stroke="white"
											strokeWidth="2.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
											<circle cx="12" cy="11" r="3" />
										</svg>
									</div>
								)}
								<div
									className={clsx(
										"max-w-[80%] sm:max-w-[70%] rounded-2xl px-5 py-3.5 text-sm font-medium leading-relaxed shadow-sm",
										msg.role === "assistant"
											? "bg-[var(--color-primary)] text-white rounded-bl-sm"
											: "bg-[var(--color-bg-page)] text-[var(--color-text-body)] rounded-br-sm border border-[var(--color-border)]",
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
					<div className="p-6 sm:p-8 bg-[var(--color-bg-card)] border-t border-[var(--color-border)]">
						<div className="flex items-center gap-3 bg-[var(--color-bg-page)] rounded-2xl border border-[var(--color-border)] px-5 py-3 transition-all focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 focus-within:border-[var(--color-primary)]">
							<input
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder="Ask about warranty, manuals, or parts..."
								disabled={status !== "connected"}
								className="flex-1 bg-transparent text-sm font-bold text-[var(--color-text-body)] placeholder-[var(--color-text-muted)] focus:outline-none disabled:opacity-50"
							/>
							<div className="flex items-center gap-2">
								<button
									type="button"
									title="Attach file"
									className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer rounded-xl hover:bg-white"
								>
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
									</svg>
								</button>
								<button
									type="button"
									onClick={handleSend}
									disabled={!input.trim() || status !== "connected"}
									className="w-11 h-11 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center hover:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-lg shadow-blue-500/20 active:scale-95"
									aria-label="Send message"
								>
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<line x1="22" y1="2" x2="11" y2="13" />
										<polygon points="22 2 15 22 11 13 2 9 22 2" />
									</svg>
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
						className="!text-[var(--color-error)] !border-[var(--color-error)] hover:!bg-[var(--color-error-bg)] py-3 min-w-[160px] font-bold"
						icon={
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<polyline points="15 18 9 12 15 6" />
							</svg>
						}
						iconPosition="start"
						onClick={handleGoBack}
					/>
				</div>
			</main>
		</div>
	);
}
