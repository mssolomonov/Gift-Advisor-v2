import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../_model/user";
import {FormBuilder, FormControl, FormGroup, PatternValidator, Validators} from "@angular/forms";
import {GiftsService} from "../_services/gifts.service";
import {AuthenticationService} from "../_services/authentification.service";
import {Tag} from "../_model/tag";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent, MatDialog} from "@angular/material";
import {map, startWith} from "rxjs/operators";
import {Observable, Subject, throwError} from "rxjs";
import {TagsService} from "../_services/tags.service";
import {Gift} from "../_model/gift";
import {SuccessDialog} from "../dialogs/success.dialog";
import {Image} from "../_model/image";
import {ImageService} from "../_services/image.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {PopularityService} from "../_services/popularity.service";

@Component({
  selector: 'app-gift',
  templateUrl: './gift.component.html',
  styleUrls: ['./gift.component.css']
})
export class GiftComponent implements OnInit {
  giftForm: FormGroup;
  giftId: number;
  name: string;
  description: string;
  user: User;
  image: string;
  isEditable = true;
  isNewGift = true;
  filteredTags: Observable<string[]>;
  tags: Tag[];
  allStringTags: string[];
  allTags: Tag[];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsControl = new FormControl();
  errMsg = '';
  defaultGift: Gift;
  price = 0.0;
  decodeImage: SafeUrl;
  file: File;
  defaultDecodeImage: SafeUrl;
  @ViewChild('tagInput', {static: false}) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;
  @ViewChild('imageInput', {static: false}) imageInput: ElementRef;
  message: string;

  private tagsList$ = this.tagService.getList();

  constructor(private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private giftService: GiftsService,
              private authenticationService: AuthenticationService,
              private tagService: TagsService,
              private router: Router,
              public dialog: MatDialog,
              private imageService: ImageService,
              private sanitizer: DomSanitizer,
              private popularityService: PopularityService,
  ) {
    this.giftService.getAll().subscribe(resp=>console.log("ok"),err => this.router.navigate(["/error"]));
    this.giftForm = this.formBuilder.group({
      name: ['', [Validators.maxLength(64)]],
      description: ['', [Validators.maxLength(1024)]],
      image: '',
      price: ['0', [Validators.pattern("^(?:0{1}|(0{1}(?:\\.|\\,))[0-9]\\d*|[1-9]{1}\\d{0,7}((?:\\.|\\,)\\d*)?)$")]],
      message: '',
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.giftId = parseInt(params['id']);
      if (this.giftId != 0) {
        popularityService.saveCount(this.giftId).subscribe()
      }
    });
  }

