'use client';

import { useEffect, useRef, useState } from 'react';

const useScrollMore = (target: HTMLElement | null, threshold = 90, cooldown = 500): boolean => {
  const [trigger, setTrigger] = useState(false);
  const lastTriggerTime = useRef(0);

  useEffect(() => {
    if (!target) return;

    const handleScroll = (): void => {
      const scrolledPercentage =
        (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;

      const now = Date.now();
      if (scrolledPercentage >= threshold && now - lastTriggerTime.current > cooldown) {
        setTrigger(true);
        lastTriggerTime.current = now;
      }
    };

    target.addEventListener('scroll', handleScroll);
    return () => {
      target.removeEventListener('scroll', handleScroll);
    };
  }, [target, threshold, cooldown]);

  useEffect(() => {
    if (trigger) {
      setTrigger(false); // reset quickly
    }
  }, [trigger]);

  return trigger;
};

export default useScrollMore;
