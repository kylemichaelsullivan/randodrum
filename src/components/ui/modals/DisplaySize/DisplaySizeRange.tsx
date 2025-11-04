'use client';

type DisplaySizeRangeProps = {
	displaySize: number;
	min: number;
	max: number;
	step: number;
	onChange: (value: number) => void;
};

export function DisplaySizeRange({
	displaySize,
	min,
	max,
	step,
	onChange,
}: DisplaySizeRangeProps) {
	return (
		<div className='flex flex-col gap-2'>
			<label htmlFor='display-size' className='text-sm font-medium'>
				Size: {displaySize}%
			</label>

			<input
				type='range'
				className='DisplaySizeRange w-full'
				min={min}
				max={max}
				step={step}
				value={displaySize}
				onChange={(e) => onChange(Number(e.target.value))}
				id='display-size'
			/>

			<div className='text-gray flex justify-between text-xs'>
				<span>{min}%</span>
				<span>{max}%</span>
			</div>
		</div>
	);
}
