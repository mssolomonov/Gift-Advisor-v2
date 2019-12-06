import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../_model/user";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {GiftsService} from "../_services/gifts.service";
import {AuthenticationService} from "../_services/authentification.service";
import {Tag} from "../_model/tag";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent, MatDialog} from "@angular/material";
import {map, startWith} from "rxjs/operators";
import {Observable, throwError} from "rxjs";
import {TagsService} from "../_services/tags.service";
import {Gift} from "../_model/gift";
import {SuccessDialog} from "../dialogs/success.dialog";
import {Image} from "../_model/image";
import {ImageService} from "../_services/image.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

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
  price=0;
  decodeImage: SafeUrl;
  file: File;
  defaultDecodeImage: SafeUrl;
  @ViewChild('tagInput', {static: false}) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;
  message: string;

  constructor( private formBuilder: FormBuilder,
               private activatedRoute: ActivatedRoute,
               private giftService: GiftsService,
               private authenticationService: AuthenticationService,
               private tagService: TagsService,
               private router: Router,
               public dialog: MatDialog,
               private imageService: ImageService,
               private sanitizer: DomSanitizer,

  ) {
    this.giftForm = this.formBuilder.group({
      name: '',
      description: '',
      image: '',
      price: 0,
      message: '',
    });
    this.tagService.getList().subscribe(
      resp =>{
        this.allTags = resp;
        this.allStringTags = resp.map((tag: Tag) => tag.name);
        this.filteredTags = this.tagsControl.valueChanges.pipe(
          startWith(null),
          map((tag: string | null) => tag ? this._filter(tag) : this.allStringTags.slice()));
      });
    this.activatedRoute.queryParams.subscribe(params => {
      this.giftId = parseInt(params['id']);
    });
  }

  ngOnInit() {

    if (this.giftId === 0) {
      // this.giftForm = this.formBuilder.group({
      //   name: '',
      //   description: '',
      //   image: '',
      //   price: 0,
      //   message: '',
      // });
      this.user = new User(this.giftId,
        this.authenticationService.currentUserValue.username,
        this.authenticationService.currentUserValue.password);
      this.defaultGift = new Gift(this.giftId, '', '', this.authenticationService.currentUserValue, '', [], 0);
      this.isNewGift = true;
      this.isEditable = false;
      this.tags = [];
      this.image='';
      this.decodeImage = '';
      this.defaultDecodeImage = '';
    }else {
      this.giftService.get(this.giftId).pipe()
        .subscribe(gift =>{
            this.name = gift.name.trim();
            this.description = gift.description.trim();
            this.image = gift.image_url.trim();
            this.user = new User(gift.id, gift.id_user.username.trim(),gift.id_user.password.trim());
            this.tags = [];
            gift.tags.forEach(tags => this.tags.push(tags));
            this.defaultGift = Object.assign({}, gift);
          this.price = gift.price;
          this.giftForm = this.formBuilder.group({
            name: this.name,
            description: this.description,
            price: this.price,
            message: '',
          });
          // if (this.image !== ""){
          //   this.imageService.getImage(this.image).subscribe(
          //     resp => {
          //       const reader = new FileReader();
          //       reader.readAsDataURL(resp);
          //       reader.addEventListener('load', (event: any) => {
          //         this.decodeImage = this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + event.target.result);
          //         this.defaultDecodeImage = this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + event.target.result);
          //       });
          //     },
          //     error => this.errMsg = 'Could not get image',
          //   );
          // }
          if (this.image){
            this.decodeImage = this.defaultDecodeImage = "http://localhost:8080/"+this.image;
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
      const value = event.value;

      if ((value || '').trim()) {
        let tags1 = this.allTags.find((tag: Tag) => tag.name===value);
        this.tags.push(tags1);
      }

      if (input) {
        input.value = '';
      }

      this.tagsControl.setValue(null);
    }
  }

  remove(tagValue: string): void {
    let index = this.tags.findIndex(tag => tag.name==tagValue);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let tags1 = this.allTags.find(tag => tag.name===event.option.viewValue)
    let find = this.tags.find(tag => tag === tags1);
    if (find){
      return
    }
    this.tags.push(tags1);
    this.tagInput.nativeElement.value = '';
    this.tagsControl.setValue(null);
  }

  onSubmit() {
      this.errMsg="";
      if (this.giftForm.invalid || this.tagsControl.invalid){
        return
      }
      let value = this.setNewValue();
      if (!value){
        this.errMsg = "Failed upload image";
        return;
      }

      let gift = new Gift(this.giftId, this.name, this.description, this.user, this.image, this.tags, this.price);
      this.defaultGift = Object.assign({}, gift);
      this.giftService.add(gift).pipe().subscribe(
        resp =>this.message ="Success!",
        error =>this.errMsg="Couldn't add gift: " + error.toString(),
        )
  }

  onUpdate() {
    this.errMsg="";
    if (this.giftForm.invalid || this.tagsControl.invalid){
      this.errMsg="Fill required field";
      return
    }
    let value = this.setNewValue();
    if (!value){
      this.errMsg = "Failed upload image";
      return;
    }
    let gift = new Gift(this.giftId, this.name, this.description, this.user, this.image, this.tags, this.price);
    this.defaultGift =Object.assign({}, gift);
    this.giftService.update(gift).pipe().subscribe(
      resp => this.message ="Success!",
      error =>this.errMsg="Couldn't update gift: " + error.toString(),
    )
  }

  onDelete() {
    this.dialog.open(SuccessDialog, {width:'250px', data: this.giftId})
      .afterClosed().subscribe(
            resp => this.message="",
      error =>this.errMsg="Couldn't delete gift: " + error.toString());
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allStringTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
  }


  tagToString(){
    return this.tags ? this.tags.map((tag : Tag | null) => tag ? tag.name : '') : []
  }

  onCancel() {
     this.router.navigate(["/gifts"])
  }

  onReset() {
    this.errMsg=this.message='';
    this.giftForm = this.formBuilder.group({
      name: this.defaultGift.name.trim(),
      description: this.defaultGift.description.trim(),
      image: this.defaultGift.image_url,
      price: this.defaultGift.price,
      message: '',
    });
    for (let tag in this.tags){
      this.tagsControl.setValue(null)
    }
    // this.tagsControl.reset();
    this.name = this.defaultGift.name;
    this.price = this.defaultGift.price;
    this.description = this.defaultGift.description;
    this.image = this.defaultGift.image_url.trim();
    this.tags = this.defaultGift.tags;
    this.decodeImage = this.defaultDecodeImage;
  }


  setNewValue(){
    this.name = this.giftForm.controls.name.value;
    this.description = this.giftForm.controls.description.value;
    this.price=this.giftForm.controls.price.value;
    if (this.image!==''){
      return this.saveImage()
    } else {
      return "OK"
    }
  }

  // private processImageFromDatabase(image: string){
  //   const reader = new FileReader();
  //   new Blob(reader.readAsText(image))
  //   reader.readAsDataURL(image);
  // }

  async saveImage(){
     let data = await this.imageService.saveImage(this.file,  this.image).toPromise();
     return data
  }
  processFile(imageInput: HTMLInputElement) {
    const reader = new FileReader();
    this.file = imageInput.files[0];
    let number = imageInput.files[0].name.lastIndexOf(".");
    this.image = (Math.floor(Math.random() * (1000000 - 1) + 1))+imageInput.files[0].name.substring(number).trim();
    reader.readAsDataURL(imageInput.files[0]);
    reader.addEventListener('load', (event: any) => {
      this.decodeImage=event.target.result;
    });
  }
}
