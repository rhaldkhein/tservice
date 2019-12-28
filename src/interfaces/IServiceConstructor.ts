import IProvider from "./IProvider";
import IOption from "./IOption";

type THandlerProvider = (_provider: IProvider, _token: string) => Promise<any> | any;
type THandlerToken = (_token: string) => Promise<any> | any;

export type TServiceConstructor = new (
  p: IProvider,
  option: IOption,
  token: string
) => any;

export default interface IServiceConstructor extends TServiceConstructor {
  __service__?: boolean;
  link?: THandlerProvider;
  mount?: THandlerProvider;
  ready?: THandlerProvider;
  setup?: THandlerToken;
  start?: THandlerProvider;
}
