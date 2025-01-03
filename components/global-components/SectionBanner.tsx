import React from 'react';

interface SectionBannerProps {
  title: string | null;
  short_description: string | null;
}

function SectionBanner({ title, short_description }: SectionBannerProps) {
  return (
    <div className="sticky top-0 bg-blue-800 text-white p-6 shadow-md rounded-md ">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-extrabold justify-start">{title}</h1>
        <p className="text-xs">{short_description}</p>
      </div>
    </div>
  );
}

export default SectionBanner;
