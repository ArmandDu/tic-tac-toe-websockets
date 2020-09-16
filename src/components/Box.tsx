import React from "react";

import { BoxValue } from "../core/TicTacToeAPI";

interface Props {
  value: BoxValue;
  onClick?: () => void;
}

const boxLabel = {
  [BoxValue.EMPTY]: { background: "", icon: "" },
  [BoxValue.PLAYER]: { background: "player-1", icon: "fas fa-times" },
  [BoxValue.BOT]: { background: "player-2", icon: "far fa-circle" },
};

export function Box(props: Props) {
  const { value, onClick } = props;
  const { background, icon } = boxLabel[value];

  return (
    <div
      className={`box`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        (e.key === " " || e.key === "Enter") && onClick && onClick();
      }}
    >
      <div className={`box-content ${background}`}>
        {icon && <i className={icon} />}
      </div>
      <div className="box-preview"></div>
    </div>
  );
}
