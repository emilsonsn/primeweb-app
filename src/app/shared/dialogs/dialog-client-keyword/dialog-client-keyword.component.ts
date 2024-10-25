import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-client-keyword',
  templateUrl: './dialog-client-keyword.component.html',
  styleUrls: ['./dialog-client-keyword.component.scss']
})
export class DialogClientKeywordComponent implements OnInit {

  public text: string = 'Você tem certeza?';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly data: {text: string},
    private readonly dialogRef: MatDialogRef<DialogClientKeywordComponent>,
  ) { }

  ngOnInit(): void {
    if(this.data?.text)
      this.text = this.data.text;
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public onConfirm(): void {
    this.dialogRef.close(true);
  }

}
