import { atom } from "recoil";

const isPlaying = atom({
  key: "isplaying",
  default: false,
});
const currentTime = atom({
  key: "currentTime",
  default: 0,
});
const duration = atom({
  key: "duration",
  default: 0,
});
const loop = atom({
  key: "loop",
  default: false,
});
const isSeeking = atom({
  key: "isseeking",
  default: false,
});
const volume = atom({
  key: "volume",
  default: 0.5,
});
const buffer = atom({
  key: "buffer",
  default: 0,
});
export { isPlaying, currentTime, duration, loop, isSeeking, volume, buffer };
