const BillCardSkeleton = () => {
	return (
		<div className="bg-bg-card rounded-3xl border border-border p-8 animate-pulse shadow-sm">
			<div className="flex items-start justify-between mb-6">
				<div className="flex-1">
					<div className="h-7 bg-gray-200 rounded-lg w-3/4 mb-3" />
					<div className="h-4 bg-gray-100 rounded-md w-1/2" />
				</div>
				<div className="h-7 bg-gray-200 rounded-xl w-24" />
			</div>
			<div className="space-y-3 mt-4 mb-8">
				<div className="h-4 bg-gray-100 rounded w-full" />
				<div className="h-4 bg-gray-100 rounded w-5/6" />
				<div className="h-4 bg-gray-100 rounded w-2/3" />
			</div>
			<div className="h-4 bg-gray-200 rounded-lg w-32 mb-8" />
			<div className="flex gap-4 pt-6 border-t border-border border-dashed">
				<div className="h-12 bg-gray-200 rounded-xl flex-1" />
				<div className="h-12 bg-gray-200 rounded-xl flex-1" />
			</div>
		</div>
	);
};

export default BillCardSkeleton;
