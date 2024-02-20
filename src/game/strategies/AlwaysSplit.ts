import { GameState, GameAction, GameActionType } from "../type";
import { GameActorStrategy } from "./ActorStrategy";

// ********************************************************************************
export class GameActorStrategyAlwaysSplit extends GameActorStrategy {
  protected async createAction(state: GameState): Promise<GameAction> {
    // artificial delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000));

    // ignore the state and always split
    return { actorId: this.actor.id, action: GameActionType.Split };
  }
}