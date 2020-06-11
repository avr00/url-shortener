import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [state, setState] = useState({
    url: "",
    slug: "",
    created: "",
    error: "",
  });

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const error = urlParams.get("error");
    setState({
      ...state,
      error: error
        ? `this ${error.toLowerCase().split("-")[0]} slug was not found`
        : "",
    });
  }, []);

  const createUrl = async (e) => {
    e.preventDefault();
    const response = await fetch("/url", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        url: state.url,
        slug: state.slug || undefined,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      setState({
        ...state,
        error: "",
        created: `https://avr00-short.herokuapp.com/${result.slug}`,
      });
    } else {
      setState({ ...state, error: result.message });
    }
  };

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  console.log(state.created, null, 2);

  const { error, created } = state;

  console.log({ state });

  return (
    <div className="App">
      <h1>URL Shortener</h1>

      {!created ? (
        <form onSubmit={createUrl}>
          {error && <div className="error">{error}</div>}
          <div className="form__group field">
            <label htmlFor="name" className="form__label">
              URL
            </label>
            <input
              type="text"
              name="url"
              onChange={handleChange}
              className="form__field"
              autocomplete="off"
            />
          </div>
          <div className="form__group field">
            <label htmlFor="name" className="form__label">
              Slug (optional)
            </label>
            <input
              type="text"
              name="slug"
              onChange={handleChange}
              placeholder="(optional)"
              className="form__field"
              autocomplete="off"
            />
          </div>
          <button className="brk-btn">Create Url</button>
        </form>
      ) : (
        <>
          Your short url is: <a href={created}>{created}</a>
        </>
      )}
    </div>
  );
}

export default App;
