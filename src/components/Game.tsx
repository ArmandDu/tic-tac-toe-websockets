import React from "react";
import { Players } from "../core/TicTacToeAPI";
import { useStore } from "../store";
import { AlertModal } from "./AlertModal";
import { Box } from "./Box";

const playerLabel = {
  [Players.BOT]: <i className={"far fa-circle"} />,
  [Players.PLAYER]: <i className={"fas fa-times"} />,
};

export function Game() {
  const game = useStore((store) => store.game);
  const isOnline = useStore((store) => store.ready);
  const actions = useStore((store) => store.actions);
  const turnIcon = game ? playerLabel[game.playerTurn] : null;

  return (
    <div className="tic-tac-toe">
      <h1>Tic Tac Toe</h1>

      <AlertModal open={!isOnline}>
        <h2>Not Connected</h2>
        <sub>Please wait</sub>
      </AlertModal>

      <AlertModal open={game !== null && game.draw}>
        <h2>It&apos;s a Tie</h2>
        <button onClick={actions.startGame}>Play Again</button>
      </AlertModal>

      <AlertModal open={game !== null && game.winner !== null}>
        {game?.winner === Players.PLAYER && <h2>You win!</h2>}
        {game?.winner === Players.BOT && <h2>You loose!</h2>}
        <button onClick={actions.startGame}>Play Again</button>
      </AlertModal>

      <div className="game">
        <div className="controls">
          <button onClick={actions.startGame}>New Game</button>
          {game ? (
            <span>turn: {turnIcon}</span>
          ) : (
            <span>
              Player ({playerLabel[Players.PLAYER]}) vs. Computer (
              {playerLabel[Players.BOT]})
            </span>
          )}
        </div>

        <div className="grid">
          {game?.grid.map((value, id) => (
            <Box key={id} value={value} onClick={() => actions.play(id)} />
          ))}
        </div>
      </div>
    </div>
  );
}
