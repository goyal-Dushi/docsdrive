import { Route, Switch, useLocation } from "wouter";
import { AppHeader } from "@/components/header";
import { HeaderProvider } from "@/context/HeaderContext";
import BillDetailsPage from "@/pages/BillDetails";
import ChatPage from "@/pages/Chat";
import DashboardPage from "@/pages/Dashboard";
import LoginPage from "@/pages/Login";
import SignupPage from "@/pages/Signup";
import UploadPage from "@/pages/Upload";

const AUTH_ROUTES = ["/login", "/signup"];

function Layout() {
	const [location] = useLocation();
	const isAuthRoute = AUTH_ROUTES.includes(location);

	return (
		<>
			{!isAuthRoute && <AppHeader />}
			<Switch>
				<Route path="/login" component={LoginPage} />
				<Route path="/signup" component={SignupPage} />
				<Route path="/bills/:id" component={BillDetailsPage} />
				<Route path="/chat/:billNo" component={ChatPage} />
				<Route path="/upload" component={UploadPage} />
				<Route path="/" component={DashboardPage} />
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
