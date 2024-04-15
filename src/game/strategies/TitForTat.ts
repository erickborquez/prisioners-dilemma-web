import { GameState, GameAction, isGameStateInProgress, GameActionType } from "../type";
import { getActorActions, getOtherActorId } from "../util";
import { GameActorStrategy } from "./ActorStrategy";

// ********************************************************************************
/** The first turn it splits, then it replicates the previous Users action */
export class GameActorStrategyTitForTat extends GameActorStrategy {
  protected async createAction(state: GameState): Promise<GameAction> {
    if(!isGameStateInProgress(state)) throw new Error(`Actor (${this.actor.id}) is not allowed to play in the current state: ${state.status}`);
    if(state.history.length < 2) return { actorId: this.actor.id, action: GameActionType.Split };    
    
    const playerId = getOtherActorId(state.spec, this.actor.id);
    const playerActions = getActorActions(playerId, state.history);

    const lastAction = playerActions[playerActions.length - 2/*ignore last action*/];

    return { actorId: this.actor.id, action: lastAction };
  }
}