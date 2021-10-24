const users = [];

// Add user to the array of users
const userJoin = (id, userName, room) =>{
    const user = {id, userName, room};
    users.push(user);
    return user;
}

const getCurrentUser = (id) =>{
    return users.find(user => user.id === id);
}

// User leaves the room 
const userLeave = (id) => {

    const index = users.findIndex(user => user.id === id);

    if(index !== -1) { 
        const removedUser = users.splice(index, 1)[0];
        console.log(removedUser);
        return  removedUser;// .splice removes the required no of elements & return them in array
    }
}

const getCurrentRoomUsers = (room) =>{
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getCurrentRoomUsers
}
