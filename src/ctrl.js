export function formatNum(num, fmt) {
  var s = num + '';
  if (num > 0) {
    while (fmt-- > s.length) s = '0' + s;
  }
  return s;
}

export function parseDateInput(dateInput) {
  var pattern = /^\d+-\d+-\d+$/i;
  if (!pattern.test(dateInput)) return;
  var dateElm = dateInput.split('-');
  return new Date(dateElm[0], dateElm[1] - 1, dateElm[2]);
}

export function formatDateInput(date) {
  return `${formatNum(date.getFullYear(), 4)}-${formatNum(date.getMonth() + 1, 2)}-${formatNum(date.getDate(), 2)}`;
}

export function isCordovaApp() {
  return window && window.isCordovaApp;
}
