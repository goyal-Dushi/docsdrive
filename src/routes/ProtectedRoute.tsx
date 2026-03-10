import { fetchAuthSession } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { Redirect } from "wouter";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

type AuthStatus = "auth" | "unauth" | "loading";

const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
	const { children } = props;
	const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");

	useEffect(() => {
		(async () => {
			try {
				const session = await fetchAuthSession();
				if (session.tokens?.idToken) {
					console.log("Auth session fetched successfully", session);
					setAuthStatus("auth");
				} else {
					setAuthStatus("unauth");
				}
			} catch (err) {
				console.error("Error fetching auth session: ", err);
				setAuthStatus("unauth");
			}
		})();
	}, []);

	if (authStatus === "loading") {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (authStatus === "unauth") {
		return <Redirect to="/login" replace />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
