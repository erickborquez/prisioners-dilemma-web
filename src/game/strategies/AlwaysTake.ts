import { GameState, GameAction, GameActionType } from "../type";
import { GameActorStrategy } from "./ActorStrategy";

// ********************************************************************************
export class GameActorStrategyAlwaysTake extends GameActorStrategy {
  protected async createAction(state: GameState): Promise<GameAction> {
    // ignore the state and always take
    return { actorId: this.actor.id, action: GameActionType.Take };
  }
}