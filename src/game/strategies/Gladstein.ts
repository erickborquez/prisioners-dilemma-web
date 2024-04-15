import { GameState, GameAction, isGameStateInProgress, GameActionType } from "../type";
import { getActorActions, getOtherActorId } from "../util";
import { GameActorStrategy } from "./ActorStrategy";

// ********************************************************************************
/** The first turn it splits, then it replicates the previous Users action */
export class GameActorStrategyGladstein extends GameActorStrategy {
  private state: 'take' | 'split' | 'tit-for-tat' = 'take';

  protected async createAction(state: GameState): Promise<GameAction> {
    if(!isGameStateInProgress(state)) throw new Error(`Actor (${this.actor.id}) is not allowed to play in the current state: ${state.status}`);
    // on first round always take
console.log(this.state);
    if(state.history.length < 2) {
      return { actorId: this.actor.id, action: GameActionType.Take };
    }/* else -- not on first step */

    const playerId = getOtherActorId(state.spec, this.actor.id);
    const playerActions = getActorActions(playerId, state.history);
    // tit for tat
    if(this.state === 'tit-for-tat') {
      const lastAction = playerActions[playerActions.length - 2/*ignore last action*/];  

      return { actorId: this.actor.id, action: lastAction };
    }
    
    // if the player has ever taken, split and then switch for tit-for-tat
    const hasTaken = playerActions.some(action => action === GameActionType.Take);
    if(hasTaken) {
      this.state = 'tit-for-tat';
      return { actorId: this.actor.id, action: GameActionType.Split };
    }

    // alternate 
    if(this.state === 'take') {
      // switch next state 
      this.state = 'split';
      return { actorId: this.actor.id, action: GameActionType.Take };
    } else { 
      // switch next state
      this.state = 'take';
      return { actorId: this.actor.id, action: GameActionType.Split };
    }

  }
}