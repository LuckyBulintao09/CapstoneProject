'use server';

import CompanyCard from '@/modules/hosting/company/CompanyCard';
import HostingContentLayout from '@/modules/hosting/components/ContentLayout';
import CustomBreadcrumbs from '@/modules/hosting/components/CustomBreadcrumbs';
import React from 'react';

async function Company() {
	return (
		<div>
			<HostingContentLayout>
				<CustomBreadcrumbs />
				<CompanyCard />
			</HostingContentLayout>
		</div>
	);
}

export default Company;
