class Logger {
  _log(method, message, data = {}) {
    const currentTimestamp = Date.now();
    console[method](`${currentTimestamp} - ${message}`, data);
    return currentTimestamp;
  }

  info(message, data) {
    return this._log("info", message, data);
  }

  error(message, data) {
    return this._log("error", message, data);
  }
}

module.exports = new Logger();
