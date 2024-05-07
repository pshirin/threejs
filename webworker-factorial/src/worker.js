if (this.Worker) {
  const factorial = (n) => {
    return n > 1 ? factorial(n - 1) * n : 1;
  };

  onmessage = function (e) {
    const result = factorial(Number(e.data));
    this.postMessage(result);
  };
}
