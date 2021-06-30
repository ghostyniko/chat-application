import React from 'react';


import './TextContainer.css';
import {useSelector} from 'react-redux';

const TextContainer = ({name})=>{
    const users = useSelector((state)=>state.users.users);
    return (
       <div className="roomDataContainer">
           <div class="infoBar inforBarRoomData"><h3>Active users</h3></div>
           <div class="userListContainer">
               {users.map((user)=><div className={name===user.name?"user userMe":"user"}>{user.name}</div>)}
           </div>
       </div>
    );
}

export default TextContainer;