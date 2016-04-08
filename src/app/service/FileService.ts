import {IPromise, IQService} from 'angular';
import {FilePlugin} from "./plugin/FilePlugin";
import {Err} from "../cmn/Err";

export class FileService {
    private filePlugin:FilePlugin;
    static $inject = ['$q'];

    constructor(private $q:IQService) {
        this.filePlugin = new FilePlugin($q);
    }

    public getDirectory():IPromise<DirectoryEntry> {
        return new this.$q<DirectoryEntry>((resolve, reject)=> {
            reject('Not implemented');
        });
    }

    public resolveUrl(uri:string):IPromise<Entry> {
        return new this.$q<Entry>((resolve, reject)=> {
            reject('Not implemented');
        });
    }

    public resolveNativePath(path:string):IPromise<string> {
        return new this.$q<string>((resolve, reject)=> {
            reject('Not implemented');
        });
    }

    public mkdirp(entry:DirectoryEntry, relativePath:string):IPromise<DirectoryEntry> {
        return new this.$q<DirectoryEntry>((resolve, reject)=> {
            reject('Not implemented');
        });
    }

    public copy(src:string|FileEntry, dest:string|DirectoryEntry, fileName?:string):IPromise<FileEntry> {
        return new this.$q<FileEntry>((resolve, reject)=> {
            reject('Not implemented');
        });
    }

    public download(config:any):IPromise<FileEntry> {
        return new this.$q<FileEntry>((resolve, reject)=> {
            reject('Not implemented');
        });
    }

    public converToFile(fileEntry:FileEntry):IPromise<File> {
        return new this.$q<File>((resolve, reject)=> {
            fileEntry.file(resolve, reject);
        });
    }
}