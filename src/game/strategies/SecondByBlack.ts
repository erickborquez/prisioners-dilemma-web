import { randomAction } from "@/util/functions";

import { GameState, GameAction, isGameStateInProgress, GameActionType } from "../type";
import { getActorActions, getOtherActorId } from "../util";
import { GameActorStrategy } from "./ActorStrategy";

// ********************************************************************************
export class GameActorStrategySecondByBlack extends GameActorStrategy {
  private probability: number = 1;

  protected async createAction(state: GameState): Promise<GameAction> {
    if(!isGameStateInProgress(state)) throw new Error(`Actor (${this.actor.id}) is not allowed to play in the current state: ${state.status}`);
    // after the 5th turn
    if(state.history.length === 6) {
      const playerId = getOtherActorId(state.spec, this.actor.id);
      const playerActions = getActorActions(playerId, state.history);

      const takeCount = playerActions.filter((action, i) => i !== 5 && action === GameActionType.Take).length;
      
      this.probability = 1 - (takeCount ** 2 - 1) / 25;

    }
    const action = randomAction(this.probability, GameActionType.Split);
    return { actorId: this.actor.id, action };
  }
}