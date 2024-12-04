'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterFormData, registerSchema } from '@/lib/schemas/authSchema';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { signup } from '@/app/(authentication)/login/actions/register';

function RegisterForm() {
	const router = useRouter();
	const [isPending, startTransition] = React.useTransition();
	const [showPassword, setShowPassword] = React.useState<boolean>(false);

	const registerForm = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: '',
			password: '',
			confirm_password: '',
			firstname: '',
			lastname: '',
		},
		mode: 'onSubmit',
	});

	async function onSubmit(values: RegisterFormData) {
		startTransition(async () => {
			const formData = new FormData();
			formData.append('email', values.email);
			formData.append('password', values.password);
			formData.append('firstname', values.firstname);
			formData.append('lastname', values.lastname);

			try {
				const response = await signup(formData);

				if (response.success) {
					toast.success(
						'Registration successful! Check your email for verification.'
					);
					router.push('/auth/verify');
				} else if (response.error) {
					toast.error(response.error);
				}
			} catch (error) {
				console.error('Signup failed:', error);
				toast.error('An error occurred. Please try again.');
			}
		});
	}

	return (
		<div className='grid w-full gap-6'>
			<Form {...registerForm}>
				<form onSubmit={registerForm.handleSubmit(onSubmit)}>
					<div className='grid gap-2'>
						{/* Email Field */}
						<FormField
							control={registerForm.control}
							name='email'
							render={({ field }) => (
								<FormItem className='grid grid-cols-3 gap-2 place-items-center space-y-0'>
									<FormLabel
										htmlFor='email'
										className='col-span-1 text-right w-full'
									>
										Email:
									</FormLabel>
									<FormControl>
										<Input
											id='email'
											placeholder='example@email.com'
											autoCapitalize='none'
											autoComplete='email'
											autoCorrect='off'
											className='col-span-2'
											{...field}
										/>
									</FormControl>
									<FormMessage className='col-span-full' />
								</FormItem>
							)}
						/>

						{/* First Name Field */}
						<FormField
							control={registerForm.control}
							name='firstname'
							render={({ field }) => (
								<FormItem className='grid grid-cols-3 gap-2 place-items-baseline space-y-0'>
									<FormLabel
										htmlFor='firstname'
										className='col-span-1 text-right w-full'
									>
										First Name:
									</FormLabel>
									<FormControl>
										<Input
											id='firstname'
											placeholder='John'
											className='col-span-2'
											{...field}
										/>
									</FormControl>
									<FormMessage className='col-start-2 col-end-4' />
								</FormItem>
							)}
						/>

						{/* Last Name Field */}
						<FormField
							control={registerForm.control}
							name='lastname'
							render={({ field }) => (
								<FormItem className='grid grid-cols-3 gap-2 place-items-baseline space-y-0'>
									<FormLabel
										htmlFor='lastname'
										className='col-span-1 text-right w-full'
									>
										Last Name:
									</FormLabel>
									<FormControl>
										<Input
											id='lastname'
											placeholder='Doe'
											className='col-span-2'
											{...field}
										/>
									</FormControl>
									<FormMessage className='col-start-2 col-end-4' />
								</FormItem>
							)}
						/>

						{/* Password Field */}
						<FormField
							control={registerForm.control}
							name='password'
							render={({ field }) => (
								<FormItem className='grid grid-cols-3 gap-2 place-items-baseline space-y-0'>
									<FormLabel
										htmlFor='password'
										className='col-span-1 text-right w-full'
									>
										Password:
									</FormLabel>
									<FormControl>
										<div className='relative col-span-2 w-full'>
											<Input
												id='password'
												type={showPassword ? 'text' : 'password'}
												placeholder='•••••••••'
												autoComplete='on'
												{...field}
											/>
											<div
												onClick={() => setShowPassword(!showPassword)}
												className='absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer'
											>
												{showPassword ? 'Hide' : 'Show'}
											</div>
										</div>
									</FormControl>
									<FormMessage className='col-start-2 col-end-4' />
								</FormItem>
							)}
						/>

						{/* Confirm Password Field */}
						<FormField
							control={registerForm.control}
							name='confirm_password'
							render={({ field }) => (
								<FormItem className='grid grid-cols-3 gap-2 place-items-baseline space-y-0'>
									<FormLabel
										htmlFor='confirm_password'
										className='col-span-1 text-right w-full'
									>
										Confirm Password:
									</FormLabel>
									<FormControl>
										<Input
											id='confirm_password'
											type={showPassword ? 'text' : 'password'}
											placeholder='•••••••••'
											autoComplete='on'
											className='col-span-2'
											{...field}
										/>
									</FormControl>
									<FormMessage className='col-start-2 col-end-4' />
								</FormItem>
							)}
						/>

						{/* Submit Button */}
						<Button type='submit' className='w-full' disabled={isPending}>
							{isPending ? 'Registering...' : 'Register'}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}

export default RegisterForm;
