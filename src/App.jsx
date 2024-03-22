import { useState } from "react";
import { useEffect } from "react";
import PropTypes from "prop-types";

export default function App() {
  let [convertedData, setConvertedData] = useState(0);
  function handleConvertedData(value) {
    setConvertedData(value);
  }
  useEffect(
    function () {
      if (!convertedData) return;
      document.title = `Your Total Converted Amount Is ${convertedData}`;
      return function () {
        document.title = "Currency | Converter";
      };
    },
    [convertedData]
  );

  return (
    <>
      <Skeleton
        convertedData={convertedData}
        handleConvertedData={handleConvertedData}
      />
    </>
  );
}

function Skeleton({ convertedData = 0, handleConvertedData }) {
  let [currency_1, setCurrency_1] = useState("USD");
  let [currency_2, setCurrency_2] = useState("USD");
  let [inputAmount, setInputAmount] = useState("");
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(null);

  useEffect(
    function () {
      const controller = new AbortController();
      async function convertMoney() {
        try {
          setLoading(true);
          let money = await fetch(
            `https://api.frankfurter.app/latest?amount=${inputAmount}&from=${currency_1}&to=${currency_2}`,
            { signal: controller.signal }
          );
          let data = await money.json();
          if (data.message) throw new Error(`${data.message}`);
          console.log(data.rates[currency_2]);
          handleConvertedData(data.rates[currency_2]);
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setLoading(false);
          setError(null);
        }
      }
      if (currency_1 == currency_2) {
        handleConvertedData(inputAmount);
      }
      convertMoney();
      return function () {
        controller.abort();
      };
    },
    [currency_1, currency_2, handleConvertedData, inputAmount]
  );

  function handleValue(value) {
    setCurrency_1(value);
  }
  function handleValue_1(value) {
    setCurrency_2(value);
  }
  function handleInput(value) {
    setInputAmount(value);
  }
  return (
    <div className="wrapper">
      <input
        type="number"
        value={inputAmount}
        onChange={(e) => handleInput(Number(e.target.value))}
        className="inputNumber"
      />
      <span> </span>
      <select
        name="currency_1"
        id="currency_1"
        value={currency_1}
        onChange={(e) => handleValue(e.target.value)}
      >
        <option value="USD">USD</option>
        <option value="CAD">CAD</option>
        <option value="EUR">EUR</option>
        <option value="INR">INR</option>
      </select>
      <span className="to-text"> TO </span>
      <select
        name="currency_2"
        id="currency_2"
        value={currency_2}
        onChange={(e) => handleValue_1(e.target.value)}
      >
        <option value="USD">USD</option>
        <option value="CAD">CAD</option>
        <option value="EUR">EUR</option>
        <option value="INR">INR</option>
      </select>
      <br />
      <p
        style={{
          color: "#333",
          fontWeight: "500",
          fontSize: "20px",
          marginTop: "20px",
        }}
      >
        Your Total is :{" "}
        {loading
          ? "loading..."
          : `${inputAmount} ${currency_1} is : ${convertedData}`}{" "}
        {currency_2}
      </p>
      <br />
      <p>{error && `the problem is : ${error.message}`}</p>
    </div>
  );
}
Skeleton.propTypes = {
  convertedData: PropTypes.number,
  handleConvertedData: PropTypes.func,
};
