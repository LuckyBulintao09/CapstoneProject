'use server';

import React from 'react';

import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';

import { cn } from '@/lib/utils';

import { ArrowLeft, Check, CircleAlert, CircleCheck, X } from 'lucide-react';

import BusinessPermitContent from './_components/business-permit-content';

import { getAuthenticatedUser } from '@/utils/supabase/server';
import {
	getBusinessPermit,
	getFireInspection,
} from '@/actions/property/propertyDocuments';
import FireInspectionContent from './_components/fire-inspection-content';

async function DocumentsPage({ params }: { params: { propertyId: string } }) {
	const user = await getAuthenticatedUser();
	const businessPermit = await getBusinessPermit(params.propertyId);
	const fireInspection = await getFireInspection(params.propertyId);
	console.log(businessPermit && fireInspection);

	return (
        <section className="flex flex-col h-[calc(100vh-68px)] w-full px-6 airBnbDesktop:overflow-x-hidden airBnbDesktop:overflow-y-auto airBnbTablet:px-10 min-[1128px]:px-20 airBnbBigDesktop:px-0">
            <header className="airBnbDesktop:mx-auto airBnbDesktop:sticky airBnbDesktop:z-[3] airBnbDesktop:top-0 airBnbDesktop:grow-0 airBnbDesktop:shrink-0 airBnbDesktop:basis-auto airBnbDesktop:pb-5 airBnbDesktop:pt-11 bg-background">
                <div className="mt-3 flex items-center justify-between w-full px-10 py-6 airBnbDesktop:gap-6 airBnbDesktop:w-[464px] airBnbDesktop:p-0 airBnbBigDesktop:w-[800px] min-[1128px]:w-[512px]">
                    <div className="flex justify-center ">
                        <Link
                            href={`/hosting/properties`}
                            className={cn(
                                buttonVariants({ variant: "ghost", size: "icon" }),
                                "rounded-full airBnbDesktop:hidden"
                            )}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <h2 className="m-0 p-0 text-[1em]">
                            <span className="p-1 px-0 text-[1.5rem] font-normal">Documents</span>
                        </h2>
                    </div>
                </div>
            </header>
            <div className=" px-6 airBnbDesktop:px-0 min-[1128px]:px-0 py-6 pt-0 grow overflow-y-auto airBnbDesktop:pb-10 airBnbDesktop:overflow-y-visible">
                <div className="airBnbDesktop:mx-auto airBnbBigDesktop:w-[800px] min-[1128px]:w-[512px] airBnbDesktop:w-[464px]">
                    <div className="font-normal">
                        <div className="text-base leading-5 tracking-normal my-4 lg:mt-0">
                            You need to upload necessary documents for the property to be
                            approved by UniHomes. Once the property is approved, it will be published for users to see.
                            Too see more information about the documents required, you can read more on our{" "}
                            <Link
                                href={`/TermsAndCondition`}
                                className={cn(buttonVariants({ variant: "link" }), "p-0 h-auto m-0 text-base")}
                            >
                                terms and conditions
                            </Link>
                            .
                        </div>
                    </div>
                    <div className="mb-6 font-normal airBnbDesktop:mb-6">
                        <div className="text-[1rem] leading-5 tracking-normal my-0 space-y-4">
                            <div className="rounded-lg border border-border px-4 py-3">
                                <div className="flex gap-3">
                                    {businessPermit.business_permit && fireInspection.fire_inspection ? (
                                        <CircleCheck
                                            className="mt-0.5 shrink-0 text-success w-5 h-5"
                                            strokeWidth={2}
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <CircleAlert
                                            className="mt-0.5 shrink-0 text-danger w-5 h-5"
                                            strokeWidth={2}
                                            aria-hidden="true"
                                        />
                                    )}
                                    <div className="grow space-y-2">
                                        <p className="text-sm font-medium">
                                            For your property to be approved, you must include the following:
                                        </p>
                                        <ul className="list-none text-sm text-muted-foreground">
                                            <li className="flex gap-1 items-center">
                                                {businessPermit.business_permit ? (
                                                    <Check className="shrink-0 text-success w-5 h-5" />
                                                ) : (
                                                    <X className="shrink-0 text-danger w-5 h-5" />
                                                )}
                                                <span>Business permit</span>
                                            </li>
                                            <li className="flex gap-1 items-center">
                                                {fireInspection.fire_inspection ? (
                                                    <Check className="shrink-0 text-success w-5 h-5" />
                                                ) : (
                                                    <X className="shrink-0 text-danger w-5 h-5" />
                                                )}
                                                <span>Fire safety permit</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-8 min-w-[16px] airBnbDesktop:min-w-[auto] airBnbDesktop:ml-auto">
                        <div className="gap-2">
                            <BusinessPermitContent
                                businessPermit={businessPermit?.business_permit}
                                propertyId={params.propertyId}
                                userId={user?.id}
                            />
                        </div>

                        <div className="gap-2">
                            <FireInspectionContent
                                fireInspection={fireInspection?.fire_inspection}
                                userId={user?.id}
                                propertyId={params.propertyId}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default DocumentsPage;
