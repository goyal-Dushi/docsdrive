import React from "react";
import { SendIcon } from "@/assets";

interface InputBarProps {
	input: string;
	setInput: (value: string) => void;
	handleSend: () => void;
	handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	status: string;
	isSending: boolean;
}

const InputBar: React.FC<InputBarProps> = ({
	input,
	setInput,
	handleSend,
	handleKeyDown,
	status,
	isSending,
}) => {
	return (
		<div className="p-6 sm:p-8 bg-bg-card border-t border-border">
			<div className="flex items-center gap-3 bg-bg-page rounded-2xl border border-border px-5 py-3 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
				{isSending ? (
					<div className="flex-1 text-sm font-bold text-text-body">
						Thinking...
					</div>
				) : (
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Ask about warranty, manuals, or parts..."
						disabled={status !== "connected"}
						className="flex-1 bg-transparent text-sm font-bold text-text-body placeholder:text-text-muted focus:outline-none disabled:opacity-50"
					/>
				)}
				<div className="flex items-center gap-2">
					{isSending ? (
						<div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center">
							<div className="animate-spin rounded-full border-2 border-white border-t-transparent w-5 h-5" />
						</div>
					) : (
						<button
							type="button"
							onClick={handleSend}
							disabled={!input.trim() || status !== "connected"}
							className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-lg shadow-blue-500/20 active:scale-95"
							aria-label="Send message"
						>
							<SendIcon />
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default InputBar;
