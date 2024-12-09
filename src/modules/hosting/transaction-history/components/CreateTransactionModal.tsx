"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, PlusCircle, MinusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from 'date-fns';
import { createClient } from '@/utils/supabase/client';
import { fetchDropdownDetails } from '@/actions/transaction/fetchDetails';
import { toast } from 'sonner';
interface CreateTransactionModalProps {
	isOpen: boolean;
	onClose: () => void;
  }
  
  const CreateTransactionModal = ({
	isOpen,
	onClose
  }: CreateTransactionModalProps) => {
	const [data, setData] = useState<any[]>([]);
	const [propertyOptions, setPropertyOptions] = useState<any[]>([]);
	const [unitOptions, setUnitOptions] = useState<any[]>([]);
	const [propertyTitle, setPropertyTitle] = useState('');
	const [unitTitle, setUnitTitle] = useState('');
	const [clientName, setClientName] = useState('');
	const [serviceOption, setServiceOption] = useState('');
	const [appointmentDate, setAppointmentDate] = useState('');
	const [propertyId, setPropertyId] = useState<number | null>(null);
	const [unitId, setUnitId] = useState<number | null>(null);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const [numGuests, setNumGuests] = useState<number>(1);
	const [monthContract, setMonthContract] = useState(0);
  
	useEffect(() => {
		const fetchDetails = async () => {
		  const supabase = createClient();
		  const userId = await supabase.auth.getUser();
		  const fetchedData = await fetchDropdownDetails(userId.data.user.id);
	
		  console.log(fetchedData);
	
		  setData(fetchedData);
		  if (fetchedData[0] && fetchedData[0].property) {
			setPropertyOptions(fetchedData[0].property);
		  }
		};
	
		fetchDetails();
	}, []);
  
	useEffect(() => {
		const selectedProperty = propertyOptions.find(
		  (item) => item.id === propertyId
		);
	
		if (selectedProperty) {
		  setUnitOptions(selectedProperty.unit || []);
		  setUnitId(null);
		  setUnitTitle('');
		}
	}, [propertyId, propertyOptions]);
	
	  const handleFormSubmit = async () => {
		const supabase = createClient();
		const {error} = await supabase
			.from("transaction")
			.insert({
				unit_id: unitId, 
				client_name: clientName, 
				service_option: "Room Reservation", 
				appointment_date: format(new Date(), 'yyyy-MM-dd'), 
				guest_number: numGuests,
				transaction_status: "reserved",
				payment_option: "Cash (On-Site)",
				contract: format(new Date(Date.now() + (monthContract * 30 * 24 * 60 * 60 * 1000)), 'yyyy-MM-dd')
			})

		const { error: unitError } = await supabase
			.from("unit")
			.update({ contract: format(new Date(Date.now() + (monthContract * 30 * 24 * 60 * 60 * 1000)), 'yyyy-MM-dd') })
			.eq("id", unitId);

		if (error) {
			console.error("Error saving reservation:", error.message);
			return { success: false, error: error.message };
		}
		toast.success('Transaction created successfully');
		onClose();
		window.location.reload();
	};
  
	return (
	  <Dialog open={isOpen} onOpenChange={onClose}>
		<DialogContent className="max-w-[80%] lg:max-w-[50%] max-h-[80%] bg-white dark:bg-secondary shadow-lg rounded-lg overflow-y-auto">
		  <DialogHeader>
			<DialogTitle>Create Transaction</DialogTitle>
			<DialogDescription className="border-b border-gray-300 dark:text-gray-200 pb-2">
			  Provide the details below to create a new transaction.
			</DialogDescription>
		  </DialogHeader>
  
		  <div className="grid w-full items-center gap-5">
			{/* Property Name */}
			<div className="flex flex-col space-y-1.5">
			<Label htmlFor="propertyName" className="font-semibold">
				Property Name
			</Label>
			<Select 
				value={propertyId ? propertyId.toString() : ''} 
				onValueChange={(value) => {
				const id = parseInt(value, 10);
				setPropertyId(id);
				const selectedProperty = propertyOptions.find(prop => prop.id === id);
				setPropertyTitle(selectedProperty ? selectedProperty.title : '');
				}}
			>
				<SelectTrigger>
				<SelectValue placeholder="Select a property" />
				</SelectTrigger>
				<SelectContent>
				{propertyOptions.map((property) => (
					<SelectItem key={property.id} value={property.id.toString()}>
					{property.title}
					</SelectItem>
				))}
				</SelectContent>
			</Select>
			</div>

  
			{/* Unit Title */}
			<div className="flex flex-col space-y-1.5">
			<Select 
				value={unitId ? unitId.toString() : ''} 
				onValueChange={(value) => {
				const id = parseInt(value, 10);
				setUnitId(id);
				const selectedUnit = unitOptions.find(unit => unit.id === id);
				setUnitTitle(selectedUnit ? selectedUnit.title : '');
				}}
			>
				<SelectTrigger>
				<SelectValue placeholder="Select a unit" />
				</SelectTrigger>
				<SelectContent>
				{unitOptions.map((unit) => (
					<SelectItem key={unit.id} value={unit.id.toString()}>
					{unit.title}
					</SelectItem>
				))}
				</SelectContent>
			</Select>
			</div>
  
			{/* Client Name */}
			<div className="flex flex-col space-y-1.5">
			  <Label htmlFor="clientName" className="font-semibold">
				Client Name
			  </Label>
			  <Input
				id="clientName"
				type="text"
				value={clientName}
				onChange={(e) => setClientName(e.target.value)}
				className="border-gray-400"
				placeholder="Enter the client name"
			  />
			</div>
  

			{/* Number of Guests */}
			{serviceOption === "Room Reservation" && (
				<div className='flex flex-col space-y-1.5'>
					<Label htmlFor='guests' className='font-semibold'>
						How many guests will be accompanying you?
					</Label>
					<p className='text-xs text-gray-500 dark:text-gray-300'>
						Please enter the total number of guests, including yourself.
					</p>
					<Input
						id='guests'
						type='number'
						value={numGuests}
						onChange={(e) => setNumGuests(Number(e.target.value))}
						className='border-gray-400 mt-3'
						min={1}
						max={10}
					/>
				</div>
			)}

			{/* Month Contract */}
			<div className="flex items-center justify-between w-full">
			<Label htmlFor="monthContract" className="font-semibold">
				Number of Month Contract
			</Label>
			<div className="flex items-center space-x-4">
				<div
				onClick={() => setMonthContract((prev) => Math.max(0, prev - 1))} 
				className="px-2 py-1 rounded-full transition-all cursor-pointer hover:bg-gray-200 dark:hover:bg-secondary-dark-hover"
				>
				<MinusCircle className="text-sm" />
				</div>

				<span className="text-sm font-medium flex items-center justify-center w-[40px]">
				{monthContract}
				</span>

				<div
				onClick={() => setMonthContract((prev) => prev + 1)}
				className="px-2 py-1 rounded-full transition-all cursor-pointer hover:bg-gray-200 dark:hover:bg-secondary-dark-hover"
				>
				<PlusCircle className="text-sm" />
				</div>
			</div>
			</div>

			
		  </div>
  
		  <Button
			className="w-full mt-4"
			onClick={handleFormSubmit}
			disabled={!propertyTitle || !unitTitle || !clientName}
		  >
			Create Transaction
		  </Button>
		</DialogContent>
	  </Dialog>
	);
  };
  
  export default CreateTransactionModal;