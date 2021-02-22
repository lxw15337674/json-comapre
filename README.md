# json比对

##  API

####  jsonCompare(*value*, compareValue,options)

- 参数：

  - value：any
  - compareValue：any
  - options:
    - arrayOrderSensitive：数据顺序敏感

- 返回值：

  返回比对结果，

- 用法：

  传入两个json，获得比对结果。

  比对状态分为四种：

  ```typescript
  enum Status {
   add = '+',
   lack = '-',
   diff = 'D',
   eq = '=',
  }
  ```

- 示例：

  ```typescript
  const value = {
      a1: 2,
      a: '1',
      b: [1, 2, '3', { a: 2 }, [2]],
      c: { a: 2, c: 4 },
    };
  const compareValue=  {
      a: 2,
      b: { a: 2 },
      c: { c: 4, a: 2 },
      d: [1, 2],
  };
  console.log(compare(value, compareValue));
  //{ a1: '+', a: 'D', b: 'D', c: { a: '=', c: '=' }, d: '-' }
  ```

  ```typescript
  const value = [1, 2];
  const compareValue = {
    a: 2,
  };
  console.log(compare(value, compareValue));
  //D 
  ```

####  formatToJSON(*diffResult*, *obj*, *compareObj*)

- 参数：

  - diffResult：any
  - obj：any
  - compareObj:any

- 返回值：

  返回格式化后的json数据和每行比对状态。

  ```typescript
  enum Status {
   add = '+',
   lack = '-',
   diff = 'D',
   eq = '=',
  }
  ```

- 用法：

  传入比对结果，被比较json，比较json

- 示例：