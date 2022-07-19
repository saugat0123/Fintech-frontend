import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NetTradingAssets} from '../../admin/modal/NetTradingAssets';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {FiscalYearService} from '../../admin/service/fiscal-year.service';
import {FiscalYear} from '../../admin/modal/FiscalYear';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {CalendarType} from '../../../@core/model/calendar-type';
import {Editor} from '../../../@core/utils/constants/editor';

@Component({
    selector: 'app-net-trading-assets',
    templateUrl: './net-trading-assets.component.html',
    styleUrls: ['./net-trading-assets.component.scss']
})
export class NetTradingAssetsComponent implements OnInit {
    @Input() netTradingAssetsData?: NetTradingAssets;
    @Input() fromProfile: boolean;
    @Output() netTradingAssetsEventEmitter = new EventEmitter();

    currentYearIndex = 0;
    selectedIndex = 0;

    calendarType = CalendarType.AD;

    quarterCalculationObject = {
        q1: undefined,
        q2: undefined,
        q3: undefined,
        q4: undefined,
        average: undefined
    };

    ntaTradingObject = {
        yearlyWorkingCapital: undefined,
        periodicWorkingCapital: undefined,
        justificationField: undefined,
        currentAssets: undefined,
        remarks: undefined
    };

    netTradingAssetSubmitData: NetTradingAssets = new NetTradingAssets();
    parentForm: FormGroup;
    netTradingAssetsFormArray: FormArray;
    fiscalYearArray = new Array<FiscalYear>();
    ntaTrading;
    submitted = false;
    ntaConfig = Editor.CK_CONFIG;
    parsedNtaData;
    currentAssetsTable = `<div> </div><table border=\"1\" cellspacing=\"0\" style=\"border-collapse:collapse; width:912px\"><tbody><tr><td style=\"background-color:white; border-color:black; border-style:solid; border-width:1px; height:17px; vertical-align:middle; white-space:normal; width:422px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Date of verification</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; vertical-align:middle; white-space:normal; width:290px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Auditor name</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; vertical-align:middle; white-space:normal; width:190px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">UDIN No.</span></strong></span></span></td></tr><tr><td style=\"background-color:white; border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:17px; vertical-align:middle; white-space:normal; width:422px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:290px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:190px\"> </td></tr></tbody></table>`;
    yearlyWorkingCapitalTable = `<div> </div><table border=\"1\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-collapse:collapse; width:1298px\"><tbody><tr><td style=\"background-color:white; border-color:black; border-style:solid; border-width:1px; height:17px; text-align:center; vertical-align:middle; white-space:nowrap; width:563px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Financial Year  -------></span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:156px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">FY</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:115px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">FY</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:101px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">FY</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:126px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">FY</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:124px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">FY</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:64px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">FY</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:37px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">FY</span></strong></span></span></td></tr><tr><td style=\"background-color:white; border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:34px; text-align:center; vertical-align:middle; white-space:nowrap; width:563px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Particulars</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; text-align:center; vertical-align:middle; white-space:normal; width:156px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Audited</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; text-align:center; vertical-align:middle; white-space:normal; width:115px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Audited</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; text-align:center; vertical-align:middle; white-space:normal; width:101px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Audited</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; text-align:center; vertical-align:middle; white-space:normal; width:126px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Provisional / Simulated</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; text-align:center; vertical-align:middle; white-space:nowrap; width:124px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Projected</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; text-align:center; vertical-align:middle; white-space:nowrap\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Projected</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; text-align:center; vertical-align:middle; white-space:nowrap; width:37px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Projected</span></strong></span></span></td></tr><tr><td style=\"background-color:white; border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:17px; vertical-align:middle; white-space:nowrap; width:563px\"><span style=\"font-size:13px\"><span style=\"color:black\"><span style=\"font-family:Cambria,serif\">Inventories </span></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:156px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:115px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:101px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:126px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:124px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:64px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:37px\"> </td></tr><tr><td style=\"background-color:white; border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:17px; vertical-align:middle; white-space:nowrap; width:563px\"><span style=\"font-size:13px\"><span style=\"color:black\"><span style=\"font-family:Cambria,serif\">Receivables </span></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:156px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:115px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:101px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:126px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:124px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:64px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:37px\"> </td></tr><tr><td style=\"background-color:white; border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:17px; vertical-align:middle; white-space:nowrap; width:563px\"><span style=\"font-size:13px\"><span style=\"color:black\"><span style=\"font-family:Cambria,serif\">Loans & Advances </span></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:156px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:115px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:101px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:126px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:124px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:64px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:37px\"> </td></tr><tr><td style=\"background-color:white; border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:17px; vertical-align:middle; white-space:nowrap; width:563px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Total </span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:156px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:115px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:101px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:126px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:124px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:64px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:37px\"> </td></tr><tr><td style=\"background-color:white; border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:17px; vertical-align:middle; white-space:nowrap; width:563px\"><span style=\"font-size:13px\"><span style=\"color:black\"><span style=\"font-family:Cambria,serif\">Less: Trade Payables </span></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:156px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:115px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:101px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:126px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:124px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:64px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:37px\"> </td></tr><tr><td style=\"background-color:white; border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:17px; vertical-align:middle; white-space:nowrap; width:563px\"><span style=\"font-size:13px\"><span style=\"color:black\"><span style=\"font-family:Cambria,serif\">Less: Other Current Liabilities</span></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:156px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:115px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:101px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:126px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:124px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:64px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:37px\"> </td></tr><tr><td style=\"background-color:white; border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:17px; vertical-align:middle; white-space:nowrap; width:563px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Deficit/Surplus </span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:156px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:115px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:101px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:126px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:124px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:64px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:37px\"> </td></tr><tr><td style=\"background-color:white; border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:17px; vertical-align:middle; white-space:nowrap; width:563px\"><span style=\"font-size:13px\"><span style=\"color:black\"><span style=\"font-family:Cambria,serif\">Bank Financing - LxBL</span></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:156px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:115px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:101px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:126px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:124px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:64px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:37px\"> </td></tr><tr><td style=\"background-color:white; border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:17px; vertical-align:middle; white-space:nowrap; width:563px\"><span style=\"font-size:13px\"><span style=\"color:black\"><span style=\"font-family:Cambria,serif\">Bank Financing - others</span></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:156px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:115px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:101px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:126px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:124px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:64px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:37px\"> </td></tr><tr><td style=\"background-color:white; border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:17px; vertical-align:middle; white-space:nowrap; width:563px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Financing %</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:156px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:115px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:101px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:126px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:124px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:64px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:37px\"> </td></tr></tbody></table><p> <p> </p></p>`;
    periodicWorkingCapitalTable = `<p> </p><table border=\"1\" cellspacing=\"0\" style=\"border-collapse:collapse; width:1305px\"><tbody><tr><td style=\"background-color:white; border-color:black; border-style:solid; border-width:1px; height:17px; text-align:center; vertical-align:middle; white-space:nowrap; width:167px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Quarter/Month  -------></span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:86px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Q1/M1</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:93px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Q1/M1</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:92px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Q1/M1</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:79px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Q1/M1</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:84px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Q1/M1</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:91px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Q1/M1</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:99px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Q1/M1</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:91px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Q1/M1</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:118px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Q1/M1</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:94px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Q1/M1</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:81px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Q1/M1</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:1px solid black; text-align:center; vertical-align:middle; white-space:normal; width:83px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Q1/M1</span></strong></span></span></td></tr><tr><td style=\"background-color:white; border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:17px; vertical-align:middle; white-space:nowrap; width:167px\"><span style=\"font-size:13px\"><span style=\"color:black\"><span style=\"font-family:Cambria,serif\">Inventories </span></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:86px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:93px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:92px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:79px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:84px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:91px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:99px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:91px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:118px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:94px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:81px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:83px\"> </td></tr><tr><td style=\"background-color:white; border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:17px; vertical-align:middle; white-space:nowrap; width:167px\"><span style=\"font-size:13px\"><span style=\"color:black\"><span style=\"font-family:Cambria,serif\">Receivables </span></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:86px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:93px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:92px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:79px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:84px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:91px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:99px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:91px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:118px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:94px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:81px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:83px\"> </td></tr><tr><td style=\"background-color:white; border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:17px; vertical-align:middle; white-space:nowrap; width:167px\"><span style=\"font-size:13px\"><span style=\"color:black\"><span style=\"font-family:Cambria,serif\">Loans & Advances </span></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:86px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:93px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:92px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:79px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:84px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:91px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:99px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:91px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:118px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:94px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:81px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:83px\"> </td></tr><tr><td style=\"background-color:white; border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:17px; vertical-align:middle; white-space:nowrap; width:167px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Total </span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:86px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:93px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:92px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:79px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:84px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:91px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:99px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:91px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:118px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:94px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:81px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:83px\"> </td></tr><tr><td style=\"background-color:white; border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:17px; vertical-align:middle; white-space:nowrap; width:167px\"><span style=\"font-size:13px\"><span style=\"color:black\"><span style=\"font-family:Cambria,serif\">Less: Trade Payables </span></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:86px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:93px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:92px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:79px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:84px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:91px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:99px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:91px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:118px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:94px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:81px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:83px\"> </td></tr><tr><td style=\"background-color:white; border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:17px; vertical-align:middle; white-space:nowrap; width:167px\"><span style=\"font-size:13px\"><span style=\"color:black\"><span style=\"font-family:Cambria,serif\">Less: Other Current Liabilities</span></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:86px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:93px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:92px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:79px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:84px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:91px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:99px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:91px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:118px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:94px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:81px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:83px\"> </td></tr><tr><td style=\"background-color:white; border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:17px; vertical-align:middle; white-space:nowrap; width:167px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Deficit/Surplus </span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:86px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:93px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:92px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:79px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:84px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:91px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:99px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:91px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:118px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:94px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:81px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:83px\"> </td></tr><tr><td style=\"background-color:white; border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:17px; vertical-align:middle; white-space:nowrap; width:167px\"><span style=\"font-size:13px\"><span style=\"color:black\"><span style=\"font-family:Cambria,serif\">Bank Financing - LxBL</span></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:86px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:93px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:92px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:79px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:84px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:91px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:99px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:91px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:118px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:94px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:81px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:83px\"> </td></tr><tr><td style=\"background-color:white; border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:17px; vertical-align:middle; white-space:nowrap; width:167px\"><span style=\"font-size:13px\"><span style=\"color:black\"><span style=\"font-family:Cambria,serif\">Bank Financing - others</span></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:86px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:93px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:92px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:79px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:84px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:91px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:99px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:91px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:118px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:94px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:81px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:83px\"> </td></tr><tr><td style=\"background-color:white; border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:17px; vertical-align:middle; white-space:nowrap; width:167px\"><span style=\"font-size:13px\"><span style=\"color:black\"><strong><span style=\"font-family:Cambria,serif\">Financing %</span></strong></span></span></td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:middle; white-space:normal; width:86px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:93px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:92px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:79px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:84px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:91px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:99px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:91px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:118px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:94px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:81px\"> </td><td style=\"background-color:white; border-bottom:1px solid black; border-left:none; border-right:1px solid black; border-top:none; vertical-align:top; white-space:normal; width:83px\"> </td></tr></tbody></table>`;
    spinner = false;

