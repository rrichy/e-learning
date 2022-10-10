export default function createMap<T = any, K = number | string>(
  arr: T[],
  key: string
) {
  const reduced = arr.reduce(
    (acc, item) => [...acc, [(item as any)[key], item] as [K, T]],
    [] as [K, T][]
  );

  return new Map<K, T>(reduced);
}
