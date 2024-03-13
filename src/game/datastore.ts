import { collection, doc, getDoc, setDoc } from "firebase/firestore";

import { firestore } from "@/util/firebase";

import { GameResult, GameResultIdentifier } from "./type";

// ********************************************************************************
export const GAME_RESULT_COLLECTION = 'game';
export const gameResultCollection = () => collection(firestore, GAME_RESULT_COLLECTION);

// -- Create ----------------------------------------------------------------------
// stores a new game result
export const storeGameResult = async (gameResult: GameResult) => {
  const ref = doc(gameResultCollection());

  console.log(ref);

  return setDoc(ref, gameResult);
}

// -- Read ------------------------------------------------------------------------
const gameResultDocRef = (gameResultId: GameResultIdentifier) => doc(gameResultCollection(), gameResultId);
export const getGameResult = async (gameResultId: GameResultIdentifier) => {
  const docSnap = await getDoc(gameResultDocRef(gameResultId));
  if (!docSnap.exists()) throw new Error('Game result not found');
  
  return docSnap.data() as GameResult;
}