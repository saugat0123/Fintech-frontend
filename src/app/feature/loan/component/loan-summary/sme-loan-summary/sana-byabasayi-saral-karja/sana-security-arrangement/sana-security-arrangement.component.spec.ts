import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SanaSecurityArrangementComponent } from './sana-security-arrangement.component';

describe('SanaSecurityArrangementComponent', () => {
  let component: SanaSecurityArrangementComponent;
  let fixture: ComponentFixture<SanaSecurityArrangementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SanaSecurityArrangementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SanaSecurityArrangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
