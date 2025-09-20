'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import { Button } from './Button';

export const Export = () => {
	return (
		<Button variant='hidden' title='Export Beat' aria-label='Export beat to file'>
			<FontAwesomeIcon icon={faDownload} className='w-4 h-4 text-black' />
		</Button>
	);
};
