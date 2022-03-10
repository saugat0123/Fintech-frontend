import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboveSecurityArrangementComponent } from './above-security-arrangement.component';

describe('AboveSecurityArrangementComponent', () => {
  let component: AboveSecurityArrangementComponent;
  let fixture: ComponentFixture<AboveSecurityArrangementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboveSecurityArrangementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboveSecurityArrangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
