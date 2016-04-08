import {IQService, IPromise} from 'angular';
import {MediaPlugin} from "./plugin/MediaPlugin";

export class MediaService {
    private mediaPlugin:MediaPlugin;
    static $inject = ['$q'];

    constructor(private $q:IQService) {
        this.mediaPlugin = new MediaPlugin($q);
    }

    private getImageSmoothContext(canvas:HTMLCanvasElement) {
        var context = canvas.getContext('2d');
        context['imageSmoothingEnabled'] = true;
        context['mozImageSmoothingEnabled'] = true;
        context['oImageSmoothingEnabled'] = true;
        context['webkitImageSmoothingEnabled'] = true;
        return context
    }

    public takePicture(option:CameraOptions):IPromise<FileEntry> {
        return new this.$q<FileEntry>((resolve, reject)=> {
            reject('Not implemented');
        });
    }

    public cleanup() {

    }

    public captureAudio(options, cb) {
        return new this.$q<FileEntry>((resolve, reject)=> {
            reject('Not implemented');
        });
    }

    public captureVideo(options:VideoOptions, cb) {
        return new this.$q<FileEntry>((resolve, reject)=> {
            reject('Not implemented');
        });
    }

    public resizeImage(img:HTMLImageElement, width:number, height?:number, quality?:number):IPromise<HTMLImageElement> {
        var defer = this.$q.defer<HTMLImageElement>(),
            canvas = document.createElement('canvas'),
            context = this.getImageSmoothContext(canvas),
            type = "image/jpeg",
            originalWidth = img.naturalWidth,
            originalHeight = img.naturalHeight,
            resizeImage:HTMLImageElement = new Image(),
            tmp:HTMLImageElement = null;
        quality = quality || 1.0;
        height = height || (originalHeight * originalWidth / width);

        if (originalWidth <= width || originalHeight <= height || originalWidth / 2 < width || originalHeight / 2 < height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(img, 0, 0, width, height);
            resizeImage.src = canvas.toDataURL(type, quality);
            defer.resolve(resizeImage);
        } else {
            stepDown()
        }

        function stepDown() {
            originalWidth = Math.max(originalWidth / 2, width) | 0;
            originalHeight = Math.max(originalHeight / 2, height) | 0;
            canvas.width = originalWidth;
            canvas.height = originalHeight;
            context.drawImage(tmp || img, 0, 0, originalWidth, originalHeight);
            if (originalWidth <= width || originalHeight <= height) {
                resizeImage.src = canvas.toDataURL(type, quality);
                defer.resolve(resizeImage);
            }
            if (!tmp) {
                tmp = new Image();
                tmp.onload = stepDown
            }
            tmp.src = canvas.toDataURL(type, quality);
        }

        return defer.promise;
    }

    public dataURItoBlob(dataURI):Blob {
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0) {
            byteString = atob(dataURI.split(',')[1]);
        } else {
            byteString = decodeURI(dataURI.split(',')[1]);
        }
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], {type: mimeString});
    }
}