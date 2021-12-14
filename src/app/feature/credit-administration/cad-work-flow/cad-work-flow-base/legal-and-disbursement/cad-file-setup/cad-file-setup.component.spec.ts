import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CadFileSetupComponent } from './cad-file-setup.component';

describe('CadFileSetupComponent', () => {
  let component: CadFileSetupComponent;
  let fixture: ComponentFixture<CadFileSetupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CadFileSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadFileSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
