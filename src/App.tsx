import { Analytics } from "@vercel/analytics/react";
import { Route, Switch, useLocation } from "wouter";
import { AppHeader } from "@/components/header";
import { HeaderProvider } from "@/context/HeaderContext";
import {
	BillDetailsPage,
	ChatPage,
	ConfirmSignupPage,
	DashboardPage,
	LoginPage,
	SignupPage,
	UploadPage,
} from "@/pages";
import ProtectedRoute from "./routes/ProtectedRoute";

const AUTH_ROUTES = ["/login", "/signup", "/confirm-signup"];

function Layout() {
	const [location] = useLocation();
	const isAuthRoute = AUTH_ROUTES.includes(location);

	return (
		<>
			<Analytics />
			{!isAuthRoute && <AppHeader />}
			<Switch>
				<Route path="/login" component={LoginPage} />
				<Route path="/signup" component={SignupPage} />
				<Route path="/confirm-signup" component={ConfirmSignupPage} />
				<ProtectedRoute>
					<Route path="/bills/:id" component={BillDetailsPage} />
					<Route path="/chat/:billNo" component={ChatPage} />
					<Route path="/upload" component={UploadPage} />
					<Route path="/dashboard" component={DashboardPage} />
					<Route path="/" component={DashboardPage} />
				</ProtectedRoute>
			</Switch>
		</>
	);
}

export default function App() {
	return (
		<HeaderProvider>
			<Layout />
		</HeaderProvider>
	);
}
