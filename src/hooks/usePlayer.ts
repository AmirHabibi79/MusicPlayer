import { useRecoilState, useRecoilCallback } from "recoil";
import {
  IsPlayingAtom,
  DurationAtom,
  CurrentTimeAtom,
  LoopAtom,
  IsSeekingAtom,
  VolumeAtom,
  BufferAtom,
  SelectedAtom,
  PlayerElementAtom,
  IsPlayerReadyAtom,
  IsPlayerInitAtom,
  IsMuteAtom,
  GetSongsFromSelectedPlaylistSelector,
  IsLoadingAtom,
} from "../store/index";
import { checkType, clamp } from "../helper/utils";
import useSongs from "./useSongs";
import useSelectedSong from "./useSelectedSong";
import { Song } from "../types/Song";
import { useEffect } from "react";
import usePlaylist from "./usePlaylist";
import { Loop } from "../store/player";

export default function usePlayer() {
  //TODO: refactor code
  //TODO: make the function as selectors
  const { songsFromSelectedPlaylist } = usePlaylist();
  const [isPlayerInit, setIsPlayerInit] = useRecoilState(IsPlayerInitAtom);

  const [isPlayerReady, setIsPlayerReady] = useRecoilState(IsPlayerReadyAtom);

  const [playerElem, setPlayerElem] = useRecoilState(PlayerElementAtom);

  const [isPlaying, setIsPlaying] = useRecoilState(IsPlayingAtom);
  const [currentTime, setCurrentTime] = useRecoilState(CurrentTimeAtom);
  const [duration, setDuration] = useRecoilState(DurationAtom);
  const [loop, setloop] = useRecoilState(LoopAtom);
  const [isSeek, setIsSeek] = useRecoilState(IsSeekingAtom);
  const [volume, setVolume] = useRecoilState(VolumeAtom);
  const [isMute, setIsMute] = useRecoilState(IsMuteAtom);
  const [isLoading, setIsLoading] = useRecoilState(IsLoadingAtom);

  const [buffer, setBuffer] = useRecoilState(BufferAtom);
  const [selected, setSelcted] = useSelectedSong();

  const { getSongById } = useSongs();

  const internal_checkPlayerStatus = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        const playerElement = snapshot.getLoadable(PlayerElementAtom).contents;
        const playerReady = snapshot.getLoadable(IsPlayerReadyAtom).contents;
        if (playerReady === false) {
          throw Error("player is not ready");
        }
        if (playerElement === null) {
          throw Error("player element is null");
        }
      },
    [isPlayerReady, playerElem]
  );

  const internal_onTimeUpdate = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        const seek = snapshot.getLoadable(IsSeekingAtom).contents as boolean;
        const PlayerElement = snapshot.getLoadable(PlayerElementAtom).contents;

        if (seek) return;
        setCurrentTime(PlayerElement.currentTime as number);

        internal_setBuffer();
      },
    [isSeek, playerElem]
  );
  const internal_setBuffer = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        const PlayerElement = snapshot.getLoadable(PlayerElementAtom)
          .contents as HTMLAudioElement;
        const current = snapshot.getLoadable(CurrentTimeAtom)
          .contents as number;
        const d = snapshot.getLoadable(DurationAtom).contents as number;
        let bufferAmount = 0;
        if (d > 0) {
          for (let i = 0; i < PlayerElement.buffered.length; i++) {
            if (
              PlayerElement.buffered.start(
                PlayerElement.buffered.length - 1 - i
              ) < current
            ) {
              bufferAmount =
                (PlayerElement.buffered.end(
                  PlayerElement.buffered.length - 1 - i
                ) *
                  100) /
                d;

              break;
            }
          }
        }

        // const bufferedEnd =
        //   PlayerElement.buffered.length === 0
        //     ? 0
        //     : (PlayerElement.buffered.end(
        //         PlayerElement.buffered.length - 1
        //       ) as number);
        // const d = isNaN(PlayerElement!.duration) ? 0 : PlayerElement!.duration;
        // if (d === 0) {
        //   setBuffer(0);
        //   return;
        // }
        // const bufferAmount = d === 0 ? 0 : (bufferedEnd / d) * 100;

        setBuffer(bufferAmount);
      },
    [playerElem, currentTime, duration]
  );
  // const internal_onLoadedMetadata = useRecoilCallback(
  //   ({ snapshot }) =>
  //     () => {
  //       //this is the first event to fire
  //       const PlayerElement = snapshot.getLoadable(PlayerElementAtom).contents;
  //       setDuration(PlayerElement.duration as number);
  //     },
  //   [playerElem]
  // );
  const internal_setCurrentTime = useRecoilCallback(
    ({ snapshot }) =>
      (currentTime: number) => {
        const player = snapshot.getLoadable(PlayerElementAtom)
          .contents as HTMLAudioElement;
        setCurrentTime(currentTime);
        player.currentTime = currentTime;
      },
    [playerElem]
  );

  const internal_onEnd = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        internal_reset();
        const l = snapshot.getLoadable(LoopAtom).contents as Loop;

        const selectedSong = snapshot.getLoadable(SelectedAtom).contents;
        const songs = snapshot.getLoadable(GetSongsFromSelectedPlaylistSelector)
          .contents as Song[];
        const songLength = songs.length;
        const selectedIndex = songs.indexOf(selectedSong);
        const isNextSongIndexHigherThanSongLength =
          selectedIndex + 1 > songLength - 1;
        if (l === Loop.singleSong) {
          internal_load(songs[selectedIndex].Link);
          internal_repeat();
          return;
        } else if (l === Loop.allSong) {
          if (isNextSongIndexHigherThanSongLength) {
            const song = songsFromSelectedPlaylist[0];
            setSelcted(song);
            internal_play(song.Id);
            return;
          }
        } else {
          if (isNextSongIndexHigherThanSongLength) {
            pause();
            internal_setCurrentTime(0);
            return;
          }
        }
        nextSong();
      },
    [loop, songsFromSelectedPlaylist]
  );

  const internal_repeat = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        const player = snapshot.getLoadable(PlayerElementAtom)
          .contents as HTMLAudioElement;
        setCurrentTime(0);
        player.currentTime = 0;
        player.play();
      },
    [playerElem]
  );

  const internal_play = useRecoilCallback(
    ({ snapshot }) =>
      (songId: number) => {
        internal_checkPlayerStatus();
        const playerElement = snapshot.getLoadable(PlayerElementAtom).contents;
        internal_load(getSongById(songId).Link);
        playerElement.play();
      },
    [playerElem]
  );
  const internal_load = useRecoilCallback(
    ({ snapshot }) =>
      (src: string) => {
        internal_checkPlayerStatus();

        const playerElement = snapshot.getLoadable(PlayerElementAtom).contents;
        playerElement!.src = src;
        playerElement!.load();
      },
    [playerElem]
  );

  const internal_reset = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        const player = snapshot.getLoadable(PlayerElementAtom)
          .contents as HTMLAudioElement;
        internal_setCurrentTime(0);
        setBuffer(0);
        setIsPlaying(false);
        player.src = "";
      },
    [playerElem]
  );
  const playerInit = (playerElem: HTMLAudioElement) => {
    checkType(playerElem, "htmlaudioelement");
    setPlayerElem(playerElem);
    setIsPlayerReady(true);
  };
  const selectSongAndPlay = useRecoilCallback(
    ({ snapshot }) =>
      (songId: number) => {
        internal_reset();
        const selectedSong = snapshot.getLoadable(SelectedAtom)
          .contents as Song;
        let song: Song | null = null;

        song = getSongById(songId);

        if (selectedSong !== null) {
          if (selectedSong.Id === songId) {
            play();
            return;
          }
        }
        setSelcted(song);
        internal_load(song.Link);
        play();
      },
    [selected]
  );
  const play = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        internal_checkPlayerStatus();

        const playerElement = snapshot.getLoadable(PlayerElementAtom)
          .contents as HTMLAudioElement;

        if (playerElement.src !== "") playerElement.play();
      },
    [playerElem]
  );

  const pause = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        internal_checkPlayerStatus();
        const playerElement = snapshot.getLoadable(PlayerElementAtom).contents;

        playerElement.pause();
      },
    [PlayerElementAtom]
  );
  const nextSong = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        internal_reset();
        const selectedSong = snapshot.getLoadable(SelectedAtom).contents;
        if (selectedSong === null) return;
        const songsFromSelectedPlaylist = snapshot.getLoadable(
          GetSongsFromSelectedPlaylistSelector
        ).contents as Song[];
        const songLength = songsFromSelectedPlaylist.length;
        const selectedIndex = songsFromSelectedPlaylist.indexOf(selectedSong);
        const isNextSongIndexHigherThanSongLength =
          selectedIndex + 1 > songLength - 1;
        let song: Song = songsFromSelectedPlaylist[0];
        if (isNextSongIndexHigherThanSongLength) {
          setSelcted(song);
        } else {
          song = songsFromSelectedPlaylist[selectedIndex + 1];

          setSelcted(song);
        }
        internal_play(song.Id);
      },
    [selected, songsFromSelectedPlaylist]
  );
  const preSong = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        internal_reset();

        const selectedSong = snapshot.getLoadable(SelectedAtom).contents;
        if (selectedSong === null) return;
        const songsFromSelectedPlaylist = snapshot.getLoadable(
          GetSongsFromSelectedPlaylistSelector
        ).contents as Song[];
        const songLength = songsFromSelectedPlaylist.length;
        const selectedIndex = songsFromSelectedPlaylist.indexOf(selectedSong);

        const isPreSongIndexLowerThanSongLength = selectedIndex - 1 < 0;

        let song: Song = songsFromSelectedPlaylist[songLength - 1];

        if (isPreSongIndexLowerThanSongLength) {
          setSelcted(song);
        } else {
          song = songsFromSelectedPlaylist[selectedIndex - 1];

          setSelcted(song);
        }
        internal_play(song.Id);
      },
    [selected, songsFromSelectedPlaylist]
  );

  const changeVolume = (v: number) => {
    const clampedV = clamp(v, 0, 1);
    setVolume(clampedV);
    setIsMute(false);
  };
  const onSeek = (currentTime: number) => {
    setIsSeek(true);
    setCurrentTime(currentTime);
  };
  const onSeekFinished = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        const playerElement = snapshot.getLoadable(PlayerElementAtom)
          .contents as HTMLAudioElement;
        const current = snapshot.getLoadable(CurrentTimeAtom)
          .contents as number;
        if (playerElement === null) return;

        playerElement.currentTime = current;
        setIsSeek(false);
      },
    [playerElem, currentTime]
  );
  const changeIsMute = () => {
    setIsMute((pre) => !pre);
  };

  const changeLoop = () => {
    setloop((pre) => {
      switch (pre) {
        case Loop.noLoop:
          return Loop.allSong;
        case Loop.allSong:
          return Loop.singleSong;
        case Loop.singleSong:
          return Loop.noLoop;
      }
    });
  };

  useEffect(() => {
    if (playerElem !== null) {
      playerElem.volume = volume;
    }
  }, [volume, playerElem]);

  useEffect(() => {
    if (playerElem !== null) {
      playerElem.muted = isMute;
    }
  }, [playerElem, isMute]);

  useEffect(() => {
    if (isPlayerInit !== true && playerElem !== null) {
      playerElem.onloadstart = () => {
        setIsLoading(true);
      };
      playerElem.ondurationchange = () => {
        setDuration(playerElem.duration);
      };
      playerElem.onprogress = internal_setBuffer;
      // playerElem.oncanplay = () => {
      //   console.log("can play");
      // };
      playerElem.oncanplaythrough = () => {
        setIsLoading(false);
      };
      playerElem.ontimeupdate = internal_onTimeUpdate;
      playerElem.onended = internal_onEnd;
      playerElem.onplay = () => {
        setIsPlaying(true);
      };
      playerElem.onpause = () => {
        setIsPlaying(false);
      };
      setIsPlayerInit(true);
    }
  }, [isPlayerInit, playerElem]);

  return {
    isPlaying,
    play,
    pause,
    currentTime,
    duration,
    changeVolume,
    loop,
    changeLoop,
    volume,
    buffer,
    nextSong,
    preSong,
    isPlayerReady,
    playerInit,
    changeIsMute,
    isMute,
    onSeek,
    onSeekFinished,
    isLoading,
    selectSongAndPlay,
  };
}
