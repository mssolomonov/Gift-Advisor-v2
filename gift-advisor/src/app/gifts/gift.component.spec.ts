import {async, ComponentFixture, fakeAsync, getTestBed, TestBed, tick} from '@angular/core/testing';

import { GiftComponent } from './gift.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatChipsModule} from "@angular/material/chips";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { RouterTestingModule } from '@angular/router/testing';
import {MatDialogModule} from "@angular/material/dialog";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {Gift} from "../_model/gift";
import {User} from "../_model/user";
import {BehaviorSubject, Observable, of, throwError} from "rxjs";
import {GiftsService} from "../_services/gifts.service";
import {TagsService} from "../_services/tags.service";
import {Tag} from "../_model/tag";
import {PopularityService} from "../_services/popularity.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../_services/authentification.service";
import {dispatchFakeEvent, typeInElement} from "@angular/cdk/testing";
import {ImageService} from "../_services/image.service";
import {SuccessDialog} from "../dialogs/success.dialog";

describe('GiftComponent', () => {
  let component: GiftComponent;
  let fixture: ComponentFixture<GiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GiftComponent,
       ],
      imports: [
        FormsModule,
        MatChipsModule,
        MatCardModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatGridListModule,
        MatPaginatorModule,
        MatListModule,
        MatIconModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule,
        MatDialogModule,
        BrowserAnimationsModule],
      providers: [ {provide:TagsService, useClass: TagsServiceStub},
         GiftsService,
        { provide: ActivatedRoute,
          useValue: {
            queryParams: of({id: 0})
          }},
        {provide:PopularityService, useClass: PopularityServiceStub},
        {provide: AuthenticationService, useClass: AuthenticationServiceStub}
       ]
    })
    .compileComponents();
  }));

  it('should create', () => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));

    fixture = TestBed.createComponent(GiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should navigate to error', () => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    let spy1 = spyOn(service, "getAll").and.returnValue(throwError('404'));
    let router = injector.get(Router);
    spyOn(router, "navigate").withArgs(["/error"]);
    fixture = TestBed.createComponent(GiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(spy1).toHaveBeenCalled();
  });
  it('should call ngOnInit with giftId = 0', () => {
    // let spy1 = spyOn(service, "currentUserValue").and.returnValue(new User(1, "username", "password"));
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));
    fixture = TestBed.createComponent(GiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(fixture.componentInstance.user).toEqual( new User(0, "username", "password"));
    expect(fixture.componentInstance.isNewGift).toEqual(true);
    expect(fixture.componentInstance.isEditable).toEqual(false);
    expect(fixture.componentInstance.tags).toEqual([]);
    expect(fixture.componentInstance.image).toEqual('');
    expect(fixture.componentInstance.decodeImage).toEqual('');
    expect(fixture.componentInstance.defaultDecodeImage).toEqual('');
  });
  it('add mat autocomplete is open', fakeAsync(() => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));

    fixture = TestBed.createComponent(GiftComponent);
    fixture.detectChanges();
    let nativeChipList = fixture.componentInstance.tagInput.nativeElement;
    typeInElement(nativeChipList, 'test');
    fixture.detectChanges();
    let tags = fixture.componentInstance.tags;
    dispatchFakeEvent(nativeChipList, 'matChipInputTokenEnd');
    fixture.detectChanges();
    expect(fixture.componentInstance.tags).toEqual(tags);
    tick(4);
  }));
  it('add success', fakeAsync(() => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));

    fixture = TestBed.createComponent(GiftComponent);
    fixture.detectChanges();
    let nativeChipList = fixture.componentInstance.tagInput.nativeElement;
    fixture.detectChanges();
    nativeChipList.dispatchEvent(new Event('matChipInputTokenEnd'));
    fixture.detectChanges();
    expect(fixture.componentInstance.tagsControl.value).toBeNull();
    tick(5);
  }));
  it('remove success', (() => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));

    fixture = TestBed.createComponent(GiftComponent);
    fixture.detectChanges();
    fixture.componentInstance.tags.push( new Tag(1, "test"));
    fixture.componentInstance.remove("test");
    expect(fixture.componentInstance.tags.length).toEqual(0);
  }));
  it('remove success', (() => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));

    fixture = TestBed.createComponent(GiftComponent);
    fixture.detectChanges();
    fixture.componentInstance.tags.push( new Tag(1, "test"));
    fixture.componentInstance.remove("test111");
    expect(fixture.componentInstance.tags.length).toEqual(1);
  }));
  it('selected success, already exists', fakeAsync(() => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));

    fixture = TestBed.createComponent(GiftComponent);
    fixture.detectChanges();
    fixture.componentInstance.allTags.push( new Tag(1, "test"));
    fixture.componentInstance.tags.push( new Tag(1, "test"));
    fixture.detectChanges();
    let option = fixture.componentInstance.matAutocomplete.options.first;
    fixture.componentInstance.matAutocomplete._emitSelectEvent(option);
    fixture.detectChanges();
    expect(fixture.componentInstance.tags.length).toEqual(1);
    expect(fixture.componentInstance.tagInput.nativeElement.value).toEqual("");
    expect(fixture.componentInstance.tagsControl.value).toEqual(null)
  }));
  it('selected success', fakeAsync(() => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));

    fixture = TestBed.createComponent(GiftComponent);
    fixture.detectChanges();
    let option = fixture.componentInstance.matAutocomplete.options.first;
    fixture.componentInstance.matAutocomplete._emitSelectEvent(option);
    fixture.detectChanges();
    expect(fixture.componentInstance.tags.length).toEqual(1);
    expect(fixture.componentInstance.tagInput.nativeElement.value).toEqual("");
    expect(fixture.componentInstance.tagsControl.value).toEqual(null)
  }));
  it('onSubmit() invalid form', (() => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));

    fixture = TestBed.createComponent(GiftComponent);
    fixture.detectChanges();
    fixture.componentInstance.onSubmit();
    expect(fixture.componentInstance.errMsg).toEqual("Invalid input, maximum length of username - 256, description -1024, price is between 1 and 99_999_999")
  }));
  it('onSubmit() invalid tag form', (() => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));

    fixture = TestBed.createComponent(GiftComponent);
    fixture.detectChanges();
    fixture.componentInstance.giftForm.controls['name'].setValue('name');
    fixture.componentInstance.giftForm.controls['description'].setValue('description');
    fixture.componentInstance.giftForm.controls['price'].setValue('1000');
    fixture.componentInstance.tagsControl.setErrors({'incorrect': true});
    fixture.componentInstance.onSubmit();
    expect(fixture.componentInstance.errMsg).toEqual("Invalid input, maximum length of username - 256, description -1024, price is between 1 and 99_999_999")
  }));
  it('onSubmit() should succeed', (() => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));
    let imageService = injector.get(ImageService);
    spyOn(imageService, "saveImage")
      .and
      .returnValue(of("success"));
    spyOn(service, "add")
      .and
      .returnValue(of("success"));
    fixture = TestBed.createComponent(GiftComponent);
    fixture.detectChanges();
    fixture.componentInstance.giftForm.controls['name'].setValue('name');
    fixture.componentInstance.giftForm.controls['description'].setValue('description');
    fixture.componentInstance.giftForm.controls['price'].setValue('1000');
    fixture.componentInstance.onSubmit();
    expect(fixture.componentInstance.message).toEqual("Success!")
  }));
  it('onSubmit() should failed because of image service', (() => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));
    fixture = TestBed.createComponent(GiftComponent);
    spyOn(fixture.componentInstance, "saveImage")
      .and
      .returnValue(null);
    fixture.detectChanges();
    fixture.componentInstance.image ='image';
    fixture.componentInstance.giftForm.controls['name'].setValue('name');
    fixture.componentInstance.giftForm.controls['description'].setValue('description');
    fixture.componentInstance.giftForm.controls['price'].setValue('1000');
    fixture.componentInstance.onSubmit();
    expect(fixture.componentInstance.errMsg).toEqual("Failed upload image")
  }));
  it('onSubmit() should failed because of gift service', (() => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));
    let imageService = injector.get(ImageService);
    spyOn(imageService, "saveImage")
      .and
      .returnValue(of("success"));
    spyOn(service, "add")
      .and
      .returnValue(throwError('404'));
    fixture = TestBed.createComponent(GiftComponent);
    fixture.detectChanges();
    fixture.componentInstance.giftForm.controls['name'].setValue('name');
    fixture.componentInstance.giftForm.controls['description'].setValue('description');
    fixture.componentInstance.giftForm.controls['price'].setValue('1000');
    fixture.componentInstance.onSubmit();
    expect(fixture.componentInstance.errMsg).toEqual("Couldn't add gift: 404")
  }));
  it('onUpdate() invalid form', (() => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));

    fixture = TestBed.createComponent(GiftComponent);
    fixture.detectChanges();
    fixture.componentInstance.onUpdate();
    expect(fixture.componentInstance.errMsg).toEqual("Invalid input, maximum length of username - 256, description -1024, price is between 1 and 99_999_999")
  }));
  it('onUpdate() invalid tag form', (() => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));

    fixture = TestBed.createComponent(GiftComponent);
    fixture.detectChanges();
    fixture.componentInstance.giftForm.controls['name'].setValue('name');
    fixture.componentInstance.giftForm.controls['description'].setValue('description');
    fixture.componentInstance.giftForm.controls['price'].setValue('1000');
    fixture.componentInstance.tagsControl.setErrors({'incorrect': true});
    fixture.componentInstance.onUpdate();
    expect(fixture.componentInstance.errMsg).toEqual("Invalid input, maximum length of username - 256, description -1024, price is between 1 and 99_999_999")
  }));
  it('onUpdate() should succeed', (() => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));
    let imageService = injector.get(ImageService);
    spyOn(imageService, "saveImage")
      .and
      .returnValue(of("success"));
    spyOn(service, "update")
      .and
      .returnValue(of("success"));
    fixture = TestBed.createComponent(GiftComponent);
    fixture.detectChanges();
    fixture.componentInstance.giftForm.controls['name'].setValue('name');
    fixture.componentInstance.giftForm.controls['description'].setValue('description');
    fixture.componentInstance.giftForm.controls['price'].setValue('1000');
    fixture.componentInstance.onUpdate();
    expect(fixture.componentInstance.message).toEqual("Success!")
  }));
  it('onUpdate() should failed because of image service', (() => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));
    fixture = TestBed.createComponent(GiftComponent);
    spyOn(fixture.componentInstance, "saveImage")
      .and
      .returnValue(null);
    fixture.detectChanges();
    fixture.componentInstance.image ='image';
    fixture.componentInstance.giftForm.controls['name'].setValue('name');
    fixture.componentInstance.giftForm.controls['description'].setValue('description');
    fixture.componentInstance.giftForm.controls['price'].setValue('1000');
    fixture.componentInstance.onUpdate();
    expect(fixture.componentInstance.errMsg).toEqual("Failed upload image")
  }));
  it('onUpdate() should failed because of gift service', (() => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));
    let imageService = injector.get(ImageService);
    spyOn(imageService, "saveImage")
      .and
      .returnValue(of("success"));
    spyOn(service, "update")
      .and
      .returnValue(throwError('404'));
    fixture = TestBed.createComponent(GiftComponent);
    fixture.detectChanges();
    fixture.componentInstance.giftForm.controls['name'].setValue('name');
    fixture.componentInstance.giftForm.controls['description'].setValue('description');
    fixture.componentInstance.giftForm.controls['price'].setValue('1000');
    fixture.componentInstance.onUpdate();
    expect(fixture.componentInstance.errMsg).toEqual("Couldn't update gift: 404")
  }));
  it('onCancel() should success', () => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));
    fixture = TestBed.createComponent(GiftComponent);
    let router = fixture.debugElement.injector.get(Router);
    let spy = spyOn(router, "navigate");
    fixture.detectChanges();
    fixture.componentInstance.onCancel();
    expect(spy).toHaveBeenCalledWith(['/gifts']);
  });
  it('onReset() should success', () => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));
    fixture = TestBed.createComponent(GiftComponent);
    fixture.detectChanges();
    fixture.componentInstance.defaultGift.tags.push(new Tag(1, 'name'));
    fixture.componentInstance.onReset();
    expect(fixture.componentInstance.name).toEqual(fixture.componentInstance.defaultGift.name);
    expect(fixture.componentInstance.price).toEqual(fixture.componentInstance.defaultGift.price);
    expect(fixture.componentInstance.description).toEqual(fixture.componentInstance.defaultGift.description);
    expect(fixture.componentInstance.image).toEqual(fixture.componentInstance.defaultGift.image_url);
    expect(fixture.componentInstance.tags.length).toEqual(1);
    expect(fixture.componentInstance.errMsg).toEqual('');
  });
  it('setNewValue() should success', () => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));
    fixture = TestBed.createComponent(GiftComponent);
    fixture.detectChanges();
    fixture.componentInstance.giftForm.controls['name'].setValue('name');
    fixture.componentInstance.giftForm.controls['description'].setValue('description');
    fixture.componentInstance.giftForm.controls['price'].setValue('1000.0');
    fixture.componentInstance.setNewValue();
    expect(fixture.componentInstance.name).toEqual('name');
    expect(fixture.componentInstance.price).toEqual(1000.0);
    expect(fixture.componentInstance.description).toEqual('description');
  });
  it('setNewValue() should success, price with ,', () => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));
    fixture = TestBed.createComponent(GiftComponent);
    fixture.detectChanges();
    fixture.componentInstance.giftForm.controls['name'].setValue('name');
    fixture.componentInstance.giftForm.controls['description'].setValue('description');
    fixture.componentInstance.giftForm.controls['price'].setValue('1000,0');
    fixture.componentInstance.setNewValue();
    expect(fixture.componentInstance.name).toEqual('name');
    expect(fixture.componentInstance.price).toEqual(1000.0);
    expect(fixture.componentInstance.description).toEqual('description');
  });
  it('setNewValue() should success, price int', () => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));
    fixture = TestBed.createComponent(GiftComponent);
    fixture.detectChanges();
    fixture.componentInstance.giftForm.controls['name'].setValue('name');
    fixture.componentInstance.giftForm.controls['description'].setValue('description');
    fixture.componentInstance.giftForm.controls['price'].setValue('1000');
    fixture.componentInstance.setNewValue();
    expect(fixture.componentInstance.name).toEqual('name');
    expect(fixture.componentInstance.price).toEqual(1000.0);
    expect(fixture.componentInstance.description).toEqual('description');
  });
  it('saveImage() should success, price int', () => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));
    fixture = TestBed.createComponent(GiftComponent);
    fixture.detectChanges();
    let imageService = fixture.debugElement.injector.get(ImageService);
    let spy = spyOn(imageService, "saveImage").and.returnValue(of("success"));
    fixture.componentInstance.saveImage();
    expect(spy).toHaveBeenCalled();
  });
  it('processFile() should success, price int', () => {
    let injector = getTestBed();
    let service = injector.get(GiftsService);
    spyOn(service, "getAll")
      .and
      .returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));
    fixture = TestBed.createComponent(GiftComponent);
    fixture.detectChanges();
    fixture.componentInstance.onDeleteImage();
    expect(fixture.componentInstance.image).toEqual('');
    expect(fixture.componentInstance.decodeImage).toEqual('');
    expect(fixture.componentInstance.imageInput.nativeElement.value).toEqual('');
  });
});


