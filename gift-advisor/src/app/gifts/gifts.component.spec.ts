import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { GiftsComponent } from './gifts.component';
import { MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import {CustomMaterialModule} from "../core/material.module";
import {FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatInputModule} from "@angular/material/input";
import {MatChipsModule} from "@angular/material/chips";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatListModule} from "@angular/material/list";
import {Ng5SliderModule} from "ng5-slider";
import {MatIconModule} from "@angular/material/icon";
import {HttpClientModule} from "@angular/common/http";
import {RouterTestingModule} from "@angular/router/testing";
import {MatDialogModule} from "@angular/material/dialog";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {Gift} from "../_model/gift";
import {User} from "../_model/user";
import {of, throwError} from "rxjs";
import {GiftsService} from "../_services/gifts.service";
import {Tag} from "../_model/tag";
import {TagsService} from "../_services/tags.service";
import {dispatchFakeEvent, dispatchKeyboardEvent, typeInElement} from "@angular/cdk/testing";
import {Router} from "@angular/router";
import {AuthenticationService} from "../_services/authentification.service";

describe('GiftsComponent', () => {
  let component: GiftsComponent;
  let fixture: ComponentFixture<GiftsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftsComponent ],
      imports: [ CustomMaterialModule,
        FormsModule,
        MatCardModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatGridListModule,
        MatPaginatorModule,
        MatListModule,
        FormsModule,
        Ng5SliderModule,
        MatIconModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule,
        MatDialogModule,
        BrowserAnimationsModule],
      providers: [{provide:GiftsService, useClass: GiftServiceStub}, {provide:TagsService, useClass: TagsServiceStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onChangeHigh invalid form', () => {
    fixture.componentInstance.rangeForm.controls['value'].setErrors({'incorrect': true});
    fixture.componentInstance.rangeForm.controls['highValue'].setErrors({'incorrect': true});
    fixture.componentInstance.onChangeHigh();
    expect(fixture.componentInstance.err).toEqual("Price is a number between 0 and 99 999 999, decimal number with ',' or '.'");
  });
  it('onChangeHigh highValue null', () => {
    fixture.componentInstance.rangeForm.controls['highValue'].setValue(null);
    fixture.componentInstance.onChangeHigh();
    expect(fixture.componentInstance.highPrice).toEqual(99999999.0);
  });
  it('onChangeHigh highValue integer', () => {
    fixture.componentInstance.rangeForm.controls['highValue'].setValue("1");
    fixture.componentInstance.onChangeHigh();
    expect(fixture.componentInstance.highPrice).toEqual(1);
  });
  it('onChangeHigh highValue float', () => {
    fixture.componentInstance.rangeForm.controls['highValue'].setValue("1.00000001");
    fixture.componentInstance.onChangeHigh();
    expect(fixture.componentInstance.highPrice).toEqual(1.00000001);
  });
  it('onChangeHigh highValue float with ,', () => {
    fixture.componentInstance.rangeForm.controls['highValue'].setValue("1,00000001");
    fixture.componentInstance.onChangeHigh();
    expect(fixture.componentInstance.highPrice).toEqual(1.00000001);
  });
  it('onChangeLow invalid form', () => {
    fixture.componentInstance.rangeForm.controls['value'].setErrors({'incorrect': true});
    fixture.componentInstance.rangeForm.controls['highValue'].setErrors({'incorrect': true});
    fixture.componentInstance.onChangeLow();
    expect(fixture.componentInstance.err).toEqual("Price is a number between 0 and 99 999 999, decimal number with ',' or '.'");
  });
 it('onChangeLow value null', () => {
    fixture.componentInstance.rangeForm.controls['value'].setValue(null);
    fixture.componentInstance.onChangeLow();
    expect(fixture.componentInstance.lowPrice).toEqual(0.0);
  });
  it('onChangeLow value integer', () => {
    fixture.componentInstance.rangeForm.controls['value'].setValue("1");
    fixture.componentInstance.onChangeLow();
    expect(fixture.componentInstance.lowPrice).toEqual(1);
  });
  it('onChangeLow value float', () => {
    fixture.componentInstance.rangeForm.controls['value'].setValue("1.00000001");
    fixture.componentInstance.onChangeLow();
    expect(fixture.componentInstance.lowPrice).toEqual(1.00000001);
  });
  it('onChangeLow value float with ,', () => {
    fixture.componentInstance.rangeForm.controls['value'].setValue("1,00000001");
    fixture.componentInstance.onChangeLow();
    expect(fixture.componentInstance.lowPrice).toEqual(1.00000001);
  });
  it('add mat autocomplete closed', fakeAsync(() => {
    let nativeChipList = fixture.componentInstance.tagInput.nativeElement;
    typeInElement(nativeChipList, 'test');
    fixture.detectChanges();
    let tags = fixture.componentInstance.tags;
    dispatchFakeEvent(nativeChipList, 'matChipInputTokenEnd');
    fixture.detectChanges();
    tick(4);
    expect(fixture.componentInstance.tags).toEqual(tags)
  }));
  it('add success', fakeAsync(() => {
    let nativeChipList = fixture.componentInstance.tagInput.nativeElement;
    fixture.detectChanges();
    nativeChipList.dispatchEvent(new Event('matChipInputTokenEnd'));
    fixture.detectChanges();
    expect(fixture.componentInstance.tagsControl.value).toBeNull();
    tick(5);
  }));
  it('remove success', (() => {
    fixture.componentInstance.tags.push( new Tag(1, "test"));
    fixture.componentInstance.remove("test");
    expect(fixture.componentInstance.tags.length).toEqual(0);
  }));
  it('remove success', (() => {
    fixture.componentInstance.tags.push( new Tag(1, "test"));
    fixture.componentInstance.remove("test111");
    expect(fixture.componentInstance.tags.length).toEqual(1);
  }));
  it('selected success, already exists', fakeAsync(() => {
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
    let option = fixture.componentInstance.matAutocomplete.options.first;
    fixture.componentInstance.matAutocomplete._emitSelectEvent(option);
    fixture.detectChanges();
    expect(fixture.componentInstance.tags.length).toEqual(1);
    expect(fixture.componentInstance.tagInput.nativeElement.value).toEqual("");
    expect(fixture.componentInstance.tagsControl.value).toEqual(null)
  }));
  it('onMyGifts() success', (() => {
    let giftsService = fixture.debugElement.injector.get(GiftsService);
    fixture.componentInstance.user= new User (1, "username", "password");
    let spy = spyOn(giftsService, "getUserGift").withArgs( "username").and.returnValue( of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));
    fixture.detectChanges();
    fixture.componentInstance.onMyGifts();
    expect(spy).toHaveBeenCalled()
  }));
  it('onMyGifts() failed', (() => {
    let giftsService = fixture.debugElement.injector.get(GiftsService);
    fixture.componentInstance.user= new User (1, "Fail", "password");
    let spy = spyOn(giftsService, "getUserGift").withArgs( "Fail").and.returnValue( throwError('404'));
    fixture.detectChanges();
    fixture.componentInstance.onMyGifts();
    expect(spy).toHaveBeenCalled()
  }));
  it('onAddGift() success', (() => {
    let router = fixture.debugElement.injector.get(Router);
    let spy1 = spyOn(router, "navigate");
    fixture.componentInstance.onAddGift();
    expect(spy1).toHaveBeenCalledWith(["/gift"],  {queryParams: {id: 0}})
  }));
  it('onLogout() success', (() => {
    let userService = fixture.debugElement.injector.get(AuthenticationService);
    let spy = spyOn(userService, "logout");
    fixture.detectChanges();
    fixture.componentInstance.onLogout();
    expect(spy).toHaveBeenCalledWith();
    expect(fixture.componentInstance.user).toBeNull();
  }));
  it('onSubmitTags() problem with price', (() => {
    fixture.componentInstance.value = undefined;
    fixture.componentInstance.highValue = undefined;
    fixture.detectChanges();
    fixture.componentInstance.onSubmitTags();
    expect(fixture.componentInstance.err).toEqual("Problem with price range");
  }));
  it('onSubmitTags() max value must be less than min value', (() => {
    fixture.componentInstance.valueNumber = 2;
    fixture.componentInstance.highValueNumber = 1;
    fixture.detectChanges();
    fixture.componentInstance.onSubmitTags();
    expect(fixture.componentInstance.err).toEqual("Max value must be less than min value");
  }));
  it('onSubmitTags() isMyGift true', (() => {
    fixture.componentInstance.isMyGift = true;
    fixture.componentInstance.user= new User (1, "username", "password");
    let giftsService = fixture.debugElement.injector.get(GiftsService);
    let spy = spyOn(giftsService, "getGifts").and.returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));
    fixture.detectChanges();
    fixture.componentInstance.onSubmitTags();
    expect(spy).toHaveBeenCalled()
  }));
  it('onSubmitTags() isMyGift true failed', (() => {
    fixture.componentInstance.isMyGift = true;
    fixture.componentInstance.user= new User (1, "username", "password");
    let giftsService = fixture.debugElement.injector.get(GiftsService);
    let spy = spyOn(giftsService, "getGifts").and.returnValue(throwError('404'));
    fixture.detectChanges();
    fixture.componentInstance.onSubmitTags();
    expect(spy).toHaveBeenCalled()
  }));
  it('onSubmitTags() isMyGift false failed', (() => {
    let giftsService = fixture.debugElement.injector.get(GiftsService);
    let spy = spyOn(giftsService, "getGifts").and.returnValue(throwError('404'));
    fixture.detectChanges();
    fixture.componentInstance.onSubmitTags();
    expect(spy).toHaveBeenCalled()
  }));
  it('onSubmitTags() isMyGift false success', (() => {
    let giftsService = fixture.debugElement.injector.get(GiftsService);
    let spy = spyOn(giftsService, "getGifts").and.returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));
    fixture.detectChanges();
    fixture.componentInstance.onSubmitTags();
    expect(spy).toHaveBeenCalled()
  }));
  it('onSubmit() problem with price', (() => {
    fixture.componentInstance.value = undefined;
    fixture.componentInstance.highValue = undefined;
    fixture.detectChanges();
    fixture.componentInstance.onSubmit(fixture.componentInstance.pageEvent);
    expect(fixture.componentInstance.err).toEqual("Problem with price range");
  }));
  it('onSubmit() max value must be less than min value', (() => {
    fixture.componentInstance.valueNumber = 2;
    fixture.componentInstance.highValueNumber = 1;
    fixture.detectChanges();
    fixture.componentInstance.onSubmit(fixture.componentInstance.pageEvent);
    expect(fixture.componentInstance.err).toEqual("Max value must be less than min value");
  }));
  it('onSubmit() isMyGift true', (() => {
    fixture.componentInstance.isMyGift = true;
    fixture.componentInstance.pageEvent = new PageEvent();
    fixture.componentInstance.user= new User (1, "username", "password");
    let giftsService = fixture.debugElement.injector.get(GiftsService);
    let spy = spyOn(giftsService, "getGifts").and.returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));
    fixture.detectChanges();
    fixture.componentInstance.onSubmit(fixture.componentInstance.pageEvent);
    expect(spy).toHaveBeenCalled()
  }));
  it('onSubmit() isMyGift true failed', (() => {
    fixture.componentInstance.isMyGift = true;
    fixture.componentInstance.pageEvent = new PageEvent();
    fixture.componentInstance.user= new User (1, "username", "password");
    let giftsService = fixture.debugElement.injector.get(GiftsService);
    let spy = spyOn(giftsService, "getGifts").and.returnValue(throwError('404'));
    fixture.detectChanges();
    fixture.componentInstance.onSubmit(fixture.componentInstance.pageEvent);
    expect(spy).toHaveBeenCalled()
  }));
  it('onSubmit() isMyGift false failed', (() => {
    let giftsService = fixture.debugElement.injector.get(GiftsService);
    fixture.componentInstance.pageEvent = new PageEvent();
    let spy = spyOn(giftsService, "getGifts").and.returnValue(throwError('404'));
    fixture.detectChanges();
    fixture.componentInstance.onSubmit(fixture.componentInstance.pageEvent);
    expect(spy).toHaveBeenCalled()
  }));
  it('onSubmit() isMyGift false success', (() => {
    let giftsService = fixture.debugElement.injector.get(GiftsService);
    fixture.componentInstance.pageEvent = new PageEvent();
    let spy = spyOn(giftsService, "getGifts").and.returnValue(of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)]));
    fixture.detectChanges();
    fixture.componentInstance.onSubmit(fixture.componentInstance.pageEvent);
    expect(spy).toHaveBeenCalled()
  }));
  it('onLogin() success', (() => {
    let router = fixture.debugElement.injector.get(Router);
    let spy1 = spyOn(router, "navigate");
    fixture.componentInstance.onLogin();
    expect(spy1).toHaveBeenCalledWith(["/login"]);
  }));
  it('onReset() success', (() => {
    fixture.componentInstance.onReset();
    expect(fixture.componentInstance.highValueNumber).toEqual(99999999.0);
    expect(fixture.componentInstance.valueNumber).toEqual(0.0);
    expect(fixture.componentInstance.tags).toEqual([]);
    expect(fixture.componentInstance.sort).toEqual("no");
    expect(fixture.componentInstance.value).toEqual("0");
    expect(fixture.componentInstance.highValue).toEqual("99999999");
    expect(fixture.componentInstance.lowPrice).toEqual(0.0);
    expect(fixture.componentInstance.highPrice).toEqual(99999999.0);
  }));
  it('onChangeValue() success', (() => {
    fixture.componentInstance.highPrice = 999;
    fixture.componentInstance.lowPrice = 1;
    fixture.detectChanges();
    fixture.componentInstance.onChangeValue();
    expect(fixture.componentInstance.value).toEqual("1");
    expect(fixture.componentInstance.highValue).toEqual("999");
  }));
});

class GiftServiceStub {
  getAll() {
    let gift = new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000);
    return of([gift])
  }
  getUserGift(username: string) {
    if (username === "Fail") {
      throwError('404')
    }
    return of([new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000)])
  }
  getGifts(tags: string[], username: string, from, to: number, sort: string){
    let gift = new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000);
    return of([gift])
  }

}

class TagsServiceStub {
  getList() {
    return  of ([ new Tag(1, "test")])
  }
}
