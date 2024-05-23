import { SelectedAtom } from "../store/index";
import { useRecoilState } from "recoil";
export default function useSelectedSong() {
  const [selected, setSelected] = useRecoilState(SelectedAtom);
  return [selected, setSelected] as const;
}
