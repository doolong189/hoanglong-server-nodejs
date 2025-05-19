const users = [];

const socketIoService = {
    addUser : ({id, name, room}) => {
        name = name.trim().toLowerCase();
        room = room.trim().toLowerCase();

        const existingUser = users.find(
            user =>
                name === user.name &&
                room === user.room
        );

        if(existingUser) return { error: "Username is taken" };

        const user = {id, name, room};
        users.push(user);

        return {
            user
        }
    },
    removeUser :(id) => {
        const index = users.findIndex(user => user.id === id);

        if(index !== -1){
            return users.splice(index, 1)[0];
        }
    },
    getUser: (id) => users.find(user => user.id === id),
    getUsersInRoom : (room) => users.filter(user => user.room === room)
}

module.exports = socketIoService