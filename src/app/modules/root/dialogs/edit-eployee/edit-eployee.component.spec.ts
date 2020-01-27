import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEployeeComponent } from './edit-eployee.component';

describe('EditEployeeComponent', () => {
  let component: EditEployeeComponent;
  let fixture: ComponentFixture<EditEployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
