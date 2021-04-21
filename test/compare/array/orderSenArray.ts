import compare from '../../../src/common/utils/jsonCompare/index';

describe('order Sensitive array', () => {
  const option = { arrayOrderSensitive: true };
  test('basic diff', () => {
    expect(compare([1], [2], option)).toEqual(['D']);
  });
});
