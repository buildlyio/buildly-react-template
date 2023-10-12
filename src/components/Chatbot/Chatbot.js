import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import {
  Box, Button, Fab, Popover, useTheme,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

// Set sender here
const sender = 'Insights';
// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = {
  //  Explain things like you're talking to a software professional with 5 years of experience.
  role: 'system', content: "Explain things like you're talking to a software professional with 2 years of experience.",
};
// Initial message state
const initialMessages = [{
  message: "Hello, I'm here to help you! Ask me anything!",
  sentTime: 'just now',
  sender,
}];

const Chatbot = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const history = useHistory();
  const theme = useTheme();
  const open = Boolean(anchorEl);
  const id = open ? 'chatbot-popover' : undefined;

  useEffect(() => {
    if (history.action === "PUSH") {
      setMessages(initialMessages);
    }
  }, []);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: 'user',
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) { // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of
    // { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    const apiMessages = chatMessages.map((messageObject) => {
      let role = '';
      if (messageObject.sender === sender) {
        role = 'assistant';
      } else {
        role = 'user';
      }
      return { role, content: messageObject.message };
    });

    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act.
    const apiRequestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        systemMessage, // The system message DEFINES the logic of our chatGPT
        ...apiMessages, // The messages from our chat with ChatGPT
      ],
    };

    await fetch('https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${window.env.BOT_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiRequestBody),
      })
      .then((data) => data.json())
      .then((data) => {
        setMessages([...chatMessages, {
          message: data.choices[0].message.content,
          sender,
        }]);
        setIsTyping(false);
      })
      .catch((error) => {
        setIsTyping(false);
        console.log(error);
      });
  }

  return (
    <div style={{ position: 'fixed', right: theme.spacing(4), bottom: theme.spacing(3) }}>
      <Button variant="text" onClick={(e) => setAnchorEl(e.currentTarget)} pt={theme.spacing(2)}>
        <Fab color="primary" aria-label="Ask for help here">
          <SmartToyIcon />
        </Fab>
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={(e) => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box width={theme.spacing(48)} height={theme.spacing(75)}>
          <MainContainer>
            <ChatContainer>
              <MessageList
                scrollBehavior="smooth"
                typingIndicator={isTyping ? <TypingIndicator content={`${sender} is typing`} /> : null}
              >
                {_.map(messages, (message, i) => <Message key={i} model={message} />)}
              </MessageList>
              <MessageInput placeholder="Type message here" onSend={handleSend} />
            </ChatContainer>
          </MainContainer>
        </Box>
      </Popover>
    </div>
  );
};

export default Chatbot;
