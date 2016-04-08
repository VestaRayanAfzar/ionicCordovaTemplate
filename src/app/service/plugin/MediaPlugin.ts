import {FilePlugin} from "./FilePlugin";
import {IQService, IPromise} from "angular";
import {CordovaPlugin} from "./CordovaPlugin";
import {Err} from "../../cmn/Err";
/**
 * cordova-plugin-camera, (cordova-plugin-media/cordova-plugin-media-with-compression-fork), cordova-plugin-media-capture
 */
export enum DestinationType{
    DATA_URL = 0, // Return base64 encoded string
    FILE_URI = 1, // Return file uri (content://media/external/images/media/2 for Android)
    NATIVE_URI = 2 // Return native uri (eg. asset-library://... for iOS)
}
export enum EncodingType{
    JPEG = 0, // Return JPEG encoded image
    PNG = 1 // Return PNG encoded image
}
export enum MediaType{
    PICTURE = 0, // allow selection of still pictures only. DEFAULT. Will return format specified via DestinationType
    VIDEO = 1, // allow selection of video only, ONLY RETURNS URL
    ALLMEDIA = 2, // allow selection from all media types
    AUDIO = 61
}
export enum PictureSourceType{
    PHOTOLIBRARY = 0, // Choose image from picture library (same as SAVEDPHOTOALBUM for Android)
    CAMERA = 1, // Take picture from camera
    SAVEDPHOTOALBUM = 2 // Choose image from picture library (same as PHOTOLIBRARY for Android)
}
export enum Direction{BACK = 0, FRONT = 1}
export enum MediaError{MEDIA_ERR_ABORTED = 1, MEDIA_ERR_NETWORK = 2, MEDIA_ERR_DECODE = 3, MEDIA_ERR_NONE_SUPPORTED = 4}
export enum MediaStatus{MEDIA_NONE = 0, MEDIA_STARTING = 1, MEDIA_RUNNING = 2, MEDIA_PAUSED = 3, MEDIA_STOPPED = 4}
// matches iOS UIPopoverArrowDirection constants to specify arrow location on popover
export enum PopoverArrowDirection{ARROW_UP = 1, ARROW_DOWN = 2, ARROW_LEFT = 4, ARROW_RIGHT = 8, ARROW_ANY = 15}
export class PhotoCaptureOptions {
    quality = 50;
    destinationType = 1;
    sourceType = 1;
    targetWidth = -1;
    targetHeight = -1;
    encodingType = 0;
    mediaType = 0;
    allowEdit = false;
    correctOrientation = false;
    saveToPhotoAlbum = false;
    popoverOptions = null;
    cameraDirection = 0;
}

export class MediaPlugin extends CordovaPlugin {
    private camera:Camera;
    private filePlugin:FilePlugin;

    constructor(private $q:IQService) {
        super();
        this.filePlugin = new FilePlugin($q);
        this.camera = navigator.camera;
        if (!this.camera) {
            this.mock();
        }
    }

    public takePicture(option:CameraOptions):IPromise<FileEntry> {
        var defer = this.$q.defer<FileEntry>();
        option = angular.extend({
            encodingType: EncodingType.JPEG,
            mediaType: MediaType.PICTURE,
            sourceType: PictureSourceType.CAMERA,
            destinationType: DestinationType.FILE_URI,
            quality: 50
        }, option);
        this.camera.getPicture((image:string)=> {
            return this.filePlugin.resolveNativePath(image);
        }, (error:string)=> {
            defer.reject(new Err(Err.Code.Device, error));
        }, option);
        return defer.promise;
    }

    public cleanup() {
        this.camera.cleanup(()=> {
        }, ()=> {
        });
    }

    public captureAudio(options, cb) {
        var d = new Date(), onRecordStop, media;
        var name = cordova.file.externalRootDirectory + 'audio-' +
            d.getFullYear() + this.zeroFiller(d.getMonth() + 1) + this.zeroFiller(d.getDate()) + '-' +
            this.zeroFiller(d.getHours()) + this.zeroFiller(d.getMinutes()) + this.zeroFiller(d.getSeconds()) + '.mp3';
        media = new Media(name, ()=> {
            this.filePlugin.resolveUrl(name/*, onRecordStop*/);
        }, function (err) {
            onRecordStop(err);
        });
        cb({
            startRecording: function () {
                media.startRecord();
            },
            stopRecording: function (cb) {
                onRecordStop = cb;
                media.stopRecord();
            }
        });
    }

    public captureVideo(options:VideoOptions, cb) {
        navigator.device.capture.captureVideo(function (mediaFiles) {
            cb(null, mediaFiles);
        }, function (err) {
            cb(err);
        }, options);
    }

    public resizeImage(imageEntry, newWidth, cb) {
        var img = new Image;
        var sourceCanvas = document.createElement('canvas');
        var destCanvas = document.createElement('canvas');

        img.onload = function () {
            sourceCanvas.width = img.width;
            sourceCanvas.height = img.height;
            sourceCanvas.getContext('2d').drawImage(img, 0, 0);
            destCanvas.width = newWidth;
            destCanvas.height = img.height * (newWidth / img.width);
            window['pica'].resizeCanvas(sourceCanvas, destCanvas, {quality: 1}, function (err) {
                cb(err, destCanvas.toDataURL('image/jpg', 0.5));
            })
        };
        img.src = imageEntry.nativeURL;
    }

    private zeroFiller(number:number):string {
        return number < 10 ? `0${number}` : String(number);
    }

    protected mock() {
        this.mockingMode = true;
        this.camera = <Camera>{
            getPicture: function (onSuccess, onError, options?) {
                console.log('Mocking Media plugin: getPicture');
                onError('Mocking mode');
            },
            cleanup: function (onSuccess, onError) {
                console.log('Mocking Media plugin: cleanup');
                onError('Mocking mode');
            }
        };
    }
}
