import { randomAction } from "@/util/functions";

import { GameState, GameAction } from "../type";
import { GameActorStrategy } from "./ActorStrategy";

// ********************************************************************************
export class GameActorStrategyProbablyTake extends GameActorStrategy {
  protected async createAction(state: GameState): Promise<GameAction> {
    // ignore the state and takes with 'p' probability
    const probability: number = 0.7;
    return { actorId: this.actor.id, action: randomAction(probability)};
  }
}