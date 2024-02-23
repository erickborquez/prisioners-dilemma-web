import { GameState, GameAction, GameActionType } from "../type";
import { GameActorStrategy } from "./ActorStrategy";

// ********************************************************************************
export class GameActorStrategyAlwaysTake extends GameActorStrategy {
  protected async createAction(state: GameState): Promise<GameAction> {
    // artificial delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 800));
    
    // ignore the state and always take
    return { actorId: this.actor.id, action: GameActionType.Take };
  }
}