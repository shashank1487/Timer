import Timer from "./timer.js";

const Lap = function(elements = {}) {
  this.elements = {};
  this.startTime = null;
  this.endTime = null;
  this.status = "";
  this.interval = null;
  this.setElements(this.elements, elements);
};

Lap.prototype.setElements = function(els, elements) {
  let lapLayoutClass = elements.lap || ".laps";
  els.lapLayout = document.querySelector(lapLayoutClass);
  els.lap = null;
};

Lap.prototype.setStartTime = function(startTime) {
  this.startTime = startTime;
};

Lap.prototype.setEndTime = function(endTime) {
  this.endTime = endTime;
};

Lap.prototype.start = function() {
  let self = this,
    diff;
  this.status = "running";

  this.elements.lap = document.createElement("span");
  this.elements.lapLayout.appendChild(this.elements.lap);
  this.interval = setInterval(function() {
    diff = Date.now() - self.startTime;
    self.displayClock(diff);
  }, 1000);
};

Lap.prototype.displayClock = function(time) {
  const { hours, minutes, seconds, milliSeconds } = this.getLapData(time);

  const displayHours = `${hours < 10 ? "0" : ""}${hours}`;
  const displayMinutes = `${minutes < 10 ? "0" : ""}${minutes}`;
  const displaySeconds = `${seconds < 10 ? "0" : ""}${seconds}`;

  this.elements.lap.textContent = `${displayHours}:${displayMinutes}:${displaySeconds}`;
};

Lap.prototype.getLapData = function(time) {
  let days = Math.floor(time / (1000 * 60 * 60 * 24));
  time = time % (1000 * 60 * 60 * 24);
  let hours = days * 24 + Math.floor(time / (60 * 60 * 1000));
  time = time % (60 * 60 * 1000);
  let minutes = Math.floor(time / (60 * 1000));
  time = time % (60 * 1000);
  let seconds = Math.floor(time / 1000);
  time = time % 1000;
  let milliSeconds = time;

  return {
    hours,
    minutes,
    seconds,
    milliSeconds
  };
};

export default Lap;
