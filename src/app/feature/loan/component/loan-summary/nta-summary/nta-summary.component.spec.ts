import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NtaSummaryComponent } from './nta-summary.component';

describe('NtaSummaryComponent', () => {
  let component: NtaSummaryComponent;
  let fixture: ComponentFixture<NtaSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NtaSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NtaSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
