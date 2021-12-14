import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MicroInstitutionComponent } from './micro-institution.component';

describe('MicroInstitutionComponent', () => {
  let component: MicroInstitutionComponent;
  let fixture: ComponentFixture<MicroInstitutionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroInstitutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
