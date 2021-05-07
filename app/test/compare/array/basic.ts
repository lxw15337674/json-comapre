import compare from '../../../src/common/utils/jsonCompare/index';
import { Status } from '../../../src/common/utils/interface';
describe('order Sensitive array', () => {
  const option = { arrayOrderSensitive: false };
  const fn = (value: any, compareValue: any) => {
    return compare(value, compareValue, option);
  };
  const toJson = (value) => {
    return JSON.parse(value);
  };
  const { diff, eq, lack, add } = Status;
  test('void', () => {
    expect(fn([], [])).toEqual(eq);
    expect(fn({}, {})).toEqual({});
    expect(fn(null, null)).toEqual(null);
  });
  test('diff type', () => {
    expect(fn({ a: [] }, [])).toEqual(diff);
  });
  test('number eq', () => {
    expect(fn([1], [1])).toEqual([eq]);
  });
  test('string eq', () => {
    expect(fn(['a'], ['a'])).toEqual([eq]);
  });

  test('multi-array eq', () => {
    const array = [[]],
      array2 = [[]];
    expect(fn(array, array2)).toEqual([eq]);
  });

  test('diff-multi-array', () => {
    const array = [[]],
      array2 = [[[]]];
    expect(fn(array, array2)).toEqual([[lack]]);
  });

  test('boolean eq', () => {
    expect(fn([true], [true])).toEqual([eq]);
  });

  test('basic lack', () => {
    expect(fn([], [1])).toEqual([lack]);
  });
  test('basic add', () => {
    expect(fn([1], [])).toEqual([add]);
  });
  // object
  test('basic', () => {
    expect(fn({ a: '1' }, { a: '2' })).toEqual({ a: diff });
  });
  test('basic multi-dim Obj', () => {
    expect(fn({ a: { a1: 1 } }, { a: { a1: 2 } })).toEqual({ a: { a1: diff } });
  });
  test('basic multi-dim Obj', () => {
    expect(fn({ a: { a1: 1 }, b: { b1: 1 } }, { a: { a1: 2 } })).toEqual({
      a: { a1: diff },
      b: add,
    });
  });
  test('obj lack', () => {
    expect(fn({ b: 1 }, { a: { a1: 2 } })).toEqual({
      b: add,
      a: lack,
    });
  });
  test('obj diff', () => {
    expect(fn({ b: 1 }, { a: { a1: 2 } })).toEqual({
      b: add,
      a: lack,
    });
  });
});
