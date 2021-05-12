import React,{useState,useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import './Chat.css';
import InfoBar from '../InfoBar/InfoBar';
import Messages from '../Messages/Messages';
import Input from '../Input/Input';
import TextContainer from '../TextContainer/TextContainer';
let socket;

const Chat = ({location})=>{
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users,setUsers] = useState([]);

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const ENDPOINT = 'http://localhost:5000/';

    useEffect(()=>{
        const {name,room} = queryString.parse(location.search);
        
        socket = io(ENDPOINT);
        setName(name);
        setRoom(room);

        socket.emit('join',{name,room},()=>{

        });

       /* return ()=>{
            socket.emit('disconnect');
            socket.off();
            
        }*/

    },[ENDPOINT,location.search]);

    useEffect(()=>{
        socket.on('message',(message)=>{
            setMessages([...messages,message]);
        })
    },[messages]);

    useEffect(()=>{
        socket.on('roomData',({users})=>{
            setUsers(users);
        });

    },[users])

    const sendMessage = (event)=>{
        event.preventDefault();
        if (!message) return;

        socket.emit('sendMessage',message,()=>setMessage(''));

    }
    const messagesFormat = messages.map((msg)=>
                                            <div>
                                                Sender:{msg.user}
                                                <br/>
                                                Message:{msg.text}
                                            </div>);
    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/>
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
            <TextContainer users={users} name={name}/>
        </div>
    )
}

export default Chat;