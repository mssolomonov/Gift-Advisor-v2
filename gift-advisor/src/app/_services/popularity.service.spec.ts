import { TestBed } from '@angular/core/testing';

import { PopularityService } from './popularity.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('PopularityService', () => {
  let service: PopularityService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
      TestBed.configureTestingModule({
      providers: [PopularityService],
      imports: [HttpClientTestingModule]
    });
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(PopularityService);
  });

  it('should be created', () => {
    const service: PopularityService = TestBed.get(PopularityService);
    expect(service).toBeTruthy();
  });
  it('saveCount() should return success', () => {
    service.saveCount(1).subscribe(data => {
      expect(data).toBe( "success");
    });

    const req = httpMock.expectOne('http://10.0.2.15:30163/popularity/1');
    expect(req.request.method).toBe('POST');
    req.flush("success")
  });
});
