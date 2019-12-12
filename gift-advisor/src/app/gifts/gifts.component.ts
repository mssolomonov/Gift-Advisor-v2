import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {User} from "../_model/user";
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatIconRegistry,
  PageEvent
} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {Tag} from "../_model/tag";
import {map, startWith} from "rxjs/operators";
import {Observable} from "rxjs";
import {Form, FormControl} from "@angular/forms";
import {TagsService} from "../_services/tags.service";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Router} from "@angular/router";
import {UserService} from "../_services/user.service";
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
  private allLenght=0;
  @ViewChild('tagInput', {static: false}) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;
  private gifts: Gift[];
  value = 1;
  highValue = 1000000;
  options: Options = {
    floor: 0,
    ceil: 1000000,
    selectionBarGradient: {
      from: 'darkslateblue',
      to: 'darkslateblue'
    }
  };
  err = '';
  sort = 'no';
  constructor(private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer,
              private tagService: TagsService,
              private router: Router,
              private userService: AuthenticationService,
              private giftService: GiftsService,
  ) {
    if (this.userService.currentUserValue){
      this.user = this.userService.currentUserValue;
    }
    this.giftService.getAll().subscribe(
      resp => {this.gifts = resp.slice(0, 5); this.allLenght=resp.length},
      err => console.error(err),
    );
  iconRegistry.addSvgIcon('gift', sanitizer.bypassSecurityTrustResourceUrl('assets/gift.svg'));
  iconRegistry.addSvgIcon('profile', sanitizer.bypassSecurityTrustResourceUrl('assets/profile.svg'));
    this.tagService.getList().subscribe(
      resp =>{
        this.allTags = resp;
        this.allStringTags = resp.map((tag: Tag) => tag.name);
        this.filteredTags = this.tagsControl.valueChanges.pipe(
          startWith(null),
          map((tag: string | null) => tag ? this._filter(tag) : this.allStringTags.slice()),
          );
      });
}

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        let tags1 = this.allTags.find((tag: Tag) => tag.name.trim()===value.trim());
        this.tags.push(new Tag(tags1.id, tags1.name.trim()));
      }

      if (input) {
        input.value = '';
      }

      this.tagsControl.setValue(null);
    }
  }

  remove(tagValue: string): void {
    let index = this.tags.findIndex(tag => tag.name.trim()==tagValue.trim());
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let tags1 = this.allTags.find(tag => tag.name===event.option.viewValue);
    let find = this.tags.find(tag => tag === tags1);
    if (find){
      this.tagInput.nativeElement.value = '';
      this.tagsControl.setValue(null);
      return
    }
    this.tags.push(tags1);
    this.tagInput.nativeElement.value = '';
    this.tagsControl.setValue(null);
  }
  tagToString(){
    return this.tags ? this.tags.map((tag : Tag | null) => tag ? tag.name.trim() : '') : []
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
      resp => {this.gifts = resp.slice(0,5); this.allLenght=resp.length},
      err => console.error(err),
    );
  }

  onAddGift() {
    this.router.navigate(['/gift'],{ queryParams: { id: 0 }});
  }

  onLogout() {
      this.userService.logout();
      this.user = null
  }

  onSubmitTags(){
    if (!this.value && !this.highValue){
      this.err = "Problem with price range";
      return
    }
    if (this.value>this.highValue){
      this.err = "Max vaule must be less than min value";
      return
    }
    if (this.isMyGift) {
      this.giftService.getGifts(this.tagToString(),  this.user.username, this.value, this.highValue, this.sort).subscribe(
        resp => {
          this.gifts = resp.slice(0,5); this.allLenght = resp.length
        },
        err => console.error(err),
      );
    }else{
      this.giftService.getGifts(this.tagToString(), '',  this.value, this.highValue, this.sort).subscribe(
        resp => {
          this.gifts = resp.slice(0,5); this.allLenght = resp.length
        },
        err => console.error(err),
      );
    }
  }

  onSubmit(e: any) {
    if (this.value>this.highValue){
      this.err = "Max vaule must be less than min value";
      return
    }
    if (this.isMyGift){
      this.giftService.getGifts(this.tagToString(), this.user.username,  this.value, this.highValue, this.sort).subscribe(
        resp =>{this.gifts = resp.slice(e.pageSize*e.pageIndex,e.pageSize*(e.pageIndex+1))},
        err => console.error(err),
      );
    } else {
      this.giftService.getGifts(this.tagToString(), '',  this.value, this.highValue, this.sort).subscribe(
        resp => {this.gifts = resp.slice(e.pageSize*e.pageIndex,e.pageSize*(e.pageIndex+1))},
        err => console.error(err),
      );
    }
    return e
  }

  onLogin() {
    this.router.navigate(['/login']);
  }
}
