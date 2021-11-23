import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateGuranteeComponent } from './corporate-gurantee.component';

describe('CorporateGuranteeComponent', () => {
  let component: CorporateGuranteeComponent;
  let fixture: ComponentFixture<CorporateGuranteeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporateGuranteeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateGuranteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
