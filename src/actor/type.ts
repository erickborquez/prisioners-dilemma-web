// ********************************************************************************
// == Actor =======================================================================
export type ActorIdentifier = string/*alias*/;

/** the actor that can play the game */
export enum ActorType {
  /** the human player */
  Player = 'player',

  /** an actor that uses a strategy to play the game */
  Strategy = 'computer',
};

export type ActorBase = {
  id: ActorIdentifier;

  type: ActorType;

  name: string;
};

export type ActorPlayer = ActorBase & {
  type: ActorType.Player;
};
export const isActorPlayer = (actor: Actor): actor is ActorPlayer => actor.type === ActorType.Player;

// -- Strategy --------------------------------------------------------------------
export enum ActorStrategyType {
  AlwaysSplit = 'always-split',
  AlwaysTake = 'always-take',
  Random = 'random',
  Probability = 'Probability p Cooperator',
}

export type ActorStrategy = ActorBase & {
  type: ActorType.Strategy;

  /** the strategy of the computer */
  strategy: ActorStrategyType;
};
export const isActorStrategy = (actor: Actor): actor is ActorStrategy => actor.type === ActorType.Strategy;

export type Actor = ActorPlayer | ActorStrategy;