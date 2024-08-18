import { Autocomplete, Avatar, Chip, Stack, TextField, Button, Modal } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { IUser } from '../types/type';
import {
  Send,
  ArrowDownward,
  AttachFile,
  HighlightOff,
  ArrowUpward,
} from '@mui/icons-material'
import { io } from 'socket.io-client'
import { useNavigate, useParams } from 'react-router-dom'
import useApi from '../hooks/use-api'
import { formatTime, numericDate } from '../helpers/formatDate'
import { toast } from 'react-toastify'

const backend = import.meta.env.VITE_SERVER

const totalUsers = [
  { label: 'Mayank', userId: 1994 },
  { label: 'Test', userId: 1972 },
]

// const users: IUser[] = [
// { "id": "cef2d603-90a3-4899-9887-328007e640d0", "name": "Mayank", "username": "Mayank", "email": "mcambling6@eventbrite.com" },
// { "id": "bd1bfecc-e2ff-4fcb-bb7a-7322c634a630", "name": "Test", "username": "Test", "email": "mcambling6@eventbrite.com" },

// { "id": "1e488aee-fb5a-4e93-bb1b-dd9711214e87", "name": "Dynah", "username": "dyesinin0", "email": "dfley0@cpanel.net" },
// { "id": "acbcd705-bc4b-47fe-97d3-e428fe340a84", "name": "Mirella", "username": "mfinlayson1", "email": "mvarndall1@cisco.com" },
// { "id": "b890037e-dd55-4d4a-8776-f690bad3cdfe", "name": "Benny", "username": "bkohnemann2", "email": "bnoye2@paginegialle.it" },
// { "id": "6e65c38d-eba6-47fb-89da-38009a4ee2bc", "name": "Bertrando", "username": "bstollberg3", "email": "bciccoloi3@vistaprint.com" },
// { "id": "9bed52d2-b1e9-494a-9a1b-88d88c219634", "name": "Kaitlin", "username": "kandrei4", "email": "kbencher4@hhs.gov" },
// { "id": "846f2bf9-eb43-4cfb-819b-9ba23f98ea62", "name": "Jon", "username": "jsilverstone5", "email": "jstaries5@unesco.org" },
// { "id": "711f8b09-b5a3-408e-8b66-48d003d28031", "name": "Max", "username": "mmandel6", "email": "mcambling6@eventbrite.com" },
// ]

