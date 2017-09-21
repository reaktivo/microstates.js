import { reduceObject } from 'ioo';
import * as mergeDeepRight from 'ramda/src/mergeDeepRight';

import { IClass, ISchema, ITransitionMap } from '../Interfaces';
import MicrostateObject from '../primitives/object';
import getReducerType from './getReducerType';
import getTypeDescriptors from './getTypeDescriptors';
import transition from './transition';

export default function transitionsFor(Type: ISchema): ITransitionMap {
  let reducerType = getReducerType(Type);

  let transitions = reduceObject(
    getTypeDescriptors(reducerType),
    (accumulator, descriptor, name) => {
      return {
        ...accumulator,
        [name]: name === 'initialize' ? descriptor.value : transition(descriptor.value),
      };
    },
    {
      set: transition(function set(current: any, state: any) {
        return state && state.valueOf ? state.valueOf() : state;
      }),
    }
  );

  let isComposed = reducerType === Type;
  if (isComposed || reducerType === MicrostateObject) {
    transitions = {
      ...transitions,
      merge: transition(function merge(current, state) {
        return mergeDeepRight(current, state && state.valueOf ? state.valueOf() : state);
      }),
    };
  }

  if (isComposed && !transitions.initialize) {
    transitions = {
      ...transitions,
      initialize: function initialize(current: any, ...args: any[]) {
        return new (Type as IClass)(...args);
      },
    };
  }

  return transitions;
}