import React, {useEffect, useState} from 'react';
import './App.css';
import {MonobankService} from "./service";

function App() {
    const [token, setToken] = useState("");
    const [name, setName] = useState("");
    useEffect(() => {
        if (token.length > 40) {
            new MonobankService(token)
                .getPersonalInfo()
                .then(pi => setName(pi.name))
                .catch((reason => setName(reason.name)))
        }
    });
    return (
        <div className="App">
            <label htmlFor="token">Token</label>
            <input
                type="text"
                name="token"
                value={token}
                onChange={(event) => setToken(event.target.value)}
            />
            <p>Detected name: {name}</p>
        </div>
    );
}

export default App;
