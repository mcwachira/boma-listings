import {deleteRentalAction, fetchRentals} from "@/actions/action";
import EmptyList from "@/components/home/EmptyList";
import {Table, TableCaption, TableHead, TableHeader, TableRow, TableBody, TableCell} from "@/components/ui/table";
import Link from "next/link";
import {formatCurrency} from "@/utils/format";
import {IconButton} from "@/components/form/Buttons";
import FormContainer from "@/components/form/FormContainer";

async function RentalPage() {



    const rentals = await fetchRentals();

    if(rentals.length === 0) {
        return(
            <EmptyList heading="No Rentals" message="Don't hesitate to create a rentals."/>
        )

    }
    return(

        <div className="mt-16">

            <h4 className="mb-4 capitalize">
                Active Properties :{rentals.length}
            </h4>

            <Table>
                <TableCaption>
                    A list of all your properties
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Property Name</TableHead>
                        <TableHead>  Nightly Rate </TableHead>
                        <TableHead> Night Booked</TableHead>
                        <TableHead>  Total Income </TableHead>
                        <TableHead> Action </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {rentals.map((rental) => {
                        const {id:propertyId, name, price} = rental;
                        const {totalNightSum, orderTotalSum} = rental;

                        return <TableRow key={propertyId}>
                            <TableCell>
                                <Link href={`/properties/${propertyId}`} className="underline text-muted-foreground tracking-wide">
                                    {name}
                                </Link>
                            </TableCell>

                            <TableCell>
                                {formatCurrency(price)}
                            </TableCell>

                            <TableCell>
                                {totalNightSum || 0}
                            </TableCell>

                            <TableCell>
                                {formatCurrency(orderTotalSum)}
                            </TableCell>

                            <TableCell className="flex items-center gap-x-2">

                                <Link href={`/rentals/${propertyId}/edit`}>
                                <IconButton actionType='edit'/></Link>

                                <DeleteRental propertyId={propertyId}/>
                            </TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        </div>
    )
}


function DeleteRental({propertyId}:{propertyId:string}){

    const deleteRental = deleteRentalAction.bind(null, {propertyId})
    return (
        <FormContainer action={deleteRental}>
<IconButton actionType="delete"/>
        </FormContainer>  )

}
export default RentalPage;