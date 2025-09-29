import { useMemo } from 'react';

import clsx from 'clsx';
import { createMemoizedComponent } from '@/utils';
import { getNoteSymbol, getRestSymbol } from '@/types';
import { useDominantHand } from '@/components';

import type { Note } from '@/types';

type NoteDisplayProps = {
	note: Note;
};

function NoteDisplayComponent({ note }: NoteDisplayProps) {
	const { dominantHand } = useDominantHand();

	// All note display properties in one useMemo
	const noteDisplayProps = useMemo(() => {
		const isRest = note.isRest;
		const noteSymbol = isRest ? getRestSymbol(note.dur) : getNoteSymbol(note.dur);

		// Dynamic properties (only for notes, not rests)
		const hasAccent = !isRest && note.dynamic === 'Accent';
		const hasRimshot = !isRest && note.dynamic === 'Rimshot';
		const hasDrag = !isRest && note.ornament === 'Drag';
		const hasFlam = !isRest && note.ornament === 'Flam';

		// Sticking properties (only for notes, not rests)
		const isDisplayedAsDominant = isRest ? false : note.isDominant === (dominantHand === 'right');
		const stickingColor = isDisplayedAsDominant ? 'text-green' : 'text-red';
		const stickingLetter = isDisplayedAsDominant ? 'R' : 'L';

		return {
			noteSymbol,
			hasAccent,
			hasRimshot,
			hasDrag,
			hasFlam,
			isDisplayedAsDominant,
			stickingColor,
			stickingLetter,
		};
	}, [note, dominantHand]);

	return (
		<div className='NoteDisplay flex flex-col items-center justify-center flex-1 text-center text-black h-full min-h-[5rem]'>
			<span
				className={clsx('NoteSymbol font-musisync text-5xl leading-none', {
					hasAccent: noteDisplayProps.hasAccent,
					hasRimshot: noteDisplayProps.hasRimshot,
					hasDrag: noteDisplayProps.hasDrag,
					hasFlam: noteDisplayProps.hasFlam,
				})}
			>
				{noteDisplayProps.noteSymbol}
			</span>
			{!note.isRest && (
				<span className={`text-sm font-bold ${noteDisplayProps.stickingColor}`}>
					{noteDisplayProps.stickingLetter}
				</span>
			)}
		</div>
	);
}

export const NoteDisplay = createMemoizedComponent(NoteDisplayComponent, 'NoteDisplay');