  ngOnInit() {
    if (!this.authenticationService.currentUserValue && this.giftId === 0) {
      return this.router.navigate(["/gifts"])
    }
    if (this.giftId === 0) {
      this.user = new User(this.giftId,
        this.authenticationService.currentUserValue.username,
        this.authenticationService.currentUserValue.password);
      this.defaultGift = new Gift(this.giftId, '', '', this.authenticationService.currentUserValue, '', [], 0);
      this.isNewGift = true;
      this.isEditable = false;
      this.tags = [];
      this.image = '';
      this.decodeImage = '';
      this.defaultDecodeImage = '';
      this.tagsList$.subscribe(resp => {
        this.allTags = resp;
        this.allStringTags = resp.map((tag: Tag) => tag.name.trim());
        this.filteredTags = this.tagsControl.valueChanges.pipe(
          startWith(null),
          map((tag: string | null) => tag ? this._filter(tag) : this.allStringTags)
        );
      });
    } else {
      this.giftService.get(this.giftId).pipe()
        .subscribe(gift => {
          this.name = gift.name.trim();
          this.description = gift.description.trim();
          this.image = gift.image_url.trim();
          this.user = new User(gift.id, gift.id_user.username.trim(), gift.id_user.password.trim());
          this.tagsList$.subscribe(resp => {
            this.allTags = resp;
            this.allStringTags = resp.map((tag: Tag) => tag.name.trim());
            this.tags = [];
            gift.tags.forEach(tags => {
              this.tags.push(new Tag(tags.id, tags.name.trim()))
            });
            const stringsTags = this.tags.map(tag => tag.name.trim());
            this.allStringTags = this.allStringTags.filter(tag => !stringsTags.includes(tag));
            this.filteredTags = this.tagsControl.valueChanges.pipe(
              startWith(null),
              map((tag: string | null) => tag ? this._filter(tag) : this.allStringTags)
            );
          });
          this.defaultGift = Object.assign({}, gift);
          this.price = gift.price;
          this.giftForm = this.formBuilder.group({
            name: [this.name, [Validators.maxLength(64)]],
            description: [this.description, [Validators.maxLength(1024)]],
            price: [this.price.toString(), [Validators.pattern("^(?:0{1}|(0{1}(?:\\.|\\,))[0-9]\\d*|[1-9]{1}\\d{0,7}((?:\\.|\\,)\\d*)?)$")]],
            message: '',
          });
          if (this.image) {
            this.decodeImage = this.defaultDecodeImage = "http://localhost:8080/" + this.image;
          } else {
            this.decodeImage = this.defaultDecodeImage = '';
          }
          this.isNewGift = false;
          if (this.authenticationService.currentUserValue) {
            this.isEditable = !(this.authenticationService.currentUserValue.username !== this.user.username &&
              this.authenticationService.currentUserValue.password !== this.user.password);
          } else {
            this.isEditable = false
          }
        });

    }
  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value.trim();

      if ((value || '')) {
        let tags1 = this.allTags.find((tag: Tag) => tag.name.trim() === value);
        this.tags.push(new Tag(tags1.id, tags1.name.trim()));
        this.allStringTags = this.allStringTags.filter(tag => tag.trim() !== value);
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
      this.allStringTags.push(tagValue.trim());
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let value = event.option.viewValue.trim();
    let tags1 = this.allTags.find(tag => tag.name === value);
    let find = this.tags.find(tag => tag.id === tags1.id && tag.name === tags1.name);
    if (find) {
      this.tagInput.nativeElement.value = '';
      this.tagsControl.setValue(null);
      return
    }
    this.tags.push(tags1);
    this.allStringTags = this.allStringTags.filter(tag => tag.trim() !== value);
    this.tagInput.nativeElement.value = '';
    this.tagsControl.setValue(null);
  }

  onSubmit() {
    this.errMsg = "";
    this.giftForm.controls.name.markAllAsTouched();
    this.giftForm.controls.price.markAllAsTouched();
    if (this.giftForm.invalid || this.tagsControl.invalid) {
      this.errMsg = "Invalid input, maximum length of username - 256, description -1024, price is between 1 and 99_999_999";
      return
    }
    let value = this.setNewValue();
    if (!value) {
      this.errMsg = "Failed upload image";
      return;
    }
    let gift = new Gift(this.giftId, this.name, this.description, this.user, this.image, this.tags, this.price);
    this.giftService.add(gift).pipe().subscribe(
      resp => this.message = "Success!",
      error => this.errMsg = "Couldn't add gift: " + error.toString(),
    )
  }

  onUpdate() {
    this.errMsg = "";
    this.giftForm.controls.name.markAllAsTouched();
    this.giftForm.controls.price.markAllAsTouched();
    if (this.giftForm.invalid || this.tagsControl.invalid) {
      this.errMsg = "Invalid input, maximum length of username - 256, description -1024, price is between 1 and 99_999_999";
      return
    }
    let value = this.setNewValue();
    if (!value) {
      this.errMsg = "Failed upload image";
      return;
    }
    let gift = new Gift(this.giftId, this.name, this.description, this.user, this.image, this.tags, this.price);
    this.giftService.update(gift).pipe().subscribe(
      resp => this.message = "Success!",
      error => this.errMsg = "Couldn't update gift: " + error.toString(),
    )
  }

  onDelete() {
    this.dialog.open(SuccessDialog, {width: '250px', data: this.giftId})
      .afterClosed().subscribe(
      resp => this.message = "",
      error => this.errMsg = "Couldn't delete gift: " + error.toString());
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase().trim();
    return this.allStringTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
  }


  tagToString() {
    return this.tags ? this.tags.map((tag: Tag | null) => tag ? tag.name.trim() : '') : []
  }

  onCancel() {
    this.router.navigate(["/gifts"])
  }

  onReset() {
    this.errMsg = this.message = '';
    this.giftForm = this.formBuilder.group({
      name: this.defaultGift.name.trim(),
      description: this.defaultGift.description.trim(),
      image: this.defaultGift.image_url,
      price: [this.defaultGift.price.toString(),[Validators.pattern("^(?:0{1}|(0{1}(?:\\.|\\,))[0-9]\\d*|[1-9]{1}\\d{0,7}((?:\\.|\\,)\\d*)?)$")]],
      message: '',
    });
    // this.tagsControl.reset();
    this.name = this.defaultGift.name;
    this.price = this.defaultGift.price;
    this.description = this.defaultGift.description;
    this.image = this.defaultGift.image_url.trim();
    this.tags = [];
    this.defaultGift.tags.forEach(tags => {
      tags.name = tags.name.trim();
      this.tags.push(tags)
    });
    this.allStringTags = this.allTags.map(tag => tag.name.trim()).filter(tag => !this.tags.map(tag => tag.name.trim()).includes(tag));
    this.tagsControl.reset();
    this.decodeImage = this.defaultDecodeImage;
    this.imageInput.nativeElement.value = "";
  }


  setNewValue() {
    this.name = this.giftForm.controls.name.value;
    this.description = this.giftForm.controls.description.value;
    let strPrice = this.giftForm.controls.price.value.toString();
    let totalPrice;
    if (strPrice.indexOf(",") > 0 || strPrice.indexOf(".")) {
      totalPrice = Number.parseFloat(strPrice.replace(",", "."));
    } else {
      totalPrice = Number.parseInt(strPrice);
    }
    this.price = totalPrice;
    if (this.image !== '') {
      return this.saveImage()
    } else {
      return "OK"
    }
  }

  async saveImage() {
    let data = await this.imageService.saveImage(this.file, this.image).toPromise();
    return data
  }

  processFile(imageInput: HTMLInputElement) {
    const reader = new FileReader();
    this.file = imageInput.files[0];
    let number = imageInput.files[0].name.lastIndexOf(".");
    this.image = (Math.floor(Math.random() * (1000000 - 1) + 1)) + imageInput.files[0].name.substring(number).trim();
    reader.readAsDataURL(imageInput.files[0]);
    reader.addEventListener('load', (event: any) => {
      this.decodeImage = event.target.result;
    });
  }

  onDeleteImage() {
    this.image = '';
    this.decodeImage = '';
    this.imageInput.nativeElement.value = "";
  }

}
