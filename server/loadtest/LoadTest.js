class LoadTest {
  constructor(obj) {
    Object.assign(this, obj);
  }

  isSelfStopping() {
    return this.type === "burst";
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
}

module.exports = LoadTest;
