type TechniqueDefinitionProps = {
	technique: string;
	definition: string;
};

export function TechniqueDefinition({ technique, definition }: TechniqueDefinitionProps) {
	return (
		<div className='flex flex-col gap-1'>
			<span className='text-black font-semibold text-sm capitalize sm:text-base'>{technique}:</span>
			<span className='text-gray text-sm leading-relaxed'>{definition}</span>
		</div>
	);
}
