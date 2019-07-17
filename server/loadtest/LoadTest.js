class LoadTest {
  constructor() {
    this.events = [];
  }

  startBy(user) {
    this.start = {
      user,
      timestamp: parseInt(Date.now() / 1000)
    };
  }

  stopBy(user) {
    this.end = {
      user,
      timestamp: parseInt(Date.now() / 1000)
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
