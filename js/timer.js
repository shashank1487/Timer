import Lap from "./lap.js";

const Timer = function(elements = {}) {
  this.elements = {};
  this.isRunning = false;
  this.threshold = null;
  this.startTime = null;
  this.pauseTime = null;
  this.interval = null;
  this.laps = [];
  this.setElements(this.elements, elements);
  this.initialize();
};

Timer.prototype.setElements = function(els, elements) {
  let timersLayoutClass = elements.layout || ".timers";
  let hourClass = elements.hour || ".hour";
  let minuteClass = elements.minute || ".minute";
  let secondClass = elements.second || ".second";
  let msClass = elements.ms || ".ms";

  els.timersLayout = document.querySelector(timersLayoutClass);
  els.hour = document.querySelector(hourClass);
  els.minute = document.querySelector(minuteClass);
  els.second = document.querySelector(secondClass);
  els.ms = document.querySelector(msClass);
};

Timer.prototype.initialize = function() {
  let self = this;
  document.addEventListener("keyup", function(e) {
    if (e.keyCode === 32) {
      self.startLap();
    }
  });
};

Timer.prototype.setThreshold = function(threshold) {
  this.threshold = threshold;
};

Timer.prototype.setStartTime = function(startTime) {
  this.startTime = startTime;
};

Timer.prototype.setPauseTime = function(pauseTime) {
  this.pauseTime = pauseTime;
};

Timer.prototype.displayClock = function(diff) {
  const { hours, minutes, seconds, milliSeconds } = this.getTimerData(diff);

  const displayHours = `${hours < 10 ? "0" : ""}${hours}`;
  const displayMinutes = `${minutes < 10 ? "0" : ""}${minutes}`;
  const displaySeconds = `${seconds < 10 ? "0" : ""}${seconds}`;
  const displayMS = `${milliSeconds < 100 ? "0" : ""}${milliSeconds}`;

  this.elements.hour.textContent = displayHours;
  this.elements.minute.textContent = displayMinutes;
  this.elements.second.textContent = displaySeconds;
  this.elements.ms.textContent = displayMS;
};

Timer.prototype.getTimerData = function(diff) {
  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff = diff % (1000 * 60 * 60 * 24);
  let hours = days * 24 + Math.floor(diff / (60 * 60 * 1000));
  diff = diff % (60 * 60 * 1000);
  let minutes = Math.floor(diff / (60 * 1000));
  diff = diff % (60 * 1000);
  let seconds = Math.floor(diff / 1000);
  diff = diff % 1000;
  let milliSeconds = diff;

  return {
    hours,
    minutes,
    seconds,
    milliSeconds
  };
};

Timer.prototype.startLap = function() {
  let newLap = new Lap();
  newLap.setStartTime(Date.now());
  newLap.start();
  this.laps.push(newLap);
};

export default Timer;
