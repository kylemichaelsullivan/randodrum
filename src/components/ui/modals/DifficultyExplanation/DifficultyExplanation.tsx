'use client';

import { DifficultyChart } from './DifficultyChart';
import { Legend } from './Legend';
import { TechniqueDefinitions } from './TechniqueDefinitions';

export function DifficultyExplanation() {
	return (
		<div className='flex flex-col gap-8' role='main' aria-label='Difficulty explanation'>
			<section
				className='text-gray text-base leading-relaxed'
				aria-labelledby='difficulty-description'
			>
				<p id='difficulty-description'>
					Each difficulty level determines the complexity of the generated drum beats. Higher
					difficulties include more note values, advanced techniques and fewer rests.
				</p>
			</section>

			<section aria-labelledby='chart-section' className='flex flex-col gap-6'>
				<DifficultyChart />
				<Legend />
			</section>

			<section aria-labelledby='technique-definitions'>
				<TechniqueDefinitions />
			</section>
		</div>
	);
}
