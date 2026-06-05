import { useEffect, useRef, useState } from 'react';

import { SubTask } from '../types/timeboxing';

export function useTimer(onComplete?: () => void | Promise<void>) {
  const [tasksQueue, setTasksQueue] = useState<SubTask[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isActive || remainingTime <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setRemainingTime((time) => time - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, remainingTime]);

  useEffect(() => {
    if (!isActive || remainingTime !== 0 || tasksQueue.length === 0) {
      return;
    }

    const nextIndex = currentTaskIndex + 1;
    const nextTask = tasksQueue[nextIndex];

    if (nextTask) {
      setCurrentTaskIndex(nextIndex);
      setRemainingTime(nextTask.durationSec);
      return;
    }

    setIsActive(false);
    onCompleteRef.current?.();
  }, [currentTaskIndex, isActive, remainingTime, tasksQueue]);

  const startTimer = (queue: SubTask[]) => {
    if (queue.length === 0) {
      return;
    }

    setTasksQueue(queue);
    setCurrentTaskIndex(0);
    setRemainingTime(queue[0].durationSec);
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
    setRemainingTime(0);
    setTasksQueue([]);
    setCurrentTaskIndex(0);
  };

  return {
    tasksQueue,
    currentTaskIndex,
    remainingTime,
    isActive,
    startTimer,
    stopTimer,
  };
}
