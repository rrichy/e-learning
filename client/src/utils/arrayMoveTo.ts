export default function arrayMoveTo(
  arr: any[],
  from: number,
  to: number,
  movedAttribute?: string
) {
  const sub = [...arr];
  sub.splice(to, 0, sub.splice(from, 1)[0]);

  if (movedAttribute) {
    const mapped = arr.map((a) => a[movedAttribute]);
    return sub.map((a, i) => ({ ...a, [movedAttribute]: mapped[i] }));
  }

  return sub;
}
