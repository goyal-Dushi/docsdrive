import React from "react";
import clsx from "clsx";

interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	isStreaming?: boolean;
}

interface MessagesProps {
	messages: Message[];
	messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const Messages: React.FC<MessagesProps> = ({ messages, messagesEndRef }) => {
	return (
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
	);
};

export default Messages;
