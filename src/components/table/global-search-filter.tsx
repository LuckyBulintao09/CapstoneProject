import { Input } from '@/components/ui/input';

interface GlobalFilterProps {
	globalFilter: string | undefined;
	setGlobalFilter: (value: string) => void;
	placeholder?: string;
	className?: string; 
}

const GlobalFilter: React.FC<GlobalFilterProps> = ({
	globalFilter,
	setGlobalFilter,
	placeholder = 'Search...',
	className = 'max-w-[400px] h-9',
}) => {
	return (
		<Input
			placeholder={placeholder}
			value={globalFilter || ''}
			onChange={(event) => setGlobalFilter(event.target.value)}
			className={className}
		/>
	);
};

export default GlobalFilter;
