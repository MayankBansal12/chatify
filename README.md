# chatify

Chatify is a simple real-time chat application. Built using React.js, Node.js, and Socket.io, chatify allows users to register on the platform and start with others who are already registered. 
The chat is real-time and shows the user's online/offline/typing status. Users can upload media along with normal messages. 

### Features

-> Real-time chats, achieved using socket.io
<br/>
-> Talk to any user registered on the platform after logging in.
<br/>
-> View the user's offline/online/typing status (using socket.io events)
<br/>
-> Share media along with the messages in chat (using cloudinary for storing media)
<br/>
-> Sort chats on the basis of archived, blocked, and unread chats.
<br/>

### Screenshots and demo

You can view the loom demo video [here](https://www.loom.com/share/1109842a94544584850e0434ec329100?sid=96e53993-40e4-4655-b0ac-28039ecb5cb5)

![chat home page](https://res.cloudinary.com/dwuyp1nss/image/upload/v1724004761/chatify/chat-1.png)

![login page](https://res.cloudinary.com/dwuyp1nss/image/upload/v1724004898/chatify/login.png)

![typing status](https://res.cloudinary.com/dwuyp1nss/image/upload/v1724004990/chatify/typing.png)

![preview ](https://res.cloudinary.com/dwuyp1nss/image/upload/v1724004851/chatify/preview.png)

### Tech Used

- React.js, MUI, Tailwind CSS in frontend
- Node.js, Express.js, PostgreSQL, Drizzle ORM in the backend
- Socket.io for real-time connections
- Cloudinary for uploading media
- Vercel for deploying frontend, Render for deploying backend, NeonDB for PostgreSQL DB

### Improvement Scope

- The search shows all the current registered users along with the ones already chatted and the users themselves.
- No pagination of any kind. All data including messages and users are fetched at once which should be improved to boost the performance.
- Archived and Blocked doesn't work for now.
- Online/Offline status for now depends on the room connection. If A user joins the room with B user then only they will see the online status. This should be improved to show online status when the user is connected to sockets and not to a specific room.

