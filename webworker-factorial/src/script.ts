if (window.Worker) {
  const factorial = (n) => {
    return n > 1 ? factorial(n - 1) * n : 1;
  };

  const worker = new Worker("worker.js");
  const resultInput = document.getElementById("result") as HTMLInputElement;
  const form = document.forms[0];
  const calculate = (order) => {
    console.time("calculate-with-worker");
    worker.postMessage(order);
    worker.onerror = (e) => {
      console.error(e);
    };
    worker.onmessage = (e) => {
      resultInput.value = String(e.data);
      console.timeEnd("calculate-with-worker");
    };
    worker.onmessageerror = (e) => {
      console.error(e);
    };
  };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const order = formData.get("order");
    if (!order) return;
    calculate(order);
    console.time("calculate-without-worker");
    factorial(order);
    console.timeEnd("calculate-without-worker");
  });
} else {
  document.body.append(
    (document.createElement("div").textContent =
      "Your browser does not support Web Workers.")
  );
}
