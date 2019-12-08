import { TestBed } from '@angular/core/testing';

import { PopularityService } from './popularity.service';

describe('PopularityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PopularityService = TestBed.get(PopularityService);
    expect(service).toBeTruthy();
  });
});
