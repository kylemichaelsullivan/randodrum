import type {
	BeatFormData,
	DifficultyConfig,
	DifficultyLevel,
	Dynamic,
	Exercise,
	GeneratedBeat,
	Measure,
	Ornament,
} from '@/types';

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

// 1) Rhythm: single pass fill to exactly gridSize units
export function generateRhythm(allowed: number[], measureLen: number): Measure {
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

		const dur = pick(choices);
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
	let currentIsDom = true;
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
	// clamp consecutive same-hand notes
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
	// nudge hand ratio if bounds provided
	if (cfg.minRatio != null && cfg.maxRatio != null) {
		const total = out.length;
		let dom = out.filter(n => n.isDominant).length;
		let ratio = dom / total;
		if (ratio > cfg.maxRatio || ratio < cfg.minRatio) {
			const targetIsDom = ratio < 0.5; // if too few dom, flip non-dom; else flip dom
			for (let i = out.length - 1; i >= 0; i--) {
				if (out[i]!.isDominant !== targetIsDom) {
					out[i] = { ...out[i]!, isDominant: targetIsDom };
					dom = targetIsDom ? dom + 1 : dom - 1;
					ratio = dom / total;
					if (ratio >= (cfg.minRatio ?? 0) && ratio <= (cfg.maxRatio ?? 1)) break;
				}
			}
		}
	}
	return out;
}

export const difficulties: Record<DifficultyLevel, DifficultyConfig> = {
	'I’m Too Young to Drum': {
		durations: [8, 16, 32],
		runLengths: { 1: 1.0 },
		switchProb: 1.0,
		dynamicScale: [2, 7, 9, 10] as [number, number, number, number],
		flamThreshold: 0,
		dragThreshold: 0,
		allowBalancing: true,
		maxClump: 1,
		minRatio: 0.45,
		maxRatio: 0.55,
	},
	'Hey, Not Too Rough': {
		durations: [4, 8, 16],
		runLengths: { 1: 0.7, 2: 0.3 },
		switchProb: 0.8,
		dynamicScale: [2, 7, 9, 10] as [number, number, number, number],
		flamThreshold: 0.05,
		dragThreshold: 0,
		allowBalancing: true,
		maxClump: 2,
		minRatio: 0.45,
		maxRatio: 0.55,
	},
	'Hurt Me Plenty': {
		durations: [2, 4, 8, 16],
		runLengths: { 1: 0.5, 2: 0.3, 3: 0.2 },
		switchProb: 0.6,
		dynamicScale: [2, 7, 9, 10] as [number, number, number, number],
		flamThreshold: 0.1,
		dragThreshold: 0.1,
		allowBalancing: true,
		maxClump: 3,
		minRatio: 0.4,
		maxRatio: 0.6,
	},
	'Ultra-Violence': {
		durations: [1, 2, 4, 8],
		runLengths: { 1: 0.4, 2: 0.3, 3: 0.2, 4: 0.1 },
		switchProb: 0.4,
		dynamicScale: [2, 7, 9, 10] as [number, number, number, number],
		flamThreshold: 0.15,
		dragThreshold: 0.15,
		allowBalancing: true,
		maxClump: 4,
		minRatio: 0.35,
		maxRatio: 0.65,
	},
	'Drumline!': {
		durations: [1, 2, 4, 8],
		runLengths: { 1: 0.25, 2: 0.25, 3: 0.25, 4: 0.25 },
		switchProb: 0.5,
		dynamicScale: [2, 7, 9, 10] as [number, number, number, number],
		flamThreshold: 0.25,
		dragThreshold: 0.25,
		allowBalancing: false,
	},
};

export function generateMeasure(
	cfg: DifficultyConfig,
	allowedDurations: number[],
	gridSize: number
): Measure {
	const base = generateRhythm(allowedDurations, gridSize);
	const withHands = generateHandRuns(base, cfg);
	const withDyn = addDynamics(withHands, cfg);
	const withOrn = addOrnaments(withDyn, cfg);
	return cfg.allowBalancing ? applyBalancing(withOrn, cfg) : withOrn;
}

export function generateExerciseBars(
	cfg: DifficultyConfig,
	allowedDurations: number[],
	gridSize: number,
	bars = 4
): Exercise {
	return Array.from({ length: bars }, () => generateMeasure(cfg, allowedDurations, gridSize));
}

export function generateBeat(formData: BeatFormData): GeneratedBeat {
	const cfg = difficulties[formData.difficulty];
	if (!cfg) {
		throw new Error(`Unknown difficulty level: ${formData.difficulty}`);
	}

	const allowedDurations = cfg.durations;
	const gridSize = formData.beats * 8;

	const exercise = generateExerciseBars(cfg, allowedDurations, gridSize, formData.measures);

	return {
		measures: exercise,
		beatsPerMeasure: formData.beats,
		difficulty: formData.difficulty,
	};
}
