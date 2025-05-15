import React from "react";
import Chart from "./Chart";
import { fetchChartsData } from "@/actions/action";

async function ChartsContainer() {
  const bookings = await fetchChartsData();
  if (bookings.length < 1) return null;

  return <Chart data={bookings} />;
}

export default ChartsContainer;
