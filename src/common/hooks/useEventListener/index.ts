// https://ahooks.js.org/zh-CN/hooks/dom/use-event-listener
import { useEffect } from 'react';
import { BasicTarget, getTargetElement } from '../../utils/dom';

export type Target = BasicTarget<HTMLElement | Element | Window | Document>;

type Options = {
  target?: Target;
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
};

function useEventListener(eventName: string, handler: (e) => void, options: Options = {}) {
  useEffect(() => {
    const targetElement = getTargetElement(options.target, window);
    if (!targetElement?.addEventListener) {
      return;
    }

    targetElement.addEventListener(eventName, handler, {
      capture: options.capture,
      once: options.once,
      passive: options.passive,
    });

    return () => {
      targetElement.removeEventListener(eventName, handler, {
        capture: options.capture,
      });
    };
  }, [eventName, options]);
}

export default useEventListener;
