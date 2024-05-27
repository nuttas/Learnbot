import React, { useEffect, useState } from 'react';
import { useClient } from 'next/data-client';

const Chatbot: React.FC = () => {
  useClient();
  
  const [state, setState] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
      const openButton = document.querySelector('.chatbox__button button');
      const chatBox = document.querySelector('.chatbox__support');
      const sendButton = document.querySelector('.send__button');

      const display = () => {
          openButton?.addEventListener('click', () => toggleState(chatBox));

          sendButton?.addEventListener('click', () => onSendButton(chatBox));

          const node = chatBox?.querySelector('input');
          node?.addEventListener("keyup", ({ key }) => {
              if (key === "Enter") {
                  onSendButton(chatBox);
              }
          });
      };

      const toggleState = (chatbox: HTMLElement | null) => {
          setState(prevState => !prevState);

          // show or hide the box
          if (state) {
              chatbox?.classList.add('chatbox--active');
          } else {
              chatbox?.classList.remove('chatbox--active');
          }
      };

      const onSendButton = (chatbox: HTMLElement | null) => {
          const textField = chatbox?.querySelector('input');
          const text1 = textField?.value;
          if (!text1) {
              return;
          }

          const msg1 = { name: "User", message: text1 };
          setMessages(prevMessages => [...prevMessages, msg1]);

          fetch('http://127.0.0.1:5000/predict', {
              method: 'POST',
              body: JSON.stringify({ message: text1 }),
              mode: 'cors',
              headers: {
                  'Content-Type': 'application/json'
              },
          })
          .then(r => r.json())
          .then(r => {
              const msg2 = { name: "Sam", message: r.answer };
              setMessages(prevMessages => [...prevMessages, msg2]);
              updateChatText(chatbox);
              textField!.value = '';
          }).catch((error) => {
              console.error('Error:', error);
              updateChatText(chatbox);
              textField!.value = '';
          });
      };

      const updateChatText = (chatbox: HTMLElement | null) => {
          let html = '';
          messages.slice().reverse().forEach(item => {
              if (item.name === "Sam") {
                  html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';
              } else {
                  html += '<div class="messages__item messages__item--operator">' + item.message + '</div>';
              }
          });

          const chatmessage = chatbox?.querySelector('.chatbox__messages');
          chatmessage!.innerHTML = html;
      };

      display();

      return () => {
          openButton?.removeEventListener('click', () => toggleState(chatBox));
          sendButton?.removeEventListener('click', () => onSendButton(chatBox));
      };
  }, [state, messages]);
    return (
        <div className="container">
            <div className="chatbox">
                <div className="chatbox__support">
                    <div className="chatbox__header">
                        <div className="chatbox__image--header">
                            <img src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png" alt="image" />
                        </div>
                        <div className="chatbox__content--header">
                            <h4 className="chatbox__heading--header">Learnbot</h4>
                            <p className="chatbox__description--header">สวัสดีฉัน Learnbot นะ มีอะไรให้ช่วยมั้ย?</p>
                        </div>
                    </div>
                    <div className="chatbox__messages">
                        <div></div>
                    </div>
                    <div className="chatbox__footer">
                        <input type="text" placeholder="เขียนข้อความซักหน่อยสิ..." />
                        <button className="chatbox__send--footer send__button"><span className="material-symbols-outlined">send</span></button>
                    </div>
                </div>
                <div className="chatbox__button">
                    <button><img src="./images/chatbox-icon.svg" alt="icon" /></button>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;
