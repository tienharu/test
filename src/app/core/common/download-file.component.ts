import { CRMSolutionApiService } from '../../core/api/crm-solution-api.service';
// other imports statements omitted

export class FileComponet
{
  constructor(private api: CRMSolutionApiService) {}

  showImage()
  {
    let filename: string = 'document.pdf';
    // return this.api.download_file(filename).subscribe((result: any) =>
    // {
    //   this.showFile(result._body, filename);
    // });
  }

  private showFile(blob: any, filename: string)
  { 
    // It is necessary to create a new blob object with mime-type 
    // explicitly set otherwise only Chrome works like it should
    let newBlob = new Blob([blob], { type: "application/pdf" });

    // IE doesn't allow using a blob object directly as link href 
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob)
    {
      window.navigator.msSaveOrOpenBlob(newBlob);
      return;
    }

    // For other browsers: 
    // Create a link pointing to the ObjectURL containing the blob.
    let data = window.URL.createObjectURL(newBlob);
    let link = document.createElement('a');
    link.href = data;
    link.download = filename;
    link.click();
    setTimeout(() =>
    {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
    }, 100);
  }
}