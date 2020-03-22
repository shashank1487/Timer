import Singleton from "./singleton.js";
import { removeDataFromStorage } from "../utils/helper.js";
import * as CONSTANTS from "../utils/constants.js";

/**
 * This function represents the user action (start/stop/pause/resume)
 * @param  { elements = The elements object containing the classes of the corresponding elements in the html}
 */
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
  var self = this;
  this.timer = Singleton.getInstance(CONSTANTS.TYPES.TIMER);
  this.elements.playButton.addEventListener("click", function(e) {
    self.start(e);
  });
  this.elements.pauseButton.addEventListener("click", function(e) {
    self.pause();
  });
  this.elements.stopButton.addEventListener("click", function(e) {
    self.stop();
  });
};

Action.prototype.start = function(e) {
  let actionName, startTime, diff;

  actionName = !e ? CONSTANTS.ACTIONS.RESUME : e.target.dataset.actionName;
  switch (actionName) {
    case CONSTANTS.ACTIONS.PLAY:
      this.timer.startTimeInMS = Date.now();
      startHelper.call(this, actionName, this.timer.startTime);
      break;
    case CONSTANTS.ACTIONS.RESUME:
      startHelper.call(this, actionName, this.timer.pauseTime);
      break;
  }

  function startHelper(actionName, timeInput) {
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
      this.timer.elements.timerLayout.classList.add("show");
      if (actionName === CONSTANTS.ACTIONS.RESUME) {
        this.elements.playButton.dataset.actionName = CONSTANTS.ACTIONS.PLAY;
        this.elements.playButton.textContent = CONSTANTS.ACTIONS.PLAY;
      }
      if (!e) {
        this.elements.stopButton.classList.toggle("disabled");
        this.elements.pauseButton.classList.toggle("disabled");
      } else {
        this.toggleElementsClass();
      }
      this.timer.elements.summary.textContent = "";
      this.timer.elements.summary.classList.add("disabled");
    }
  }
};

Action.prototype.stop = function() {
  this.timer.isRunning = false;
  this.timer.setEndTime(Date.now());
  this.timer.duration = this.timer.endTime - this.timer.startTimeInMS;
  clearInterval(this.timer.interval);
  this.timer.displayClock(0);
  let lapsLength = this.timer.laps.length,
    lastLap = lapsLength && this.timer.laps[lapsLength - 1];
  if (lastLap && lastLap.status === CONSTANTS.LAP_STATUS.RUNNING) {
    lastLap.stop(this.timer.threshold);
    lastLap.elements.lapLayout.textContent = "";
  }
  this.toggleElementsClass();
  this.timer.elements.summary.classList.remove("disabled");
  this.timer.displaySummary();
  removeDataFromStorage(CONSTANTS.STORAGE_KEY);
};

Action.prototype.pause = function() {
  this.timer.setPauseTime(Date.now());
  this.timer.isRunning = false;
  clearInterval(this.timer.interval);
  this.elements.playButton.dataset.actionName = CONSTANTS.ACTIONS.RESUME;
  this.elements.playButton.textContent = CONSTANTS.ACTIONS.RESUME;
  this.toggleElementsClass();
};

Action.prototype.toggleElementsClass = function() {
  this.elements.playButton.classList.toggle("disabled");
  this.elements.stopButton.classList.toggle("disabled");
  this.elements.pauseButton.classList.toggle("disabled");
};

export default Action;
