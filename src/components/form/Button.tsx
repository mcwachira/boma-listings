"use client"

import React from 'react';
import {Button} from "@/components/ui/button";
import { ReloadIcon } from '@radix-ui/react-icons';
import { useFormStatus } from 'react-dom';

type SubmitButtonProps = {
    className?: string;
    text?:string;
}

function SubmitButton({
                          className = '',
                          text = 'submit',
                      }: SubmitButtonProps) {
    const { pending } = useFormStatus();
    return (
<Button type="submit" disabled={pending} className={`capitalize ${className}`} size='lg'>
    {pending ? (
        <>
            <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
            Please wait...
        </>
    ) : (
        text
    )}
</Button>
    );
}

export default SubmitButton;