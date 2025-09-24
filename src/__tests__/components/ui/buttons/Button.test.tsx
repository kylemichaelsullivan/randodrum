import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/__tests__';
import { Button } from '@/components';

describe('Button', () => {
	it('renders with correct title and children', () => {
		render(<Button title='Test Button'>Click me</Button>);

		const button = screen.getByRole('button', { name: 'Test Button' });
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent('Click me');
	});

	it('applies default variant styles', () => {
		render(<Button title='Default Button'>Default</Button>);

		const button = screen.getByRole('button');
		expect(button).toHaveClass('Button', 'flex', 'items-center', 'justify-center');
	});

	it('applies generate variant styles', () => {
		render(
			<Button title='Generate Button' variant='generate'>
				Generate
			</Button>
		);

		const button = screen.getByRole('button');
		expect(button).toHaveClass('bg-blue', 'text-white', 'rounded-md');
	});

	it('applies icon variant styles', () => {
		render(
			<Button title='Icon Button' variant='icon'>
				🎵
			</Button>
		);

		const button = screen.getByRole('button');
		expect(button).toHaveClass('bg-white', 'border', 'border-black', 'rounded-lg');
	});

	it('applies help variant styles', () => {
		render(
			<Button title='Help Button' variant='help'>
				?
			</Button>
		);

		const button = screen.getByRole('button');
		expect(button).toHaveClass('bg-gray-100', 'border-gray-300', 'rounded-full');
	});

	it('handles click events', () => {
		const handleClick = vi.fn();
		render(
			<Button title='Clickable Button' onClick={handleClick}>
				Click me
			</Button>
		);

		const button = screen.getByRole('button');
		fireEvent.click(button);
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('handles keyboard events (Enter and Space)', () => {
		const handleClick = vi.fn();
		render(
			<Button title='Keyboard Button' onClick={handleClick}>
				Press me
			</Button>
		);

		const button = screen.getByRole('button');

		// Test Enter key
		fireEvent.keyDown(button, { key: 'Enter' });
		expect(handleClick).toHaveBeenCalledTimes(1);

		// Test Space key
		fireEvent.keyDown(button, { key: ' ' });
		expect(handleClick).toHaveBeenCalledTimes(2);
	});

	it('can be disabled', () => {
		render(
			<Button title='Disabled Button' isDisabled>
				Disabled
			</Button>
		);

		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
		expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
	});

	it('uses custom aria-label when provided', () => {
		render(
			<Button title='Button Title' aria-label='Custom Label'>
				Button
			</Button>
		);

		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('aria-label', 'Custom Label');
	});

	it('forwards ref correctly', () => {
		const ref = vi.fn();
		render(
			<Button title='Ref Button' ref={ref}>
				Ref
			</Button>
		);

		expect(ref).toHaveBeenCalled();
	});

	it('applies custom className', () => {
		render(
			<Button title='Custom Button' className='custom-class'>
				Custom
			</Button>
		);

		const button = screen.getByRole('button');
		expect(button).toHaveClass('custom-class');
	});
});
