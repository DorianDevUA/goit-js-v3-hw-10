import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const refs = {
  dateTimePicker: document.querySelector('#datetime-picker'),
  startButton: document.querySelector('button[data-start]'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
};

let intervalId = null;
let userSelectedDate = null;

refs.startButton.addEventListener('click', startTimer);

toggleStartButton(false);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    userSelectedDate = selectedDates[0].getTime();
    const isDateInFuture = Date.now() < userSelectedDate;

    if (!isDateInFuture) {
      iziToast.error({
        position: 'topRight',
        title: 'Hey',
        message: 'Please choose a date in the future',
      });

      toggleStartButton(false);
      return;
    }

    toggleStartButton(true);
  },
};

flatpickr(refs.dateTimePicker, options);

function startTimer() {
  if (!intervalId) {
    toggleDateTimePicker(false);
    toggleStartButton(false);
    intervalId = setInterval(updateCountdownTimer, 1000);
  }
}

function stopTimer() {
  clearInterval(intervalId);
  intervalId = null;
  toggleDateTimePicker(true);
}

function updateCountdownTimer() {
  const currentTime = Date.now();
  const deltaTime = userSelectedDate - currentTime;

  if (deltaTime <= 0) {
    stopTimer();
    iziToast.success({
      position: 'topCenter',
      title: 'Achtung',
      message: 'Час вийшов!',
    });
    return;
  }

  updateTimerDisplay(convertMs(deltaTime));
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

function toggleStartButton(isEnabled) {
  refs.startButton.disabled = !isEnabled;
}

function toggleDateTimePicker(isEnabled) {
  refs.dateTimePicker.disabled = !isEnabled;
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}
