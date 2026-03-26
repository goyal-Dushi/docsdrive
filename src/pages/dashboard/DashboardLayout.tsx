import DashboardPage from "./Dashboard";

interface DashboardLayoutProps {}

const DashboardLayout: React.FC<DashboardLayoutProps> = () => {
	return (
		<div className="min-h-screen bg-bg-page">
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<DashboardPage />
			</main>
		</div>
	);
};

export default DashboardLayout;
