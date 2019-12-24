import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {User} from "../_model/user";
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatIconRegistry, MatInput, MatPaginator,
  PageEvent
} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {Tag} from "../_model/tag";
import {filter, map, startWith} from "rxjs/operators";
import {Observable} from "rxjs";
import {Form, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TagsService} from "../_services/tags.service";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Router} from "@angular/router";
import {GiftsService} from "../_services/gifts.service";
import {AuthenticationService} from "../_services/authentification.service";
import {Gift} from "../_model/gift";
import {Options} from "ng5-slider";

@Component({
  selector: 'app-gifts',
  templateUrl: './gifts.component.html',
  styleUrls: ['./gifts.component.css']
})
export class GiftsComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  user: User;
  pageEvent: PageEvent;
  isMyGift = false;
  private allTags: Tag[];
  private allStringTags: string[];
  private filteredTags: Observable<string[]>;
  private tagsControl = new FormControl();
  private tags = [];
  private allLenght = 0;
  private _value = 0.0;
  private _highValue = 99999999.0;
  private value = '0';
  private  highValue = '99999999';
  private lowPrice=0.0;
  private highPrice=99999999.0;
  @ViewChild('tagInput', {static: false}) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;
  @ViewChild('paginator', {static: false}) paginator: MatPaginator;
  private gifts: Gift[];
  options: Options = {
    floor: 0.0,
    ceil: 99999999.0,
    selectionBarGradient: {
      from: 'darkslateblue',
      to: 'darkslateblue'
    }
  };
  err = '';
  sort = 'no';

  public rangeForm: FormGroup;

  constructor(private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer,
              private tagService: TagsService,
              private router: Router,
              private formBuilder: FormBuilder,
              private userService: AuthenticationService,
              private giftService: GiftsService,
  ) {
    if (this.userService.currentUserValue) {
      this.user = this.userService.currentUserValue;
    }
    this.giftService.getAll().subscribe(
      resp => {
        this.gifts = resp.slice(0, 30);
        this.allLenght = resp.length
      },
      err =>this.router.navigate(["/error"]),
    );
    iconRegistry.addSvgIcon('gift', sanitizer.bypassSecurityTrustResourceUrl('assets/gift.svg'));
    iconRegistry.addSvgIcon('profile', sanitizer.bypassSecurityTrustResourceUrl('assets/profile.svg'));
    this.tagService.getList().subscribe(
      resp => {
        this.allTags = resp;
        this.allStringTags = resp.map((tag: Tag) => tag.name);
        this.filteredTags = this.tagsControl.valueChanges.pipe(
          startWith(null),
          map((tag: string | null) => {
            return tag ? this._filter(tag) : this.allStringTags;
          }),
        );
      });

    this.rangeForm = this.formBuilder.group({
      value: ["0", [Validators.pattern(/^(?:0|(0[.,])[0-9]\d*|[1-9]\d{0,7}([.,]\d*)?)$/)]],
      highValue: ["99999999", [Validators.pattern(/^(?:0|(0[.,])[0-9]\d*|[1-9]\d{0,7}([.,]\d*)?)$/)]]
    });

    this.rangeForm.get("value").valueChanges.subscribe((val)=>this._value = val);
    this.rangeForm.get("highValue").valueChanges.subscribe((val)=>this._highValue = val);
  }

  // get highPrice(): number {
  //   if (!this.rangeForm.get('highValue').valid) {
  //     return 0;
  //   }
  //   if (this.highValue.indexOf(",") > 0 || this.highValue.indexOf(".")) {
  //     return Number.parseFloat(this.rangeForm.get('highValue').value.replace(",", "."));
  //   } else {
  //     return Number.parseInt(this.rangeForm.get('highValue').value);
  //   }
  // }

  onChangeHigh(){
    this.err = "";
    if (!this.rangeForm.valid) {
      this.err="Price is a number between 0 and 99 999 999, decimal number with ',' or '.'";
      return 0;
    }
    if (!this.rangeForm.controls.highValue.value){
      this.highPrice=99999999.0;
      this._highValue = this.highPrice;
      return
    }
    if (this.rangeForm.controls.highValue.value.indexOf(",") > 0 ||this.rangeForm.controls.highValue.value.indexOf(".")) {
      this.highPrice = Number.parseFloat(this.rangeForm.controls.highValue.value.replace(",", "."));
    } else {
      this.highPrice = Number.parseInt(this.rangeForm.controls.highValue.value);
    }
    this._highValue = this.highPrice;
  }

  onChangeLow() {
    this.err = "";
    if (!this.rangeForm.valid) {
      this.err="Price is a number between 0 and 99 999 999, decimal number with ',' or '.'";
      return 0;
    }
    if (!this.rangeForm.controls.value.value){
      this.lowPrice=0.0;
      this._value=this.lowPrice
      return
    }
    if (this.rangeForm.controls.value.value.indexOf(",") > 0 ||this.rangeForm.controls.value.value.indexOf(".")) {
      this.lowPrice = Number.parseFloat(this.rangeForm.controls.value.value.replace(",", "."));
    } else {
      this.lowPrice = Number.parseInt(this.rangeForm.controls.value.value);
    }
    this._value=this.lowPrice
  }

  // set highPrice(value: number) {
  //   this.rangeForm.get('highValue').setValue(value);
  // }
  //
  // set highValue(value: string) {
  //   this.rangeForm.get('highValue').setValue(value);
  // }
  //
  // get highValue() {
  //   return this.rangeForm.get('highValue').value;
  // }
  //
  // set lowPrice(value: number) {
  //   this.rangeForm.get('highValue').setValue(value);
  // }
  //
  // get lowPrice(): number {
  //   if (!this.rangeForm.get('value').valid) {
  //     return;
  //   }
  //   if (this.value.indexOf(",") > 0 || this.value.indexOf(".")) {
  //     return Number.parseFloat(this.rangeForm.get('value').value.replace(",", "."));
  //   } else {
  //     return Number.parseInt(this.rangeForm.get('value').value);
  //   }
  // }
  //
  // set value(value: string) {
  //   this.rangeForm.get('value').setValue(value);
  // }
  //
  // get value() {
  //   return this.rangeForm.get('value').value;
  // }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        let tags1 = this.allTags.find((tag: Tag) => tag.name.trim() === value.trim());
        this.tags.push(new Tag(tags1.id, tags1.name.trim()));
        this.allStringTags = this.allStringTags.filter(tag => tag.trim() !== value.trim());
      }

      if (input) {
        input.value = '';
      }

      this.tagsControl.setValue(null);
    }
  }

  remove(tagValue: string): void {
    let index = this.tags.findIndex(tag => tag.name.trim() == tagValue.trim());
    if (index >= 0) {
      this.tags.splice(index, 1);
      this.allStringTags.push(tagValue);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let tags1 = this.allTags.find(tag => tag.name === event.option.viewValue);
    let find = this.tags.find(tag => tag === tags1);
    if (find) {
      this.tagInput.nativeElement.value = '';
      this.tagsControl.setValue(null);
      return
    }
    this.tags.push(tags1);
    this.allStringTags = this.allStringTags.filter(tag => tag.trim() !== event.option.viewValue.trim());
    this.tagInput.nativeElement.value = '';
    this.tagsControl.setValue(null);
  }

  tagToString() {
    return this.tags ? this.tags.map((tag: Tag | null) => tag ? tag.name.trim() : '') : []
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allStringTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit() {
    // this.allLenght=this.gifts.length;
  }

  onClick() {
    window.location.reload();
  }

  onMyGifts() {
    this.isMyGift = true;
    this.giftService.getUserGift(this.user.username).subscribe(
      resp => {
        this.gifts = resp.slice(0, 30);
        this.allLenght = resp.length
      },
      err => console.error(err),
    );
  }

  onAddGift() {
    this.router.navigate(['/gift'], {queryParams: {id: 0}});
  }

  onLogout() {
    this.userService.logout();
    this.user = null
  }

  onSubmitTags() {
    if (!this.value && !this.highValue) {
      this.err = "Problem with price range";
      return
    }
    if (this._value > this._highValue) {
      this.err = "Max value must be less than min value";
      return
    }
    this.paginator.firstPage();
    if (this.isMyGift) {
      this.giftService.getGifts(this.tagToString(), this.user.username, this._value, this._highValue, this.sort).subscribe(
        resp => {
          this.gifts = resp.slice(0, 30);
          this.allLenght = resp.length
        },
        err => console.error(err),
      );
    } else {
      this.giftService.getGifts(this.tagToString(), '', this._value, this._highValue, this.sort).subscribe(
        resp => {
          this.gifts = resp.slice(0, 30);
          this.allLenght = resp.length
        },
        err => console.error(err),
      );
    }
  }

  onSubmit(e: any) {
    if (!this.value && !this.highValue) {
      this.err = "Problem with price range";
      return
    }
    if (this._value > this._highValue) {
      this.err = "Max value must be less than min value";
      return
    }
    if (this.isMyGift) {
      this.giftService.getGifts(this.tagToString(), this.user.username, this._value, this._highValue, this.sort).subscribe(
        resp => {
          this.gifts = resp.slice(e.pageSize * e.pageIndex, e.pageSize * (e.pageIndex + 1))
        },
        err => console.error(err),
      );
    } else {
      this.giftService.getGifts(this.tagToString(), '', this._value, this._highValue, this.sort).subscribe(
        resp => {
          this.gifts = resp.slice(e.pageSize * e.pageIndex, e.pageSize * (e.pageIndex + 1))
        },
        err => console.error(err),
      );
    }
    return e
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  onReset() {
    this.tags = [];
    this.sort = "no";
    this.value = '0';
    this.highValue = '99999999';
    this._value = 0.0;
    this._highValue = 99999999.0;
    this.lowPrice = 0.0;
    this.highPrice=99999999.0;
    this.rangeForm = this.formBuilder.group({
      value: ["0", [Validators.pattern(/^(?:0|(0[.,])[0-9]\d*|[1-9]\d{0,7}([.,]\d*)?)$/)]],
      highValue: ["99999999", [Validators.pattern(/^(?:0|(0[.,])[0-9]\d*|[1-9]\d{0,7}([.,]\d*)?)$/)]]
    });
  }


  // onChangeHigh($event: Event) {
  //   if (!this.rangeForm.get('highValue').valid) {
  //     return;
  //   }
  //   if (this.highValue.indexOf(",") > 0 || this.highValue.indexOf(".")) {
  //     this.highPrice = Number.parseFloat(this.highValue.replace(",", "."));
  //   } else {
  //     this.highPrice = Number.parseInt(this.highValue);
  //   }
  // }


  onChangeValue() {
    this._value = this.lowPrice;
    this._highValue = this.highPrice;
    this.value = this.lowPrice.toString();
    this.highValue = this.highPrice.toString();
    this.rangeForm.get('highValue').setValue(this.highValue);
    this.rangeForm.get('value').setValue(this.value);
  }
}
