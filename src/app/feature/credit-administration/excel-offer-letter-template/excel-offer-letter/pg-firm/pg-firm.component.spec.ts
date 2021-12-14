import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PgFirmComponent } from './pg-firm.component';

describe('PgFirmComponent', () => {
  let component: PgFirmComponent;
  let fixture: ComponentFixture<PgFirmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PgFirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgFirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
