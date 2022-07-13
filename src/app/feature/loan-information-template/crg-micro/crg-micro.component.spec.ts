import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrgMicroComponent } from './crg-micro.component';

describe('CrgMicroComponent', () => {
  let component: CrgMicroComponent;
  let fixture: ComponentFixture<CrgMicroComponent>;

  beforeEach(async(() => {
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
