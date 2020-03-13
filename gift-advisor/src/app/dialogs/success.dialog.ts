import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material";
import {Router} from "@angular/router";
import {GiftsService} from "../_services/gifts.service";

@Component({
  selector: 'dialog-success',
  templateUrl: 'success.dialog.html',
})

export class SuccessDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: number, private router: Router, private giftService: GiftsService,) {
  }

  onClick() {
    this.giftService.delete(this.data).pipe().subscribe(
      resp => this.router.navigate(["/gifts"]));
  }
}
