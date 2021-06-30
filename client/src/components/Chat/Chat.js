import React,{useState,useEffect,useRef} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import './Chat.css';
import InfoBar from '../InfoBar/InfoBar';
import Messages from '../Messages/Messages';
import Input from '../Input/Input';
import TextContainer from '../TextContainer/TextContainer';
import TypingInfo from '../TypingInfo/TypingInfo';

let socket;

const Chat = ({location})=>{
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users,setUsers] = useState([]);

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [typingUsers,_setTypingUsers]= useState([]);
    const typingUsersRef = useRef(typingUsers);
    const setTypingUsers = data=>{
        typingUsersRef.current=data;
        _setTypingUsers(data);
    }

    const ENDPOINT = 'http://192.168.1.101:5000/';

    useEffect(()=>{
        const {name,room} = queryString.parse(location.search);
        
        socket = io(ENDPOINT);
        setName(name);
        setRoom(room);

        socket.emit('join',{name,room},()=>{
        turnSocket(name);
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

    useEffect(()=>{
        socket.emit('sendTyping',{},()=>{

        });

    },[message]);

    const turnSocket = (name)=>{
        socket.on('typing',({user})=>{
            console.log(user,name);
            // if (name==='') return;
            if (user===name) return;

            let userStored = typingUsersRef.current.find((u)=>u.user===user);
            console.log(typingUsersRef.current)
            console.log(userStored)
            if (userStored){
                clearTimeout(userStored.timeout);
                userStored.timeout = setTimeout(()=>{
                    let newUsers = typingUsersRef.current.filter((u)=>u.user!==user);
                    setTypingUsers(newUsers);
                    console.log("timeout after");
                },2000);
                return;
            }

            let userData={
                user:user,
                timeout:setTimeout(()=>{
                    let newUsers = typingUsersRef.current.filter((u)=>u.user!==user);
                    setTypingUsers(newUsers);
                    console.log("timeout first");
                },2000)
            }

            setTypingUsers([...typingUsersRef.current,userData]);
        });
    }
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
   /* const typingUsersFormat = typingUsers.map((user)=>{
        <TypingInfo username={user}/>
    });*/

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/>
                <Messages messages={messages} name={name}/>
                {typingUsers.map((userData)=><TypingInfo username={userData.user}/>)}
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
            <TextContainer users={users} name={name}/>
        </div>
    )
}

export default Chat;