const Timer = function(elements = {}) {
  //debugger;
  this.elements = {};
  this.isRunning = false;
  this.startDate = "";
  this.interval = null;
  this.setElements(this.elements, elements);
  this.initialize();
};

Timer.prototype.setElements = function(els, elements) {
  let inputDateClass = elements.date || ".startDate";
  let timersLayoutClass = elements.layout || ".timers";
  let hourClass = elements.hour || ".hour";
  let minuteClass = elements.minute || ".minute";
  let secondClass = elements.second || ".second";
  let msClass = elements.ms || ".ms";
  let playClass = elements.play || ".play";
  let pauseClass = elements.play || ".pause";
  let stopClass = elements.play || ".stop";

  els.inputDate = document.querySelector(inputDateClass);
  els.timersLayout = document.querySelector(timersLayoutClass);
  els.hour = document.querySelector(hourClass);
  els.minute = document.querySelector(minuteClass);
  els.second = document.querySelector(secondClass);
  els.ms = document.querySelector(msClass);
  els.playButton = document.querySelector(playClass);
  els.pauseButton = document.querySelector(pauseClass);
  els.stopButton = document.querySelector(stopClass);
};

Timer.prototype.initialize = function() {
  let self = this;
  this.elements.inputDate.setAttribute("min", this.getMinDate());
  this.elements.inputDate.addEventListener("change", function(e) {
    e.preventDefault();
    const start = e.target.value;
    self.start(start);
  });
  this.elements.playButton.addEventListener("click", function() {
    self.start(self.starDate);
  });
  //this.elements.pauseButton.
};

Timer.prototype.start = function(start) {
  let self = this;
  this.startDate = start;
  this.isRunning = true;

  this.interval = setInterval(function() {
    const startTime = Date.parse(self.startDate);
    const now = Date.now();
    const difference = startTime - now;
    self.displayClock(difference);
  }, 1);
  this.elements.timersLayout.classList.add("show");
};

Timer.prototype.stop = function() {};

Timer.prototype.pause = function() {};

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

Timer.prototype.getMinDate = function() {
  let current = new Date();
  let year = current.getFullYear();
  let month = current.getMonth() + 1;
  let day = current.getDate() + 1;

  day = day < 10 ? `0${day}` : day;
  month = month < 10 ? `0${month}` : month;
  return `${year}-${month}-${day}`;
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

export default Timer;
