import {IUser} from "../cmn/models/User";

export class AuthService {
    private tokenKeyName: string = 'auth-token';
    private userKeyName: string = 'userData';
    private storage: Storage = localStorage;
    static $inject = [];

    constructor() {
    }

    public login(user: IUser): void {
            this.storage.setItem(this.userKeyName, JSON.stringify(user));
        }

    public isLoggedIn(): IUser {
        var user = null;
        try {
            user = JSON.parse(this.storage.getItem(this.userKeyName));
        } catch (e) {
            this.logout();
        }
        return user;
    }

    public setToken(token: string): void {
        this.storage.setItem(this.tokenKeyName, token);
    }

    public getToken(): string {
        return <string>this.storage.getItem(this.tokenKeyName);
    }

    public logout(): void {
        this.storage.removeItem(this.userKeyName);
    }
}
