import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Amplify } from "aws-amplify";
import { ToastProvider } from "@/components/toast";
import App from "./App.tsx";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			staleTime: 5 * 60 * 1000, // 5 minutes
		},
	},
});

Amplify.configure({
	Auth: {
		Cognito: {
			userPoolId: import.meta.env.VITE_COGNITO_USERPOOLID,
			userPoolClientId: import.meta.env.VITE_COGNITO_CLIENTID,
		},
	},
});

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Root element not found");
}

createRoot(rootElement).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ToastProvider>
				<App />
			</ToastProvider>
		</QueryClientProvider>
	</StrictMode>,
);
