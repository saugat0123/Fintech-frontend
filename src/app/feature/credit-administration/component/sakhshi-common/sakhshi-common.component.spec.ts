import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SakhshiCommonComponent } from './sakhshi-common.component';

describe('SakhshiCommonComponent', () => {
  let component: SakhshiCommonComponent;
  let fixture: ComponentFixture<SakhshiCommonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SakhshiCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SakhshiCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
