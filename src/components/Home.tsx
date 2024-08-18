import { Autocomplete, Avatar, Chip, Stack, TextField } from '@mui/material';
import React, { useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { IUser } from '../types/type';

const totalUsers = [
  { label: 'Mayank', userId: 1994 },
  { label: 'Another User', userId: 1972 },
]

const users: IUser[] = [
  { "id": "1e488aee-fb5a-4e93-bb1b-dd9711214e87", "name": "Dynah", "username": "dyesinin0", "email": "dfley0@cpanel.net" },
  { "id": "acbcd705-bc4b-47fe-97d3-e428fe340a84", "name": "Mirella", "username": "mfinlayson1", "email": "mvarndall1@cisco.com" },
  { "id": "b890037e-dd55-4d4a-8776-f690bad3cdfe", "name": "Benny", "username": "bkohnemann2", "email": "bnoye2@paginegialle.it" },
  { "id": "6e65c38d-eba6-47fb-89da-38009a4ee2bc", "name": "Bertrando", "username": "bstollberg3", "email": "bciccoloi3@vistaprint.com" },
  { "id": "9bed52d2-b1e9-494a-9a1b-88d88c219634", "name": "Kaitlin", "username": "kandrei4", "email": "kbencher4@hhs.gov" },
  { "id": "846f2bf9-eb43-4cfb-819b-9ba23f98ea62", "name": "Jon", "username": "jsilverstone5", "email": "jstaries5@unesco.org" },
  { "id": "711f8b09-b5a3-408e-8b66-48d003d28031", "name": "Max", "username": "mmandel6", "email": "mcambling6@eventbrite.com" },
]

const Home = () => {
  const [search, setSearch] = useState("");
  const [clickout, setClickout] = useState(0);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isOnline, setIsOnline] = useState(true)
  const [isTyping, setIsTyping] = useState(false)

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
            <div key={user.id} className={`flex gap-4 border-b-[1px] hover:bg-[var(--color-secondary)] cursor-pointer ${selectedUser?.id === user.id && "bg-[var(--color-secondary)]"}`} onClick={() => setSelectedUser(user)}>
              <div className={`w-[0.6rem] ${selectedUser?.id === user.id ? "bg-[var(--cta-color)]" : ""} `}></div>
              <div className="py-4 flex gap-2">
                <Avatar>{user?.name?.substring(0, 1)}</Avatar>
                <div className="flex flex-col">
                  <div className="flex gap-3 items-center">
                    <h2 className="font-medium">{user?.name}</h2>
                    <p className="rounded-full w-1 h-1 opacity-75 bg-[var(--accent-color)]"></p>
                    <p className="text-sm text-[var(--accent-color)]">11 days</p>
                  </div>
                  <div>
                    <span className="text-[var(--text-color)] font-medium">Mayank: </span>
                    <span>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis ab assumenda molestias architecto dolores autem accusantium dolore</span>
                  </div>
                </div>
              </div>
            </div>
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

            {/* Message Input */}

          </>

        }
      </div>
    </div>
  )
}

export default Home
