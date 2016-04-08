import {IClientAppSetting} from "../config/setting";
import {IDeferred, IQService, IPromise} from 'angular';
import {DateTime} from "../cmn/date/DateTime";
import {DateTimeFactory} from "../cmn/date/DateTimeFactory";

export interface IDatePickerOptions {
    attachedTo?: HTMLElement;
    timestamp?: number;
    clickToSelect?: boolean;
    min?: number;
    max?: number;
}

export class DatePickerService {
    private dpOuterWrapper:HTMLDivElement;
    private dpWrapper:HTMLDivElement;
    private dpContent:HTMLDivElement;
    private dpDateTable:HTMLTableElement;
    private dpMonthSelect:HTMLDivElement;
    private dpYearSelect:HTMLDivElement;

    private altMode = '';
    private isVisible = false;
    private selectedTimestamp = 0;
    private pickerDate:DateTime;
    private inputDate:DateTime;
    private defer:IDeferred<number>;
    private options:IDatePickerOptions;

    public static $inject = ['$q', 'Setting'];

    constructor(private $q:IQService, private Setting:IClientAppSetting) {
        this.pickerDate = DateTimeFactory.create(Setting.locale);
        this.init();
    }

    private init() {
        this.dpOuterWrapper = document.createElement('div');
        this.dpOuterWrapper.classList.add('dp-outer-wrapper');
        this.dpOuterWrapper.classList.add('dp-modal');
        document.querySelector('body').appendChild(this.dpOuterWrapper);
        this.dpOuterWrapper.innerHTML = this.getTemplate();
        this.dpWrapper = <HTMLDivElement>this.dpOuterWrapper.querySelector('.dp-wrapper');
        var actionBtns = this.dpWrapper.querySelectorAll('.dp-footer button'),
            dpBody:HTMLDivElement = <HTMLDivElement>this.dpWrapper.querySelector('.dp-body');
        this.dpContent = <HTMLDivElement>dpBody.querySelector('.dp-content');
        this.dpDateTable = <HTMLTableElement>dpBody.querySelector('table');
        this.dpMonthSelect = <HTMLDivElement>this.dpWrapper.querySelector('.dp-month-select');
        this.dpYearSelect = <HTMLDivElement>this.dpWrapper.querySelector('.dp-year-select');
        // date cell click handler
        this.dpDateTable.addEventListener('click', this.selectDay.bind(this), false);
        // cancel button click handler
        actionBtns[1].addEventListener('click', this.toggleDatePicker.bind(this), false);
        // ok button click handler
        actionBtns[0].addEventListener('click', this.update.bind(this), false);
        // prev month click handler
        dpBody.querySelector('.dp-prev').addEventListener('click', this.gotoPrevMonth.bind(this), false);
        // next month click handler
        dpBody.querySelector('.dp-next').addEventListener('click', this.gotoNextMonth.bind(this), false);
        // month select handler
        dpBody.querySelector('.dp-curr-month').addEventListener('click', this.showMonthSelector.bind(this), false);
        this.dpMonthSelect.addEventListener('click', this.selectMonth.bind(this), false);
        // year select handler
        dpBody.querySelector('.dp-curr-year').addEventListener('click', this.showYearSelector.bind(this), false);
        this.dpYearSelect.addEventListener('click', this.selectYear.bind(this), false);
        var lastScrollTop = 0,
            scrollTimer;
        this.dpContent.addEventListener('scroll', function (event:Event) {
            if (this.altMode != 'year') return;
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(((downSide)=> {
                return ()=> {
                    this.addYearEntry(downSide);
                }
            })(this.dpContent.scrollTop > lastScrollTop), 300);
            lastScrollTop = this.dpContent.scrollTop;
        })
    }

    private renderDatePicker() {
        this.dpDateTable.innerHTML = '';
        this.dpDateTable.appendChild(this.getWeekDaysNameRow());
        this.fillDateTable();
    }

    private getWeekDaysNameRow():HTMLTableRowElement {
        var tr:HTMLTableRowElement = document.createElement('tr'),
            weekDays = this.pickerDate.locale.weekDays,
            html = '';
        this.dpWrapper.querySelector('.dp-curr-year').textContent = String(this.pickerDate.getFullYear());
        this.dpWrapper.querySelector('.dp-curr-month').textContent = this.inputDate.locale.monthNames[this.pickerDate.getMonth()];
        for (var i = 0, il = weekDays.length; i < il; ++i) {
            html += `<th>${weekDays[i]}</th>`;
        }
        tr.innerHTML = html;
        return tr;
    }