    constructor(protected formBuilder: FormBuilder,
                protected fiscalYearService: FiscalYearService,
                protected toastService: ToastService) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.netTradingAssetsData)) {
            this.parsedNtaData = JSON.parse(this.netTradingAssetsData.data);
        }
        if (!ObjectUtil.isEmpty(this.parsedNtaData)) {
            this.ntaTrading = true;
            this.setNta(this.parsedNtaData);
        } else {
            this. fillTable();
        }
        // this.netTradingAssetsFormArray = this.parentForm.get('netTradingAssetsFormArray') as FormArray;
        // this.getFiscalYears();
    }

    buildForm() {
        this.parentForm = this.formBuilder.group({
            yearlyWorkingCapital: [undefined],
            periodicWorkingCapital: [undefined],
            justificationField: [undefined],
            currentAssets: [undefined],
            remarks: [undefined],
            checkedBox: [undefined]
        });
    }

    fillTable() {
        this.parentForm.patchValue({
            yearlyWorkingCapital: this.yearlyWorkingCapitalTable,
            periodicWorkingCapital: this.periodicWorkingCapitalTable,
            currentAssets: this.currentAssetsTable,
        });
    }

    setNta(data) {
       // this.parentForm.patchValue(data);
        this.parentForm.patchValue({
            yearlyWorkingCapital: data.yearlyWorkingCapital,
            periodicWorkingCapital: data.periodicWorkingCapital,
            justificationField: data.justificationField,
            currentAssets: data.currentAssets,
            remarks: data.remarks,
            checkedBox:  data.checkedBox
        });
    }

    verifyDataWithFiscalYear(fiscalYearArray: Array<FiscalYear>) {
        if (!ObjectUtil.isEmpty(this.netTradingAssetsData)) {

            const parsedNtaData = JSON.parse(this.netTradingAssetsData.data) as Array<any>;

            const fiscalYearComparisonArray = this.mapObjectToIdArray(fiscalYearArray);
            const parsedNtaDataComparisonArray = this.mapObjectToIdArray(parsedNtaData);

            // check if new year has been added
            const newFiscalArray = fiscalYearComparisonArray.filter(f => {
                return !parsedNtaDataComparisonArray.includes(f);
            });

            // check if a year has been disabled TODO: test-scenario
            const disabledFiscalArray = parsedNtaDataComparisonArray.filter(p => {
                return !fiscalYearComparisonArray.includes(p);
            });

            // add new array --
            if (newFiscalArray.length > 0) {
                newFiscalArray.forEach(v => {
                    parsedNtaData.push({
                        id: v,
                        isCurrentYear: false,
                        valueOfStock: this.formBuilder.group(this.quarterCalculationObject),
                        valueOfDebtors: this.formBuilder.group(this.quarterCalculationObject),
                        valueOfGoodsInTrans: this.formBuilder.group(this.quarterCalculationObject),
                        valueOfCreditors: this.formBuilder.group(this.quarterCalculationObject),
                        netTradingAssetsBefore: this.formBuilder.group(this.quarterCalculationObject),
                        otherBanksFinancing: this.formBuilder.group(this.quarterCalculationObject),
                        netTradingAssetsAfter: this.formBuilder.group(this.quarterCalculationObject),
                        drawingPower: this.formBuilder.group(this.quarterCalculationObject),
                        drawingPowerAmount: this.formBuilder.group(this.quarterCalculationObject),
                        asOnDate: this.formBuilder.group(this.quarterCalculationObject),
                        loanFromUs: this.formBuilder.group(this.quarterCalculationObject),
                        surplusDeficit: this.formBuilder.group(this.quarterCalculationObject)
                    });
                });
            }

            // remove disabled -- TODO: test-scenario
            if (disabledFiscalArray.length > 0) {
                parsedNtaData.forEach((o, i) => {
                    disabledFiscalArray.forEach((vId, j) => {
                        if (Number(o.id) === Number(vId)) {
                            parsedNtaData.splice(i, 1);
                        }
                    });
                });
            }

            // Check current Year --
            parsedNtaData.forEach(pObj => {
                pObj.isCurrentYear = false;
            });
            this.fiscalYearArray.forEach(obj => {
                if (obj.isCurrentYear) {
                    parsedNtaData.some(po => {
                        if (Number(po.id) === Number(obj.id)) {
                            po.isCurrentYear = true;
                            this.currentYearIndex = parsedNtaData.indexOf(po);
                            return true;
                        } else {
                            return false;
                        }
                    });
                }
            });

            parsedNtaData.forEach((v, i) => {
                const formObjectData = {
                    id: v.id,
                    isCurrentYear: v.isCurrentYear,
                    valueOfStock: this.formBuilder.group(this.setNestedFormValues(v.valueOfStock)),
                    valueOfDebtors: this.formBuilder.group(this.setNestedFormValues(v.valueOfDebtors)),
                    valueOfGoodsInTrans: this.formBuilder.group(this.setNestedFormValues(v.valueOfGoodsInTrans)),
                    valueOfCreditors: this.formBuilder.group(this.setNestedFormValues(v.valueOfCreditors)),
                    netTradingAssetsBefore: this.formBuilder.group(this.setNestedFormValues(v.netTradingAssetsBefore)),
                    otherBanksFinancing: this.formBuilder.group(this.setNestedFormValues(v.otherBanksFinancing)),
                    asOnDate: this.formBuilder.group(this.setNestedDateValues(v.asOnDate)),
                    netTradingAssetsAfter: this.formBuilder.group(this.setNestedFormValues(v.netTradingAssetsAfter)),
                    drawingPower: this.formBuilder.group(this.setNestedFormValues(v.drawingPower)),
                    drawingPowerAmount: this.formBuilder.group(this.setNestedFormValues(v.drawingPowerAmount)),
                    loanFromUs: this.formBuilder.group(this.setNestedFormValues(v.loanFromUs)),
                    surplusDeficit: this.formBuilder.group(this.setNestedFormValues(v.surplusDeficit))
                };
                this.netTradingAssetsFormArray.push(
                    this.formBuilder.group(formObjectData)
                );
                if (v.isCurrentYear) {
                    this.currentYearIndex = parsedNtaData.indexOf(v);
                    this.selectedIndex = this.currentYearIndex;
                }
            });

        } else {
            this.fiscalYearArray.forEach(fiscalYearObj => {
                const formObjectData = {
                    id: fiscalYearObj.id,
                    isCurrentYear: fiscalYearObj.isCurrentYear,
                    valueOfStock: this.formBuilder.group(this.quarterCalculationObject),
                    valueOfDebtors: this.formBuilder.group(this.quarterCalculationObject),
                    valueOfGoodsInTrans: this.formBuilder.group(this.quarterCalculationObject),
                    valueOfCreditors: this.formBuilder.group(this.quarterCalculationObject),
                    netTradingAssetsBefore: this.formBuilder.group(this.quarterCalculationObject),
                    otherBanksFinancing: this.formBuilder.group(this.quarterCalculationObject),
                    asOnDate: this.formBuilder.group(this.quarterCalculationObject),
                    netTradingAssetsAfter: this.formBuilder.group(this.quarterCalculationObject),
                    drawingPower: this.formBuilder.group(this.quarterCalculationObject),
                    drawingPowerAmount: this.formBuilder.group(this.quarterCalculationObject),
                    loanFromUs: this.formBuilder.group(this.quarterCalculationObject),
                    surplusDeficit: this.formBuilder.group(this.quarterCalculationObject),
                };
                this.netTradingAssetsFormArray.push(this.formBuilder.group(formObjectData));
                if (fiscalYearObj.isCurrentYear) {
                    this.currentYearIndex = this.fiscalYearArray.indexOf(fiscalYearObj);
                    this.selectedIndex = this.currentYearIndex;
                }
            });
        }
    }

    getFiscalYears() {
        this.spinner = true;
        this.fiscalYearService.getAll().subscribe(response => {
            this.fiscalYearArray = response.detail;
            this.verifyDataWithFiscalYear(this.fiscalYearArray);
            this.spinner = false;
        }, error => {
            console.log(error);
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load Fiscal Year!'));
        });
    }

    setNestedFormValues(param) {
        if (param) {
            return {
                q1: param.q1,
                q2: param.q2,
                q3: param.q3,
                q4: param.q4,
                average: param.average
            };
        } else {
            return this.quarterCalculationObject;
        }
    }

    // setNtaTradingValues(param) {
    //     if (param) {
    //         return {
    //             yearlyWorkingCapital: param.yearlyWorkingCapital,
    //             periodicWorkingCapital: param.periodicWorkingCapital,
    //             justificationField: param.justificationField,
    //             currentAssets: param.currentAssets,
    //             remarks: param.remarks
    //         };
    //     } else {
    //         return this.ntaTradingObject;
    //     }
    // }

    setNestedDateValues(param) {
        return {
            q1: ObjectUtil.isEmpty(param.q1) ? param.q1 : new Date(param.q1),
            q2: ObjectUtil.isEmpty(param.q2) ? param.q2 : new Date(param.q2),
            q3: ObjectUtil.isEmpty(param.q3) ? param.q3 : new Date(param.q3),
            q4: ObjectUtil.isEmpty(param.q4) ? param.q4 : new Date(param.q4),
            average: ObjectUtil.isEmpty(param.average) ? param.average : new Date(param.average)
        };
    }

    mapObjectToIdArray(objectArray: Array<any>): Array<any> {
        return objectArray.map(o => {
            return o.id;
        });
    }

    calculateNta(ntaFormGroup, header, q) {
        this.calculateNtaBefore(ntaFormGroup, q);
        this.calculateNtaAfter(ntaFormGroup, q);
        this.calculateAverage(ntaFormGroup, header);
        this.calculateAverage(ntaFormGroup, 'netTradingAssetsBefore');
        this.calculateAverage(ntaFormGroup, 'netTradingAssetsAfter');
        this.calculateAverage(ntaFormGroup, 'drawingPowerAmount');
        this.calculateAverage(ntaFormGroup, 'surplusDeficit');
    }

    calculateAverage(ntaFormGroup, header) {
        let elementsArray = [
            ntaFormGroup.get([header, 'q1']).value,
            ntaFormGroup.get([header, 'q2']).value,
            ntaFormGroup.get([header, 'q3']).value,
            ntaFormGroup.get([header, 'q4']).value,
        ];
        elementsArray = elementsArray.filter(e => {
            return !ObjectUtil.isEmpty(e);
        });
        ntaFormGroup.get([header, 'average'])
            .patchValue((Number(elementsArray.reduce((x, y) => x + y, 0) / elementsArray.length).toFixed(2))
        );
    }

    calculateNtaBefore(ntaFormGroup, quarter) {
        ntaFormGroup.get(['netTradingAssetsBefore', quarter]).patchValue(
            Number(ntaFormGroup.get(['valueOfDebtors', quarter]).value) +
            Number(ntaFormGroup.get(['valueOfStock', quarter]).value) +
            Number(ntaFormGroup.get(['valueOfGoodsInTrans', quarter]).value) -
            Number(ntaFormGroup.get(['valueOfCreditors', quarter]).value)
        );
    }

    calculateNtaAfter(ntaFormGroup, quarter) {
        ntaFormGroup.get(['netTradingAssetsAfter', quarter]).patchValue(
            Number(ntaFormGroup.get(['valueOfStock', quarter]).value) +
            Number(ntaFormGroup.get(['valueOfDebtors', quarter]).value) +
            Number(ntaFormGroup.get(['valueOfGoodsInTrans', quarter]).value) -
            Number(ntaFormGroup.get(['valueOfCreditors', quarter]).value) -
            Number(ntaFormGroup.get(['otherBanksFinancing', quarter]).value)
        );
        ntaFormGroup.get(['drawingPowerAmount', quarter]).patchValue(
            Number(ntaFormGroup.get(['netTradingAssetsAfter', quarter]).value) *
            Number(ntaFormGroup.get(['drawingPower', quarter]).value) / 100);

        ntaFormGroup.get(['surplusDeficit', quarter]).patchValue(
            Number(ntaFormGroup.get(['drawingPowerAmount', quarter]).value) -
            Number(ntaFormGroup.get(['loanFromUs', quarter]).value));
    }

    onChangeFiscalYear(selectedFiscalYearObj) {
        this.spinner = true;
        this.netTradingAssetsFormArray.controls.forEach(singleControl => {
            if (Number(selectedFiscalYearObj.id) === Number(singleControl.value.id)) {
                this.selectedIndex = this.netTradingAssetsFormArray.controls.indexOf(singleControl);
            }
        });
        this.spinner = false;
    }

    onSubmit() {
        if (!ObjectUtil.isEmpty(this.netTradingAssetsData)) {
            this.netTradingAssetSubmitData = this.netTradingAssetsData;
        }
        // const tempNet = {
        //     // netTradingAssetsFormArray: this.netTradingAssetsFormArray.value,
        //     ntaTrading: this.parentForm.value.ntaTrading
        // };
        this.netTradingAssetSubmitData.data = JSON.stringify(this.parentForm.value);
        this.netTradingAssetsEventEmitter.emit(this.netTradingAssetSubmitData);
    }
    public ntaCheckBox(ciclChk) {
        if (!ciclChk) {
            this.ntaTrading = false;
        } else {
            this.ntaTrading = true;
        }
    }


}
