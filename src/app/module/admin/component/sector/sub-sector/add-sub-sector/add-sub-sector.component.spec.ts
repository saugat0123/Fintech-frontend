import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubSectorComponent } from './add-sub-sector.component';

describe('AddSubSectorComponent', () => {
  let component: AddSubSectorComponent;
  let fixture: ComponentFixture<AddSubSectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSubSectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