    private fillDateTable() {
        var currentMonth = this.pickerDate.getMonth(),
            currentYear = this.pickerDate.getFullYear();
        this.pickerDate.setDate(1);
        var firstWeekDayOfMonth = this.pickerDate.getDay(),
            monthDays = this.pickerDate.locale.daysInMonth[currentMonth],
            tr:HTMLTableRowElement = document.createElement('tr'),
            tds:string = '';
        var thisYear = this.inputDate.getFullYear(),
            thisMonth = this.inputDate.getMonth(),
            thisDate = this.inputDate.getDate();
        var lookForToday = currentYear == thisYear && currentMonth == thisMonth;
        // days from last month
        for (var i = 0; i < firstWeekDayOfMonth; i++) {
            tds += '<td class="dp-empty">&nbsp;</td>';
        }
        // this month days
        for (var j = 1; j <= monthDays; j++, i++) {
            if (i > 0 && i % 7 == 0) {
                tr.innerHTML = tds;
                this.dpDateTable.appendChild(tr);
                tr = document.createElement('tr');
                i = 0;
                tds = '';
            }
            var cssClasses = [], cssClassStr = '';
            if (i > 0 && i % 6 == 0) {
                cssClasses.push('dp-holiday');
            }
            if (lookForToday && j == thisDate) {
                cssClasses.push('dp-today')
            }
            if (cssClasses.length) {
                cssClassStr = ` class="${cssClasses.join(' ')}"`;
            }
            tds += `<td${cssClassStr}><span>${j}</span></td>`;
        }
        // days from next month
        if (i < 7) {
            for (; i <= 6; i++) {
                tds += '<td class="dp-empty">&nbsp;</td>';
            }
            tr.innerHTML = tds;
            this.dpDateTable.appendChild(tr);
        } else if (i == 7) {
            tr.innerHTML = tds;
            this.dpDateTable.appendChild(tr);
        }
    }

    private setHeaderDate() {
        var header:HTMLDivElement = <HTMLDivElement>this.dpWrapper.querySelector('.dp-header');
        header.querySelector('.dp-day').textContent = this.inputDate.locale.weekDays[this.inputDate.getDay()];
        header.querySelector('.dp-date').textContent = String(this.inputDate.getDate());
        header.querySelector('.dp-month').textContent = this.inputDate.locale.monthNames[this.inputDate.getMonth()];
        header.querySelector('.dp-year').textContent = String(this.inputDate.getFullYear());
    }

    private selectDay(event:MouseEvent) {
        var srcElement = event.srcElement;
        if (srcElement.tagName.toUpperCase() == 'SPAN') {
            srcElement = srcElement.parentElement;
        }
        var day = Number(srcElement.textContent);
        if (!day) return;
        var prevMarkedDays = this.dpDateTable.querySelectorAll('.dp-selected');
        if (prevMarkedDays) {
            for (var i = prevMarkedDays.length; i--;) {
                prevMarkedDays[i].classList.remove('dp-selected');
            }
        }
        srcElement.classList.add('dp-selected');
        this.pickerDate.setDate(day);
        this.selectedTimestamp = this.pickerDate.getTime();
        if (this.options.clickToSelect) {
            this.defer.resolve(this.selectedTimestamp);
            this.toggleDatePicker();
        }
    }

    private toggleDatePicker() {
        this.isVisible = !this.isVisible;
        this.dpOuterWrapper.classList[this.isVisible ? 'add' : 'remove']('dp-visible');
        this.renderDatePicker();
    }

    private toggleAltMode(mode?:string) {
        this.altMode = mode;
        switch (mode) {
            case 'month':
                this.dpWrapper.classList.add('dp-alt-mode');
                this.dpWrapper.classList.add('dp-month-select-mode');
                this.dpWrapper.classList.remove('dp-year-select-mode');
                break;
            case 'year':
                this.dpWrapper.classList.add('dp-alt-mode');
                this.dpWrapper.classList.add('dp-year-select-mode');
                this.dpWrapper.classList.remove('dp-month-select-mode');
                break;
            default:
                this.dpWrapper.classList.remove('dp-alt-mode');
                this.dpWrapper.classList.remove('dp-month-select-mode');
                this.dpWrapper.classList.remove('dp-year-select-mode');
        }
    }

