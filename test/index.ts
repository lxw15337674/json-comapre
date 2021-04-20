import compare from '../src/common/utils/jsonCompare/index';
describe('basic ', () => {
  test('void', () => {
    expect(compare([], [])).toEqual([]);
    expect(compare({}, {})).toEqual({});
    expect(compare(null, null)).toEqual(null);
  });
  describe('eq', () => {
    test('number eq', () => {
      expect(compare([1], [1])).toEqual(['=']);
      2;
    });
    test('string eq', () => {
      expect(compare(['a'], ['a'])).toEqual(['=']);
    });
    test('array eq', () => {
      expect(compare([[]], [[]])).toEqual(['=']);
      expect(compare([[[]]], [[[]]])).toEqual(['=']);
    });
  });

  test('basic lack', () => {
    expect(compare([], [1])).toEqual(['-']);
  });
  test('basic add', () => {
    expect(compare([1], [])).toEqual(['+']);
  });
});
describe('not order sensitive array', () => {
  describe('one-dimensional array', () => {
    test('string eq', () => {
      expect(compare(['a'], ['a'])).toEqual(['=']);
    });
    // test('')
  });
  describe('multi-dimensional array', () => {
    test('num eq', () => {
      expect(compare([1, 2], [2, 1])).toEqual(['=', '=']);
    });
  });
});

describe('order Sensitive array', () => {
  const option = { arrayOrderSensitive: true };
  test('basic diff', () => {
    expect(compare([1], [2], option)).toEqual(['D']);
  });
});
