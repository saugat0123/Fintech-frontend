import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CrgMicroComponent } from './crg-micro.component';

describe('CrgMicroComponent', () => {
  let component: CrgMicroComponent;
  let fixture: ComponentFixture<CrgMicroComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CrgMicroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrgMicroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
