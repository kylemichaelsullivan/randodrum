import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/__tests__/utils';
import { Form } from '@/components/ui/forms';

describe('Form', () => {
	it('renders children correctly', () => {
		render(
			<Form>
				<input type='text' placeholder='Test input' />
				<button type='submit'>Submit</button>
			</Form>
		);

		expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
	});

	it('applies default Form class', () => {
		render(
			<Form>
				<div>Test form</div>
			</Form>
		);

		const form = screen.getByText('Test form').closest('form');
		expect(form).toHaveClass('Form');
	});

	it('applies custom className', () => {
		render(
			<Form className='custom-form-class'>
				<div>Test form</div>
			</Form>
		);

		const form = screen.getByText('Test form').closest('form');
		expect(form).toHaveClass('Form', 'custom-form-class');
	});

	it('handles form submission', () => {
		const handleSubmit = vi.fn();
		render(
			<Form onSubmit={handleSubmit}>
				<button type='submit'>Submit</button>
			</Form>
		);

		const form = screen.getByText('Submit').closest('form');
		fireEvent.submit(form!);
		expect(handleSubmit).toHaveBeenCalledTimes(1);
	});

	it('forwards ref correctly', () => {
		const ref = vi.fn();
		render(
			<Form ref={ref}>
				<div>Test form</div>
			</Form>
		);

		expect(ref).toHaveBeenCalled();
	});

	it('passes through additional props', () => {
		render(
			<Form data-testid='custom-form' aria-label='Test form'>
				<div>Test form</div>
			</Form>
		);

		const form = screen.getByTestId('custom-form');
		expect(form).toHaveAttribute('aria-label', 'Test form');
	});
});
