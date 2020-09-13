import {
  AnimatingElement,
  StatefulAnimatingElement,
  AnimationCallbacks,
  AnimationGroup,
} from './types';
import { rAF, update } from '../rAF';
import { Entity } from '../forces';

const animationStateCache = new Map<string, Record<number, Entity>>();

function getCurrentMotionValues<C>(
  initialState: StatefulAnimatingElement<C>['state'],
  id: string,
  i: number
) {
  // Check if mover's motion values are stored in the cache.
  if (animationStateCache.has(id) && animationStateCache.get(id)?.[i]) {
    // Obtain cached values for velocity and position.
    const { velocity, position } = animationStateCache.get(id)?.[i] ?? {
      velocity: initialState.mover.velocity,
      position: initialState.mover.position,
    };

    return {
      ...initialState,
      mover: {
        ...initialState.mover,
        velocity,
        position,
      },
    };
  }

  return initialState;
}

function clearMotionValuesFromCache(id: string, i: number) {
  if (animationStateCache.has(id)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { [i]: _state, ...rest } = animationStateCache.get(id)!;
    console.log('Clearing cache', JSON.stringify(rest));

    animationStateCache.set(id, rest);
  }
}

/**
 * A function to take in a set of elements and begin animating them.
 * Elements that are delayed or paused are instructed to animate once
 * their delay has elapsed or pause has been set to true.
 */
export function group<C>(
  elements: AnimatingElement<C>[],
  initialState: (
    element: AnimatingElement<C>
  ) => StatefulAnimatingElement<C>['state'],
  callbacks: AnimationCallbacks<C>,
  id: string
): AnimationGroup<C> {
  const animatingElements = new Set<StatefulAnimatingElement<C>>();
  let isFrameloopActive = false;

  elements.forEach((element, i) => {
    const initMotionValues = initialState(element);
    const state = getCurrentMotionValues(initMotionValues, id, i);

    const animatingElement: StatefulAnimatingElement<C> = {
      ...element,
      state,
    };

    // If the element to animate is not in the Set...
    if (!animatingElements.has(animatingElement)) {
      // If it has a delay and is not paused, set a timer to clear delayed state.
      if (animatingElement.state.delayed && !animatingElement.state.paused) {
        setTimeout(() => {
          animatingElement.state.delayed = false;
        }, animatingElement.delay);
      }

      animatingElements.add(animatingElement);
    }
  });

  let startFn: AnimationGroup<C>['start'] = () => {};
  let pauseFn: AnimationGroup<C>['pause'] = () => {};
  let stopFn: (
    element: StatefulAnimatingElement<C>,
    i: number
  ) => void = () => {};

  // Only start the frameloop if there are elements to animate.
  if (animatingElements.size > 0) {
    const { start, stop } = rAF();

    startFn = (c = { isImperativeStart: false }) => {
      if (!isFrameloopActive) {
        isFrameloopActive = true;
        start(
          update<C>({
            animatingElements,
            ...callbacks,
            clearMotionValuesFromCache: () => clearMotionValuesFromCache(id, 0),
          })
        );
      }

      if (c.isImperativeStart) {
        for (const animatingElement of animatingElements) {
          if (animatingElement.state.paused) {
            // Handle starting paused elements on a delay if both properties are specified.
            if (animatingElement.state.delayed) {
              setTimeout(() => {
                animatingElement.state.delayed = false;
              }, animatingElement.delay);
            }

            // Mark previously paused elements as active.
            animatingElement.state.paused = false;
          }
        }
      }
    };

    pauseFn = () => {
      stop();
      isFrameloopActive = false;
    };

    stopFn = (element: StatefulAnimatingElement<C>, i: number) => {
      // If the animation was interrupted before completing, cache its motion values.
      if (!element.state.complete) {
        console.log(
          'Writing values to cache',
          JSON.stringify({
            velocity: element.state.mover.velocity,
            position: element.state.mover.position,
          })
        );

        animationStateCache.set(id, {
          [i]: {
            ...element.state.mover,
            acceleration: [0, 0],
            velocity: [
              element.config.initialVelocity - element.state.mover.velocity[0],
              0,
            ],
            position: [
              element.state.maxDistance - element.state.mover.position[0],
              0,
            ],
          },
        });
        // On completion, ensure we remove the element from the cache.
      } else if (element.state.complete && animationStateCache.has(id)) {
        clearMotionValuesFromCache(id, i);
      }

      if (animatingElements.has(element)) {
        animatingElements.delete(element);
      }

      pauseFn();
    };
  }

  return {
    start: startFn,
    pause: pauseFn,
    stop: stopFn,
    elements: Array.from(animatingElements),
  };
}
