export type SubTask = {
  id: string;
  name: string;
  durationSec: number;
};

export type SubTaskInput = {
  name: string;
  mins: string;
};

export type SavedTimeboxingSession = {
  endTime: number;
  total: number;
  failMsg: string;
  task: string;
};
