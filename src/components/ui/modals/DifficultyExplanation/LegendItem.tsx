type LegendItemProps = {
	name: string;
	color: string;
};

export function LegendItem({ name, color }: LegendItemProps) {
	return (
		<div className='flex items-center gap-1.5 sm:gap-2 px-2 py-1 rounded-md hover:bg-light-gray transition-colors'>
			<div
				className={`${color} border border-gray rounded w-3 h-3 sm:w-4 sm:h-4`}
				role='img'
				aria-label={`${name} color indicator`}
			/>
			<span className='text-black text-xs font-medium sm:text-sm'>{name}</span>
		</div>
	);
}
