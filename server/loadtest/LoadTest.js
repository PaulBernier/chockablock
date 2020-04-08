class LoadTest {
  constructor(obj) {
    if (obj) {
      this._id = obj._id;
      this.start = obj.start;
      this.end = obj.end;
      this.events = obj.events;
      this.generatorConfig = obj.generatorConfig;
      this.chainIds = obj.chainIds;
      this.type = obj.type;
    } else {
      this.events = [];
    }
  }

  startBy(user) {
    this.start = {
      user,
      timestamp: parseInt(Date.now() / 1000),
    };
  }

  stopBy(user) {
    this.end = {
      user,
      timestamp: parseInt(Date.now() / 1000),
    };
  }

  isActive() {
    return !this.end;
  }

  addEvent({ type }) {
    this.events.push({ type, timestamp: parseInt(Date.now() / 1000) });
  }
}

module.exports = LoadTest;
