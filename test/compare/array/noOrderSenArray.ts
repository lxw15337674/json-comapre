import compare from '../../../src/common/utils/jsonCompare/index';

test('string eq', () => {
  expect(compare(['a'], ['a'])).toEqual(['=']);
});
test('Duplicated data', () => {
  expect(compare(['a', 'a'], ['a'])).toEqual(['=', '+']);
  expect(compare(['a', 'a', 'a', 'a'], ['a'])).toEqual(['=', '+', '+', '+']);
  expect(compare(['a', 'b', 'a', 'a'], ['a'])).toEqual(['=', '+', '+', '+']);
  expect(compare(['a'], ['a', 'a'])).toEqual(['=', '-']);
  expect(compare(['a'], ['a', 'a', 'a', 'a'])).toEqual(['=', '-', '-', '-']);
  expect(compare(['a'], ['a', 'a', 'a', 'c', 'a'])).toEqual(['=', '-', '-', '-', '-']);
});

// multi-dimensional array
test('num eq', () => {
  const array = [[1, 2]];
  const array2 = [[2, 1]];
  expect(compare(array, array2)).toEqual([['=', '=']]);
});

test('diff multi-dim array', () => {
  const array = [[1, 2]];
  const array2 = [[[1, 2], 1]];
  expect(compare(array, array2)).toEqual([['=', '+']]);
});

test('boolean eq', () => {
  expect(compare([true, true], [true])).toEqual(['=', '+']);
});
