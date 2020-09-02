import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSwotComponent } from './edit-swot.component';

describe('EditSwotComponent', () => {
  let component: EditSwotComponent;
  let fixture: ComponentFixture<EditSwotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSwotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSwotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
