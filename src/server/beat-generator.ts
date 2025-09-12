import type {
	BeatFormData,
	DifficultyLevel,
	BeatNote,
	Beat,
	Measure,
	GeneratedBeat,
} from '@/types';

type NoteOption = {
	value: number;
	isTuplet: boolean;
	technique?: 'accent' | 'flam' | 'drag' | 'ghost';
};

function getNoteOptions(difficulty: DifficultyLevel): NoteOption[] {
	const baseOptions: NoteOption[] = [
		{ value: 8, isTuplet: false }, // Quarter Note
		{ value: 4, isTuplet: false }, // Eighth Note
		{ value: 2, isTuplet: false }, // Sixteenth Note
		{ value: 1, isTuplet: false }, // Thirty-Second Note
		{ value: 8 / 3, isTuplet: true }, // Quarter-Note Triplet
		{ value: 4 / 3, isTuplet: true }, // Eighth-Note Triplet
		{ value: 2 / 3, isTuplet: true }, // Sixteenth-Note Triplet
		{ value: 4 / 6, isTuplet: true }, // Sixtuplet
	];

	switch (difficulty) {
		case 'I’m Too Young to Drum':
			return baseOptions.filter(opt => opt.value >= 8); // Whole, Half, Quarter notes only

		case 'Hey, Not Too Rough':
			return [
				...baseOptions.filter(opt => opt.value >= 4), // Previous + Eighth notes
				{ value: 8, isTuplet: false, technique: 'accent' },
				{ value: 4, isTuplet: false, technique: 'accent' },
				{ value: 8, isTuplet: false, technique: 'flam' },
				{ value: 4, isTuplet: false, technique: 'flam' },
			];

		case 'Hurt Me Plenty':
			return [
				...baseOptions.filter(opt => opt.value >= 2), // Previous + Sixteenth notes
				{ value: 8 / 3, isTuplet: true, technique: 'accent' },
				{ value: 4 / 3, isTuplet: true, technique: 'accent' },
				{ value: 8, isTuplet: false, technique: 'drag' },
				{ value: 4, isTuplet: false, technique: 'drag' },
			];

		case 'Ultra-Violence':
			return [
				...baseOptions, // Previous + Sixtuplets
				{ value: 2, isTuplet: false, technique: 'ghost' },
				{ value: 1, isTuplet: false, technique: 'ghost' },
				{ value: 4 / 3, isTuplet: true, technique: 'ghost' },
				{ value: 2 / 3, isTuplet: true, technique: 'ghost' },
			];

		case 'Drumline!':
			return [
				...baseOptions,
				{ value: 8, isTuplet: false },
				{ value: 4, isTuplet: false },
				{ value: 2, isTuplet: false },
				{ value: 8 / 3, isTuplet: true },
				{ value: 4 / 3, isTuplet: true },
			];

		default:
			return baseOptions.filter(opt => opt.value >= 4);
	}
}

function generateBeatNotes(difficulty: DifficultyLevel): BeatNote[] {
	const notes: BeatNote[] = [];
	let remainingValue = 8;
	const noteOptions = getNoteOptions(difficulty);
	let lastSticking: 'R' | 'L' = 'R'; // Start with right hand

	while (remainingValue > 0) {
		const validOptions = noteOptions.filter(option => option.value <= remainingValue);

		if (validOptions.length === 0) break;

		const selectedOption = validOptions[Math.floor(Math.random() * validOptions.length)]!;

		const restProbability =
			difficulty === 'I’m Too Young to Drum' ? 0.3
			: difficulty === 'Hey, Not Too Rough' ? 0.2
			: difficulty === 'Hurt Me Plenty' ? 0.15
			: difficulty === 'Ultra-Violence' ? 0.1
			: 0.05;

		const isRest = Math.random() < restProbability;

		let sticking: 'R' | 'L' = lastSticking;
		if (!isRest) {
			// For flams and drags, use the same hand as the previous note
			if (selectedOption.technique === 'flam' || selectedOption.technique === 'drag') {
				sticking = lastSticking;
			} else {
				sticking = lastSticking === 'R' ? 'L' : 'R';
			}
		}

		notes.push({
			value: selectedOption.value,
			sticking: sticking,
			isTuplet: selectedOption.isTuplet,
			isRest: isRest,
			technique: selectedOption.technique,
		});

		if (!isRest) {
			lastSticking = sticking;
		}

		remainingValue -= selectedOption.value;
	}

	return notes;
}

export function generateBeat(formData: BeatFormData): GeneratedBeat {
	const measures: Measure[] = [];

	for (let measureIndex = 0; measureIndex < formData.measures; measureIndex++) {
		const beats: Beat[] = [];

		for (let beatIndex = 0; beatIndex < formData.beats; beatIndex++) {
			const notes = generateBeatNotes(formData.difficulty);

			beats.push({
				notes,
				totalValue: 8,
			});
		}

		measures.push({ beats });
	}

	return {
		measures,
		beatsPerMeasure: formData.beats,
		difficulty: formData.difficulty,
	};
}