const Home = () => {
  const navigate = useNavigate()
  const callApi = useApi()
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false)
  const [clickout, setClickout] = useState(0);
  const [users, setUsers] = useState<IUser[]>([])
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isOnline, setIsOnline] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [userId, setUserId] = useState<string>("")
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [showScroll, setShowScroll] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const chatContainerRef = useRef(null)
  const [showPhoto, setShowPhoto] = useState('')
  const [imageUrl, setImageUrl] = useState(null)
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [preview, setPreview] = useState(false)
  const handleOpenPreview = () => setPreview(true)
  const handleClosePreview = () => setPreview(false)

  function generateRoomId(id1: string, id2: string) {
    const [first, second] = [id1, id2].sort();
    return `${first}_${second}`
  }

  async function handleImage(img: File) {
    try {
      const base64Img = await convertBase64(img)

      setImageUrl(base64Img as string)
      handleOpenPreview()
    } catch (error) {
      console.log('Error encoding image: ', error)
    }
  }

  async function convertBase64(file: File) {
    if (!file) return undefined
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)

      fileReader.onload = () => {
        resolve(fileReader.result)
      }

      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }

  // handle input message
  const handleInputChange = (e) => {
    setMessage(e.target.value);

    if (socket && selectedUser) {
      const roomId = generateRoomId(userId, selectedUser.id);

      // emit in case input has value
      if (e.target.value.length > 0) {
        socket.emit('typing', { roomId });
      } else {
        socket.emit('stop-typing', { roomId });
      }
    }
  };

  // Send message func
  const sendMessage = (senderId: string, participantId: string, photoLink = '') => {
    if (!socket || !senderId || !participantId) {
      console.log('Error sending message ', 'senderId: ', senderId, ' particid: ', participantId)
      return
    }

    let roomId = generateRoomId(userId, selectedUser?.id)

    socket.emit('stop-typing', { roomId });

    socket.emit('send-message', {
      roomId: roomId,
      senderId: senderId,
      participantId,
      content: message,
      attachment: photoLink
    })

    setMessage('')
    handleClosePreview()
    setImageUrl('')
  }

  // Scroll to top chat setion
  const scrollToTop = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  }

  // Scroll to bottom chat section
  const scrollToBottom = () => {
    console.log('scroll to bottom', chatContainerRef)
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
      console.log(' chatcontainer details: ', chatContainerRef.current)
    }
  }

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;

      // show scroll to top when user is not at top
      if (scrollTop > 0) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      // show scroll to bottom when user is not at bottom
      if (scrollHeight - Math.ceil(scrollTop) > clientHeight) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    }
  }

  const renderMessages = () => {
    let lastDate = null
    let lastSender = null

    if (loading) return <div className="flex h-full justify-center items-center opacity-50 text-lg">fetching messages...</div>

    return messages.length > 0 ? (
      messages?.map((item) => {
        const messageDate = new Date(item.timestamp).toDateString()
        const showDate = messageDate !== lastDate
        const sameSender = item.senderId === userId
        lastDate = messageDate
        lastSender = item.senderId

        console.log('last Date ', lastDate, ' messagDate: ', messageDate)
        console.log("ids: ", item?.senderId, userId)

        return (
          <div key={item.id}>
            {showDate && (
              <div className="flex items-center gap-2 my-4">
                <div className="flex-grow border-gray-200 border-t"></div>
                <p className="text-[14px] text-center text-gray-500">
                  {messageDate}
                </p>
                <div className="flex-grow border-gray-200 border-t"></div>
              </div>
            )}

            <div className={`flex my-2 w-full ${sameSender ? "justify-end" : "justify-start"} `}>
              <div className="max-w-[60%] flex flex-col gap-[0.2rem]">
                {!item.attachment || item.attachment === '' ? (
                  <p className={`py-4 px-4 rounded-md font-medium ${sameSender ? "bg-[var(--cta-color)] text-white" : "bg-[var(--color-secondary)] text-[var(--dark-color)]"}`}>{item.content}</p>
                ) : (
                  <img
                    className="rounded-md w-[500px] cursor-pointer"
                    src={item.attachment}
                    alt="img"
                    onClick={() => {
                      setShowPhoto(item.attachment)
                      handleOpen()
                    }}
                  />
                )}

                <p className="text-[14px] text-gray-500 text-end">
                  {formatTime(item?.timestamp)}
                </p>
              </div>
            </div>
          </div>
        )
      }))
      : (
        <div className="flex h-full justify-center items-center opacity-50 text-lg">No messages yet, start a conversation!</div>
      )
  }

  // connect to the socket
  useEffect(() => {
    const userId = localStorage.getItem("userId")
    setUserId(userId)

    if (!userId) {
      navigate("/auth/login")
      toast("Login to start chatting!", {
        position: "bottom-right",
        type: "info",
        autoClose: 3000,
      });
      return;
    }

    const newSocket = io(backend, {
      query: {
        userId: userId
      }
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  // join room for selected user
  useEffect(() => {
    if (socket && selectedUser) {
      const roomId = generateRoomId(userId, selectedUser.id);

      socket.emit('join-dm', { roomId });

      socket.on('user-online', ({ userId: onlineUserId }) => {
        if (onlineUserId === selectedUser.id) {
          setIsOnline(true);
        }
      });

      socket.on('user-offline', ({ userId: offlineUserId }) => {
        if (offlineUserId === selectedUser.id) {
          setIsOnline(false);
        }
      });

      socket.on('typing', ({ userId: typingUserId }) => {
        if (typingUserId === selectedUser.id) {
          setIsTyping(true);
        }
      });

      socket.on('stop-typing', ({ userId: stopTypingUserId }) => {
        if (stopTypingUserId === selectedUser.id) {
          setIsTyping(false);
        }
      });

      socket.on('receive-message', (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        socket.emit('leave-dm', { roomId });
        socket.off('user-online');
        socket.off('user-offline');
        socket.off('receive-message');
      };
    }
  }, [socket, selectedUser]);

  // Fetch new messages
  const fetchMessages = async (roomId: string) => {
    const participantId = selectedUser?.id
    if (!userId || !participantId) {
      console.log('Error fetching emssages')
      return
    }

    setLoading(true)

    try {
      const res = await callApi(`/chat/messages?chatId=${roomId}`, 'GET', {
        userId,
        participantId,
      })
      if (res.status === 200) {
        console.log(res.data)
        setMessages(res.data.messages)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch new messages whenever participant or user changes
  useEffect(() => {
    const roomId = generateRoomId(userId, selectedUser?.id)
    fetchMessages(roomId)

  }, [userId, selectedUser])

  // Scroll to bottom whenever messages changes!
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (clickout === 0)
      setUsers([{ "id": "cef2d603-90a3-4899-9887-328007e640d0", "name": "Mayank", "username": "Mayank", "email": "mcambling6@eventbrite.com" },
      { "id": "bd1bfecc-e2ff-4fcb-bb7a-7322c634a630", "name": "Test", "username": "Test", "email": "mcambling6@eventbrite.com" },
      ])
    else
      setUsers([])
  }, [clickout])

  return (
    <div className="flex w-full h-screen">
      <div className="w-1/3 h-full border-r-[1px]">
        {/* Search Input */}
        <div className="w-full px-6 py-3 border-b-[1px]">
          <Autocomplete
            freeSolo
            id="combo-box-demo"
            options={totalUsers}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search User"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: <FaSearch />,
                }}
                className="bg-[var(--color-secondary)] text-[var(--accent-color)] px-4"
              />
            )}
          />
        </div>

        {/* Chips */}
        <Stack direction="row" spacing={1} paddingInline={3} paddingBlock={2}>
          <Chip label="All" size='small'
            color={clickout === 0 ? "primary" : "default"}
            sx={{ color: `${clickout === 0 ? "white" : "black"}` }}
            onClick={() => setClickout(0)} />
          <Chip label="Unread" size='small'
            color={clickout === 1 ? "primary" : "default"}
            sx={{ color: `${clickout === 1 ? "white" : "black"}` }}
            onClick={() => setClickout(1)}
          />
          <Chip label="Archived" size='small'
            color={clickout === 2 ? "primary" : "default"}
            sx={{ color: `${clickout === 2 ? "white" : "black"}` }}
            onClick={() => setClickout(2)}
          />
          <Chip label="Blocked" size='small'
            color={clickout === 3 ? "primary" : "default"}
            sx={{ color: `${clickout === 3 ? "white" : "black"}` }}
            onClick={() => setClickout(3)}
          />
        </Stack>

        {/* All Users */}
        <div className="flex flex-col overflow-y-scroll h-[81vh]">
          {users.length > 0 ? users.map((user) => (
            user.id !== userId && (
              <div key={user.id} className={`flex gap-4 border-b-[1px] hover:bg-[var(--color-secondary)] cursor-pointer ${selectedUser?.id === user.id && "bg-[var(--color-secondary)]"}`} onClick={() => setSelectedUser(user)}>
                <div className={`w-[0.6rem] ${selectedUser?.id === user.id ? "bg-[var(--cta-color)]" : ""} `}></div>
                <div className="py-4 flex gap-2">
                  <Avatar>{user?.name?.substring(0, 1)}</Avatar>
                  <div className="flex flex-col">
                    <div className="flex gap-3 items-center">
                      <h2 className="font-medium">{user?.name}</h2>
                      <p className="rounded-full w-1 h-1 opacity-75 bg-[var(--accent-color)]"></p>
                      <p className="text-sm text-[var(--accent-color)]">today</p>
                    </div>
                    <div>
                      <span className="text-[var(--text-color)] font-medium">Mayank: </span>
                      <span>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis ab assumenda molestias architecto dolores autem accusantium dolore</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          ))
            : <div className="flex w-full h-full items-center justify-center text-center text-lg">No user to display, <br /> start a new chat by searching user!</div>
          }
        </div>
      </div>
      
      <div className="w-2/3 h-full">
        {selectedUser === null ? <div className="w-full h-full flex justify-center items-center">No selected chat to display!</div> :
          <>
            {/* Header */}
            <div className="flex gap-2 items-center w-full px-6 py-3 border-b-[1px] bg-[var(--color-secondary)]">
              <Avatar sx={{ width: 50, height: 50 }}>{selectedUser?.name?.substring(0, 1)}</Avatar>
              <div className="flex flex-col">
                <div className="flex gap-2 items-center">
                  <h2 className="font-semibold">{selectedUser?.name}</h2>
                  <p className={`rounded-full w-2 h-2 opacity-75 ${isOnline ? "bg-green-500" : "bg-[var(--accent-color)]"}`}></p>
                </div>
                <p className="text-[var(--light-text)] text-sm font-medium">
                  {!isOnline ? "offline" : isTyping ? "Typing..." : "online"}
                </p>
              </div>
            </div>

            {/* Chats */}
            <div className="relative flex flex-col h-[88vh]">
              <div
                className="flex-1 py-4 px-6 overflow-auto"
                ref={chatContainerRef}
                onScroll={handleScroll}
              >
                {renderMessages()}

                <Modal
                  open={open}
                  onClose={handleClose}
                  className="flex justify-center items-center"
                >
                  <div className="relative">
                    <img
                      src={showPhoto}
                      alt="img"
                      className="lg:!max-w-[750px] lg:!max-h-[750px] md:min-w-[500px] md:min-h-[500px] rounded-md outline-none"
                    />
                    <button
                      className="top-1 right-1 absolute text-gray-300"
                      onClick={handleClose}
                      title="Close"
                    >
                      <HighlightOff />
                    </button>
                  </div>
                </Modal>

                <Modal
                  open={preview}
                  onClose={handleClosePreview}
                  className="flex flex-col justify-center items-center"
                >
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt="img"
                      className="w-[500px] h-[500px] lg:max-w-[900px] lg:max-h-[900px]"
                    />
                    <button
                      className="right-3 bottom-3 absolute flex justify-center items-center bg-[var(--cta-color)] p-2 rounded-full text-white"
                      onClick={() => sendMessage(userId, selectedUser?.id, imageUrl)}
                      title="Send Message"
                    >
                      <Send />
                    </button>
                  </div>
                </Modal>
              </div>

              {showScrollTop && (
                <button
                  className="right-2 bottom-24 absolute bg-[var(--color-secondary)] p-1 rounded-full w-8"
                  onClick={scrollToTop}
                  title="Scroll to top"
                >
                  <ArrowUpward sx={{ color: "var(--cta-color)" }} />
                </button>
              )}

              {showScroll && (
                <button
                  className="right-2 bottom-16 absolute bg-[var(--color-secondary)] p-1 rounded-full w-8"
                  onClick={scrollToBottom}
                  title="Scroll to bottom"
                >
                  <ArrowDownward sx={{ color: "var(--cta-color)" }} />
                </button>
              )}

              {/* Message Input  */}
              <form
                className="bottom-2 sticky flex items-center gap-2 bg-[var(--color-secondary)] mx-8 py-1"
                onSubmit={(e) => {
                  e.preventDefault()
                  sendMessage(userId, selectedUser?.id)
                }}
              >
                <input
                  value={message}
                  onChange={handleInputChange}
                  className="flex-1 bg-transparent px-4 py-2 rounded-lg outline-none"
                  placeholder="Type your message..."
                  type="text"
                />
                <input
                  type="file"
                  title="upload image"
                  placeholder="upload image"
                  name="image"
                  accept="image/*"
                  id="image"
                  onChange={(e) => handleImage(e.target.files[0])}
                  className="hidden"
                />
                <label htmlFor="image" className="cursor-pointer text-[var(--cta-color)] rotate-45">
                  <AttachFile />
                </label>

                <Button type="submit">
                  <Send />
                </Button>
              </form>
            </div>
          </>
        }
      </div>
    </div>
  )
}

export default Home
