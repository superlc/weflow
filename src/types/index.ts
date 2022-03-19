export { PlainObject } from './base';

export { DSL_Item, DSL, Handler } from './dsl';

export interface WeflowEmmiter {
    on(eventName: string, callback: (...args: any[]) => any): any;
    once(eventName: string, callback: (...args: any[]) => any): any;
    emit(eventName: string, data?: any): any;
}
