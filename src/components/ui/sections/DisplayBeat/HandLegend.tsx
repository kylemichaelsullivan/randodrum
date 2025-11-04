export function HandLegend() {
	const hands: [string, string][] = [
		['Left', 'red'],
		['Right', 'green'],
	];

	return (
		<div className='HandLegend text-gray flex justify-around gap-6 text-xs'>
			{hands.map(([name, color]) => (
				<div key={name} className={`${name}Hand flex items-center gap-1`}>
					<span className={`text-${color} font-bold`}>{name[0]}</span>
					<span>- {name} Hand</span>
				</div>
			))}
		</div>
	);
}
