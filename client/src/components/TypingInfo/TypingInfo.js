import React from 'react';

import './TypingInfo.css';

const TypingInfo = ({username})=>{
    
    return (
       <div className="typingInfoContainer">
           {username} ...
       </div>
       
    );
}

export default TypingInfo;