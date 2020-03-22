import * as CONSTANTS from "../utils/constants.js";
import { getTimeParts } from "../utils/helper.js";

/**
 * This function represents the lap
 * @param  { elements = The elements object containing the classes of the corresponding elements in the html}
 */
const Lap = function(elements = {}) {
  this.elements = {};
  this.startTime = null;
  this.endTime = null;
  this.status = "";
  this.statusText = "";
  this.messageText = "";
  this.lapNumber = "";
  this.interval = null;
  this.duration = null;
  this.AddThresholdEvent = null;
  this.RemoveThresholdEvent = null;
  this.setElements(this.elements, elements);
  this.initialize();
};

Lap.prototype.setElements = function(els, elements) {
  let lapLayoutClass = elements.lap || ".laps";
  els.lapLayout = document.querySelector(lapLayoutClass);
  els.lap = null;
};

Lap.prototype.initialize = function() {
  this.AddThresholdEvent = new CustomEvent(CONSTANTS.EVENTS.ADD_THRESHOLD, {
    bubbles: true
  });
  this.RemoveThresholdEvent = new CustomEvent(
    CONSTANTS.EVENTS.REMOVE_THRESHOLD,
    {
      bubbles: true
    }
  );
};

Lap.prototype.setStartTime = function(startTime) {
  this.startTime = startTime;
};

Lap.prototype.setEndTime = function(endTime) {
  this.endTime = endTime;
};

Lap.prototype.start = function(lapNumber, threshold) {
  let self = this,
    diff;
  this.setStartTime(Date.now());
  this.lapNumber = lapNumber + 1;
  this.status = CONSTANTS.LAP_STATUS.RUNNING;
  this.statusText = `Lap ${this.lapNumber} running: `;

  this.elements.lap = document.createElement("div");
  this.elements.lap.classList.add("lap");
  this.elements.lapName = document.createElement("span");
  this.elements.lapName.classList.add("status");
  this.elements.lapName.textContent = this.statusText;
  this.elements.lapTime = document.createElement("span");
  this.elements.lapTime.classList.add("duration");
  this.elements.lapMessage = document.createElement("span");
  this.elements.lapMessage.classList.add("message");
  this.elements.lap.appendChild(this.elements.lapName);
  this.elements.lap.appendChild(this.elements.lapTime);
  this.elements.lap.appendChild(this.elements.lapMessage);
  this.elements.lapLayout.appendChild(this.elements.lap);
  this.interval = setInterval(function() {
    diff = Date.now() - self.startTime;
    if (diff > threshold * 1000) {
      self.elements.lapLayout.dispatchEvent(self.AddThresholdEvent);
    }
    self.displayLap(diff);
  }, 1000);
};

Lap.prototype.restart = function(previousLapDuration, threshold) {
  let self = this,
    diff;
  this.status = CONSTANTS.LAP_STATUS.RUNNING;
  this.statusText = `Lap ${this.lapNumber} running: `;
  this.endTime = null;
  this.elements.lapName.textContent = this.statusText;
  self.elements.lapLayout.dispatchEvent(self.RemoveThresholdEvent);
  this.interval = setInterval(function() {
    diff = Date.now() - self.startTime - previousLapDuration;
    diff > threshold * 1000 &&
      self.elements.lapLayout.dispatchEvent(self.AddThresholdEvent);
    self.displayLap(diff);
  }, 1000);
};

Lap.prototype.stop = function(threshold) {
  this.status = CONSTANTS.LAP_STATUS.COMPLETED;
  this.statusText = `Lap ${this.lapNumber} completed: `;
  this.setEndTime(Date.now());
  this.elements.lapName.textContent = this.statusText;
  this.duration = this.endTime - this.startTime;
  if (this.duration > threshold * 1000) {
    this.messageText = `(The lap exceeded the threshold limit of ${threshold} (sec))`;
    this.elements.lapMessage.textContent = this.messageText;
  }
  this.elements.lapLayout.dispatchEvent(this.RemoveThresholdEvent);
  clearInterval(this.interval);
};

Lap.prototype.displayLap = function(time) {
  const { hours, minutes, seconds, milliSeconds } = getTimeParts(time);

  const displayHours = `${hours < 10 ? "0" : ""}${hours}`;
  const displayMinutes = `${minutes < 10 ? "0" : ""}${minutes}`;
  const displaySeconds = `${seconds < 10 ? "0" : ""}${seconds}`;

  this.elements.lapTime.textContent = `${displayHours}:${displayMinutes}:${displaySeconds}`;
};

export default Lap;
