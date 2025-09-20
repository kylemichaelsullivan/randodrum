import { TECHNIQUE_DEFINITIONS } from '@/utils';
import { TechniqueDefinition } from './TechniqueDefinition';

export function TechniqueDefinitions() {
	return (
		<div className='flex flex-col gap-4 rounded-lg border border-gray bg-light-gray p-4 sm:p-5'>
			<h4 className='text-black text-base font-semibold sm:text-lg'>Technique Definitions</h4>
			<div className='flex flex-col gap-3 text-gray text-sm'>
				{Object.entries(TECHNIQUE_DEFINITIONS).map(([technique, definition]) => (
					<TechniqueDefinition technique={technique} definition={definition} key={technique} />
				))}
			</div>
		</div>
	);
}
