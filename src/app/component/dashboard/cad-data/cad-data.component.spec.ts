import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CadDataComponent } from './cad-data.component';

describe('CadDataComponent', () => {
  let component: CadDataComponent;
  let fixture: ComponentFixture<CadDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CadDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
