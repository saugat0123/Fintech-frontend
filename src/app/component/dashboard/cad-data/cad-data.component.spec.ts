import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadDataComponent } from './cad-data.component';

describe('CadDataComponent', () => {
  let component: CadDataComponent;
  let fixture: ComponentFixture<CadDataComponent>;

  beforeEach(async(() => {
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