describe('GiftComponent with giftId > 0', () => {
  let component: GiftComponent;
  let fixture: ComponentFixture<GiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GiftComponent,
      ],
      imports: [
        FormsModule,
        MatChipsModule,
        MatCardModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatGridListModule,
        MatPaginatorModule,
        MatListModule,
        MatIconModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule,
        MatDialogModule,
        BrowserAnimationsModule],
      providers: [{provide: TagsService, useClass: TagsServiceStub},
        {provide: GiftsService, useClass: GiftServiceStub},
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({id: 1})
          }
        },
        {provide: PopularityService, useClass: PopularityServiceStub},
        {provide: AuthenticationService, useClass: AuthenticationServiceStub}
      ]
    })
      .compileComponents();
  }))
  it('should create successful', () => {
    fixture = TestBed.createComponent(GiftComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});

class GiftServiceStub {
  getAll() {
    let gift = new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000);
    return of([gift])
  }
  get(id: number){
    let gift = new Gift(id, "name", "description", new User(1, "username", "password"), "image", [], 1000);
    return of(gift)
  }
}

class TagsServiceStub {
  getList() {
    return  of ( [new Tag(1, "test")])
  }
}


class AuthenticationServiceStub {
  private currentUserSubject = new BehaviorSubject<User>(new User(1, "username", "password"));

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
}

class PopularityServiceStub {
  saveCount(id: number) {
    return  of ("success")
  }
}
