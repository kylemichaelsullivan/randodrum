import { getDifficultyConfig } from '@/utils';
import type {
	BeatFormData,
	DifficultyConfig,
	DifficultyLevel,
	Duration,
	Dynamic,
	Exercise,
	GeneratedBeat,
	Measure,
	Ornament,
} from '@/types';
import { isTupletDuration, isTripletDuration, isSixtupletDuration } from '@/types/duration';

const pick = <T>(arr: T[]): T => {
	if (arr.length === 0) {
		throw new Error('Cannot pick from empty array');
	}
	return arr[Math.floor(Math.random() * arr.length)]!;
};

function sampleFromDist(dist: Record<number, number>, cap: number): number {
	const items = Object.entries(dist)
		.map(([k, w]) => ({ len: Number(k), w: Number(w) }))
		.filter(x => x.len <= cap);

	if (items.length === 0) {
		throw new Error('No valid items found in distribution');
	}

	const total = items.reduce((s, x) => s + x.w, 0);
	if (total <= 0) {
		throw new Error('Total weight must be greater than 0');
	}

	let r = Math.random() * total;
	for (const it of items) {
		if ((r -= it.w) <= 0) return it.len;
	}
	return items[items.length - 1]!.len;
}

function isTuplet(duration: Duration): boolean {
	// Use the type-safe helper function
	return isTupletDuration(duration);
}

function getTupletGroupSize(duration: Duration): number {
	// Use type-safe helper functions
	if (isTripletDuration(duration)) {
		return 3; // Triplets
	}
	if (isSixtupletDuration(duration)) {
		return 6; // Sixtuplets
	}
	return 1; // Non-tuplets don't need grouping
}

// 1) Rhythm: single pass fill to exactly gridSize units
export function generateRhythm(allowed: Duration[], measureLen: number): Measure {
	const m: Measure = [];
	let t = 0;

	if (allowed.length === 0) {
		throw new Error('Allowed durations array cannot be empty');
	}

	// Ensure smallest duration exists (e.g., 1 or 2) to guarantee termination
	const sortedAllowed = [...allowed].sort((a, b) => a - b);

	while (t < measureLen) {
		const remaining = measureLen - t;
		const choices = sortedAllowed.filter(d => d <= remaining);

		if (choices.length === 0) {
			throw new Error(
				`Cannot fill remaining ${remaining} units with allowed durations: ${sortedAllowed.join(', ')}`
			);
		}

		const tupletChoices = choices.filter(isTuplet);
		const nonTupletChoices = choices.filter(d => !isTuplet(d));

		if (tupletChoices.length > 0) {
			const tupletDur = pick(tupletChoices);
			const groupSize = getTupletGroupSize(tupletDur);
			const totalTupletDuration = tupletDur * groupSize;

			if (remaining >= totalTupletDuration) {
				// 70% chance to place complete group, 30% chance to place partial group
				// This encourages mixed tuplet combinations
				const shouldPlaceComplete = Math.random() < 0.7;

				if (shouldPlaceComplete) {
					// Place complete tuplet group
					for (let i = 0; i < groupSize; i++) {
						m.push({
							start: t + i * tupletDur,
							dur: tupletDur,
							isDominant: true,
							dynamic: 'normal',
							ornament: null,
						});
					}
					t += totalTupletDuration;
					continue;
				} else {
					// How many notes can fit in partial tuplet group
					const maxNotes = Math.floor(remaining / tupletDur);
					const notesToPlace = Math.min(maxNotes, groupSize);

					// Ensure we place at least 1 note
					if (notesToPlace > 0) {
						for (let i = 0; i < notesToPlace; i++) {
							m.push({
								start: t + i * tupletDur,
								dur: tupletDur,
								isDominant: true,
								dynamic: 'normal',
								ornament: null,
							});
						}
						t += tupletDur * notesToPlace;
						continue;
					}
				}
			} else if (remaining >= tupletDur) {
				// How many notes can fit into partial tuplet group
				const maxNotes = Math.floor(remaining / tupletDur);
				const notesToPlace = Math.min(maxNotes, groupSize);

				for (let i = 0; i < notesToPlace; i++) {
					m.push({
						start: t + i * tupletDur,
						dur: tupletDur,
						isDominant: true,
						dynamic: 'normal',
						ornament: null,
					});
				}
				t += tupletDur * notesToPlace;
				continue;
			}
		}

		const dur = nonTupletChoices.length > 0 ? pick(nonTupletChoices) : pick(choices);

		m.push({
			start: t,
			dur,
			isDominant: true,
			dynamic: 'normal',
			ornament: null,
		});
		t += dur;
	}
	return m;
}

