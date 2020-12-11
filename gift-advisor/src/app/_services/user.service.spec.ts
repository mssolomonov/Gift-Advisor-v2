import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {User} from "../_model/user";

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService],
      imports: [HttpClientTestingModule]
    });
      service = TestBed.get(UserService);
      httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the mocked data in the subscribe', () => {
    service.register(new User( 0,'username', 'password')).subscribe(data => {
      expect(data).toBe( [ ({ id: 1, username: 'username', password: 'password' })]);
    });

    const req = httpMock.expectOne('http://10.0.2.15:30163/users/reg');
    expect(req.request.method).toBe('POST');

  });
});
