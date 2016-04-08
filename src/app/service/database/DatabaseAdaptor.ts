import {IPromise} from 'angular';

export abstract class DatabaseAdaptor {

    public abstract get<T>(key: string): IPromise<T> ;

    public abstract set<T>(key: string, value: T): IPromise<boolean>;

    public abstract remove(key: string): IPromise<boolean>;
}