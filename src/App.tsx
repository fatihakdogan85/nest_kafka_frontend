import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const BACKEND_URL = "http://localhost:3000/v1/emails";

  //Request count input
  const [requestCount, setRequestCount] = useState(0);
  //Requests for table view
  const [requests, setRequests] = useState([]);
  //State for disabling button on request sending
  const [requestSending, setRequestSending] = useState(false);

  const onRequestCountChange = (requestInput: number) => {
    setRequestCount(requestInput);
  };

  const onSubmitRequest = () => {
    //Send the request to backend
    setRequestSending(true);
    let payload = { requestCount };
    axios
      .post(BACKEND_URL, payload)
      .then((postResponse) => {
        setRequestSending(false);
      })
      .catch((e) => {
        console.log("Exception at sending email request,", e);
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      //Get requests list from backend every half second
      axios.get(BACKEND_URL).then((response) => {
        setRequests(response.data);
      });
    }, 500);

    return () => clearInterval(interval);
  });

  return (
    <div className="App">
      <header className="App-header">
        <p>Welcome to Email Sender, please enter the mail job request.</p>
        <div id="commandDiv" className="App-command">
          <input
            type="number"
            id="requestCount"
            name="requestCount"
            onChange={(e) => onRequestCountChange(Number(e.target.value))}
            value={requestCount}
            placeholder="Number of mails to send"
            autoComplete="off"
          />

          <button onClick={onSubmitRequest} disabled={requestSending}>
            {requestSending ? "Sending..." : "Send"}
          </button>
        </div>
        <table className="App-table">
          <tr>
            <th>Request ID</th>
            <th>Request Target</th>
            <th>Request Processed</th>
          </tr>
          {requests.map((val: any, key: any) => {
            return (
              <tr key={key}>
                <td>{val.requestId}</td>
                <td>{val.requestCount}</td>
                <td>{val.processedRequestCount}</td>
              </tr>
            );
          })}
        </table>
      </header>
    </div>
  );
};

export default App;
