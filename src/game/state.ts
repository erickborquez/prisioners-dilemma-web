import { GameAction, GameSpec, GameState, GameStatus, isGameStateEnded, isGameStateIdle, isGameStateInProgress } from "./type";

// ********************************************************************************
/** applies the action to the game state */
export const applyAction = (spec: GameSpec, state: GameState, action: GameAction): GameState => {
  // validate the action
  if(isGameStateEnded(state)) throw new Error(`The game is not in progress`);
  if(state.actorId !== action.actorId) throw new Error(`The actor ${action.actorId} is not allowed to play`);
  const history = isGameStateIdle(state) ? [/*new history*/] : state.history,
        actionIndex = isGameStateIdle(state) ? 0 : state.actionIndex;
  if(actionIndex >= spec.maxActions) throw new Error(`The game has ended`);
  
  // apply the action
  const nextHistory = [...history , action],
        nextActionIndex = actionIndex + 1;

  // check if the game has ended
  if(nextActionIndex === spec.maxActions) return {
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

    actionIndex: nextActionIndex,
    history: nextHistory,
    actorId: nextActorId
  };
}
