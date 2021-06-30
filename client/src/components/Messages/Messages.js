import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from '../Message/Message';
import './Messages.css';
import {useSelector} from 'react-redux';
const Messages = ({name})=>{
    const messages = useSelector((state)=>state.messages.messages);
    return (
       <ScrollToBottom className="messages">
           {messages.map((message, i) => <div key={i}><Message message={message} name={name}/></div>)}
       </ScrollToBottom>
    );
}

export default Messages;