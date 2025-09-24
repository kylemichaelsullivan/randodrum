'use client';

import { DIFFICULTY_LEVELS } from '@/utils';

import { BorderedSection } from './BorderedSection';
import { Definitions } from './Definitions';
import { DifficultyChart } from './DifficultyChart';
import { SectionWrapper } from './SectionWrapper';
import { TechniquesTable } from './TechniquesTable';

export function DifficultyExplanation() {
	return (
		<div
			className='DifficultyExplanation flex flex-col gap-8'
			role='main'
			aria-label='Difficulty explanation'
		>
			<BorderedSection ariaLabelledBy='difficulty-description'>
				<p className='text-gray text-base leading-relaxed' id='difficulty-description'>
					Each difficulty level determines the complexity of the generated drum beats. Higher
					difficulties include more note values, advanced techniques and fewer rests.
				</p>
			</BorderedSection>

			<SectionWrapper ariaLabelledBy='chart-section'>
				<DifficultyChart />
			</SectionWrapper>

			<SectionWrapper ariaLabelledBy='techniques-section'>
				<TechniquesTable difficulties={[...DIFFICULTY_LEVELS]} />
			</SectionWrapper>

			<Definitions />
		</div>
	);
}
