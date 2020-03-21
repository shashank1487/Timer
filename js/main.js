import Singleton from "./singleton.js";
import Timer from "./timer.js";
import * as CONSTANTS from "../utils/constants.js";

let initialize;
(function() {
  let input;
  initialize = function() {
    input = Singleton.getInstance(CONSTANTS.TYPES.INPUT);
  };
})();

export default initialize;
