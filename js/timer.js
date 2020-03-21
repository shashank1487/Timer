import Lap from "./lap.js";
import { getTimeParts } from "../utils/helper.js";

const Timer = function(elements = {}) {
  this.elements = {};
  this.isRunning = false;
  this.threshold = null;
  this.startTime = null;
  this.pauseTime = null;
  this.interval = null;
  this.laps = [];
  this.pDuration = null;
  this.setElements(this.elements, elements);
  this.initialize();
};

Timer.prototype.setElements = function(els, elements) {
  let timerLayoutClass = elements.timer || ".timer";
  let hourClass = elements.hour || ".hour";
  let minuteClass = elements.minute || ".minute";
  let secondClass = elements.second || ".second";
  let msClass = elements.ms || ".ms";

  els.timerLayout = document.querySelector(timerLayoutClass);
  els.hour = document.querySelector(hourClass);
  els.minute = document.querySelector(minuteClass);
  els.second = document.querySelector(secondClass);
  els.ms = document.querySelector(msClass);
};

Timer.prototype.initialize = function() {
  let self = this;
  document.addEventListener("keyup", function(e) {
    if (e.keyCode === 32) {
      self.addLap();
    }
  });
  document.addEventListener("keyup", function(e) {
    if (e.keyCode === 8) {
      self.removeCurrentLapAndMergeToPrevious();
    }
  });
  document.addEventListener("AddThreshold", function(e) {
    self.addThresholdClass();
  });
  document.addEventListener("RemoveThreshold", function(e) {
    self.removeThresholdClass();
  });
};

Timer.prototype.setThreshold = function(threshold) {
  this.threshold = +threshold;
};

Timer.prototype.setStartTime = function(startTime) {
  this.startTime = startTime;
};

Timer.prototype.setPauseTime = function(pauseTime) {
  this.pauseTime = pauseTime;
};

Timer.prototype.displayClock = function(diff) {
  const { hours, minutes, seconds, milliSeconds } = getTimeParts(diff);

  const displayHours = `${hours < 10 ? "0" : ""}${hours}`;
  const displayMinutes = `${minutes < 10 ? "0" : ""}${minutes}`;
  const displaySeconds = `${seconds < 10 ? "0" : ""}${seconds}`;
  const displayMS = `${milliSeconds < 100 ? "0" : ""}${milliSeconds}`;

  this.elements.hour.textContent = displayHours;
  this.elements.minute.textContent = displayMinutes;
  this.elements.second.textContent = displaySeconds;
  this.elements.ms.textContent = displayMS;
};

Timer.prototype.addLap = function() {
  let lastLap = this.laps.length && this.laps[this.laps.length - 1];
  if (lastLap) {
    lastLap.stop(this.threshold);
    lastLap.elements.lapLayout.dispatchEvent(lastLap.RemoveThresholdEvent);
  }
  lastLap && lastLap.stop();

  let newLap = new Lap();
  newLap.setStartTime(Date.now());
  newLap.start(this.laps.length, this.threshold);
  this.laps.push(newLap);
};

Timer.prototype.removeCurrentLapAndMergeToPrevious = function() {
  let currentLap, currentLapDuration;
  if (this.laps.length) {
    currentLap = this.laps[this.laps.length - 1];
    clearInterval(currentLap.interval);
    currentLap.endTime = Date.now();
    currentLapDuration =
      currentLap.endTime - currentLap.startTime - this.pDuration;
    currentLapDuration = currentLap.endTime - currentLap.startTime;
    currentLap.elements.lapLayout.removeChild(currentLap.elements.lap);
    this.laps.pop();
    this.pDuration = currentLapDuration;
  }

  currentLap = this.laps.length && this.laps[this.laps.length - 1];
  currentLap && currentLap.restart(currentLapDuration, this.threshold);
};

Timer.prototype.addThresholdClass = function(e) {
  this.elements.timerLayout.classList.add("threshold");
};

Timer.prototype.removeThresholdClass = function(e) {
  this.elements.timerLayout.classList.remove("threshold");
};

export default Timer;
