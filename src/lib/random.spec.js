import { randomInt, randomItem, randomItems, insertRandom } from './random';

test('randomInt', () => {
  Array.from({ length: 50 }).forEach(() =>
    expect([0, 1, 2, 3]).toEqual(expect.arrayContaining([randomInt(3)]))
  );
});

test('randomItem', () => {
  const samples = [1, 2, 3, 4, 5];
  Array.from({ length: 50 }).forEach(() =>
    expect(samples.indexOf(randomItem(samples))).toBeGreaterThan(-1)
  );
});

test('randomItems', () => {
  const samples = [1, 2, 3];
  const results = randomItems(samples, 10);
  expect(results.length).toBe(10);
  expect(samples).toEqual(expect.arrayContaining(results));
});

test('insertRandom', () => {
  const list1 = ['a', 'b', 'c'];
  const list2 = ['e', 'f', 'g', 'h', 'i', 'j', 'k'];
  const output = insertRandom(list1, list2);

  expect(output.length).toBe(10);
  expect(output.filter(i => !list2.includes(i))).toEqual(['a', 'b', 'c']);
});
