
import { ModeToggle } from "@/components/mode-toggle";

function HostingContentLayout({children}: {children: React.ReactNode}) {
  return (
		<div>
			<div className="px-32 md:px-24 sm:px-20 xs:px-10 mx-auto">
				<div className='pt-5'>{children}</div>
			</div>
		</div>
	);
}

export default HostingContentLayout