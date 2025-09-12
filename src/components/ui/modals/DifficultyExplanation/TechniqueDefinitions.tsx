import { TechniqueDefinition } from './TechniqueDefinition';

const TECHNIQUES = {
	accent: 'A note played louder than surrounding notes',
	flam: 'Two notes played almost simultaneously, with one slightly before the other',
	drag: 'Two grace notes before a main note',
	ghost: 'A very quiet note, often played on the snare drum',
};

export function TechniqueDefinitions() {
	return (
		<div className='bg-light-gray border border-gray rounded-lg p-4 sm:p-5 flex flex-col gap-4'>
			<h4 className='font-semibold text-black text-base sm:text-lg'>Technique Definitions:</h4>
			<div className='text-sm text-gray flex flex-col gap-3'>
				{Object.entries(TECHNIQUES).map(([technique, definition]) => (
					<TechniqueDefinition technique={technique} definition={definition} key={technique} />
				))}
			</div>
		</div>
	);
}
