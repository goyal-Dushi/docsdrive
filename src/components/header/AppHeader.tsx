import { signOut } from "aws-amplify/auth";
import { useLocation } from "wouter";
import { HomeIcon } from "@/assets";
import { Button } from "@/components/button";
import { useHeaderConfig } from "@/context/HeaderContext";

export function AppHeader() {
	const [, navigate] = useLocation();
	const { config } = useHeaderConfig();

	const handleLogout = async () => {
		try {
			await signOut({
				global: true,
			});
			navigate("/login");
		} catch (err) {
			console.error("Error logging out: ", err);
		}
	};

	return (
		<header className="sticky top-0 z-10 bg-bg-card border-b border-border px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto h-14 flex items-center justify-between">
				{/* Logo + title */}
				<button
					type="button"
					onClick={() => navigate("/")}
					className="flex items-center gap-2.5 cursor-pointer"
				>
					<HomeIcon />
					<span className="font-bold text-text-heading hidden sm:block">
						{config.title ?? "DocsDrive"}
					</span>
				</button>

				{/* Right slot + logout */}
				<div className="flex items-center gap-2">
					<Button
						label="Log Out"
						variant="secondary"
						icon={
							<svg
								width="15"
								height="15"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
								<polyline points="16 17 21 12 16 7" />
								<line x1="21" y1="12" x2="9" y2="12" />
							</svg>
						}
						iconPosition="start"
						onClick={handleLogout}
					/>
				</div>
			</div>
		</header>
	);
}
