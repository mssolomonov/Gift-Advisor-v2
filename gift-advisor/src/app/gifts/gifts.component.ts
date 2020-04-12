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
  allTags: Tag[];
  value = '0';
  highValue = '99999999';
  tagsControl = new FormControl();
  tags = [];
  private allStringTags: string[];
  private filteredTags: Observable<string[]>;
  private allLenght = 0;
  private _valueNumber = 0.0;
  private _highValueNumber = 99999999.0;
  private _lowPrice=0.0;
  private _highPrice= 99999999.0;
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
        let g =  resp as Gift[];
        this.gifts = g.slice(0, 30);
        this.allLenght = g.length
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

    this.rangeForm.get("value").valueChanges.subscribe((val)=>this._valueNumber = val);
    this.rangeForm.get("highValue").valueChanges.subscribe((val)=>this._highValueNumber = val);
  }

  onChangeHigh(){
    this.err = "";
    if (!this.rangeForm.valid) {
      this.err="Price is a number between 0 and 99 999 999, decimal number with ',' or '.'";
      return 0;
    }
    if (!this.rangeForm.controls.highValue.value){
      this._highPrice=99999999.0;
      this._highValueNumber = this._highPrice;
      return
    }
    if (this.rangeForm.controls.highValue.value.indexOf(",") > 0 ||this.rangeForm.controls.highValue.value.indexOf(".")>0) {
      this._highPrice = Number.parseFloat(this.rangeForm.controls.highValue.value.replace(",", "."));
    } else {
      this._highPrice = Number.parseInt(this.rangeForm.controls.highValue.value);
    }
    this._highValueNumber = this._highPrice;
  }

  onChangeLow() {
    this.err = "";
    if (!this.rangeForm.valid) {
      this.err="Price is a number between 0 and 99 999 999, decimal number with ',' or '.'";
      return 0;
    }
    if (!this.rangeForm.controls.value.value){
      this._lowPrice=0.0;
      this._valueNumber=this._lowPrice;
      return
    }
    if (this.rangeForm.controls.value.value.indexOf(",") > 0 ||this.rangeForm.controls.value.value.indexOf(".")>0) {
      this._lowPrice = Number.parseFloat(this.rangeForm.controls.value.value.replace(",", "."));
    } else {
      this._lowPrice = Number.parseInt(this.rangeForm.controls.value.value);
    }
    this._valueNumber=this._lowPrice
  }

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
    let find = this.tags.find(tag => tag.name.trim() === tags1.name.trim());
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
    if (this._valueNumber > this._highValueNumber) {
      this.err = "Max value must be less than min value";
      return
    }
    this.paginator.firstPage();
    if (this.isMyGift) {
      this.giftService.getGifts(this.tagToString(), this.user.username, this._valueNumber, this._highValueNumber, this.sort).subscribe(
        resp => {
          this.gifts = resp.slice(0, 30);
          this.allLenght = resp.length
        },
        err => console.error(err),
      );
    } else {
      this.giftService.getGifts(this.tagToString(), '', this._valueNumber, this._highValueNumber, this.sort).subscribe(
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
    if (this._valueNumber > this._highValueNumber) {
      this.err = "Max value must be less than min value";
      return
    }
    if (this.isMyGift) {
      this.giftService.getGifts(this.tagToString(), this.user.username, this._valueNumber, this._highValueNumber, this.sort).subscribe(
        resp => {
          this.gifts = resp.slice(e.pageSize * e.pageIndex, e.pageSize * (e.pageIndex + 1))
        },
        err => console.error(err),
      );
    } else {
      this.giftService.getGifts(this.tagToString(), '', this._valueNumber, this._highValueNumber, this.sort).subscribe(
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
    this._valueNumber = 0.0;
    this._highValueNumber = 99999999.0;
    this._lowPrice = 0.0;
    this._highPrice=99999999.0;
    this.rangeForm = this.formBuilder.group({
      value: ["0", [Validators.pattern(/^(?:0|(0[.,])[0-9]\d*|[1-9]\d{0,7}([.,]\d*)?)$/)]],
      highValue: ["99999999", [Validators.pattern(/^(?:0|(0[.,])[0-9]\d*|[1-9]\d{0,7}([.,]\d*)?)$/)]]
    });
  }


  onChangeValue() {
    this._valueNumber = this._lowPrice;
    this._highValueNumber = this._highPrice;
    this.value = this._lowPrice.toString();
    this.highValue = this._highPrice.toString();
    this.rangeForm.get('highValue').setValue(this.highValue);
    this.rangeForm.get('value').setValue(this.value);
  }

  get highPrice() {
    return this._highPrice;
  }
  get lowPrice() {
    return this._lowPrice;
  }

  set lowPrice(value: number) {
    this._lowPrice = value;
  }

  set highPrice(value: number) {
    this._highPrice = value;
  }

  get valueNumber(): number {
    return this._valueNumber;
  }

  set valueNumber(value: number) {
    this._valueNumber = value;
  }

  get highValueNumber(): number {
    return this._highValueNumber;
  }

  set highValueNumber(value: number) {
    this._highValueNumber = value;
  }
}
