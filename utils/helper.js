export const getDateString = function() {
  let current = new Date();
  let year = current.getFullYear();
  let month = current.getMonth() + 1;
  let day = current.getDate() + 1;
  day = day < 10 ? `0${day}` : day;
  month = month < 10 ? `0${month}` : month;
  return `${year}-${month}-${day}`;
};

export const getTimeParts = function(time, daysRequired = true) {
  let days = Math.floor(time / (1000 * 60 * 60 * 24));
  time = time % (1000 * 60 * 60 * 24);
  let hours = daysRequired
    ? days * 24 + Math.floor(time / (60 * 60 * 1000))
    : Math.floor(time / (60 * 60 * 1000));
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

export const saveDataInStorage = function(data, key) {
  if (data && typeof data === "object") {
    data = JSON.stringify(data);
  }
  let storage = window.localStorage;
  storage && storage.setItem(key, data);
};
export const getDataFromStorage = function(key) {
  let storage = window.localStorage;
  let data = storage && storage.getItem(key);
  return data;
};

export const removeDataFromStorage = function(key) {
  let storage = window.localStorage;
  storage && storage.removeItem(key);
};
