import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdslWithoutSubsidyComponent } from './ddsl-without-subsidy.component';

describe('DdslWithoutSubsidyComponent', () => {
  let component: DdslWithoutSubsidyComponent;
  let fixture: ComponentFixture<DdslWithoutSubsidyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdslWithoutSubsidyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdslWithoutSubsidyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
