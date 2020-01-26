/* tslint:disable variable-name */

import IProvider from "./IProvider";
import IOptions from "./IOptions";

type THandlerProvider = (_provider: IProvider, _token: string) => Promise<any> | any;
type THandlerToken = (_token: string) => Promise<any> | any;

export type TServiceConstructor = new (
  p: IProvider,
  option: IOptions,
  token: string
) => any;

export default interface IServiceConstructor extends TServiceConstructor {
  __service__?: boolean;
  link?: THandlerProvider;
  mount?: THandlerProvider;
  beforeReady?: THandlerProvider;
  ready?: THandlerProvider;
  setup?: THandlerToken;
  beforeStart?: THandlerProvider;
  start?: THandlerProvider;
}
