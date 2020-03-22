import Singleton from "./singleton.js";
import { saveDataInStorage, getDataFromStorage } from "../utils/helper.js";
import * as CONSTANTS from "../utils/constants.js";

let initialize;
(function() {
  let input, timer, action;
  initialize = function() {
    input = Singleton.getInstance(CONSTANTS.TYPES.INPUT);
    timer = Singleton.getInstance(CONSTANTS.TYPES.TIMER);
    action = Singleton.getInstance(CONSTANTS.TYPES.ACTION);
    let countDown = getDataFromStorage(CONSTANTS.STORAGE_KEY);
    if (countDown) {
      countDown = JSON.parse(countDown);
      if (countDown) {
        input.elements.threshold.value = countDown.threshold;
        let inputTime =
          countDown.startTime && countDown.startTime.split("T")[0];
        input.elements.inputTime.value = inputTime;
        timer.startTime = inputTime;
        timer.startTimeInMS = countDown.startTimeInMS;
        timer.pauseTime = countDown.pauseTime;
        action.start();
      }
    }

    window.addEventListener("unload", function(e) {
      let countDown = timer.isRunning && {
        startTime: timer.startTime,
        startTimeInMS: timer.startTimeInMS,
        pauseTime: Date.now(),
        threshold: timer.threshold
      };
      saveDataInStorage(countDown, CONSTANTS.STORAGE_KEY);
    });
  };
})();

export default initialize;
