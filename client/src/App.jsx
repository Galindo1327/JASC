import io from 'socket.io-client'

import { useState } from 'react'
import './App.css'
import Chat from './Chat'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";


const socket = io.connect("http://localhost:3001")

function App() {
  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")
  const [showChat, setshowChat] = useState(false)

  const joinRoom = () => {
    if(username !== "" && room !== ""){
      socket.emit("join_room", room)
      setshowChat(true)
    }
  }

  return (
    <div>
      { !showChat ? (
        <div className="bg-slate-900 w-screen h-screen flex justify-center items-center">
          <Card className="w-96 max-w-sm mx-min">
            <CardHeader
              variant="gradient"
              color="teal"
              className="mb-4 grid h-28 place-items-center"
            >
              <Typography variant="h3" color="white">
                JASC
              </Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <Input 
                label="Usuario" 
                size="lg" 
                onChange={e => setUsername(e.target.value)} 
              />
              <Input 
                label="ID Sala" 
                size="lg" 
                onChange={e => setRoom(e.target.value)}
              />
            </CardBody>
            <CardFooter className="pt-0">
              <Button 
                variant="gradient" 
                fullWidth
                onClick={joinRoom}
              >
                Unirse
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  )
}

export default App
