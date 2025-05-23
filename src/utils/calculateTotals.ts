import {calculateDaysBetween} from "@/utils/calendar";


type BookingDetails = {
    checkIn:Date;
    checkOut:Date;
    price:number
}

export const calculateTotals = ({price, checkIn, checkOut}:BookingDetails)=>{

    //get number of dats booked
    const totalNights = calculateDaysBetween({checkIn, checkOut});
    const subTotal = totalNights*price;
    const cleaning = 21;
    const service = 40;
    const tax= subTotal * 0.16;

    const orderTotal = subTotal + cleaning + service +tax;

    return {totalNights,subTotal, cleaning,  service, tax, orderTotal}

}