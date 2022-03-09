import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NrbStatutoryRemarksStatusComponent } from './nrb-statutory-remarks-status.component';

describe('NrbStatutoryRemarksStatusComponent', () => {
  let component: NrbStatutoryRemarksStatusComponent;
  let fixture: ComponentFixture<NrbStatutoryRemarksStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NrbStatutoryRemarksStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NrbStatutoryRemarksStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
