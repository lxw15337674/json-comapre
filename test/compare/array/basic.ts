import compare from '../../../src/common/utils/jsonCompare/index';
import { Status } from '../../../src/common/utils/interface';
test('void', () => {
  expect(compare([], [])).toEqual(Status.eq);
  expect(compare({}, {})).toEqual({});
  expect(compare(null, null)).toEqual(null);
});
test('number eq', () => {
  expect(compare([1], [1])).toEqual([Status.eq]);
});
test('string eq', () => {
  expect(compare(['a'], ['a'])).toEqual([Status.eq]);
});

test('multi-array eq', () => {
  const array = [[]],
    array2 = [[]];
  expect(compare(array, array2)).toEqual([Status.eq]);
});

test('diff-multi-array', () => {
  const array = [[]],
    array2 = [[[]]];
  expect(compare(array, array2)).toEqual([[Status.lack]]);
});

test('boolean eq', () => {
  expect(compare([true], [true])).toEqual([Status.eq]);
});

test('basic lack', () => {
  expect(compare([], [1])).toEqual(['-']);
});
test('basic add', () => {
  expect(compare([1], [])).toEqual(['+']);
});
