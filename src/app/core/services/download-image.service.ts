import { Injectable } from "@angular/core";
import { CRMSolutionApiService } from '../../core/api/crm-solution-api.service';
@Injectable()
export class DownloadImageService {
    constructor(private api: CRMSolutionApiService) {
    }

    showImage(filename, path) {
        return this.api.download_image(path).subscribe((result: any) => {
            var arr = filename.split('.');
            let type = arr.length > 0 ? arr[arr.length - 1] : 'jpg';
            var fileType = "";
            switch(type){
                case ".png": fileType = "image/png";
                case ".jpg": fileType = "image/jpeg";
                case ".jpeg": fileType = "image/jpeg";
                case ".gif": fileType = "image/gif";
                default: fileType = "image/jpeg";
            }
            this.showFile(result, filename, fileType);
        });
    }

    downloadFile(filename, path) {
        return new Promise<any>((resolve, reject) => {
            this.api.download_image(path).subscribe(result => {
                var arr = filename.split('.');
                let type = arr.length > 0 ? arr[arr.length - 1] : 'jpg';
                var fileType = "";
                switch(type){
                    case ".png": fileType = "image/png";
                    case ".jpg": fileType = "image/jpeg";
                    case ".jpeg": fileType = "image/jpeg";
                    case ".gif": fileType = "image/gif";
                    default: fileType = "image/jpeg";
                }
                resolve(result);
            });
        });
    }

    private showFile(blob: any, filename: string, type) {
        // It is necessary to create a new blob object with mime-type 
        // explicitly set otherwise only Chrome works like it should
        // let newBlob = new Blob([blob], { type: type });

        // IE doesn't allow using a blob object directly as link href 
        // instead it is necessary to use msSaveOrOpenBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob);
            return;
        }

        // For other browsers: 
        // Create a link pointing to the ObjectURL containing the blob.
        let data = window.URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.href = data;
        link.download = filename;
        link.click();
        setTimeout(() => {
            // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(data);
        }, 100);
    }

}
