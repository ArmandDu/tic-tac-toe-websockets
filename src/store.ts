import io from "socket.io-client";
import create from "zustand";
import { combine } from "zustand/middleware";

import { GameState, Players, TicTacToeAPI } from "./core/TicTacToeAPI";
import { wrapClientSocket } from "./core/tsSocketWrapper";

const ioClient = wrapClientSocket<TicTacToeAPI>(io);

type Store = {
  ready: boolean;
  game: null | GameState;
  scores: [number, Number];
};

export const useStore = create(
  combine(
    {
      ready: false,
      game: null,
    } as Store,
    (set, get) => {
      const socket = ioClient();

      socket
        .on("connect", () => {
          set({ ready: true });
        })
        .on("disconnect", () => {
          set({ ready: false });
        })
        .on("state", (gameState) => {
          set({ game: gameState });
        });

      return {
        actions: {
          startGame() {
            socket.emit("start-game", undefined);
          },
          play(boxId: number) {
            const isPlayerTurn = get().game?.playerTurn === Players.PLAYER;

            if (isPlayerTurn) {
              socket.emit("play", boxId);
            }
          },
        },
      };
    }
  )
);
