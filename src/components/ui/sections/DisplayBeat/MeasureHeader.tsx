type MeasureHeaderProps = {
	measureIndex: number;
};

export function MeasureHeader({ measureIndex }: MeasureHeaderProps) {
	return (
		<div className='MeasureHeader text-light-gray text-lg font-semibold text-center'>
			Measure {measureIndex + 1}
		</div>
	);
}
