'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Correctly import NavSearch with ssr: false (no nested dynamic)
const DynamicNavSearch = dynamic(() => import('@/components/navbar/NavSearch'), {
    ssr: false,
});

export default function DynamicNavSearchComponent() {
    return <DynamicNavSearch />;
}
