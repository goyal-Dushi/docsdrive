import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

export interface HeaderConfig {
	/** Controls whether the Log Out button is visible. Default: true */
	showLogout?: boolean;
	/** Override the brand title shown in the header. Default: "Digital Home Binder" */
	title?: string;
	/** Extra right-side slot rendered next to the logout button */
	rightSlot?: ReactNode;
}

interface HeaderContextValue {
	config: HeaderConfig;
	setConfig: (cfg: HeaderConfig) => void;
}

const HeaderContext = createContext<HeaderContextValue | null>(null);

export function HeaderProvider({ children }: { children: ReactNode }) {
	const [config, setConfig] = useState<HeaderConfig>({
		showLogout: true,
		title: "Digital Home Binder",
	});

	return (
		<HeaderContext.Provider value={{ config, setConfig }}>
			{children}
		</HeaderContext.Provider>
	);
}

/** Hook to read / update the shared header config from any page. */
export function useHeaderConfig() {
	const ctx = useContext(HeaderContext);
	if (!ctx) {
		throw new Error("useHeaderConfig must be used inside <HeaderProvider>");
	}
	return ctx;
}
