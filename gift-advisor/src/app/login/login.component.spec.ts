import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {CustomMaterialModule} from "../core/material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatListModule} from "@angular/material/list";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatInputModule} from "@angular/material/input";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {Router} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {RouterTestingModule} from "@angular/router/testing";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {UserService} from "../_services/user.service";
import {User} from "../_model/user";
import {Gift} from "../_model/gift";
import {GiftsService} from "../_services/gifts.service";
import {of, throwError} from "rxjs";
import {AuthenticationService} from "../_services/authentification.service";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ CustomMaterialModule,
        FormsModule,
        MatChipsModule,
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
        BrowserAnimationsModule],
      providers: [{provide:GiftsService, useClass: GiftServiceStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onRegister invalid form ', () => {
    component.onRegister();
    expect(component.errMsg).toEqual("Invalid form, username size 1-64 character, password 1-64 character");
  });

  it('onRegister userService return success', async() => {
    let userService = fixture.debugElement.injector.get(UserService);
    let authService = fixture.debugElement.injector.get(AuthenticationService);
    spyOn(userService, 'register').withArgs(new Object({username: 'username', password: 'password'})).and.returnValue(of([new User(1, "username", "password")]));
    spyOn(authService, 'login').withArgs( "username", "password").and.returnValue(of([new User(1, "username", "password")]));
    let router = TestBed.get(Router);
    fixture.componentInstance.loginForm.controls['username'].setValue("username");
    fixture.componentInstance.loginForm.controls['password'].setValue("password");
    fixture.detectChanges();
    expect(fixture.componentInstance.f.username.value).toBe('username');
    expect(fixture.componentInstance.f.password.value).toBe('password');
    const navigateSpy = spyOn(router, 'navigate');
    fixture.componentInstance.onRegister();
    expect(fixture.componentInstance.errMsg).toEqual("");
  });

  it('onRegister userService return error', async() => {
    let userService = fixture.debugElement.injector.get(UserService);
    spyOn(userService, 'register').withArgs(new Object({username: 'username', password: 'password'})).and.returnValue(throwError({status: 404}));
    fixture.componentInstance.loginForm.controls['username'].setValue("username");
    fixture.componentInstance.loginForm.controls['password'].setValue("password");
    fixture.detectChanges();
    expect(fixture.componentInstance.f.username.value).toBe('username');
    expect(fixture.componentInstance.f.password.value).toBe('password');

    fixture.componentInstance.onRegister();
    expect(component.errMsg).toEqual("User with this username already exists, please choose another username");
  });
  it('onGift success', async() => {
    let router = TestBed.get(Router);
    fixture.detectChanges();
    const navigateSpy = spyOn(router, 'navigate');
    fixture.componentInstance.onGifts();
    expect(navigateSpy).toHaveBeenCalledWith(['/gifts'])
  });

  it('onSubmit authService return error', async() => {
    let authService = fixture.debugElement.injector.get(AuthenticationService);
    spyOn(authService, 'login').withArgs( "username", "password").and.returnValue(throwError({status: 404}));
    fixture.componentInstance.loginForm.controls['username'].setValue("username");
    fixture.componentInstance.loginForm.controls['password'].setValue("password");
    fixture.detectChanges();
    expect(fixture.componentInstance.f.username.value).toBe('username');
    expect(fixture.componentInstance.f.password.value).toBe('password');

    fixture.componentInstance.onSubmit();
    expect(component.errMsg).toEqual("Could not login because of  wrong credentials");
  });

  it('onSubmit invalid form', async() => {

    fixture.componentInstance.onSubmit();
    expect(component.errMsg).toEqual("Invalid form, username is required, password is required");
  });

});

class GiftServiceStub {
  getAll() {
    let gift = new Gift(1, "name", "description", new User(1, "username", "password"), "image", [], 1000);
    return of([gift])
  }
}

