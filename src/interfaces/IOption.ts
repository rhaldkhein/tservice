

export default interface IOption<T> {

  set<T>(option: T): void;
  get(): T;

}
