import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SummernoteDirective} from '@app/shared/forms/editors/summernote.directive'
import {SummernoteAttachDirective} from '@app/shared/forms/editors/summernote-attach.directive'
import {SummernoteDetachDirective} from '@app/shared/forms/editors/summernote-detach.directive'
import {MarkdownEditorDirective} from '@app/shared/forms/editors/markdown-editor.directive'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SummernoteDirective,
    SummernoteAttachDirective,
    SummernoteDetachDirective,
    MarkdownEditorDirective,
  ],
  exports: [
    SummernoteDirective,
    SummernoteAttachDirective,
    SummernoteDetachDirective,
    MarkdownEditorDirective,
  ]
})
export class SmartadminEditorsModule { }
