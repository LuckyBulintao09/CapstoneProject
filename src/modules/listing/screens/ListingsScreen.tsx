"use client"
import React, { useState } from 'react';
import ListingsHero from '../components/ListingsPage';
import { Toaster } from 'sonner';



const ListingsScreen = () => {
	return(
		<>
		<Toaster position='bottom-right'/>
		<div className='h-full'>
			<ListingsHero />
		</div>
		</>
		
	)
		
};

export default ListingsScreen;
