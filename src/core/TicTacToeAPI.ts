export interface TicTacToeAPI {
  connect: void;
  disconnect: void;

  state: GameState;

  "start-game": void;

  play: number;
  forfeit: void;
}

export type GameState = {
  playerTurn: Players;
  winner: null | Players;
  winningRow: null | number[];
  draw: boolean;
  grid: BoxValue[];
};

export enum Players {
  PLAYER,
  BOT,
}

export enum BoxValue {
  EMPTY,
  PLAYER,
  BOT,
}
