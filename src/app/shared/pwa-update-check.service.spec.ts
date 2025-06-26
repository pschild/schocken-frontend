import { TestBed } from '@angular/core/testing';

import { PwaUpdateCheckService } from './pwa-update-check.service';

describe('PwaUpdateCheckService', () => {
  let service: PwaUpdateCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PwaUpdateCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
