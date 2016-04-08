import {IQService, IPromise} from 'angular';
import {CordovaPlugin} from "./CordovaPlugin";
import {Err} from "../../cmn/Err";
/**
 * cordova-plugin-file & cordova-plugin-file-transfer & cordova-plugin-filepath
 */
var requestFileSystem = window.requestFileSystem || window['webkitRequestFileSystem'];
var resolveLocalFileSystemURL = window.resolveLocalFileSystemURI || window['webkitResolveLocalFileSystemURL'];
export enum AppLocationType {Private, Public}
export class FilePlugin extends CordovaPlugin {
    private fileSystem:FileSystem;
    //private publicEntry: DirectoryEntry;
    //private privateEntry: DirectoryEntry;
    private file:any;

    constructor(private $q:IQService) {
        super();
        if (window['cordova']) {
            this.file = cordova.file;
        } else {
            this.mock();
        }
    }

    private getFileSystem():IPromise<FileSystem> {
        var defer = this.$q.defer<FileSystem>();
        if (this.fileSystem) {
            defer.resolve(this.fileSystem);
        } else {
            requestFileSystem(window['PERSISTENT'], 0, defer.resolve, defer.reject);
        }
        return defer.promise;
    }

    public getDirectory(type:AppLocationType, relativePath?:string):IPromise<DirectoryEntry> {
        var baseDirectory:string = type == AppLocationType.Public ? this.file.externalRootDirectory : this.file.dataDirectory;
        return this.resolveUrl(baseDirectory)
            .then(result=> {
                if (relativePath) {
                    return this.mkdirp(<DirectoryEntry>result, relativePath);
                } else {
                    return <DirectoryEntry>result;
                }
            })
            ;
    }

    public resolveUrl(uri:string):IPromise<Entry> {
        var defer = this.$q.defer<Entry>();
        resolveLocalFileSystemURL(uri, entry=> {
            defer.resolve(entry)
        }, (error)=> {
            defer.reject(error)
        });
        return defer.promise;
    }

    public resolveNativePath(path:string):IPromise<string> {
        var defer = this.$q.defer<string>();
        window['FilePath'].resolveNativePath(path, defer.resolve, defer.reject);
        return defer.promise;
    }

    public mkdirp(entry:DirectoryEntry, relativePath:string):IPromise<DirectoryEntry> {
        var defer = this.$q.defer<DirectoryEntry>(),
            folders = relativePath.split(/[\/\\]/g);
        mkdir(entry, 0);
        function mkdir(entry:DirectoryEntry, index:number) {
            if (index == folders.length) {
                return defer.resolve(entry);
            }
            entry.getDirectory(folders[index], {create: true, exclusive: false}, (newEntry:DirectoryEntry)=> {
                console.log('Successfully created the `' + newEntry.nativeURL + '` directory');
                mkdir(newEntry, ++index);
            }, (err) => {
                console.error('Failed creating the `' + entry.nativeURL + '/' + folders[index] + '` directory because of: ', err);
                defer.reject(new Err(Err.Code.FileSystem, `Failed creating the '${entry.nativeURL}/${folders[index]}'`));
            });
        }

        return defer.promise;
    }

    public copy(src:string|FileEntry, dest:string|DirectoryEntry, fileName?:string):IPromise<FileEntry> {
        var defer = this.$q.defer<FileEntry>(),
        //entries = {src: null, dest: null},
        //hasError = false,
            _this = this;

        function checkType(path:string|Entry):IPromise<Entry> {
            var defer = _this.$q.defer<Entry>();
            if (typeof path === 'string') return this.resolveUrl(path);
            defer.resolve(<Entry>path);
            return defer.promise;
        }

        this.$q.all([checkType(src), checkType(dest)]).then((result:Array<Entry>) => {
            var srcEntry:Entry = result[0],
                destEntry:Entry = result[1];
            if (destEntry.isFile) throw new Err(Err.Code.FileSystem, 'Destination is not of type Directory');
            if (!fileName) {
                fileName = srcEntry.name;
            }
            srcEntry.copyTo(<DirectoryEntry>destEntry, fileName, (entry)=> {
                defer.resolve(<FileEntry>entry);
            }, defer.reject);
        }).catch(reason=> {
            defer.reject(reason);
        });
        return defer.promise;
    }

    public download(config:any) {
        var options:FileDownloadOptions = {};
        if (config.headers) {
            options.headers = config.headers;
        }
        this.resolveUrl(config.destination).then((destDirEntry)=> {
            var ft = new FileTransfer();
            if (config.progressHandler) {
                ft.onprogress = function (progressEvent) {
                    config.progressHandler(progressEvent);
                };
            }
            ft.download(encodeURI(config.endPoint + '/' + config.fileName), destDirEntry.toURL() + config.fileName, function (entry) {
                config.cb(null, entry);
            }, function (err) {
                try {
                    var realError = JSON.parse(err.body);
                    config.cb(new Error(realError.message));
                } catch (e) {
                    config.cb(new Error('Error downloading file'));
                }
            }, true, options);
        });
        throw new Err(Err.Code.Implementation);
    }

    public converToFile(fileEntry:FileEntry):IPromise<File> {
        var defer = this.$q.defer<File>();
        fileEntry.file(defer.resolve, defer.reject);
        return defer.promise;
    }

    protected mock():void {
        this.mockingMode = true;
        this.file = {
            applicationStorageDirectory: '/',
            dataDirectory: '/',
            externalRootDirectory: '/'
        };
    }
}
