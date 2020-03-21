import Singleton from "./singleton.js";
import * as CONSTANTS from "../utils/constants.js";

const Action = function(elements = {}) {
  this.elements = {};
  this.timer = null;
  this.setElements(this.elements, elements);
  this.initialize();
};

Action.prototype.setElements = function(els, elements) {
  let playClass = elements.play || ".play";
  let pauseClass = elements.play || ".pause";
  let stopClass = elements.play || ".stop";

  els.playButton = document.querySelector(playClass);
  els.pauseButton = document.querySelector(pauseClass);
  els.stopButton = document.querySelector(stopClass);
};

Action.prototype.initialize = function() {
  this.timer = Singleton.getInstance(CONSTANTS.TYPES.TIMER);
  this.elements.playButton.addEventListener("click", e => {
    this.start(e);
  });
  this.elements.pauseButton.addEventListener("click", e => {
    this.pause();
  });
};

Action.prototype.start = function(e) {
  let actionName = e.target.dataset.actionName,
    startTime,
    diff;

  switch (actionName) {
    case CONSTANTS.ACTIONS.PLAY:
      startHelper.call(this, actionName, this.timer.startTime);
      break;
    case CONSTANTS.ACTIONS.RESUME:
      startHelper.call(this, actionName, this.timer.pauseTime);
      break;
  }

  function startHelper(actionName, timeInput) {
    debugger;
    var self = this;
    if (timeInput) {
      this.timer.isRunning = true;
      this.timer.startTime =
        actionName === CONSTANTS.ACTIONS.PLAY
          ? this.timer.startTime
          : new Date(
              Date.parse(this.timer.startTime) +
                Date.now() -
                this.timer.pauseTime
            );
      startTime = Date.parse(this.timer.startTime);
      this.timer.interval = setInterval(function() {
        diff = startTime - Date.now();
        self.timer.displayClock(diff);
      }, 1);
      this.timer.elements.timersLayout.classList.add("show");
      if (actionName === CONSTANTS.ACTIONS.RESUME) {
        this.elements.playButton.dataset.actionName = "play";
        this.elements.playButton.textContent = "play";
      }
      this.elements.playButton.classList.toggle("disabled");
      this.elements.stopButton.classList.toggle("disabled");
      this.elements.pauseButton.classList.toggle("disabled");
    }
  }
};

Action.prototype.stop = function() {};

Action.prototype.pause = function() {
  this.timer.pauseTime = Date.now();
  this.timer.isRunning = false;
  clearInterval(this.timer.interval);
  this.elements.playButton.dataset.actionName = "resume";
  this.elements.playButton.textContent = "resume";
  this.elements.playButton.classList.toggle("disabled");
  this.elements.pauseButton.classList.toggle("disabled");
};

export default Action;
