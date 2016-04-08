import {IPromise, IQService} from 'angular';
import {DatabaseAdaptor} from "./DatabaseAdaptor";

export class PouchDBAdapter extends DatabaseAdaptor {
    private db: any;

    constructor(name: string, private $q: IQService) {
        super();
        this.db = new window['PouchDB'](name);
    }

    public get<T>(key: string): IPromise<T> {
        //var defer = this.$q.defer<T>();
        return this.db.get(key);
        //return defer.promise;
    }

    public set<T>(key: string, value: T): IPromise<boolean> {
        value['_id'] = key;
        return this.db.put(value);
    }

    public remove(key: string): IPromise<boolean> {
        return null;
    }
}