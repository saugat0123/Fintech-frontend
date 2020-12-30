import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateGteeComponent } from './corporate-gtee.component';

describe('CorporateGteeComponent', () => {
  let component: CorporateGteeComponent;
  let fixture: ComponentFixture<CorporateGteeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporateGteeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateGteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
