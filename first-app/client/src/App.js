import logo from './logo.svg';
import './App.css';
import {
  io
} from 'socket.io-client';
import {
  useEffect,
  useState
} from 'react';
import {
  BACKEND_URL
} from './constants';
    
const  socket = io.connect(BACKEND_URL);


function App() {
  const [messages,setMessages] = useState([]);
  const [message,setMessage] = useState("");
   

  useEffect(()=>{
    socket.on("ReceiveMessage", (socketId, socketData) => {
        console.log(socketData.message);
        console.log(messages);
 
        setMessages(messages.concat(socketData.message));
    })
  },[messages])
 
  const onMessageSend = (e)=>{
    e.preventDefault();
    socket.emit("SendMessage","XXXXX",{message});
     setMessages(messages.concat(message));
  }






  return ( <div className = "main-div">
      <div className="text-div">
      {messages.map((m,index)=>(<span key={index} className="text">{m}</span>))}
      </div>
      


      <input onChange={e=>{setMessage(e.target.value)}}/>
      <button onClick={onMessageSend}>Send</button>
    </div>

  );
}

export default App;