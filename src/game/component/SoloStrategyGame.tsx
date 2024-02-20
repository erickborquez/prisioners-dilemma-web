import { Button } from "@chakra-ui/react";
import { useState } from "react"

import { ActorPlayer, ActorStrategy, ActorStrategyType, ActorType } from "@/actor/type"
import { useObservable } from "@/util/hook/useObservable";

import { ISoloStrategyGame, SoloStrategyGame } from "../SoloStrategyGame"
import { GameActionType, GameSpec, GameStateEnded, GameStateIdle, GameStateInProgress } from "../type"

// ********************************************************************************
// TODO: use non-hardcoded data
const actorPlayer: ActorPlayer = {
  id: 'player',
  type: ActorType.Player,

  name: 'Player',
};

const actorStrategy: ActorStrategy = {
  id: 'strategy',
  type: ActorType.Strategy,

  name: 'Strategy',
  strategy: ActorStrategyType.AlwaysTake,
};

const gameSpec: GameSpec = {
  actors: [actorPlayer, actorStrategy],

  maxActions: 10
}

// ********************************************************************************
export const SoloStrategyGameComponent: React.FC = () => {
  const [game] = useState(new SoloStrategyGame(gameSpec));
  const [state] = useObservable('SoloStrategyGameComponent', () => game.onState$(), [game]);

  if(!state) return <div>Loading...</div>;
  let component: React.ReactNode;
  switch(state.status) {
    case 'idle':
    case 'in-progress': component = <SoloStrategyGameIdleInProgressComponent game={game} state={state} />; break;
    case 'ended': component = <SoloStrategyGameEndComponent game={game} state={state} />; break;
  }
  return (
    <div>
      <h1>Solo Strategy Game</h1>
      {component}
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}

// == Status ======================================================================
// -- Idle / In Progress ----------------------------------------------------------
interface SoloStrategyGameStatusProps {
  game: ISoloStrategyGame;

  state: GameStateIdle | GameStateInProgress;
}
const SoloStrategyGameIdleInProgressComponent: React.FC<SoloStrategyGameStatusProps> = ({ game, state }) => {
  const isPlayerTurn = state.actorId === actorPlayer.id;

  const handleSplit = () => game.makeAction({ actorId: actorPlayer.id, action: GameActionType.Split });
  const handleTake = () => game.makeAction({ actorId: actorPlayer.id, action: GameActionType.Take });

  return (
    <div>
      <h2>Game in Progress</h2>
      {isPlayerTurn && (
        <div>
          <Button onClick={handleSplit}>Split</Button>
          <Button onClick={handleTake}>Take</Button>
        </div>
      )}
    </div>
  );
}

// -- Ended -----------------------------------------------------------------------
interface SoloStrategyGameEndProps {
  game: ISoloStrategyGame;

  state: GameStateEnded;
}

const SoloStrategyGameEndComponent: React.FC<SoloStrategyGameEndProps> = ({ game, state }) => {
  return (
    <div>
      <h2>Game Over</h2>
    </div>
  );
}