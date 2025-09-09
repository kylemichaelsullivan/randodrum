'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

import { Button } from './Button';

export const Import = () => {
	return (
		<Button variant='icon' title='Import Beat' aria-label='Import beat from file'>
			<FontAwesomeIcon icon={faUpload} className='w-4 h-4 text-black' />
		</Button>
	);
};
