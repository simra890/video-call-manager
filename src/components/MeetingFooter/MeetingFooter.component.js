import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faVideo,
  faDesktop,
  faVideoSlash,
  faMicrophoneSlash,
  faLink,
  faLinkSlash,
  faAlignLeft,
  faSlash,
  faCamera,
  faPhone,
  faKey,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import "./MeetingFooter.css";
import { Link } from "react-router-dom";
import Model from "../Model/Model";
import { useContext } from 'react';
import { AppContext, stopVideoRecording } from '../../AppContext';
import Chatbot from "../Chatbot/Chatbot";

const MeetingFooter = (props) => {
  const { appState, setAppState } = useContext(AppContext);
  const inputRef = useRef();
  const [keyPoints, setKeyPoints] = useState([]);
  const [streamState, setStreamState] = useState({
    mic: true,
    video: false,
    screen: false,
  });


  const handleChatbot = () => {
    setAppState(prevState => ({
      ...prevState,
      showChatbot: !prevState.showChatbot
    }));
  };
  

  const micClick = () => {
    setStreamState((currentState) => {
      return {
        ...currentState,
        mic: !currentState.mic,
      };
    });
  };

  const onVideoClick = () => {
    setStreamState((currentState) => {
      return {
        ...currentState,
        video: !currentState.video,
      };
    });
  };

  const onScreenClick = () => {
    props.onScreenClick(setScreenState);
  };

  const setScreenState = (isEnabled) => {
    setStreamState((currentState) => {
      return {
        ...currentState,
        screen: isEnabled,
      };
    });
  };

const onScreenshotClick = async () => {
  try {
    const response = await fetch('http://localhost:5000/screen-shot');
    if (!response.ok) {
      throw new Error(`Failed to capture screenshot: ${response.status} ${response.statusText}`);
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'screenshot.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error capturing screenshot:', error.message);
  }
};

  function onKeyClick() {
    setAppState({
      loaderShow: false,
      model: {
        showModel: true,
        modelNeedInput: true,
        modelType: 'keys',
        modelMsg: "Enter a Key Points:"
      }
    });
  }

  useEffect(() => {
    props.onMicClick(streamState.mic);
  }, [streamState.mic]);

  useEffect(() => {
    props.onVideoClick(streamState.video);
  }, [streamState.video]);

  return (
    <>
  <ReactTooltip id="tooltip" effect="solid" />
      {appState.showChatbot && <Chatbot />}
      {appState.model.showModel && (
        <Model
          message={appState.model.modelMsg}
          setKeyPoints={setKeyPoints}
          keyPoints={keyPoints}
          inputRef={inputRef}
        />
      )}
      <div className="meeting-footer border-t">
        <div
          className={`meeting-icons ${!streamState.mic ? "active" : ""}`}
          title={streamState.mic ? "Mute Audio" : "Unmute Audio"}
          onClick={micClick}
        >
          <FontAwesomeIcon
            icon={!streamState.mic ? faMicrophoneSlash : faMicrophone}
          />
        </div>
        <div
          className={`meeting-icons ${!streamState.video ? "active" : ""}`}
          title={streamState.video ? "Hide Video" : "Show Video"}
          onClick={onVideoClick}
        >
          <FontAwesomeIcon icon={!streamState.video ? faVideoSlash : faVideo} />
        </div>
        <div className="meeting-icons" onClick={onScreenshotClick}
          title="Take Screenshot"
          >
          <FontAwesomeIcon icon={faCamera} />
        </div>
        <Link to='summary'>
          <div className="meeting-icons active"
          title="End Call"
          onClick={stopVideoRecording}
          >
            <FontAwesomeIcon icon={faPhone} />
          </div>
        </Link>
        <div
          className="meeting-icons"
          title="Share Screen"
          onClick={onScreenClick}
          disabled={streamState.screen}
        >
          <FontAwesomeIcon icon={faDesktop} />
        </div>
        <div
          className={`meeting-icons ${props.meetingState.meetingInfo ? "" : "active"}`}
          title={props.meetingState.meetingInfo ? "Close Link Info" : "Link Info"}
          onClick={() =>
            props.setMeetingState((prev) => ({
              ...prev,
              meetingInfo: !prev.meetingInfo,
            }))
          }
        >
          <FontAwesomeIcon
            icon={props.meetingState.meetingInfo ? faLink : faLinkSlash}
          />
        </div>
        <div
          className={`meeting-icons ${props.meetingState.transcription ? "" : "active"}`}
          title="Transcription"
          onClick={() =>
            props.setMeetingState((prev) => ({
              ...prev,
              transcription: !prev.transcription,
            }))
          }
        >
          {props.meetingState.transcription ? (
            <FontAwesomeIcon icon={faAlignLeft} />
          ) : (
            <>
              <FontAwesomeIcon
                icon={faSlash}
                className="overlay-icon"
                style={{ position: "absolute" }}
              />
              <FontAwesomeIcon
                icon={faAlignLeft}
                style={{ position: "relative" }}
              />
            </>
          )}
        </div>
        <div className="meeting-icons" onClick={onKeyClick}
        title="Key Points">
          <FontAwesomeIcon icon={faKey} />
        </div>
        <div
          className={`meeting-icons ${appState.showChatbot ? "" : "active"}`}
          title="Chatbot"
          onClick={handleChatbot}
        >
          {appState.showChatbot ? (
            <FontAwesomeIcon icon={faMessage} />
          ) : (
            <>
              <FontAwesomeIcon
                icon={faSlash}
                className="overlay-icon"
                style={{ position: "absolute" }}
              />
              <FontAwesomeIcon
                icon={faMessage}
                style={{ position: "relative" }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};


export default MeetingFooter;
