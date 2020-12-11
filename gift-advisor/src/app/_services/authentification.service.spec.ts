import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentification.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {User} from "../_model/user";

describe('AuthentificationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticationService],
      imports: [HttpClientTestingModule]
    });
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('login() should return success', () => {
    service.login("username", "password").subscribe(data => {
      expect(data).toBe( new User(1, "username", "password"));
    });

    const req = httpMock.expectOne(req => req.method ==='POST' && req.url ==='http://10.0.2.15:30163/user/log');
    expect(req.request.body).toEqual({username: "username", password: "password"});
    expect(service.currentUser).toBeTruthy();
    // expect(localStorage.getItem("currentUser")).toBeTruthy()
  });

  it('login() should return null', () => {
    service.login("username", "password").subscribe(data => {
      expect(data).toBe(null);
    });

    const req = httpMock.expectOne(req => req.method ==='POST' && req.url ==='http://10.0.2.15:30163/user/log');
    expect(req.request.body).toEqual({username: "username", password: "password"});
    expect(service.currentUserValue).toBeFalsy();
    expect(localStorage.getItem("currentUser")).toBeFalsy()
  });

  it('logout() should succeeded', () => {
    service.logout();
    expect(localStorage.getItem("currentUser")).toBeFalsy()
  });
});
