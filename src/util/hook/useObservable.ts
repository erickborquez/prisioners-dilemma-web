import { useEffect, useState, DependencyList } from 'react';
import { Observable } from 'rxjs';

import { useIsMounted } from './useIsMounted';
import { AsyncStatus, useAsyncStatus } from './useAsyncStatus';

// ********************************************************************************
/** subscribes to the given Observable and return the events emitted alongside the
 *  status of the subscription */
// NOTE: when the dependencies change, the subscription is cancelled and a new one
//       is created
export const useObservable = <T, I extends T | undefined>(label: string, getObservable: () => Observable<T> | null, deps?: DependencyList, initialValue: I | undefined = undefined): I extends undefined ? [T | undefined, AsyncStatus, Error | undefined]: [T, AsyncStatus, Error | undefined] => {
  const isMounted = useIsMounted();

  // == State =====================================================================
  const [event, setEvent] = useState<T | undefined>(initialValue);
  const [status, setStatus] = useAsyncStatus();
  const [error, setError] = useState<Error | undefined/*no error yet*/>(undefined);

  // == Effect ====================================================================
  useEffect(() => {
    const observable = getObservable();
    if(!observable) return/*nothing to do*/;

    setStatus('loading');
    const subscription = observable.subscribe({
      next: (event) => {
        if(!isMounted()) return/*component is unmounted, prevent unwanted state updates*/;

        setEvent(event);
        setStatus('complete');
      },
      error: (error) => {
        console.error(`Unexpected error on subscription (${label}). Error: `, error);

        if(!isMounted()) return/*component is unmounted, prevent unwanted state updates*/;

        setError(error);
        setStatus('error');
      },
    });

    return () => subscription.unsubscribe();

    // NOTE: the dependencies are managed by the caller
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return [event, status, error] as I extends undefined ? [T | undefined, AsyncStatus, Error | undefined]: [T, AsyncStatus, Error | undefined];
};
