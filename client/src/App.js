import React, { useState } from "react";
import "./App.css";

function App() {
  const [state, setState] = useState({ url: "", slug: "", created: "" });
  const createUrl = async (e) => {
    e.preventDefault();
    const response = await fetch("/url", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        url: state.url,
        slug: state.slug,
      }),
    });

    setState({ ...state, created: await response.json() });
  };

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  return (
    <div className="App">
      <h1>URL Shortener</h1>
      <form onSubmit={createUrl}>
        url
        <input type="text" name="url" onChange={handleChange} />
        slug
        <input type="text" name="slug" onChange={handleChange} />
        <button>Create Url</button>
      </form>

      {JSON.stringify(state.created, null, 2)}
    </div>
  );
}

export default App;
