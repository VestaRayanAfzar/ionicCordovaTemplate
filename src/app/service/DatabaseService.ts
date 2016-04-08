import {IQService} from 'angular';
import {DatabaseFactory} from './database/DatabaseFactory';
import {DatabaseAdaptor} from './database/DatabaseAdaptor';
import IPromise = angular.IPromise;


export class DatabaseService {
    private storage: DatabaseAdaptor;
    public static $inject = ['$q'];

    constructor($q: IQService) {
        var type = DatabaseFactory.Type.LocalStorage;
        if (window['PouchDB']) {
            type = DatabaseFactory.Type.PouchDb;
        }
        this.storage = DatabaseFactory.create(type, 'chetoreDB', $q);
    }

    public set<T>(key: string, value: T): IPromise<boolean> {
        return this.storage.set(key, JSON.stringify(value));
    }

    public get<T>(key: string): IPromise<T> {
        return this.storage.get(key);
    }

    public remove(key: string): IPromise<boolean> {
        return this.storage.remove(key);
    }
}
