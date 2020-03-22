import * as CONSTANTS from "../utils/constants.js";
import Input from "./input.js";
import Timer from "./timer.js";
import Action from "./action.js";

let Singleton = (function() {
  let inputInstance, timerInstance, actionInstance;

  return {
    getInstance: function(type) {
      switch (type) {
        case CONSTANTS.TYPES.INPUT:
          if (!inputInstance) {
            inputInstance = new Input();
          }
          return inputInstance;
        case CONSTANTS.TYPES.TIMER:
          if (!timerInstance) {
            timerInstance = new Timer();
          }
          return timerInstance;
        case CONSTANTS.TYPES.ACTION:
          if (!actionInstance) {
            actionInstance = new Action();
          }
          return actionInstance;
        default:
          if (!inputInstance) {
            inputInstance = new Input();
          }
          return inputInstance;
      }
    }
  };
})();
export default Singleton;
