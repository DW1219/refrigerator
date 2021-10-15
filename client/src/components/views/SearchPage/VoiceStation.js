import React, { useState, useEffect, useRef } from "react";

function VoiceStation({ setDisplayStatus }) {
  var initialText = [
    "찾고 싶은 것을 말씀하세요.",
    <br />,
    '예) "콩나물 찾아줘"',
  ];

  const [responseText, setResponseText] = useState(initialText);
  const [isListening, setIsListening] = useState(false);

  const webSocketUrl = "ws://localhost:8008/nlu/dialogflow/stream/text";
  let ws = useRef(null);

  useEffect(() => {
    start();

    return () => {
      console.log("clean up");
      ws.current.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = () => {
    console.log("start");
    ws.current = new WebSocket(webSocketUrl);
    ws.current.onopen = () => {
      console.log("connected to " + webSocketUrl);
      ws.current.send(
        JSON.stringify({
          project_id: "damda-9rvx",
          session_id: "123456",
        })
      );
      setIsListening(true);
    };

    ws.current.onclose = (error) => {
      console.log("disconnect from " + webSocketUrl);
      setIsListening(false);
    };

    ws.current.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.response_type === "intermediate_transcript") {
        setResponseText(data.text);
        console.log(data.text);
      } else {
        var responses = {
          default_fallback_intent_response_1: "이해할 수 없는 말이에요.",
          default_fallback_intent_response_2: "잘 못 알아 들었어요.",
          default_fallback_intent_response_3: "제가 할 수 없는 일이에요.",
          feature_description_intent_response:
            '지금은 "레시피 검색" 기능을 사용할 수 있어요.',
          recipe_search_intent_response: "레시피를 알려드릴게요.",
        };

        setIsListening(false);
        setResponseText(responses[data.result.response_text]);

        if (data.result.intent === "Recipe Search Intent") {
          setResponseText(
            data.result.parameters.food + " 레시피를 알려드릴게요."
          );
          setDisplayStatus(false);
          // document.location.href =
          //   "http://127.0.0.1:9007/search/" + data.result.parameters.food;
        } else if (data.result.intent === "Default Welcome Intent") {
          setResponseText(data.result.response_text);
        }
      }
    };
  };

  //const mic1 = require('../../../images/')

  return (
    <div
      className="dim"
      onClick={() => {
        setDisplayStatus(false);
      }}
    >
      <div className="voice__box">
        <p className="text__slarge color__white">{responseText}</p>
        {/* <div
          className={isListening ? "voice__icon effect" : "voice__icon"}
          onClick={(e) => {
            e.stopPropagation();
          }}
        > */}
        <i
          className={isListening ? "icon__voice__listening" : "icon__voice"}
          onClick={(e) => {
            console.log("refresh");
            e.stopPropagation();
            setResponseText("");
            start();
          }}
        ></i>
        {isListening && <div className="effect__out"></div>}
        {/* </div> */}
      </div>
    </div>
  );
}

export default VoiceStation;
