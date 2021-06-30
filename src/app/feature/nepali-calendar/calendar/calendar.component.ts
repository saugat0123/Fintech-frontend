import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from '../../admin/component/user/user.service';
import {DatePipe} from '@angular/common';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ResponseEmit} from '../model/responseEmit';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: ' app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  @Input() ePreDate: Date;
  @Output() messageToEmit = new EventEmitter<ResponseEmit>();
  calendarData = [];
  calendarPageData = [];
  totalElement: number;
  totalPage: number;
  monthMapList = [];
  daysInMonthList = [];
  daysInMonthListCustomCalendar = [];
  selectedYear;
  selectedMonth;
  selectedMonthInt;
  selectedDay;
  START_ENGLISH_DAY = 14;
  START_ENGLISH_MONTH = 4;
  START_ENGLISH_YEAR = 1923;
  START_NEPALI_DAY = 1;
  START_NEPALI_MONTH = 1;
  START_NEPALI_YEAR = 1980;
  numberOfDaysPerMonth;
  date: Date;
  eDateRespTonDate;
  nDateRespTonDate;
  outputDate: ResponseEmit = new ResponseEmit();

  calendarDay = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  monthStartDay;
  displayYearShow = false;
  numOfYearTobeDisplay = 20;
  startIndex = 0;
  endIndexBtn = true;
  toggleShow = false;
  emitCounter = 0;

  constructor(private userService: UserService, public datepipe: DatePipe, private modalService: NgbModal, ) {
  }

  ngOnInit() {
    this.getCalendar();

  }

  getCalendar() {
    const storage = LocalStorageUtil.getStorage();
    if (storage.calendar) {
      this.initialize(storage.calendar);
    } else {
      this.userService.getCalendar().subscribe((message: any) => {
        this.initialize(message);
        storage.calendar = message;
        LocalStorageUtil.setStorage(storage);
      });
    }
  }

  initialize(message: any) {
    this.calendarData = message.detail.calendar;
    this.totalElement = this.calendarData.length;
    for (let i = this.startIndex; i < this.numOfYearTobeDisplay; i++) {
      this.calendarPageData.push(this.calendarData[i]);
    }
    this.monthMapList = message.detail.month;
    this.selectedYear = 2076;
    this.selectedMonth = this.monthMapList[0];
    this.selectedDay = 1;
    this.START_NEPALI_YEAR = message.detail.initialDate.startNepaliYear;
    this.START_NEPALI_MONTH = message.detail.initialDate.startNepaliMonth;
    this.START_NEPALI_DAY = message.detail.initialDate.startNepaliDay;
    this.START_ENGLISH_DAY = message.detail.initialDate.startEnglishDay;
    this.START_ENGLISH_MONTH = message.detail.initialDate.startEnglishMonth;
    this.START_ENGLISH_YEAR = message.detail.initialDate.startEnglishYear;
    this.getNumberOfDaysOfMonth(this.selectedMonth);
    this.adToBs();
  }

  paging(type) {
    this.calendarPageData = [];
    if (type === 'prev') {
      this.startIndex = this.startIndex - 20;
      this.numOfYearTobeDisplay = this.numOfYearTobeDisplay - 20;
    } else {
      this.startIndex = this.numOfYearTobeDisplay;
      this.numOfYearTobeDisplay = this.numOfYearTobeDisplay + 20;

    }

    for (let i = this.startIndex; i < this.numOfYearTobeDisplay; i++) {
      if (i < this.totalElement) {
        this.endIndexBtn = true;
        this.calendarPageData.push(this.calendarData[i]);
      } else {
        this.endIndexBtn = false;
      }
    }
  }

  getMonthDaysByYearMonth(value) {
    this.calendarData.forEach(y => {
      if (y.year.toString() === value.toString()) {
        this.selectedYear = value;
        this.daysInMonthList = [];
      }
    });
    if (this.selectedMonthInt && this.selectedDay) {
      this.getEnglishDate();
      this.emitValue();
    }
    if (this.selectedMonth) {
      this.getNumberOfDaysOfMonth(this.selectedMonth);
    }
    this.displayYearShow = false;
  }

  getNumberOfDaysOfMonth(value) {
    this.selectedMonth = value;
    this.daysInMonthListCustomCalendar = [];
    this.calendarData.forEach(y => {
      if ((this.selectedYear.toString() === y.year.toString())) {
        this.daysInMonthList = [];
        let j = 1;
        const monthList = y.monthMap;
        monthList.forEach(m => {
          if ((m.month.toString() === value.toString())) {
            this.selectedMonthInt = j;
            this.monthStartDay = m.englishStartDateOfNepMonth.startDay;
            const index = this.calendarDay.indexOf(this.monthStartDay);
            for (let i = 0; i < index; i++) {
              this.daysInMonthListCustomCalendar.push('');
            }
            this.numberOfDaysPerMonth = m.numberOfDaysPerMonth;
            for (let i = 0; i < m.numberOfDaysPerMonth; i++) {
              this.daysInMonthList.push(i + 1);
              this.daysInMonthListCustomCalendar.push(i + 1);
            }

          }
          j++;
        });
      }
    });
    if (this.selectedYear && this.selectedDay && this.selectedDay <= this.numberOfDaysPerMonth) {
      this.getEnglishDate();
      this.emitValue();
    }
  }

  selectedCalendar(value) {
    this.selectedDay = value;
    this.toggleShow = false;
    this.getEnglishDate();
    this.emitValue();
  }

  getEnglishDate() {
    let l_day = this.START_NEPALI_DAY;
    let l_month = this.START_NEPALI_MONTH;
    let l_year = this.START_NEPALI_YEAR;
    let deltaDays = 0;
    let isReached = false;
    const nYear = this.selectedYear;
    const nMonth = this.selectedMonthInt;
    const nDay = this.selectedDay;
    while (!isReached) {
      if (nYear.toString() === l_year.toString() && nMonth.toString() === l_month.toString() && nDay.toString() === l_day.toString()) {
        isReached = true;
        deltaDays--;
      }

      deltaDays++;
      const daysInMonth = this.getNumberOfDaysOfMonthForEnglish(l_year, l_month);
      if (l_day < daysInMonth) {
        l_day++;
      } else if (l_month < 12) {
        l_day = 1;
        l_month++;
      } else if (l_month === 12) {
        l_year++;
        l_month = 1;
        l_day = 1;
      }

    }
    const date = this.START_ENGLISH_YEAR.toString() + '-' + this.START_ENGLISH_MONTH.toString() + '-' + this.START_ENGLISH_DAY.toString();
    this.date = new Date(date);
    this.eDateRespTonDate = this.date.setDate(this.date.getDate() + deltaDays);
    this.eDateRespTonDate = this.datepipe.transform(this.eDateRespTonDate, 'yyyy-MM-dd');

  }

  getNumberOfDaysOfMonthForEnglish(year, value) {
    let daysInMonth = 0;
    this.calendarData.forEach(y => {
      if ((year.toString() === y.year.toString())) {
        const monthList = y.monthMap;
        daysInMonth = monthList[value - 1].numberOfDaysPerMonth;
        return true;
      }
    });
    return daysInMonth;
  }


  prevMnth() {
    const index = this.monthMapList.indexOf(this.selectedMonth);
    if (index !== 0) {
      this.selectedMonth = this.monthMapList[index - 1];
      this.getNumberOfDaysOfMonth(this.selectedMonth);
    } else {
      this.selectedMonth = this.monthMapList[11];
      this.getNumberOfDaysOfMonth(this.selectedMonth);
    }
  }

  nxtMnth() {
    const index = this.monthMapList.indexOf(this.selectedMonth);
    if (index !== 11) {
      this.selectedMonth = this.monthMapList[index + 1];
      this.getNumberOfDaysOfMonth(this.selectedMonth);
    } else {
      this.selectedMonth = this.monthMapList[0];
      this.getNumberOfDaysOfMonth(this.selectedMonth);
    }
  }

  displayYear() {
    this.displayYearShow = true;
  }

  toggleDate() {
    if (!this.toggleShow) {
      this.toggleShow = true;
    } else {
      this.toggleShow = false;
    }

  }

  emitValue() {
    this.nDateRespTonDate = this.selectedMonth + ' ' + this.selectedDay + ', ' + this.selectedYear;

    this.eDateRespTonDate = this.datepipe.transform(this.eDateRespTonDate, 'MMMM d, y, h:mm:ss a z');
    const date = new Date(this.eDateRespTonDate);
    if (this.emitCounter === 0 && ObjectUtil.isEmpty(this.ePreDate)) {
      this.nDateRespTonDate = undefined;
    } else {
      this.outputDate.eDate = date;
      this.outputDate.nDate = this.nDateRespTonDate;
      this.messageToEmit.emit(this.outputDate);
    }
    this.emitCounter++;
  }

  adToBs() {
    if (!ObjectUtil.isEmpty(this.ePreDate)) {
      const startEngFull = this.START_ENGLISH_YEAR.toString() + '-' +
          this.START_ENGLISH_MONTH.toString() + '-' + this.START_ENGLISH_DAY.toString();
      const eStartDate = new Date(this.datepipe.transform(startEngFull, 'yyyy-MM-dd'));
      const eEndDateFormat = this.datepipe.transform(this.ePreDate, 'yyyy-MM-dd');
      const eEndDate = new Date(eEndDateFormat);
      let nDay = this.START_NEPALI_DAY;
      let nMonth = this.START_NEPALI_MONTH;
      let nYear = this.START_NEPALI_YEAR;

      const timeDiff = Math.abs(eEndDate.getTime() - eStartDate.getTime());
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      for (let i = 0; i < diffDays; i++) {
        if (nDay < this.getNumberOfDaysOfMonthForEnglish(nYear, nMonth)) {
          nDay++;
        } else if (nMonth < 12) {
          nDay = 1;
          nMonth++;
        } else if (nMonth === 12) {
          nYear++;
          nMonth = 1;
          nDay = 1;
        }
      }
      this.selectedYear = nYear;
      this.selectedMonth = this.monthMapList[nMonth - 1];
      this.selectedMonthInt = nMonth;
      this.selectedDay = nDay;
      this.eDateRespTonDate = eEndDate;
      this.getNumberOfDaysOfMonth(this.selectedMonth);
    }
  }


}
