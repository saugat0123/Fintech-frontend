import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailGlobalContentComponent } from './retail-global-content.component';

describe('RetailGlobalContentComponent', () => {
  let component: RetailGlobalContentComponent;
  let fixture: ComponentFixture<RetailGlobalContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailGlobalContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailGlobalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
