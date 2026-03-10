import { HomeIcon } from "@/assets";

const AuthLogo = () => {
	return (
		<div className="flex items-center gap-2.5 mb-8 justify-center">
			<div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
				<HomeIcon className="w-5 h-5 text-white" />
			</div>
			<span className="text-xl font-bold text-text-heading">
				Digital Home Binder
			</span>
		</div>
	);
};

export default AuthLogo;
