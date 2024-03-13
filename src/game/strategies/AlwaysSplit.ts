import { GameState, GameAction, GameActionType } from "../type";
import { GameActorStrategy } from "./ActorStrategy";

// ********************************************************************************
export class GameActorStrategyAlwaysSplit extends GameActorStrategy {
  protected async createAction(state: GameState): Promise<GameAction> {
    // ignore the state and always split
    return { actorId: this.actor.id, action: GameActionType.Split };
  }
}