import { GameAction, GameSpec, GameState, GameStatus, isGameStateIdle, isGameStateInProgress } from "./type";

// ********************************************************************************
/** applies the action to the game state */
export const applyAction = (spec: GameSpec, state: GameState, action: GameAction): GameState => {
  // validate the action
  if(!isGameStateInProgress(state) || isGameStateIdle(state)) throw new Error(`The game is not in progress`);
  if(state.actorId !== action.actorId) throw new Error(`The actor ${action.actorId} is not allowed to play`);
  if(state.history.length >= spec.maxActions) throw new Error(`The game has ended`);
  
  // apply the action
  const nextHistory = [...state.history, action];
  const nextAction = state.action + 1;

  // check if the game has ended
  if(nextAction >= spec.maxActions) return {
    spec,

    status: GameStatus.Ended,

    history: nextHistory
  };
  
  const nextActorId = state.actorId === spec.actors[0].id ?
      spec.actors[1].id
    : spec.actors[0].id;

  return {
    spec,

    status: GameStatus.InProgress,

    action: nextAction,
    history: nextHistory,
    actorId: nextActorId
  };
}
