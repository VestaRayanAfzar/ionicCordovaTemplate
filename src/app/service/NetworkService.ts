export class NetworkService {
    constructor() {
    }

    public isOnline():boolean {
        return navigator.onLine;
    }
}