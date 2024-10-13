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

	
	const handleSubmit = async (e) => {
		e.preventDefault(); 
		const data = new FormData();
		data.append('email', formData.email);
		data.append('password', formData.password);

		try {
			await login(data);
			onLoginSuccess(); 
		} catch (error) {
			console.error('Login failed:', error); 
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

					<div>
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

					<DialogFooter>
						<div className='w-full'>
							<Button
								type='submit'
								className='w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800'
							>
								Login
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
