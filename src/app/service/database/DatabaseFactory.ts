import {IQService} from 'angular';
import {DatabaseAdaptor} from './DatabaseAdaptor';
import {PouchDBAdapter} from "./PouchDBAdapter";

export class DatabaseFactory {
    public static Type = {PouchDb: 'pouch', LocalStorage: 'local'};

    static create(type: string, databaseName: string, $q: IQService): DatabaseAdaptor {
        var db: DatabaseAdaptor;
        switch (type) {
            case DatabaseFactory.Type.PouchDb:
                db = new PouchDBAdapter(databaseName, $q);
                break;
            default:
                db = null;
        }
        return db;
    }
}