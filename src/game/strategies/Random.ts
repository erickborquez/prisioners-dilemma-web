import { randomChoice } from "@/util/functions";

import { GameState, GameAction } from "../type";
import { GameActorStrategy } from "./ActorStrategy";

// ********************************************************************************
export class GameActorStrategyRandom extends GameActorStrategy {
  protected async createAction(state: GameState): Promise<GameAction> {
    // ignore the state and takes a random choice
    return { actorId: this.actor.id, action: randomChoice(0.5)};
  }
}