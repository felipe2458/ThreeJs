import { TestBed } from '@angular/core/testing';

import { IsActiveHeaderService } from './is-active-header.service';

describe('IsActiveHeaderService', () => {
  let service: IsActiveHeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsActiveHeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
