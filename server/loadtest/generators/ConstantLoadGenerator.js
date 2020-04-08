const LoadGenerator = require("./LoadGenerator");

class ConstantLoadGenerator extends LoadGenerator {
  getConfig({ eps = 1, entrySize = 1024 }) {
    if (eps <= 0) {
      throw new Error(`EPS must be positive. Received: ${eps}`);
    }
    if (entrySize <= 0 || entrySize > 10240) {
      throw new Error(`Invalid entry size: ${entrySize}`);
    }

    return { eps, entrySize };
  }

  async run({ eps, entrySize }) {
    const interval = 1000 / eps;

    console.log(`ConstantLoadGenerator: sending entries every ${interval}ms`);

    this.intervalId = setInterval(() => {
      this.add({ entrySize });
    }, interval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

module.exports = ConstantLoadGenerator;
