export enum Status {
  add = '+',
  lack = '-',
  diff = 'D',
  eq = '=',
}

export type BasicType = number | string | null;

export interface Options {
  arrayOrderSensitive: boolean;
}
export interface JsonCompare {
  (obj: object, compareObj: object, options?: Options): [string[], Status[]];
}

export type LineNumberValue = LineNumberValue[] | number | LineNumberObj;
export interface LineNumberObj {
  [propsName: string]: LineNumberValue;
}
export interface StatusObj {
  [propsName: string]: Status | StatusObj | Status[];
}

export type JsonValue = boolean | any[] | object | boolean | null | string;
