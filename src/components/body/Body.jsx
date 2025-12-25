import "./body.css"
import { useState } from "react";
import { GoogleGenAI } from "@google/genai";

function Body(){
    const ai = new GoogleGenAI({ apiKey: "AIzaSyCT8rtvGXBWRzfp7_RcvZBlx66MHqu66Ng" });
    let message="";
    const  [userInput, setUserInput] = useState("");
    const  [aiInput, setAiInput] = useState("");
    const  [inputField,setInputField] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [chat, setChat] = useState([]);


    async function submitInput() {
        if (!inputField.trim() || isFetching) return;

        setIsFetching(true);

        const userMessage = { sender: "user", text: inputField };
        setChat((prev) => [...prev, userMessage]);



        const reply = await getAiResponse(inputField);

        const aiMessage = { sender: "ai", text: reply };
        setChat((prev) => [...prev, aiMessage]);


        setIsFetching(false); 
    }

    async function getAiResponse(message) {
        try {
            const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: message,
  });
  console.log(response.text);

  return response.text;
}
    catch (error) {
              console.error(error);
            return "Error getting response 😢";
        }
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isFetching) {
            submitInput();
        }
    };


    return(
        <div>
            


            <div className="container">

                <div className="main-body" >
                    <div className="chat-area" >
                        <p> How can I help you ?</p>
                        {chat.map((msg,index) =>(
                            <p
                             key={index}
                             className={msg.sender==="user" ? "user" : "ai"}
                            >
                            {msg.text}
                            </p>
                        ))}


                    </div>
                    <div className="input-msg"  >
                        <input
                          type="text"
                          className="user-input"
                          value={inputField}
                           onChange={(e) => setInputField(e.target.value)}
                            onKeyDown={handleKeyPress}
                           placeholder="Type your message here..." />
                        <button 
                            className="submit-prompt" 
                            onClick={submitInput}
                            disabled={isFetching}>
                            {isFetching ? "Sending..." : "Submit"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Body