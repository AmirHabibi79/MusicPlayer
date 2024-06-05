import { Songs, selectedSong } from "./song";
import {
  isPlaying,
  currentTime,
  duration,
  loop,
  isSeeking,
  volume,
  buffer,
  playerElement,
  isPlayerReady,
  isPlayerInit,
  isMute,
  isLoading,
  isKeyboardSetup,
} from "./player";

import {
  playlists,
  isAddingSong,
  selectedPlaylistToEdit,
  getPlaylists,
  selectedPlaylistToPlayId,
  getSongsFromSelectedPlaylist,
} from "./playlist";

export {
  Songs as SongsAtom,
  selectedSong as SelectedAtom,
  isPlaying as IsPlayingAtom,
  currentTime as CurrentTimeAtom,
  duration as DurationAtom,
  loop as LoopAtom,
  isSeeking as IsSeekingAtom,
  volume as VolumeAtom,
  buffer as BufferAtom,
  playerElement as PlayerElementAtom,
  isPlayerReady as IsPlayerReadyAtom,
  isPlayerInit as IsPlayerInitAtom,
  isMute as IsMuteAtom,
  playlists as PlaylistAtom,
  isAddingSong as IsAddingSongToPlaylistAtom,
  selectedPlaylistToEdit as SelectedPlaylistToEditAtom,
  getPlaylists as GetPlaylistSelector,
  selectedPlaylistToPlayId as SelectedPlaylistToPlayIdAtom,
  getSongsFromSelectedPlaylist as GetSongsFromSelectedPlaylistSelector,
  isLoading as IsLoadingAtom,
  isKeyboardSetup as IskeyboardSetupAtom,
};
