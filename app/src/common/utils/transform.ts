//数字转px
export function numToPx(number: number): string {
  if (number) {
    return `${number}px`;
  }
  return "";
}
//px转数字
export function pxToNum(str: string): number {
  if (str) {
    return parseInt(str.slice(0, -2), 10);
  }
  return 0;
}
