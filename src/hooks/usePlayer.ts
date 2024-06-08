/* eslint-disable no-debugger */
/* eslint-disable react-hooks/exhaustive-deps */
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
  IskeyboardSetupAtom,
} from "../store/index";
import { checkType, clamp, fadeIn, fadeOut } from "../helper/utils";
import useSongs from "./useSongs";
import { Song } from "../types/Song";
import { useEffect } from "react";
import usePlaylist from "./usePlaylist";
import { Loop } from "../store/player";
import $ from "jquery";
import { gsap } from "gsap";
export default function usePlayer() {
  //TODO: refactor code
  //TODO: make the function as selectors
  //TODO: add fade to play and pause

  const { songsFromSelectedPlaylist } = usePlaylist();
  const [, setIsPlayerInit] = useRecoilState(IsPlayerInitAtom);

  const [isPlayerReady, setIsPlayerReady] = useRecoilState(IsPlayerReadyAtom);
  const [isKeyboardSetup, setIsKeyboardSetup] =
    useRecoilState(IskeyboardSetupAtom);

  const [playerElem, setPlayerElem] = useRecoilState(PlayerElementAtom);

  const [isPlaying, setIsPlaying] = useRecoilState(IsPlayingAtom);
  const [currentTime, setCurrentTime] = useRecoilState(CurrentTimeAtom);
  const [duration, setDuration] = useRecoilState(DurationAtom);
  const [loop, setloop] = useRecoilState(LoopAtom);
  const [, setIsSeek] = useRecoilState(IsSeekingAtom);
  const [volume, setVolume] = useRecoilState(VolumeAtom);
  const [isMute, setIsMute] = useRecoilState(IsMuteAtom);
  const [isLoading, setIsLoading] = useRecoilState(IsLoadingAtom);

  const [buffer, setBuffer] = useRecoilState(BufferAtom);
  //TODO: move this to here
  const [selected, setSelected] = useRecoilState(SelectedAtom);

  const { getSongById } = useSongs();

  const internal_checkPlayerStatus = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        const playerElement = snapshot.getLoadable(PlayerElementAtom).contents;
        const playerReady = snapshot.getLoadable(IsPlayerReadyAtom).contents;
        const playerInit = snapshot.getLoadable(IsPlayerInitAtom).contents;
        if (playerInit === false) {
          throw Error("player is not initialized");
        }
        if (playerReady === false) {
          throw Error("player is not ready");
        }
        if (playerElement === null) {
          throw Error("player element is null");
        }
      },
    []
  );

  const internal_onTimeUpdate = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        //TODO: save music with current time to local storage

        const seek = snapshot.getLoadable(IsSeekingAtom).contents as boolean;
        const PlayerElement = snapshot.getLoadable(PlayerElementAtom).contents;

        if (seek) return;
        setCurrentTime(PlayerElement.currentTime as number);

        internal_setBuffer();
      },
    []
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

        setBuffer(bufferAmount);
      },
    []
  );
  const internal_setCurrentTime = useRecoilCallback(
    ({ snapshot }) =>
      (currentTime: number) => {
        const player = snapshot.getLoadable(PlayerElementAtom)
          .contents as HTMLAudioElement;
        setCurrentTime(currentTime);
        player.currentTime = currentTime;
      },
    []
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
            setSelected(song);
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
    []
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
    []
  );

  const internal_play = useRecoilCallback(
    ({ snapshot }) =>
      (songId: number) => {
        internal_checkPlayerStatus();
        const playerElement = snapshot.getLoadable(PlayerElementAtom).contents;
        internal_load(getSongById(songId).Link);
        playerElement.play();
      },
    []
  );
  const internal_load = useRecoilCallback(
    ({ snapshot }) =>
      (src: string) => {
        internal_checkPlayerStatus();

        const playerElement = snapshot.getLoadable(PlayerElementAtom).contents;
        playerElement!.src = src;
        playerElement!.load();
      },
    []
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
    []
  );
  const playerInit = (playerElem: HTMLAudioElement) => {
    //TODO: load music from local storage if there is
    checkType(playerElem, "htmlaudioelement");
    setPlayerElem(playerElem);
    setIsPlayerInit(true);
  };
  const selectSongAndPlay = useRecoilCallback(
    ({ snapshot }) =>
      (songId: number) => {
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
        internal_reset();

        setSelected(song);
        internal_load(song.Link);
        play();
      },
    []
  );
  const play = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        internal_checkPlayerStatus();

        const playerElement = snapshot.getLoadable(PlayerElementAtom)
          .contents as HTMLAudioElement;

        if (playerElement.src !== "") playerElement.play();
      },
    []
  );

  const pause = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        internal_checkPlayerStatus();
        const playerElement = snapshot.getLoadable(PlayerElementAtom)
          .contents as HTMLAudioElement;
        setIsPlaying(false);
        volumeFadeOut().then(() => playerElement.pause());

        // $(playerElement).animate(
        //   { volume: 0 },
        //   {
        //     duration: 500,
        //     easing: "linear",
        //     done: () => {
        //       playerElement.pause();
        //     },
        //   }
        // );

        // fadeOut.then(() => {
        //   console.log("finished");
        //   playerElement.pause();
        // });
      },
    []
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
          setSelected(song);
        } else {
          song = songsFromSelectedPlaylist[selectedIndex + 1];

          setSelected(song);
        }
        internal_play(song.Id);
      },
    []
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
          setSelected(song);
        } else {
          song = songsFromSelectedPlaylist[selectedIndex - 1];

          setSelected(song);
        }
        internal_play(song.Id);
      },
    []
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
    []
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
  const volumeFadeIn = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        const player = snapshot.getLoadable(PlayerElementAtom)
          .contents as HTMLAudioElement;
        const v = snapshot.getLoadable(VolumeAtom).contents as number;
        // let volume = 0;
        player.volume = 0;
        fadeIn(player, v);
        // $(player).animate({ volume: v }, { duration: 1000, easing: "linear" });
        // adjustVolume(player, v);
        // const interval = setInterval(() => {
        //   volume += speed;
        //   if (volume >= v) {
        //     clearInterval(interval);
        //     return;
        //   }
        //   player.volume = volume;
        // }, 50);
      },
    []
  );
  const volumeFadeOut = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        return new Promise((resolve) => {
          const player = snapshot.getLoadable(PlayerElementAtom)
            .contents as HTMLAudioElement;

          fadeOut(player, () => {
            resolve("ok");
          });
        });
      },
    []
  );

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
    if (isPlayerReady !== true && playerElem !== null) {
      playerElem.onloadstart = () => {
        //TODO: save music to local storage

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
        volumeFadeIn();
        setIsPlaying(true);
      };
      playerElem.onpause = () => {
        setIsPlaying(false);
      };
      setIsPlayerReady(true);
    }
  }, [isPlayerReady, playerElem, volume]);
  const internal_togglePlayPause = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        const playing = snapshot.getLoadable(IsPlayingAtom).contents as boolean;
        if (playing) {
          pause();
        } else {
          play();
        }
      },
    []
  );
  const internal_changeVolume = useRecoilCallback(
    ({ snapshot }) =>
      (byAmount: number) => {
        const v = snapshot.getLoadable(VolumeAtom).contents as number;
        changeVolume(v + byAmount);
      },
    []
  );
  const internal_skip = useRecoilCallback(
    ({ snapshot }) =>
      (byAmount: number) => {
        const player = snapshot.getLoadable(PlayerElementAtom)
          .contents as HTMLAudioElement;
        const current = snapshot.getLoadable(CurrentTimeAtom)
          .contents as number;
        const duration = snapshot.getLoadable(DurationAtom).contents as number;
        const total = current + byAmount;
        if (total >= duration) {
          nextSong();
        } else if (total <= 0) {
          preSong();
        } else {
          setIsSeek(true);
          setCurrentTime(total);
          player.currentTime = total;
          setIsSeek(false);
        }
      },
    []
  );
  const setupKeyboard = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        const isK = snapshot.getLoadable(IskeyboardSetupAtom)
          .contents as boolean;
        if (!isK) {
          document.addEventListener("keydown", (e) => {
            switch (e.code) {
              case "Space":
                internal_togglePlayPause();
                break;
              case "KeyN":
                nextSong();
                break;
              case "KeyP":
                preSong();
                break;
              case "KeyL":
                changeLoop();
                break;
              case "KeyM":
                changeIsMute();
                break;
              case "ArrowUp":
                internal_changeVolume(0.1);
                break;
              case "ArrowDown":
                internal_changeVolume(-0.1);
                break;
              case "ArrowRight":
                internal_skip(5);
                break;
              case "ArrowLeft":
                internal_skip(-5);
                break;
            }
          });
          setIsKeyboardSetup(true);
        }
      },

    []
  );
  useEffect(() => {
    setupKeyboard();
  }, []);

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
    selected,
  };
}
