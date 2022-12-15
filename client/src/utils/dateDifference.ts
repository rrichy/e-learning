export default function dateDifference(
  date1: Date | string,
  date2: Date | string,
  unit: "days" | "hours" | "minutes" | "seconds" | "milliseconds" = "days"
) {
  const dateObj1 = Number(typeof date1 === "string" ? new Date(date1) : date1);
  const dateObj2 = Number(typeof date2 === "string" ? new Date(date2) : date2);

  const difference = Math.abs(dateObj2 - dateObj1);

  if (unit === "milliseconds") return difference;
  else if (unit === "seconds") return difference / 1000;
  else if (unit === "minutes") return difference / (1000 * 60);
  else if (unit === "hours") return difference / (1000 * 60 * 60);
  else return difference / (1000 * 60 * 60 * 24);
}
