type DefinitionProps = {
	term: string;
	definition: string;
};

export function Definition({ term, definition }: DefinitionProps) {
	return (
		<div className='Definition'>
			<span className='text-black font-semibold text-sm pr-1 sm:text-base'>{term}:</span>
			<span className='text-gray text-sm leading-relaxed'>{definition}</span>
		</div>
	);
}
