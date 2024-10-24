import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '../ui/button';
import { login } from '@/app/auth/login/actions';
import { useState } from 'react';

export function NavbarModalLogin({
	isOpen,
	onClose,
	openModal,
	onLoginSuccess,
}) {
	const [formData, setFormData] = useState({ email: '', password: '' });
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setErrorMessage('');

		const data = new FormData();
		data.append('email', formData.email);
		data.append('password', formData.password);

		try {
			const response = await login(data);

			if (response.success) {
				onLoginSuccess();
				window.location.href = '/';
			} else {
				setErrorMessage(response.error || 'Invalid email or password');
			}
		} catch (error) {
			console.error('Login failed:', error);
			// setErrorMessage('Something went wrong. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-[425px] bg-white text-black rounded-[20px]'>
				<DialogHeader>
					<DialogTitle className='text-2xl'>Login</DialogTitle>
					<DialogDescription>
						Please enter your login credentials.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className='text-black'>
					<div>
						<Label htmlFor='login-email' className='font-semibold'>
							Email
						</Label>
						<Input
							id='login-email'
							name='email'
							placeholder='you@example.com'
							className='border-gray-400'
							value={formData.email}
							onChange={handleChange}
						/>
					</div>

					<div className='mt-2'>
						<Label htmlFor='login-password' className='font-semibold'>
							Password
						</Label>
						<Input
							id='login-password'
							name='password'
							type='password'
							className='border-gray-400'
							value={formData.password}
							onChange={handleChange}
						/>
					</div>

					{errorMessage && (
						<p className='text-red-500 text-sm mt-2'>{errorMessage}</p>
					)}

					<DialogFooter>
						<div className='w-full'>
							<Button
								type='submit'
								className='w-full bg-black text-white px-4 py-2 mt-4 rounded-md hover:bg-gray-800'
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<span className='loader mr-2'></span> Logging in...
									</>
								) : (
									'Login'
								)}
							</Button>

							<div className='mt-4 text-center text-black'>
								<p>
									Don&apos;t have an account?{' '}
									<a
										href='#'
										className='text-blue-500 hover:underline'
										onClick={() => {
											onClose();
											openModal('register');
										}}
									>
										Register
									</a>
								</p>
							</div>
						</div>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
