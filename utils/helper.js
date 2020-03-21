export const getDateString = function() {
  let current = new Date();
  let year = current.getFullYear();
  let month = current.getMonth() + 1;
  let day = current.getDate() + 1;
  day = day < 10 ? `0${day}` : day;
  month = month < 10 ? `0${month}` : month;
  return `${year}-${month}-${day}`;
};

export const getTimeParts = function(time) {
  let days = Math.floor(time / (1000 * 60 * 60 * 24));
  time = time % (1000 * 60 * 60 * 24);
  let hours = days * 24 + Math.floor(time / (60 * 60 * 1000));
  time = time % (60 * 60 * 1000);
  let minutes = Math.floor(time / (60 * 1000));
  time = time % (60 * 1000);
  let seconds = Math.floor(time / 1000);
  time = time % 1000;
  let milliSeconds = time;

  return {
    hours,
    minutes,
    seconds,
    milliSeconds
  };
};
