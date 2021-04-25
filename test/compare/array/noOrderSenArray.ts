import compare from '../../../src/common/utils/jsonCompare/index';
import { Status } from '../../../src/common/utils/interface';

const option = { arrayOrderSensitive: false };
const fn = (value: any, compareValue: any) => {
  return compare(value, compareValue, option);
};
const { diff, eq, lack, add } = Status;

test('string eq', () => {
  expect(fn(['a'], ['a'])).toEqual([eq]);
});
test('Duplicated data', () => {
  expect(fn(['a', 'a'], ['a'])).toEqual([eq, add]);
  expect(fn(['a', 'a', 'a', 'a'], ['a'])).toEqual([eq, add, add, add]);
  expect(fn(['a', 'b', 'a', 'a'], ['a'])).toEqual([eq, add, add, add]);
  expect(fn(['a'], ['a', 'a'])).toEqual([eq, lack]);
  expect(fn(['a'], ['a', 'a', 'a', 'a'])).toEqual([eq, lack, lack, lack]);
  expect(fn(['a'], ['a', 'a', 'a', 'c', 'a'])).toEqual([eq, lack, lack, lack, lack]);
});

// multi-dimensional array
test('num eq', () => {
  const array = [[1, 2]];
  const array2 = [[2, 1]];
  expect(fn(array, array2)).toEqual([[eq, eq]]);
});

test('diff multi-dim array', () => {
  const array = [[1, 2]];
  const array2 = [[[1, 2], 1]];
  expect(fn(array, array2)).toEqual([[eq, add]]);
});

test('boolean eq', () => {
  expect(fn([true, true], [true])).toEqual([eq, add]);
});
test('array lack and add', () => {
  expect(fn([1, 2, 3], [1, 1, 1, 1, 1])).toEqual([eq, add, add, lack, lack]);
});
