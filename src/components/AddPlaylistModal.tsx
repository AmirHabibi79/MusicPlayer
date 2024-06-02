import { LegacyRef, useEffect, useRef, useState } from "react";
import CustomModal from "./CustomModal";
import usePlaylist from "../hooks/usePlaylist";
export default function AddPlaylistModal() {
  const [open, setOpen] = useState(false);
  const { addPlayList } = usePlaylist();
  const nameRef = useRef<HTMLInputElement>();
  useEffect(() => {
    nameRef.current?.focus();
  }, []);
  return (
    <>
      <CustomModal open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col gap-2 p-2 bg-white">
          <input
            ref={nameRef as LegacyRef<HTMLInputElement>}
            placeholder="name of playlist"
            autoFocus={true}
          />
          <button
            onClick={() => {
              addPlayList(nameRef.current?.value as string);
              nameRef.current!.value = "";
              setOpen(false);
            }}
          >
            add playlist
          </button>
        </div>
      </CustomModal>
      <button onClick={() => setOpen(true)}>open modal</button>
    </>
  );
}
