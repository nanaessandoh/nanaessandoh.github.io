// DOM queries
const chatList = document.querySelector('.chat-list');
const newChatForm = document.querySelector('.new-chat');
const newNameForm = document.querySelector('.new-name');
const updateMessage = document.querySelector('.update-mssg');
const rooms = document.querySelector('.chat-rooms');


// add a new chat
newChatForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = newChatForm.message.value.trim();
    chatRoom.addChat(message).then( () =>{
        newChatForm.reset();
    }).catch( error => 
        console.log(error));
});


// Update username
newNameForm.addEventListener('submit', e => {
    e.preventDefault();
    // Update name via chatroom class
    const newName = newNameForm.name.value.trim();
    chatRoom.updateName(newName);
    // reset the form
    newNameForm.reset();
    // show then update the update message
    updateMessage.innerText = `Your name was updated to ${newName}`;

    // Disappers after 3 secs
    setTimeout(() =>updateMessage.innerText = '',3000);
});


// Update the chatroom
rooms.addEventListener('click', e => {
    if(e.target.tagName === 'BUTTON'){
        chatUI.clear();
        chatRoom.updateRoom(e.target.getAttribute('id'));
        chatRoom.getChats(chats => chatUI.render(chats));
    }
})


// check local storage for a name
const username = localStorage.username ? localStorage.username : 'Anonymous';

// class instances
const chatUI = new ChatUI(chatList);

const chatRoom = new Chatroom("general", username);

// get chats and render
chatRoom.getChats((data) => chatUI.render(data));
