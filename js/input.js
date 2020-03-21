import Singleton from "./singleton.js";
import { getDateString } from "../utils/helper.js";
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

  this.elements.inputTime.setAttribute("min", getDateString());
  this.elements.inputTime.addEventListener("change", function(e) {
    self.timer.setStartTime(e.target.value);
    self.action.elements.playButton.classList.toggle("disabled");
  });
};

export default Input;
