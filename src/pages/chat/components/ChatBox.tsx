import React from "react";
import Messages from "./Messages";
import InputBar from "./InputBar";

interface ChatBoxProps {
	messages: any[];
	messagesEndRef: React.RefObject<HTMLDivElement | null>;
	input: string;
	setInput: (value: string) => void;
	handleSend: () => void;
	handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	status: string;
	isSending: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({
	messages,
	messagesEndRef,
	input,
	setInput,
	handleSend,
	handleKeyDown,
	status,
	isSending,
}) => {
	return (
		<div
			className="flex-1 bg-bg-card rounded-3xl border border-border flex flex-col overflow-hidden shadow-xl"
			style={{ minHeight: "65vh" }}
		>
			<Messages messages={messages} messagesEndRef={messagesEndRef} />
			<InputBar
				input={input}
				setInput={setInput}
				handleSend={handleSend}
				handleKeyDown={handleKeyDown}
				status={status}
				isSending={isSending}
			/>
		</div>
	);
};

export default ChatBox;
