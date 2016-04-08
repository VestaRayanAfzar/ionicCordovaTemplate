export abstract class CordovaPlugin {
    protected mockingMode: boolean = false;

    protected abstract mock(): void;
}