import ICollection from './ICollection';
import IProvider from './IProvider';

export default interface IContainer {

  build(builder: (collection: ICollection) => void): IContainer;

  start(): Promise<IProvider>;

}
