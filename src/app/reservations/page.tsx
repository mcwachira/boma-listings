import React from "react";
import { fetchReservations } from "@/actions/action";
import EmptyList from "@/components/home/EmptyList";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/utils/format";
import Link from "next/link";
import CountryFlagAndName from "@/components/card/CountryFlagAndName";
import Stats from "@/components/reservations/Stats";

async function ReservationPage() {
  const reservations = await fetchReservations();

  if (reservations.length === 0) return <EmptyList />;
  return (
    <>
      <Stats />

      <div className="mt-16">
        <h4 className="mb-4 capitalize">
          Total Reservations :{reservations.length}
        </h4>

        <Table>
          <TableCaption>A list of all reservations</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Property Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Nights</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>CheckIn</TableHead>

              <TableHead>CheckOut</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {reservations.map((item) => {
              const { id, orderTotal, totalNights, checkIn, checkOut } = item;
              const { id: propertyId, name, country } = item.property;

              const startDate = formatDate(checkIn);
              const endDate = formatDate(checkOut);

              return (
                <TableRow key={id}>
                  <TableCell>
                    <Link
                      href={`/properties/${propertyId}`}
                      className="underline text-muted-foreground tracking-wide"
                    >
                      {name}
                    </Link>
                  </TableCell>

                  <TableCell>
                    <CountryFlagAndName countryCode={country} />
                  </TableCell>
                  <TableCell>{totalNights}</TableCell>
                  <TableCell>{formatCurrency(orderTotal)}</TableCell>
                  <TableCell>{startDate}</TableCell>
                  <TableCell>{endDate}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default ReservationPage;
