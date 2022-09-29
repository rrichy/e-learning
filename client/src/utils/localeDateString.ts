export function localeDate(dateObj: Date | null) {
  if (!dateObj) return "";

  const [m, d, y] = dateObj.toLocaleDateString().match(/\d+/g)!.map(Number);

  return `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}`;
}
