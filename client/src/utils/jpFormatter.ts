export const jpDate = (
  date?: string | Date | null,
  withTime: boolean = false
) => {
  if (!date) return null;
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return (
    dateObj.toLocaleDateString("ja-JP", { dateStyle: "long" }) +
    (withTime ? " " + dateObj.toLocaleTimeString() : "")
  );
};

export const jpCurrency = (num: number) =>
  num.toLocaleString("jp-JP", { style: "currency", currency: "JPY" });

export const getAgeFromDate = (date: string | Date) => {
  const timestamp = +(typeof date === "string" ? new Date(date) : date);
  return Math.floor((+new Date() - timestamp) / 31556926000);
};
