import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgFirmComponent } from './pg-firm.component';

describe('PgFirmComponent', () => {
  let component: PgFirmComponent;
  let fixture: ComponentFixture<PgFirmComponent>;

  beforeEach(async(() => {
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
