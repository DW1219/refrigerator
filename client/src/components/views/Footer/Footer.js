import React from 'react'
import "./Footer.css";

function Footer({ voiceStatus, setVoiceStatus }) {
  const clickVoiceBtn = () => {
    setVoiceStatus(!voiceStatus);
    console.log("navi - " + voiceStatus);
  };

  return (
    <div>
      <div className="gnb">
        <button className="button button__back" />
        <a href="#a" className="button button__home" />
        <button
          className={
            voiceStatus ? "button button__voice__off" : "button button__voice"
          }
          onClick={clickVoiceBtn}
        />
      </div>
    </div>
  );
}

export default Footer
