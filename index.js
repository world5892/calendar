// const days = ['niedz.', 'pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.'];

// const months = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'];

// const date = new Date();
// const dayIndex = date.getDay();
// const monthIndex = date.getMonth();

// console.log(days[dayIndex], months[monthIndex]);

class Calendar {
  // date data
  _days = ['niedz.', 'pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.'];
  _months = [
    'styczeń',
    'luty',
    'marzec',
    'kwiecień',
    'maj',
    'czerwiec',
    'lipiec',
    'sierpień',
    'wrzesień',
    'październik',
    'listopad',
    'grudzień',
  ];
  _date = new Date();
  _currentDay; // this._date.getDate(); current day of month (number)
  _monthName; // this._months[this._date.getMonth()];
  _monthIndex; // this._date.getMonth();
  _year; // this._date.getFullYear();
  _firstDayIndex; // new Date(`${this._date.getMonth() + 1}-01-${this._date.getFullYear()}`).getDay(); index of first day of current month

  // UI elements
  _monthEl = document.querySelector('.month');
  _yearEl = document.querySelector('.year');
  _dayEls = [...document.querySelectorAll('td')];
  _currentMonthDayEls;
  _previousMonthEl = document.querySelector('.previous-day');
  _todayEl = document.querySelector('.today');
  _nextMonthEl = document.querySelector('.next-day');

  constructor() {
    this._init();
    this._previousMonthEl.addEventListener(
      'click',
      this._generateDifferentMonth.bind(this, true)
    );
    this._nextMonthEl.addEventListener(
      'click',
      this._generateDifferentMonth.bind(this, false)
    );
    this._todayEl.addEventListener(
      'click',
      this._generateCurrentMonthBack.bind(this)
    );
  }

  _init() {
    this.getDateData();
    this._displayHeaderDate();
    this._resetGrayFontColor();
    this._generatePreviousMonthRest();
    this._generateMonth();
    this._generateNextMonthRest();

    // Avoid generating current day when different month is chosen
    if (
      this._monthIndex === new Date().getMonth() &&
      this._year === new Date().getFullYear()
    )
      this._generateCurrentDay();
  }

  getDateData() {
    this._currentDay = this._date.getDate(); // current day of month (number)
    this._monthName = this._months[this._date.getMonth()];
    this._monthIndex = this._date.getMonth();
    this._year = this._date.getFullYear();
    this._firstDayIndex = new Date(
      `${this._date.getMonth() + 1}-01-${this._date.getFullYear()}`
    ).getDay();
    // index of first day of current month
    if (this._firstDayIndex === 0) this._firstDayIndex = 7; // if the first day is Sunday, switch to 7
  }

  _displayHeaderDate() {
    this._monthEl.textContent = this._monthName;
    this._yearEl.textContent = ` ${this._year}`;
  }

  _getDaysInMonth(monthId = this._monthIndex + 1) {
    // returns the number of days in current month
    return new Date(this._year, monthId, 0).getDate();
  }

  _generateMonth() {
    const daysInMonth = this._getDaysInMonth();

    // get all UI elements to be replaced with days of month
    const daysToFill = this._dayEls.slice(
      this._firstDayIndex - 1,
      daysInMonth + this._firstDayIndex - 1
    );
    // console.log(daysToFill);

    // display days of current month
    this._fillWithDays(daysToFill, 1, undefined, true);

    // make day elements of current month global variable
    this._currentMonthDayEls = daysToFill;
  }

  _generatePreviousMonthRest() {
    const daysInMonth = this._getDaysInMonth(this._monthIndex);

    const daysToFill = this._dayEls.slice(0, this._firstDayIndex - 1);

    daysToFill.reverse();

    this._fillWithDays(daysToFill, undefined, daysInMonth, false);
  }

  _generateNextMonthRest() {
    const daysInMonth = this._getDaysInMonth();

    const daysToFill = this._dayEls.slice(
      this._firstDayIndex - 1 + daysInMonth
    );

    this._fillWithDays(daysToFill, 2, undefined, false);
  }

  _fillWithDays(days, increaseBy, daysInMonth, isCurrMonth) {
    // Fill for previous month
    if (!increaseBy) {
      days.forEach((day, index) => {
        day.textContent = daysInMonth - index;

        // Display in gray
        day.classList.add('day-gray');
      });
      return;
    }

    // Fill for current and next month
    days.forEach((day, index) => {
      let html = index + 1;

      // Switch to previous/current/next month
      let month = this._monthIndex + increaseBy;

      // Reset to January if it is 13
      month === 13 ? (month = 1) : month;

      // Add 0 before months 1-9
      month < 10 ? (month = `0${month}`) : month;

      // Check if it is first day of month: if so, add number of current month
      html === 1 ? (html = `${html}.${month}`) : html;

      // Display day
      day.textContent = html;

      // Display in gray if it is NOT current month
      !isCurrMonth && day.classList.add('day-gray');
    });
  }

  _generateCurrentDay() {
    // If current day is 1
    if (this._currentDay === 1) {
      // Get day 1 element
      const currDayEl = this._currentMonthDayEls[0];
      const [day, month] = currDayEl.textContent.split('.');

      const html = `
      <span class="current-one-wrapper">
        <span class="current current-one">${day}</span>
        <span>.${month}</span>
      </span>
    `;

      this._displayCurrentDay(currDayEl, html);
      return;
    }

    // If current day is other than 1
    this._currentMonthDayEls.forEach((day) => {
      const today = day.textContent;

      // Add class "current" to current day
      if (+today === this._currentDay) {
        const html = `
        <span class="current ${
          today.length === 1 ? 'current-extra-padding' : ''
        }">${day.textContent}</span>
        `;

        this._displayCurrentDay(day, html);
      }
    });
  }

  _displayCurrentDay(day, html) {
    day.style.padding = '0';
    day.style.position = 'relative';

    day.innerHTML = html;
  }

  _removeCurrentDayMark() {
    // Repair padding in current day <td>
    const currentDayDrawer =
      document.querySelector('[class^="current"]').parentElement;
    currentDayDrawer.style.paddingRight = '.8rem';
  }

  _generateDifferentMonth(showPreviousMonth) {
    // Call function only if current day mark exists
    if (
      this._monthIndex === new Date().getMonth() &&
      this._year === new Date().getFullYear()
    )
      this._removeCurrentDayMark();

    // Change month index
    if (showPreviousMonth) {
      this._monthIndex--;
    } else {
      this._monthIndex++;
    }

    // Update date data
    this._date.setMonth(this._monthIndex);
    this._date.setDate(this._currentDay);

    // Generate new month and UI
    this._init();
  }

  _generateCurrentMonthBack() {
    // Set current date
    this._date = new Date();

    // Regenerate UI
    this._init();
  }

  _resetGrayFontColor() {
    // Removes class 'day-gray' from all <td> elements
    this._dayEls.forEach((day) => day.classList.remove('day-gray'));
  }
}

new Calendar();
