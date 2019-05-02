import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeSelectComponent } from './scheme-select.component';

describe('SchemeSelectComponent', () => {
  let component: SchemeSelectComponent;
  let fixture: ComponentFixture<SchemeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemeSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