    private gotoPrevMonth() {
        this.toggleAltMode();
        var pm = this.pickerDate.getMonth() - 1;
        if (pm >= 0) {
            this.pickerDate.setMonth(pm);
        } else {
            this.pickerDate.setFullYear(this.pickerDate.getFullYear() - 1, 11);
        }
        this.renderDatePicker();
    }

    private gotoNextMonth() {
        this.toggleAltMode();
        this.pickerDate.setMonth(this.pickerDate.getMonth() + 1);
        this.renderDatePicker();
    }

    private showMonthSelector() {
        if (this.altMode == 'month') return this.toggleAltMode();
        this.toggleAltMode('month');
    }

    private selectMonth(event:MouseEvent) {
        this.toggleAltMode();
        var month = Number(event.srcElement.getAttribute('data-index'));
        if (!month) return;
        this.pickerDate.setMonth(month - 1);
        this.renderDatePicker();
    }

    private showYearSelector() {
        if (this.altMode == 'year') return this.toggleAltMode();
        this.toggleAltMode('year');
    }

    private addYearEntry(downSide:boolean = false) {
        var startYear = Number(this.dpYearSelect.children[downSide ? this.dpYearSelect.children.length - 1 : 0].textContent),
            child;
        if ((!downSide && this.dpContent.scrollTop < 300) || (downSide && this.dpContent.scrollHeight - this.dpContent.scrollTop < 500)) {
            if (downSide) {
                for (var i = startYear - 1; i >= startYear - 10; i--) {
                    child = document.createElement('div');
                    child.textContent = i;
                    this.dpYearSelect.appendChild(child);
                }
            } else {
                var topOffset = this.dpContent.scrollTop;
                for (var i = startYear + 1; i <= startYear + 5; i++) {
                    child = document.createElement('div');
                    child.textContent = i;
                    this.dpYearSelect.insertBefore(child, this.dpYearSelect.firstChild);
                }
                this.dpContent.scrollTop = topOffset;
            }
        }
    }

    private selectYear(event:MouseEvent) {
        this.toggleAltMode();
        var year = Number(event.srcElement.textContent);
        if (!year) return;
        this.pickerDate.setFullYear(year);
        this.renderDatePicker();
        this.dpYearSelect.classList.remove('dp-visible');
    }

    private getTemplate() {
        var months = this.pickerDate.locale.monthNames,
            monthHtml = '',
            year = this.pickerDate.getFullYear(),
            yearHtml = '';
        for (var i = 0, il = months.length; i < il; ++i) {
            monthHtml += `<div data-index="${i + 1}">${months[i]}</div>`;
        }
        for (var i = year + 10; i > year - 20; i--) {
            yearHtml += `<div>${i}</div>`;
        }
        return `
    <div class="dp-wrapper">
        <div class="dp-header">
            <div class="dp-day"></div>
            <div class="dp-month"></div>
            <div class="dp-date"></div>
            <div class="dp-year"></div>
        </div>
        <div class="dp-body">
            <div class="dp-current">
                <span class="dp-prev icon ion-chevron-left"></span>
                <span class="dp-curr-month"></span>
                <span class="dp-curr-year"></span>
                <span class="dp-next icon ion-chevron-right"></span>
            </div>
            <div class="dp-content">
                <table></table>
                <div class="dp-month-select">${monthHtml}</div>
                <div class="dp-year-select">${yearHtml}</div>
            </div>
        </div>
        <div class="dp-footer">
            <button>انتخاب</button>
            <button>لغو</button>
        </div>
    </div>`;
    }

    private update() {
        this.defer.resolve(this.selectedTimestamp);
        this.toggleDatePicker();
    }

    public show(options:IDatePickerOptions):IPromise<number> {
        this.options = options;
        this.inputDate = DateTimeFactory.create(this.Setting.locale);
        if (options.timestamp) {
            this.inputDate.setTime(options.timestamp);
        }
        this.pickerDate.setTime(this.inputDate.getTime());
        this.defer = this.$q.defer<number>();
        this.setHeaderDate();
        this.toggleDatePicker();
        return this.defer.promise;
    }

    public cancel() {
        this.toggleDatePicker();
        this.defer.reject();
    }
}
