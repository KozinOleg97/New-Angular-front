import { TestBed } from '@angular/core/testing';

import { EditDataService } from './edit-data.service';

describe('EditDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditDataService = TestBed.get(EditDataService);
    expect(service).toBeTruthy();
  });
});
