import Timer from "./timer.js";

let initialize;
(function() {
  let timer;
  initialize = function() {
    timer = new Timer();
  };
})();

export default initialize;
