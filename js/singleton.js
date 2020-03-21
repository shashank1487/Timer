import * as CONSTANTS from "../utils/constants.js";
import Input from "./input.js";
import Timer from "./timer.js";
import Action from "./action.js";

let Singleton = (function() {
  let inputInstance, timerInstance, actionInstance;

  function createInstance(type) {
    let object;
    switch (type) {
      case CONSTANTS.TYPES.INPUT:
        object = new Input();
        break;
      case CONSTANTS.TYPES.TIMER:
        object = new Timer();
        break;
      case CONSTANTS.TYPES.ACTION:
        object = new Action();
        break;
      default:
        object = new Input();
    }
    return object;
  }

  return {
    getInstance: function(type) {
      switch (type) {
        case CONSTANTS.TYPES.INPUT:
          if (!inputInstance) {
            inputInstance = createInstance(type);
          }
          return inputInstance;
        case CONSTANTS.TYPES.TIMER:
          if (!timerInstance) {
            timerInstance = createInstance(type);
          }
          return timerInstance;
        case CONSTANTS.TYPES.ACTION:
          if (!actionInstance) {
            actionInstance = createInstance(type);
          }
          return actionInstance;
        default:
          if (!inputInstance) {
            inputInstance = createInstance(type);
          }
          return inputInstance;
      }
    }
  };
})();
export default Singleton;
