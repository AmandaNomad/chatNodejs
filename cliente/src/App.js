
import './App.css';
import io from 'socket.io-client' //con el io ya podemos comunicarnos al backend
import { useState, useEffect } from 'react'


//objeto socket es el que va apermitir enviar datos al backend
const socket = io('https://chat-nodejs-react.onrender.com') //socket puente de coneccion entre el backend y el frontend

function App() {

  const [message, setMessage] = useState(''); //en message  se guarda el mensaje y en setMessage se va a establecer
  const [messages, setMessages] = useState([{}]) //recibe un evento y esto lo va a ejecutar el formulario cuando es enviado
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', message); // desde el frontend vamos a enviar socket.emit, emitir un evento, recibe 2 parametros, el primero es un nombre y el segundo el es valor en este caso. le esta enviando algo al backedn y el back es el que lo debe escuchar
    const newMessage = {
      body: message,
      from: "Yo"
    }
    setMessages([newMessage, ...messages]);
    setMessage("");
  };

  useEffect(() => {
    const receiveMessage = message => {
      setMessages([message, ...messages]);

    };
    socket.on("message", receiveMessage);

    return () => {
      socket.off("message", receiveMessage);
    };
  }, [messages])

  return (
    <div className="h-screen bg-black text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-10">
      <h1 className ="text-2x1 font-bold my-2">CHAT</h1>

        <input type="text" onChange={e => setMessage(e.target.value)}
          value={message}
          className="borde-3 border zinc-500 p-2 text-black w-full"
        />
        <div className="flex justify-center"> {/* Contenedor para centrar el botón */}
          <button className="bg-green-500 rounded-full px-4 py-2 text-white">Enviar</button>
        </div>

        <ul className="h-80 overflow-y-auto">
        {messages.map((message, index) => (
          <li key={index} className={`my-2 p-2 table text-sm rounded-md ${message.from === "Yo" ? "bg-indigo-700 ml-auto":"bg-gray-800" }`}>
            <p>{message.from}: {message.body}</p>
          </li>
        ))}
        </ul>
      
      </form>

    </div>
  );
}

export default App;
