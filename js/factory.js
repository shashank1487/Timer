import * as CONSTANTS from "../utils/constants.js";
import Input from "./input.js";
import Timer from "./timer.js";
import Action from "./action.js";

export default Factory = function(type) {
  this.createInstance = function() {
    switch (type) {
      case CONSTANTS.TYPES.INPUT:
        instance = new Input();
        break;
      case CONSTANTS.TYPES.TIMER:
        instance = new Timer();
        break;
      case CONSTANTS.TYPES.ACTION:
        instance = new Action();
        break;
      default:
        instance = new Input();
    }
    return instance;
  };
};
