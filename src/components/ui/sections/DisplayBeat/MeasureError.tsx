type MeasureErrorProps = {
	measureIndex: number;
};

export function MeasureError({ measureIndex }: MeasureErrorProps) {
	return (
		<div className='MeasureError flex flex-col gap-3 bg-black border border-light-gray rounded-lg p-4'>
			<div className='MeasureHeader text-light-gray text-lg font-semibold text-center'>
				Measure {measureIndex + 1}
			</div>

			<div className={`MeasureContent grid bg-white rounded font-musisync p-2 min-h-[80px]`}>
				<div className='text-red p-2'>Error: Invalid measure data</div>
			</div>
		</div>
	);
}
