"use client";
import React, { useEffect } from 'react';
import "./globals.css";

class Chatbox {
    
    constructor() {
        this.args = {
            openButton: null,
            chatBox: null,
            sendButton: null
        };

        // Check if document is defined
        if (typeof document !== 'undefined') {
            this.args = {
                openButton: document.querySelector('.chatbox__button button'),
                chatBox: document.querySelector('.chatbox__support'),
                sendButton: document.querySelector('.send__button')
            };
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const {openButton, chatBox, sendButton} = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox));

        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox);
            }
        });
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active');
        } else {
            chatbox.classList.remove('chatbox--active');
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value;
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 };
        this.messages.push(msg1);

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
            let msg2 = { name: "Sam", message: r.answer };
            this.messages.push(msg2);
            this.updateChatText(chatbox);
            textField.value = '';
        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox);
            textField.value = '';
        });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item) {
            if (item.name === "Sam") {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';
            } else {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>';
            }
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}

const Chatbot: React.FC = () => {
    useEffect(() => {
        const chatbox = new Chatbox();
        chatbox.display();

        // Cleanup function to remove event listeners if needed
        return () => {
            // Clean up code here
        };
    }, []); // Empty dependency array means this effect will only run once
    
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
