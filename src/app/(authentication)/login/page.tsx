import AuthLeft from '@/components/authentication/auth-left';
import AuthTop from '@/components/authentication/auth-top';
import AuthHeading from '@/components/authentication/auth-heading';
import LoginForm from '@/components/authentication/login-form';

function LoginPage() {
	return (
		<>
			<div className='container relative h-screen flex-col items-center justify-center mx-auto grid airBnbDesktop:max-w-none airBnbDesktop:grid-cols-2 airBnbDesktop:px-0'>
				{/* top */}
				<AuthTop />
				{/* left */}
				<AuthLeft />
				{/* right */}
				<div className='lg:p-8'>
					<div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
						{/* title */}
						<AuthHeading
							title={'Login to UniHomes'}
							subtitle={
								<p>
									Welcome back! Please sign in to continue.
									<span className='text-[16px] mx-1'></span>
								</p>
							}
						/>
						{/* form */}
						<LoginForm />
					</div>
				</div>
			</div>
		</>
	);
}

export default LoginPage;
