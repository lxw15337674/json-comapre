import compare from '../../../src/common/utils/jsonCompare/index';
import { Status } from '../../../src/common/utils/interface';
const str1 = `{
	"c": "0",
	"d": [
		{
			"generalType": 1,
			"groundArea": 11.68,
			"groundPerimeter": 13.7
     },
	{
			"generalType": 1,
			"groundArea": 11.68,
			"groundPerimeter": 13.7
     }
	],
	"f": null,
	"m": ""
}`;

const str2 = `
{
	"c": "0",
	"d": [
		{
			"generalType": 1,
			"groundArea": 11.68,
			"groundPerimeter": 13.7
}
	],
	"f": null,
	"m": ""
}
`;

describe('order Sensitive array', () => {
  const option = { arrayOrderSensitive: true };
  const fn = (value: any, compareValue: any) => {
    return compare(value, compareValue, option);
  };
  const toJsonFn = (value: string, compareValue: string) => {
    value = JSON.parse(value);
    compareValue = JSON.parse(compareValue);
    return compare(value, compareValue, option);
  };
  const { diff, eq, lack, add } = Status;
  test('array lack item', () => {
    expect(toJsonFn(str1, str2)).toEqual({
      c: '=',
      d: [
        {
          generalType: '=',
          groundArea: '=',
          groundPerimeter: '=',
        },
        '+',
      ],
      f: '=',
      m: '=',
    });
  });
});
