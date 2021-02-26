# useSyncScroll

同步元素之间的scrollLeft或scrollTop

### Params

| 参数      | 说明                  | 类型                                  | 是否必填 | 默认值 |
| --------- | --------------------- | ------------------------------------- | -------- | ------ |
| refList   | 需要同步的元素Ref列表 | React.MutableRefObject<HTMLElement>[] | 是       |        |
| attribute | 同步的属性            | left\|top\|both                       | 否       | left   |
