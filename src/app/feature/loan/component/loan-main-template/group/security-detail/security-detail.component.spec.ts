import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SecurityDetailComponent } from './security-detail.component';

describe('SecurityDetailComponent', () => {
  let component: SecurityDetailComponent;
  let fixture: ComponentFixture<SecurityDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
