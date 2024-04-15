import { GameState, GameAction, isGameStateInProgress, GameActionType } from "../type";
import { getActorActions, getOtherActorId } from "../util";
import { GameActorStrategy } from "./ActorStrategy";

// ********************************************************************************
/** The first turn it splits, then it replicates the previous Users action */
export class GameActorStrategyGrofman extends GameActorStrategy {
  private state: 'take' | 'split' | 'tit-for-tat' = 'take';

  protected async createAction(state: GameState): Promise<GameAction> {
    if(!isGameStateInProgress(state)) throw new Error(`Actor (${this.actor.id}) is not allowed to play in the current state: ${state.status}`);
    // cooperate on the first 2 rounds
    if(state.history.length < 3) {
      return { actorId: this.actor.id, action: GameActionType.Split };
    }/* else -- not on first step */

    const playerId = getOtherActorId(state.spec, this.actor.id);
    const playerActions = getActorActions(playerId, state.history);
    
    // tit for tat
    if(state.history.length < 8){ 
      const lastAction = playerActions[playerActions.length - 2/*ignore last action*/];  
      console.log('tit for tat last action', lastAction);
      return { actorId: this.actor.id, action: lastAction };
    }

    // Implementing the Python strategy in TypeScript
    const opponentActions = getActorActions(playerId, state.history);
    const opponentDefectionsLast8Rounds = opponentActions.slice(-8, -1).filter(action => action === GameActionType.Take).length;
    if (this.state === 'split' && opponentDefectionsLast8Rounds <= 2) {
      return { actorId: this.actor.id, action: GameActionType.Split };
    } else if (this.state === 'take' && opponentDefectionsLast8Rounds <= 1) {
      return { actorId: this.actor.id, action: GameActionType.Split };
    }
    return { actorId: this.actor.id, action: GameActionType.Take };
  }
}