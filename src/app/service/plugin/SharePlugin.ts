import {CordovaPlugin} from "./CordovaPlugin";

export class SharePlugin extends CordovaPlugin {
    private socialSharing: any;

    constructor() {
        super();
        this.socialSharing = window.plugins && window.plugins['socialSharing'];
        if (!this.socialSharing) {
            this.mock();
        }
    }

    public shareMessage(message: string, subject?: string) {
        this.socialSharing.share(message, subject);
    }

    public shareImage(message: string, subject: string, image: string, link?: string) {
        this.socialSharing.share(message, subject, image, link);
    }

    protected mock(): void {
        this.mockingMode = true;
        this.socialSharing = {
            share: function (message?: string, subject?: string, file?: string, link?: string) {
                console.log(`Mocking SocialSharing plugin: share(${message}, ${subject}, ${file}, ${link})`);
            }
        };
    }
}
