export function createEmptyArray(count: number) {
  return Array.from({ length: count });
}

export function flatten<T>(array: Array<T | T[]>): T[] {
  return array.flat
    ? array.flat<T>()
    : array.reduce<T[]>((result, item) => result.concat(item), []);
}
