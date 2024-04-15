import { GameState, GameAction, isGameStateInProgress, GameActionType } from "../type";
import { getActorActions, getOtherActorId } from "../util";
import { GameActorStrategy } from "./ActorStrategy";

export class GameActorStrategyHufford extends GameActorStrategy {
  private numAgreements: number = 2;
  private lastFourAgreements: number[] = [1, 1, 1, 1];
  private lastFourIndex: number = 0;
  private streakNeeded: number = 21;
  private currentStreak: number = 2;
  private lastAberration: number = Infinity;
  private coopAfterAbCount: number = 2;
  private defAfterAbCount: number = 2;

  protected async createAction(state: GameState): Promise<GameAction> {
    if (!isGameStateInProgress(state)) throw new Error(`Actor (${this.actor.id}) is not allowed to play in the current state: ${state.status}`);
    const turn = state.history.length + 1;
    const playerId = getOtherActorId(state.spec, this.actor.id);
    const opponentActions = getActorActions(playerId, state.history);
    if (turn === 1) {
      return { actorId: this.actor.id, action: GameActionType.Split };
    }
    this.lastFourIndex = (this.lastFourIndex + 1) % 4;
    const meTwoMovesAgo = turn > 2 ? state.history[state.history.length - 2][1] : GameActionType.Split;
    if (meTwoMovesAgo === opponentActions[opponentActions.length - 1]) {
      this.numAgreements += 1;
      this.lastFourAgreements[this.lastFourIndex] = 1;
    } else {
      this.lastFourAgreements[this.lastFourIndex] = 0;
    }
    if (turn < this.lastAberration) {
      if (opponentActions[opponentActions.length - 1] === GameActionType.Split) {
        this.currentStreak += 1;
      } else {
        this.currentStreak = 0;
      }
      if (this.currentStreak >= this.streakNeeded) {
        this.lastAberration = turn;
        if (this.currentStreak === this.streakNeeded) {
          return { actorId: this.actor.id, action: GameActionType.Take };
        }
      }
    } else if (turn === this.lastAberration + 2) {
      this.lastAberration = Infinity;
      if (opponentActions[opponentActions.length - 1] === GameActionType.Split) {
        this.coopAfterAbCount += 1;
      } else {
        this.defAfterAbCount += 1;
      }
      this.streakNeeded = Math.floor(20.0 * this.defAfterAbCount / this.coopAfterAbCount) + 1;
      this.currentStreak = 0;
      return { actorId: this.actor.id, action: GameActionType.Split };
    }
    const proportionAgree = this.numAgreements / turn;
    const lastFourNum = this.lastFourAgreements.reduce((a, b) => a + b, 0);
    if (proportionAgree > 0.9 && lastFourNum >= 4) {
      return { actorId: this.actor.id, action: GameActionType.Split };
    } else if (proportionAgree >= 0.625 && lastFourNum >= 2) {
      return { actorId: this.actor.id, action: opponentActions[opponentActions.length - 1] };
    }
    return { actorId: this.actor.id, action: GameActionType.Take };
  }
}