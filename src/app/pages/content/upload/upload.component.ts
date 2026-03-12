import { Component, Input } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent {

  files: File[] = [];
  @Input() multi: string;

  @Input() onUpload = (files: File[]) => { };

  onFilesChange(droppedFiles: NgxFileDropEntry[]) {
    const files: File[] = [];
    for (const droppedFile of droppedFiles) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          files.push(file);
          if (files.length === droppedFiles.length) {
            this.onUpload(files);
          }
        });
      }
    }
  }

}
