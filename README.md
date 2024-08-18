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

### How to setup locally

Start by Fork and cloning the repo and move on to setup client and backend/server

#### For client side

1. Install dependencies:
   ```bash
   npm install
   
2. Build the project:
   ```bash
   npm run build
   
3. Run the server:
   ```bash
   npm run dev

Client will be running on port 5173

.env file
```
VITE_SERVER = http://localhost:5000
```

#### For server side

1. Install dependencies:
   ```bash
   npm install

2. Connect to db and run migrations:
  ```bash
   npx drizzle-kit generate
   npx drizzle-kit migrate
  ```
   
3. Run the backend server:
   ```bash
   npm run dev

server will run on port 5000

Make sure to define these variables inside .env file

```
DB_URL = postgresql_db_url
JWT_SECRET = your_secret
CLOUDINARY_NAME = cloudinary_name
CLOUDINARY_API = cloudinary_api
CLOUDINARY_SECRET = cloudinary_secret
```
Note: Cloudinary is used for uploading media in messages


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

