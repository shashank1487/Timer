import Singleton from "./singleton.js";
import * as CONSTANTS from "../utils/constants.js";

const Input = function(elements = {}) {
  this.elements = {};
  this.timer = null;
  this.action = null;
  this.setElements(this.elements, elements);
  this.initialize();
};

Input.prototype.setElements = function(els, elements) {
  let thresholdClass = elements.limits || ".limit";
  let inputTimeClass = elements.date || ".startTime";

  els.threshold = document.querySelector(thresholdClass);
  els.inputTime = document.querySelector(inputTimeClass);
};

Input.prototype.initialize = function() {
  var self = this;
  this.timer = Singleton.getInstance(CONSTANTS.TYPES.TIMER);
  this.action = Singleton.getInstance(CONSTANTS.TYPES.ACTION);

  this.timer.setThreshold(this.elements.threshold.value);
  this.elements.threshold.addEventListener("change", function(e) {
    self.timer.setThreshold(e.target.value);
  });

  this.elements.inputTime.setAttribute("min", this.getMinDate());
  this.elements.inputTime.addEventListener("change", function(e) {
    self.timer.setStartTime(e.target.value);
    self.action.elements.playButton.classList.toggle("disabled");
  });
};

Input.prototype.getMinDate = function() {
  let current = new Date();
  let year = current.getFullYear();
  let month = current.getMonth() + 1;
  let day = current.getDate() + 1;
  day = day < 10 ? `0${day}` : day;
  month = month < 10 ? `0${month}` : month;
  return `${year}-${month}-${day}`;
};

export default Input;
