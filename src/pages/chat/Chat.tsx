import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import { GoBackIcon } from "@/assets";
import { Button } from "@/components/button";
import { useWebSocket } from "@/hooks/useWebSocket";
import { PageHeader, ChatBox } from "./components";

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
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
				<PageHeader status={status} onGoBack={handleGoBack} />

				{/* Chat box */}
				<ChatBox
					messages={messages}
					messagesEndRef={messagesEndRef}
					input={input}
					setInput={setInput}
					handleSend={handleSend}
					handleKeyDown={handleKeyDown}
					status={status}
				/>

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
