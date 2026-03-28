import { HomeIcon } from "@/assets";

const AuthLogo = () => {
	return (
		<div className="flex items-center gap-2.5 mb-8 justify-center">
			<HomeIcon className="w-12 h-12 text-primary" />
			<span className="text-xl font-bold text-text-heading">DocsDrive</span>
		</div>
	);
};

export default AuthLogo;
