import { BehaviorSubject, filter } from "rxjs";

import { storeGameResult } from "./datastore";
import { applyAction } from "./state";
import { isGameStateEnded, GameAction, GameSpec, GameState, GameStateEnded, GameStateIdle, GameStatus, createGameResult, GameActionType } from "./type";

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

    const stateEnd$ = this.state$.pipe(
      filter(isGameStateEnded)
    );
    stateEnd$.subscribe(state => this.onStateEnd(state));
  }
  
  // ------------------------------------------------------------------------------
  private createInitialState(): GameStateIdle {
    // first actor starts the game
    const actorId = this.spec.actors[0].id;
    return { status: GameStatus.Idle, spec: this.spec, actorId, points: {/*initially no points*/ }};
  }

  // == Observable ================================================================
  public onState$(): BehaviorSubject<GameState> { return this.state$; }

  // == Subscription ==============================================================
  /** automatically store the game on the database once it's finished */
  private async onStateEnd(gameState: GameStateEnded) {
    // hardcoded!!
    const player = this.spec.actors[0];
    const playerPoints = gameState.points[player.id];
    const splitCount = gameState.history.filter(round => round[0].action === GameActionType.Split).length;
    const message = `El jugador ${player.name} obtuvo ${playerPoints} puntos y coopero ${splitCount} veces.`

    const gameResult = createGameResult(this.spec, gameState, message);

    try {
      await storeGameResult(gameResult);
    } catch(error) {
      console.error('Error storing game result', error);
    }
  }

  // == Public API ================================================================
  public makeAction(action: GameAction) {
    this.state$.next(applyAction(this.spec, this.state$.value, action));
  }
};