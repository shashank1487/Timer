import Lap from "./lap.js";
import { getTimeParts } from "../utils/helper.js";
import * as CONSTANTS from "../utils/constants.js";

/**
 * This function represents the timer
 * @param  { elements = The elements object containing the classes of the corresponding elements in the html}
 */
const Timer = function(elements = {}) {
  this.elements = {};
  this.isRunning = false;
  this.threshold = null;
  this.startTimeInMS = null;
  this.startTime = null;
  this.pauseTime = null;
  this.duration = null;
  this.endTime = null;
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
  let summaryClass = elements.summary || ".summary";

  els.timerLayout = document.querySelector(timerLayoutClass);
  els.hour = document.querySelector(hourClass);
  els.minute = document.querySelector(minuteClass);
  els.second = document.querySelector(secondClass);
  els.ms = document.querySelector(msClass);
  els.summary = document.querySelector(summaryClass);
};

Timer.prototype.initialize = function() {
  let self = this;
  document.addEventListener("keyup", function(e) {
    if (e.keyCode === 32) {
      self.addLap();
    }

    if (e.keyCode === 8) {
      self.removeCurrentLapAndMergeToPrevious();
    }
  });
  document.addEventListener(CONSTANTS.EVENTS.ADD_THRESHOLD, function(e) {
    self.addThresholdClass();
  });
  document.addEventListener(CONSTANTS.EVENTS.REMOVE_THRESHOLD, function(e) {
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

Timer.prototype.setEndTime = function(endTime) {
  this.endTime = endTime;
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
  if (this.isRunning) {
    let lastLap = this.laps.length && this.laps[this.laps.length - 1];
    if (lastLap && lastLap.status === CONSTANTS.LAP_STATUS.RUNNING) {
      lastLap.stop(this.threshold);
      lastLap.elements.lapLayout.dispatchEvent(lastLap.RemoveThresholdEvent);
    }
    lastLap && lastLap.stop();

    let newLap = new Lap();
    newLap.start(this.laps.length, this.threshold);
    this.laps.push(newLap);
  }
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

Timer.prototype.displaySummary = function() {
  let self = this;
  let fragment = new DocumentFragment();
  let summaryHeading = document.createElement("h1");
  summaryHeading.classList.add("heading");
  summaryHeading.textContent = CONSTANTS.SUMMARY_TEXT.MAIN_HEADING;

  let timerSummary = createSummaryElement(
    Date.parse(this.startTime) - this.startTimeInMS,
    Date.parse(this.startTime) - this.endTime,
    this.duration
  );

  let lapSummary = document.createElement("div");
  lapSummary.classList.add("lap-summary");
  this.laps &&
    this.laps.forEach(function(lap) {
      let lapElement = createSummaryElement(
        Date.parse(self.startTime) - lap.startTime,
        Date.parse(self.startTime) - lap.endTime,
        lap.duration,
        lap.lapNumber,
        lap.messageText,
        false
      );
      lapSummary.appendChild(lapElement);
    });

  fragment.appendChild(summaryHeading);
  fragment.appendChild(timerSummary);
  fragment.appendChild(lapSummary);
  this.elements.summary.appendChild(fragment);
  this.resetTimerDetails();

  function createSummaryElement(
    startTime,
    endTime,
    duration,
    lapNumber = 0,
    lapMessage = "",
    isTimerSummary = true
  ) {
    let timerSummary = document.createElement("div");
    timerSummary.classList.add("timer-summary");
    lapMessage && timerSummary.classList.add("threshold");
    let timerSummaryHeading = document.createElement("h2");
    timerSummaryHeading.textContent = isTimerSummary
      ? CONSTANTS.SUMMARY_TEXT.TIMER_SUMMARY_HEADING
      : `LAP ${lapNumber} SUMMARY`;
    let startTimeElement = createElement(
      "start",
      isTimerSummary
        ? CONSTANTS.SUMMARY_TEXT.TIMER_START_TIME_TEXT
        : CONSTANTS.SUMMARY_TEXT.LAP_START_TIME_TEXT,
      startTime
    );
    let endTimeElement = createElement(
      "end",
      isTimerSummary
        ? CONSTANTS.SUMMARY_TEXT.TIMER_END_TIME_TEXT
        : CONSTANTS.SUMMARY_TEXT.LAP_END_TIME_TEXT,
      endTime
    );
    let durationElement = createElement(
      "duration",
      isTimerSummary
        ? CONSTANTS.SUMMARY_TEXT.TIMER_DURATION_TEXT
        : CONSTANTS.SUMMARY_TEXT.LAP_DURATION_TEXT,
      duration,
      startTime,
      endTime
    );
    let messageElement;
    if (lapMessage) {
      messageElement = document.createElement("div");
      messageElement.classList.add("message");
      let messageSpan = document.createElement("span");
      messageSpan.textContent = lapMessage;
      messageElement.appendChild(messageSpan);
    }

    timerSummary.appendChild(timerSummaryHeading);
    timerSummary.appendChild(startTimeElement);
    timerSummary.appendChild(endTimeElement);
    timerSummary.appendChild(durationElement);
    messageElement && timerSummary.appendChild(messageElement);
    return timerSummary;
  }

  function createElement(
    elementClass,
    startTimeText,
    time,
    ref1 = "",
    ref2 = ""
  ) {
    let element = document.createElement("div");
    element.classList.add(elementClass);
    let textSpan = document.createElement("span");
    textSpan.textContent = startTimeText;
    let valueSpan = document.createElement("span");
    let timeParts = getTimeParts(time);
    let milliSecondsRunByLap;

    if (ref1 && ref2) {
      let ref1TimeParts = getTimeParts(ref1);
      let ref2TimeParts = getTimeParts(ref2);

      milliSecondsRunByLap =
        1000 - ref1TimeParts.milliSeconds + ref2TimeParts.milliSeconds;
    }

    timeParts.hours =
      timeParts.hours < 10 ? "0" + timeParts.hours : timeParts.hours;
    timeParts.minutes =
      timeParts.minutes < 10 ? "0" + timeParts.minutes : timeParts.minutes;
    timeParts.seconds += milliSecondsRunByLap
      ? Math.floor(milliSecondsRunByLap / 1000)
      : 0;
    timeParts.seconds =
      timeParts.seconds < 10 ? "0" + timeParts.seconds : timeParts.seconds;

    valueSpan.textContent = `${timeParts.hours}:${timeParts.minutes}:${timeParts.seconds}`;
    element.appendChild(textSpan);
    element.appendChild(valueSpan);
    return element;
  }
};

Timer.prototype.resetTimerDetails = function() {
  this.startTimeInMS = null;
  this.duration = null;
  this.endTime = null;
  this.interval = null;
  this.laps = [];
};

export default Timer;
