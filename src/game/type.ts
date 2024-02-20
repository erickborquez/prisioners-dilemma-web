import { Actor, ActorIdentifier } from "@/actor/type";

// ********************************************************************************
// == Game ========================================================================
// -- Spec ------------------------------------------------------------------------
export type GameSpec = {
  /** the maximum number of actions in the game before it ends */
  maxActions: number;

  /** the actors in the game */
  // NOTE: the first actor is the one that starts the game
  // NOTE: it will always be two actors
  actors: Actor[];
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
/** an ordered list of the actions in the game in chronological order. The two actors
 *  take actions making actions. That is, the first action is made by the first actor, the
 *  second action is made by the second actor, the third action is made by the first actor,
 *  and so on. */
export type GameStateHistory = GameAction[];

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
};

export type GameStateIdle = GameStateBase & {
  status: GameStatus.Idle;

  /** the player that is waiting to start the game */
  actorId: ActorIdentifier;
};
export const isGameStateIdle = (state: GameState): state is GameStateIdle => state.status === GameStatus.Idle;

export type GameStateInProgress = GameStateBase & {
  status: GameStatus.InProgress;

  /** the current action number */
  action: number;

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