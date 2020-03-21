const Timer = function(elements = {}) {
  this.elements = {};
  this.isRunning = false;
  this.startDate = "";
  this.pauseTime = null;
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
    self.startDate = e.target.value;
  });
  this.elements.playButton.addEventListener("click", function(e) {
    self.start(e);
  });
  this.elements.pauseButton.addEventListener("click", function(e) {
    self.pause();
  });
  if (!this.isRunning) {
    this.elements.stopButton.classList.toggle("disabled");
    this.elements.pauseButton.classList.toggle("disabled");
  }
};

Timer.prototype.start = function(e) {
  debugger;
  let startTime, now, diff, lag;

  switch (e.target.dataset.actionName) {
    case "play":
      if (this.startDate) {
        let self = this;
        this.isRunning = true;
        startTime = Date.parse(this.startDate);
        this.interval = setInterval(function() {
          diff = startTime - Date.now();
          self.displayClock(diff);
        }, 1);
        this.elements.timersLayout.classList.add("show");
        this.elements.playButton.classList.toggle("disabled");
        this.elements.stopButton.classList.toggle("disabled");
        this.elements.pauseButton.classList.toggle("disabled");
      }
      break;
    case "resume":
      if (this.pauseTime) {
        let self = this;
        this.isRunning = true;
        this.startDate = new Date(
          Date.parse(this.startDate) + Date.now() - this.pauseTime
        );
        startTime = Date.parse(this.startDate);
        this.interval = setInterval(function() {
          diff = startTime - Date.now();
          self.displayClock(diff);
        }, 1);
        this.elements.timersLayout.classList.add("show");
        this.elements.playButton.dataset.actionName = "play";
        this.elements.playButton.textContent = "play";
        this.elements.playButton.classList.toggle("disabled");
        this.elements.stopButton.classList.toggle("disabled");
        this.elements.pauseButton.classList.toggle("disabled");
      }
      break;
  }
};

Timer.prototype.stop = function() {};

Timer.prototype.pause = function() {
  debugger;
  this.pauseTime = Date.now();
  this.isRunning = false;
  clearInterval(this.interval);
  this.elements.playButton.dataset.actionName = "resume";
  this.elements.playButton.textContent = "resume";
  this.elements.playButton.classList.toggle("disabled");
  this.elements.pauseButton.classList.toggle("disabled");
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
