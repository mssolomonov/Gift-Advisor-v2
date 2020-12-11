import { TestBed } from '@angular/core/testing';

import { ImageService } from './image.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('ImageService', () => {
  let service: ImageService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageService],
      imports: [HttpClientTestingModule]
    });
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(ImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('saveCount() should return success', () => {
    const file = new File(['sample'], 'sample.txt', { type: 'image/jpg' });
    service.saveImage(file, "1").subscribe(data => {
      expect(data).toBe( "success");
    });

    const req = httpMock.expectOne(req => req.method ==='POST' && req.url ==='http://10.0.2.15:30163/image');
    expect(req.request.method).toBe('POST');
    expect(req.request.params.has('id')).toBeTruthy();
  });
});
