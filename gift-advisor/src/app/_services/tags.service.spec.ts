import { TestBed } from '@angular/core/testing';

import { TagsService } from './tags.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('TagsService', () => {
  let service: TagsService;
  let httpMock: HttpTestingController;
  beforeEach(() =>{
    TestBed.configureTestingModule({
      providers: [TagsService],
      imports: [HttpClientTestingModule]
    });
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(TagsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('getList() should return success', () => {
    service.getList().subscribe(data => {
      expect(data).toBe( [ ({ id: 1, name: 'tag',})]);
    });

    const req = httpMock.expectOne('http://10.0.2.15:30163/tags');
    expect(req.request.method).toBe('GET');
  });
});
