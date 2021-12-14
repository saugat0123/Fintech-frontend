import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmeComponent } from './sme.component';

describe('SmeComponent', () => {
  let component: SmeComponent;
  let fixture: ComponentFixture<SmeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
