import { useEffect, useRef, useState } from 'react';

export type Attribute = 'left' | 'both' | 'top';
function useSyncScroll(
  refList: React.MutableRefObject<HTMLElement>[],
  attribute: Attribute = 'left',
) {
  const lock = useRef(0);
  useEffect(() => {
    function syncScroll(e) {
      if (lock.current > 0) {
        lock.current -= 1;
        return;
      }
      const syncList = refList.filter((ref) => ref.current !== e.target);
      lock.current = syncList.length;
      if (attribute === 'left' || attribute === 'both') {
        const left = e.target.scrollLeft;
        for (let ref of syncList) {
          ref.current.scrollLeft = left;
        }
      }
      if (attribute === 'top' || attribute === 'both') {
        const top = e.target.scrollTop;
        for (let ref of syncList) {
          if (ref.current) {
            ref.current.scrollTop = top;
          }
        }
      }
    }
    for (let ref of refList) {
      if (ref.current) {
        ref.current.addEventListener('scroll', syncScroll);
      }
    }
    return () => {
      for (let ref of refList) {
        if (ref.current) {
          ref.current.removeEventListener('scroll', syncScroll);
        }
      }
    };
  }, []);
}

export default useSyncScroll;
