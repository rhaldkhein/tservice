
export default interface IProvider {

  get<T>(token: string): T;

}
