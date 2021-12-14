import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HpDeedCorporateComponent } from './hp-deed-corporate.component';

describe('HpDeedCorporateComponent', () => {
  let component: HpDeedCorporateComponent;
  let fixture: ComponentFixture<HpDeedCorporateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HpDeedCorporateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpDeedCorporateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
