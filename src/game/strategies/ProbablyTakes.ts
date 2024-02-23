import { randomChoice } from "@/util/functions";

import { GameState, GameAction } from "../type";
import { GameActorStrategy } from "./ActorStrategy";

// ********************************************************************************
export class GameActorStrategyProbablyTake extends GameActorStrategy {
  protected async createAction(state: GameState): Promise<GameAction> {
    // artificial delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 800));

    // ignore the state and takes with 'p' probability
    const probability: number = 0.7;
    return { actorId: this.actor.id, action: randomChoice(probability)};
  }
}