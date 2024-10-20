"use client"

import React from 'react'
import { Button } from '@/components/ui/button';
import { createProperty } from '@/actions/property/create-property';
import Link from 'next/link';
import ResponsiveLayout from '@/components/ResponsiveLayout';

function HostAProperty() {
  return (
      <ResponsiveLayout className='h-screen flex items-center justify-center'>
          <div className='flex flex-row items-center justify-center gap-3'>
              <Button
                  type="submit"
                  onClick={async () => {
                      await createProperty();
                  }}
              >
                  Get started
              </Button>
              <Link href={`/hosting/listings`}>Go back</Link>
          </div>
      </ResponsiveLayout>
  );
}

export default HostAProperty