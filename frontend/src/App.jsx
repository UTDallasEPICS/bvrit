import "./App.css";
import logo from "./logo.png"; 

function App() {
  return (
    <div className="page">
      <div className="chatbot">

        <div className="chat-header">
          <div className = "assistant-title"> 
              <img src ={logo} alt = "Logo" />
          <h2>Support Assistant</h2>
        </div> 
        
          <button>X</button>
        </div>

        <div className="chat-body">
          <div className="bot-message">
            This is ChatBot AI.
            <br />
            How can I help you?
          </div>

          <div className="user-message">
            Question
          </div>
        </div>

        <div className="chat-input">
          <input placeholder="Type your message..." />
          <button>Send</button>
        </div>

      </div>
    </div>
  );
}

export default App;