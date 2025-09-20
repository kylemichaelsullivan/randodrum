type TechniqueDefinitionProps = {
	technique: string;
	definition: string;
};

export function TechniqueDefinition({ technique, definition }: TechniqueDefinitionProps) {
	return (
		<div className='flex gap-1 items-end'>
			<span className='text-black font-semibold text-sm capitalize sm:text-base'>{technique}:</span>
			<span className='text-gray text-sm leading-relaxed'>{definition}</span>
		</div>
	);
}
