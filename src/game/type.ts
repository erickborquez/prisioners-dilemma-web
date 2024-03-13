import { Actor, ActorIdentifier } from "@/actor/type";

// ********************************************************************************
// == Game ========================================================================
// -- Points ----------------------------------------------------------------------
/** the points that the actor receive in the game */
export type GamePoints = number/*alias*/;

/** a map of the points that the actors have in the game */
export type GamePointsMap = Record<ActorIdentifier, GamePoints>;

// -- Spec ------------------------------------------------------------------------
export type GameSpec = {
  /** the maximum number of rounds in the game before it ends */
  maxRounds: number;

  /** the actors in the game */
  // NOTE: the first actor is the one that starts the game
  // NOTE: it will always be two actors
  actors: Actor[];

  // .. Points ....................................................................
  /** the reward that the user take when it does {@link GameActionType.Split} and the
   *  other does {@link GameActionType.Split} */
  splitSplitPoints: GamePoints;

  /** the reward that the user take when it does {@link GameActionType.Split} and the
   *  other does {@link GameActionType.Take} */
  splitTakePoints: GamePoints;

  /** the reward that the user take when it does {@link GameActionType.Take} and the
   * other does {@link GameActionType.Split} */
  takeSplitPoints: GamePoints;

  /** the reward that the user take when it does {@link GameActionType.Take} and the
   *  other does {@link GameActionType.Take} */
  takeTakePoints: GamePoints;
}

// -- Action ----------------------------------------------------------------------
export enum GameActionType { 
  /** the player splits the reward */
  Split = 'split',
  
  /** the player takes the reward */
  Take = 'take',
}

// -- Turn ------------------------------------------------------------------------
export type GameAction = {
  /** the actor that made the action */
  actorId: ActorIdentifier;

  /** the action taken by the actor */
  action: GameActionType;
}

// .. History .....................................................................
export type GameStateRound = [GameAction, GameAction | null/*no action yet*/];
export const isCompleteRound = (round: GameStateRound): round is [GameAction, GameAction] => round[1] !== null;

/** an ordered list of the actions in the game in chronological order. The two actors
 *  take actions making actions. That is, the first action is made by the first actor, the
 *  second action is made by the second actor, the third action is made by the first actor,
 *  and so on. */
export type GameStateHistory = GameStateRound[];

// a stringified version of the {@link GameStateHistory}
export type GameStateHistoryResult = string/*alias*/;
export const parseGameStateHistory = (history: GameStateHistoryResult): GameStateHistory => JSON.parse(history);
export const createGameStateHistoryResult = (history: GameStateHistory): GameStateHistoryResult => JSON.stringify(history);

export const isGameEnded = (spec: GameSpec, history: GameStateHistory): boolean => history.length >= spec.maxRounds && isCompleteRound(history[history.length - 1]);

// -- State -----------------------------------------------------------------------
export enum GameStatus {
  /** the game is not yet started */
  Idle = 'idle',

  /** the game is in progress */
  InProgress = 'in-progress',

  /** the game has ended */
  Ended = 'ended',
}

export type GameStateBase = {
  /** the spec of the game */
  spec: GameSpec;

  /** the points that the actors have in the game */
  points: GamePointsMap;
};

export type GameStateIdle = GameStateBase & {
  status: GameStatus.Idle;

  /** the player that is waiting to start the game */
  actorId: ActorIdentifier;
};
export const isGameStateIdle = (state: GameState): state is GameStateIdle => state.status === GameStatus.Idle;

export type GameStateInProgress = GameStateBase & {
  status: GameStatus.InProgress;

  /** the history of the game */
  history: GameStateHistory;

  /** the player that is waiting to make a action */
  actorId: ActorIdentifier;
};
export const isGameStateInProgress = (state: GameState): state is GameStateInProgress => state.status === GameStatus.InProgress;

export type GameStateEnded = GameStateBase & {
  status: GameStatus.Ended;

  /** the history of the game */
  history: GameStateHistory;
};
export const isGameStateEnded = (state: GameState): state is GameStateEnded => state.status === GameStatus.Ended;

export type GameState = GameStateIdle | GameStateInProgress | GameStateEnded;

// == Result ======================================================================
export type GameResultIdentifier = string/*alias*/;

// stores a reference with the final result of the game
export type GameResult = {
  // CHECK: add userId? App doesn't have auth so doesn't seem necessary 

  spec: GameSpec;

  /** the points that the actors have in the game */
  points: GamePointsMap;

  // NOTE: history is stored as a string since a nested array cannot be stored in 
  //       Firestore. 
  history: GameStateHistoryResult;
};

export const createGameResult = (spec: GameSpec, state: GameStateEnded): GameResult => {

  return {
    spec,

    points: state.points,

    history: createGameStateHistoryResult(state.history),
  };
}