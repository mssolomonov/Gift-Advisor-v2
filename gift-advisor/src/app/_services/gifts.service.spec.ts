import { TestBed } from '@angular/core/testing';

import { GiftsService } from './gifts.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Gift} from "../_model/gift";
import {User} from "../_model/user";

describe('GiftsService', () => {
  let service: GiftsService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GiftsService],
      imports: [HttpClientTestingModule]
    });
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(GiftsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('get() should return success', () => {
    service.get(1).subscribe(data => {
      expect(data).toBe( new Gift( 1, "name","description", new User(1, "username", "password"),
        "image_url",  [], 1));
    });

    const req = httpMock.expectOne('http://10.0.2.15:30163/gift/1');
    expect(req.request.method).toBe('GET');

  });

  it('add() should return success', () => {
    service.add(new Gift( 1, "name","description", new User(1, "username", "password"),
      "image_url",  [], 1)).subscribe(data => {
      expect(data).toBe("success");
    });

    const req = httpMock.expectOne('http://10.0.2.15:30163/gift/add');
    expect(req.request.method).toBe('POST');
    req.flush("success")
  });

  it('update() should return success', () => {
    service.update(new Gift( 1, "name","description", new User(1, "username", "password"),
      "image_url",  [], 1)).subscribe(data => {
      expect(data).toBe("success");
    });

    const req = httpMock.expectOne('http://10.0.2.15:30163/gift/update');
    expect(req.request.method).toBe('PUT');
    req.flush("success")
  });
  it('delete() should return success', () => {
    service.delete(1).subscribe(data => {
      expect(data).toBe("success");
    });

    const req = httpMock.expectOne('http://10.0.2.15:30163/gift/1');
    expect(req.request.method).toBe('DELETE');
    req.flush("success")

  });

  it('getUserGift() should return success', () => {
    service.getUserGift("username").subscribe(data => {
      expect(data).toBe([{id: 1, name: "name", description:"description", "id_user": {id:1, username:"username", password: "password"},
        image_url: "image_url", tags: [], price: 1, count: 1}]);
    });

    const req = httpMock.expectOne('http://10.0.2.15:30163/gifts/username');
    expect(req.request.method).toBe('GET');

  });

  it('getUserGift() should return success', () => {
    service.getGifts([], "username", 0, 1, "asc").subscribe(data => {
      expect(data).toBe([{id: 1, name: "name", description:"description", "id_user": {id:1, username:"username", password: "password"},
        image_url: "image_url", tags: [], price: 1, count: 1}]);
    });

    const req = httpMock.expectOne(req => req.method ==='GET' && req.url ==='http://10.0.2.15:30163/gift/search');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get("from")).toBe('0');
    expect(req.request.params.get("to")).toBe('1');
    expect(req.request.params.get("username")).toBe('username');
    expect(req.request.params.get("sort")).toBe('asc');
  });

  it('getAll() should return success', () => {
    service.getAll().subscribe(data => {
      expect(data).toBe([{id: 1, name: "name", description:"description", "id_user": {id:1, username:"username", password: "password"},
        image_url: "image_url", tags: [], price: 1, count: 1}]);
    });

    const req = httpMock.expectOne('http://10.0.2.15:30163/gifts');
    expect(req.request.method).toBe('GET');
  });

});
