import { getGameActionPoints, isCompleteRound, isGameStateEnded, isGameStateIdle, GameAction, GamePointsMap, GameSpec, GameState, GameStateHistory, GameStateRound, GameStatus } from "./type";

// ********************************************************************************
/** applies the action to the game state */
export const applyAction = (spec: GameSpec, state: GameState, action: GameAction): GameState => {
  // validate the action
  if(isGameStateEnded(state)) throw new Error(`The game is not in progress`);
  if(state.actorId !== action.actorId) throw new Error(`The actor ${action.actorId} is not allowed to play`);
  const history = isGameStateIdle(state) ? [/*new history*/] : state.history;
  if(history.length >= spec.maxRounds) throw new Error(`The game has ended`);
  
  // apply the action to the current round or create a new round
  let nextHistory = [...history];
  if(history.length <= 0){
    const round: GameStateRound = [action, null/*no action yet*/];
    nextHistory.push(round);
  } else {
    // verify if a new rounds is needed
    const lastRound = history[history.length - 1];
    if(lastRound[1] !== null) {
      const newRound: GameStateRound = [action, null/*no action yet*/];
      nextHistory.push(newRound);
    } else {
      const existingRound: GameStateRound = [lastRound[0], action];
      nextHistory[history.length - 1] = existingRound;
    }
  }

  // calculate the points
  const points = getTotalPoints(spec, nextHistory);

  // check if the game has ended
  if(nextHistory.length >= spec.maxRounds){
    return {
      spec,

      status: GameStatus.Ended,

      points,
      history: nextHistory
    }
  };
  
  const nextActorId = state.actorId === spec.actors[0].id ?
      spec.actors[1].id
    : spec.actors[0].id;

  return {
    spec,

    status: GameStatus.InProgress,
    
    actorId: nextActorId,

    points,
    history: nextHistory,
  };
}

const getTotalPoints = (spec: GameSpec, history: GameStateHistory): GamePointsMap => {
  const points: GamePointsMap = {};
  history.forEach(round => {
    if(!isCompleteRound(round)) return/*nothing to do*/;
    const [a, b] = round;
    const aPoints = getGameActionPoints(spec, a.action, b.action),
          bPoints = getGameActionPoints(spec, b.action, a.action);

    points[a.actorId] = (points[a.actorId] || 0) + aPoints;
    points[b.actorId] = (points[b.actorId] || 0) + bPoints;
  });

  return points;
}