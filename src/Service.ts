
export default abstract class Service {

  static __service__: '__service__';

  // Trigger when container is mounted to new parent
  static mount(): Promise<any> | any { }

  // Trigger when container is completely ready
  static ready(): Promise<any> | any { }

  // Trigger when the service it added to container
  static setup(): Promise<any> | any { }

  // Trigger when container is starting
  static start(): Promise<any> | any { }

}
