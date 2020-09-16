import { Server } from "http";

import sample from "lodash/sample";
import io from "socket.io";

import {
  BoxValue,
  GameState,
  Players,
  TicTacToeAPI,
} from "../src/core/TicTacToeAPI";
import { SocketIOWrapper, wrapServerSocket } from "../src/core/tsSocketWrapper";

type Client = SocketIOWrapper<TicTacToeAPI>;

export class TicTacToeService {
  private games: Record<string, GameState> = {};
  readonly server: io.Server;

  constructor(http: Server) {
    this.server = io(http);

    this.server.on("connection", (socket) => {
      const client = wrapServerSocket<TicTacToeAPI>(socket);

      client
        .on("disconnect", () => {
          delete this.games[client.id];
        })
        .on("start-game", this.startGame.bind(this, client))
        .on("play", this.playerPlay.bind(this, client));
    });
  }

  startGame(client: Client) {
    const game = (this.games[client.id] = this.createGame());

    client.emit("state", game);
  }

  playerPlay(client: Client, boxId: number) {
    const game = this.games[client.id];

    if (
      game?.playerTurn === Players.PLAYER &&
      game?.grid[boxId] === BoxValue.EMPTY
    ) {
      game.grid[boxId] = BoxValue.PLAYER;

      if (!this.checkVictory(client, game)) {
        game.playerTurn = Players.BOT;
        client.emit("state", game);

        this.botPlay(client, game);
      }
    }
  }

  private createGame(): GameState {
    return {
      grid: Array(9).fill(BoxValue.EMPTY),
      playerTurn: Players.PLAYER,
      winner: null,
      winningRow: null,
      draw: false,
    };
  }

  private botPlay(client: Client, game: GameState) {
    const freeIndexes = game.grid
      .map((box, i) => [box, i])
      .filter(([box]) => box === BoxValue.EMPTY)
      .map(([_, i]) => i);

    const boxId = sample(freeIndexes);
    if (boxId !== undefined) {
      game.grid[boxId] = BoxValue.BOT;

      if (!this.checkVictory(client, game)) {
        game.playerTurn = Players.PLAYER;
        client.emit("state", game);
      }
    }
  }

  private checkVictory(client: Client, game: GameState) {
    const winCases = [
      // horizontally
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      //   vertically
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      //   diagonaly
      [0, 4, 8],
      [2, 4, 6],
    ];

    const winningRow = winCases.find(([a, b, c]) => {
      return (
        game.grid[a] !== BoxValue.EMPTY &&
        game.grid[a] === game.grid[b] &&
        game.grid[a] === game.grid[c]
      );
    });

    if (winningRow) {
      game.winner =
        game.grid[winningRow[0]] === BoxValue.BOT
          ? Players.BOT
          : Players.PLAYER;
      game.winningRow = winningRow;
      client.emit("state", game);

      return true;
    }

    if (game.grid.every((box) => box !== BoxValue.EMPTY)) {
      game.draw = true;
      client.emit("state", game);
      return true;
    }

    return false;
  }
}

export default TicTacToeService;
