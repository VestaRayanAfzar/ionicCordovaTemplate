export class StorageService {
    private storage: Storage = localStorage;

    public set<T>(key: string, value: T): void {
        return this.storage.setItem(key, JSON.stringify(value));
    }

    public get<T>(key: string): T {
        var value: any = this.storage.getItem(key),
            object: T;
        try {
            object = JSON.parse(value);
        } catch (e) {
            object = <T>value;
        }
        return object;
    }

    public remove(key: string): boolean {
        this.storage.removeItem(key);
        return true;
    }
}
