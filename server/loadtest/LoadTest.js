const uuidv4 = require("uuid/v4");

class LoadTest {
  constructor() {
    this.id = uuidv4();
    this.events = [];
    this.generator = {
      config: {},
      data: {}
    };
  }

  isActive() {
    return !this.events.find(e => e.type === "stop");
  }

  addEvent({ user, type }) {
    this.events.push({ user, type, timestamp: parseInt(Date.now() / 1000) });
  }
}

module.exports = LoadTest;
