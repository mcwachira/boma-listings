import React from 'react';
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import { formattedCountries } from '@/utils/countries';

const name = 'country'
function CountriesInput({defaultValue}:{defaultValue?:string}) {
    return (
    <div className="mb-2">
        <Label htmlFor={name} className="capitalize">

            Country
        </Label>

        <Select
        defaultValue={defaultValue || formattedCountries[0].code} name={name} required>
<SelectTrigger id={name}/>

<SelectValue/>
            <SelectContent>
                {formattedCountries.map((item) => {
                    return <SelectItem key={item.code} value={item.code}>
                        <span className="flex items-center gap-2">
                            {item.flag} {item.name}
                        </span>
                    </SelectItem>
                })}
            </SelectContent>
        </Select>
    </div>
    );
}

export default CountriesInput;