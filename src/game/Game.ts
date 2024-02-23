import { BehaviorSubject } from "rxjs";

import { GameAction, GameSpec, GameState, GameStateIdle, GameStatus } from "./type";
import { applyAction } from "./state";

// ********************************************************************************
export interface IGame {
  /** the spec of the game */
  spec: GameSpec;

  /** makes an action in the game */
  // NOTE: if the action is invalid (e.g. the user is not allowed to make the action),
  //       an error will be thrown
  // NOTE: no need to explicitly start the game, the first action will start the game
  makeAction(action: GameAction): void;

  /** an Observable that emits the current state of the Game */
  onState$(): BehaviorSubject<GameState>;
}

export class AbstractGame implements IGame {
  /** an Observable that emits the current state of the Game */
  protected readonly state$: BehaviorSubject<GameState>;

  // == Lifecycle =================================================================
  constructor(public readonly spec: GameSpec) {
    if(this.spec.actors.length !== 2) throw new Error('The game must have exactly two actors');
    this.state$ = new BehaviorSubject<GameState>(this.createInitialState());
  }
  
  // ------------------------------------------------------------------------------
  private createInitialState(): GameStateIdle {
    // first actor starts the game
    const actorId = this.spec.actors[0].id;
    return { status: GameStatus.Idle, spec: this.spec, actorId, points: {/*initially no points*/ }};
  }

  // == Observable ================================================================
  public onState$(): BehaviorSubject<GameState> { return this.state$; }

  // == Public API ================================================================
  public makeAction(action: GameAction) {
    this.state$.next(applyAction(this.spec, this.state$.value, action));
  }
};