// 2) Sticking via run-lengths + switch probability
export function generateHandRuns(measure: Measure, cfg: DifficultyConfig): Measure {
	// 85% chance of starting with dominant hand
	let currentIsDom = Math.random() < 0.85;
	let i = 0;
	const out = measure.map(note => ({ ...note }));
	while (i < out.length) {
		const runLen = sampleFromDist(cfg.runLengths, out.length - i);
		for (let j = 0; j < runLen && i < out.length; j++, i++) {
			out[i] = { ...out[i]!, isDominant: currentIsDom };
		}
		if (Math.random() < cfg.switchProb) currentIsDom = !currentIsDom;
	}
	return out;
}

// 3) Dynamics: weighted thresholds on 0–10 scale
export function addDynamics(measure: Measure, cfg: DifficultyConfig): Measure {
	const [tGhost, tNormal, tAccent, tRimshot] = cfg.dynamicScale;
	return measure.map(n => {
		const r = Math.random() * tRimshot;
		const dynamic: Dynamic =
			r < tGhost ? 'ghost'
			: r < tNormal ? 'normal'
			: r < tAccent ? 'accent'
			: 'rimshot';
		return { ...n, dynamic };
	});
}

// 4) Ornaments: rare flams/drags; no drags until Hurt Me Plenty
export function addOrnaments(measure: Measure, cfg: DifficultyConfig): Measure {
	return measure.map(n => {
		const r = Math.random();
		let ornament: Ornament = null;
		if (r < cfg.flamThreshold) ornament = 'flam';
		else if (r < cfg.flamThreshold + cfg.dragThreshold) ornament = 'drag';
		return { ...n, ornament };
	});
}

// 5) Balancing: clamp clumps + hand ratio (skip for Drumline!)
export function applyBalancing(measure: Measure, cfg: DifficultyConfig): Measure {
	const out = measure.map(note => ({ ...note }));
	if (cfg.maxClump) {
		let run = 1;
		for (let i = 1; i < out.length; i++) {
			if (out[i]!.isDominant === out[i - 1]!.isDominant) {
				run++;
				if (run > cfg.maxClump) {
					out[i] = { ...out[i]!, isDominant: !out[i]!.isDominant };
					run = 1;
				}
			} else {
				run = 1;
			}
		}
	}

	if (cfg.minRatio != null && cfg.maxRatio != null) {
		const total = out.length;
		let dom = out.filter(n => n.isDominant).length;
		let ratio = dom / total;
		if (ratio > cfg.maxRatio || ratio < cfg.minRatio) {
			const needMoreDominant = ratio < cfg.minRatio;
			for (let i = out.length - 1; i >= 0; i--) {
				if (needMoreDominant && !out[i]!.isDominant) {
					out[i] = { ...out[i]!, isDominant: true };
					dom++;
					ratio = dom / total;
					if (ratio >= cfg.minRatio) break;
				} else if (!needMoreDominant && out[i]!.isDominant) {
					out[i] = { ...out[i]!, isDominant: false };
					dom--;
					ratio = dom / total;
					if (ratio <= cfg.maxRatio) break;
				}
			}
		}
	}
	return out;
}

export function generateMeasure(
	cfg: DifficultyConfig,
	allowedDurations: Duration[],
	gridSize: number,
	_difficulty: DifficultyLevel
): Measure {
	const base = generateRhythm(allowedDurations, gridSize);
	const withHands = generateHandRuns(base, cfg);

	const withDyn = addDynamics(withHands, cfg);

	const withOrn = addOrnaments(withDyn, cfg);
	return cfg.allowBalancing ? applyBalancing(withOrn, cfg) : withOrn;
}

export function generateExerciseBars(
	cfg: DifficultyConfig,
	allowedDurations: Duration[],
	gridSize: number,
	_difficulty: DifficultyLevel,
	bars = 4
): Exercise {
	return Array.from({ length: bars }, () =>
		generateMeasure(cfg, allowedDurations, gridSize, _difficulty)
	);
}

export function generateBeat(formData: BeatFormData): GeneratedBeat {
	const cfg = getDifficultyConfig(formData.difficulty);

	const allowedDurations = cfg.durations;
	const gridSize = formData.beats * 24; // (Quarter Note = 24)

	const exercise = generateExerciseBars(
		cfg,
		allowedDurations,
		gridSize,
		formData.difficulty,
		formData.measures
	);

	return {
		measures: exercise,
		beatsPerMeasure: formData.beats,
		difficulty: formData.difficulty,
	};
}
