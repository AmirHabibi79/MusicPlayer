import { SongsAtom } from "../store/index";
import { useRecoilState } from "recoil";
export default function useSongs() {
  const [songs, setSongs] = useRecoilState(SongsAtom);
  return [songs, setSongs] as const;
}
