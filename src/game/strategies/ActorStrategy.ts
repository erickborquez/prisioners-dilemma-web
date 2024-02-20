import { ActorStrategy } from "@/actor/type";

import { GameAction, GameState, GameStatus } from "../type";

// ********************************************************************************
export interface IGameActorStrategy {
  /** the actor following this strategy */
  actor: ActorStrategy;

  /** creates an Action from the current state for the actor following this strategy */
  requestAction(state: GameState): Promise<GameAction>;
}

export abstract class GameActorStrategy {
  // == Lifecycle =================================================================
  constructor(public readonly actor: ActorStrategy) {/*nothing else*/}

  // == Public API ================================================================
  /** creates an Action from the current state for the actor following this strategy */
  public async requestAction(state: GameState){
    // validate the state
    if(state.status !== GameStatus.InProgress) throw new Error(`Actor (${this.actor.id}) is not allowed to play in the current state: ${state.status}`);
    if(state.actorId !== this.actor.id) throw new Error(`The actor ${this.actor.id} is not allowed to play`);

    // create the action
    return this.createAction(state);
  }

  // ==============================================================================
  protected abstract createAction(state: GameState): Promise<GameAction>
}