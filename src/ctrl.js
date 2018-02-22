import * as Base64 from 'base64-js';
import {TextEncoder, TextDecoder} from 'text-encoding';

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

export function str2ByteArray(str, strEnc = 'utf-8') {
  return new TextEncoder(strEnc).encode(str);
}

export function byteArrayToStr(arr, strEnc = 'utf-8') {
  return new TextDecoder(strEnc).decode(arr);
}

export function b64Encode(arr) {
  return Base64.fromByteArray(arr);
}

export function b64Decode(b64) {
  return Base64.toByteArray(b64);
}

export function basicAuth(user, pass) {
  return `Basic ${Base64.encode(user + ":" + pass)}`;
}
