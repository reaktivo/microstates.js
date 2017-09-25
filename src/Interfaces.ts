import MicrostateArray from './primitives/array';
import MicrostateBoolean from './primitives/boolean';
import MicrostateNumber from './primitives/number';
import MicrostateObject from './primitives/object';
import MicrostateString from './primitives/string';

export type IState = any | Array<any> | IStateObject;

export type ITransitions = ITransition | ITransitionMap;

export type IPath = Array<string | number>;

export interface IMicrostate {
  state: IStateObject;
  transitions: ITransitions;
}

export interface ITransitionMap {
  initialize?: (...args: any[]) => any;
  [name: string]: ITransitions;
}

export type ISchema = { new (): any; name: String };

export interface IStateObject {
  [name: string]: IState;
}

export type ITransition = (current: any, ...args: Array<any>) => any;

export interface IDescriptor {
  configurable?: boolean;
  enumerable?: boolean;
  value?: any;
  writable?: boolean;
  get?: () => any;
  set?: (value: any) => any;
}

export type IMicrostateType =
  | MicrostateString
  | MicrostateNumber
  | MicrostateObject
  | MicrostateArray
  | MicrostateBoolean;

export interface ITypeTree {
  name: string;
  path: IPath;
  isPrimitive: boolean;
  isComposed: boolean;
  isList: boolean;
  properties?: ITypeTreeProperties | null;
  transitions: ITransitionMap;
  schemaType: ISchema;
  type: IMicrostateType;
}

export interface ITypeTreeProperties {
  [name: string]: ITypeTree;
}
