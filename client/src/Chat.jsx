import { useEffect, useState, useRef } from "react"
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  CardFooter,
  Textarea,
  IconButton,
} from '@material-tailwind/react'

const Chat = ({socket, username, room}) => {

  const [currentMessage, setCurrentMessage] = useState("")
  const [messagesList, setMessagesList] = useState([])
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const sendMessage = async() => {
    if (username && currentMessage) {
      const info = {
        message: currentMessage,
        room,
        author: username,
        time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes()
      }

      await socket.emit("send_message", info)
      setMessagesList((list) => [...list, info])
    }
  }

  useEffect(() => {

    const messageHandle = (data) => {
      setMessagesList((list) => [...list, data])
    }
    socket.on("receive_message", messageHandle)
    
    return () => socket.off("receive_message", messageHandle)
  }, [socket])

  useEffect(() => {
    scrollToBottom();
  }, [messagesList]);
  

  return (
    <div className="bg-slate-900 w-screen h-screen flex justify-center items-center">
      <Card className="w-full md:w-11/12 h-full md:h-5/6">

        <div className="card-container flex flex-col justify-between h-full">

          <CardHeader className="max-h-min">
            <Typography variant="h2" color="black" className="my-5 md:mt-2">
              {`Chat en vivo | Sala ${room}`}
            </Typography>
          </CardHeader>
          <CardBody className="min-w-min overflow-y-scroll h-full">
            <ol>
            {
              messagesList.map((item, i) => {
                return (
                  <span key={i}>
                    <Card className={`mt-1 max-w-min ${username === item.author ? 'ml-auto' : 'mr-auto'} ${username === item.author ? 'bg-blue-200' : 'bg-green-100'}`} style={{overflow: 'hidden'}}>
                        <Typography className="mt-3 mx-3" color={username === item.author ? 'gray' : 'blue-gray'} style={{textAlign: username === item.author ? 'right' : 'left'}}> {item.author} </Typography>
                        <p className="text-black text-wrap break-words md:max-w-5xl max-w-60 mb-5 mx-5" style={{textAlign: username === item.author ? 'right' : 'left'}}> 
                          {item.message}
                        </p>                     
                    </Card>
                  </span>
                )
              })
            }

            </ol>
            <div ref={messagesEndRef} />
          </CardBody>

          <CardFooter className="mt-auto">
            <div className="flex w-full flex-row items-center gap-2 rounded-[99px] border border-gray-900/10 bg-gray-900/5 p-2">
              <Textarea
                rows={1}
                resize={true}
                placeholder="Mensaje"
                className="min-h-full !border-0 focus:border-transparent"
                value={currentMessage}
                onChange={e => setCurrentMessage(e.target.value)}
                containerProps={{
                  className: "grid h-full",
                }}
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                    setCurrentMessage("");
                  }
                }}
              />
              <div>
                <IconButton variant="text" className="rounded-full" onClick={sendMessage} color="blue">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                </IconButton>
              </div>
            </div>
          </CardFooter>
        </div>
      </Card>
    </div>
  )
}

export default Chat

