import { faTimes, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect } from "react";
import "./Transcription.scss";

const Transcription = ({ setMeetingState, transcriptionMsg }) => {
  const startRecognition = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = ['en-US', 'en-GB']; 
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setMeetingState(prev => ({
            ...prev,
            transcriptionMsg: prev.transcriptionMsg + transcript + '.',
          }));
        } else {
          interimTranscript += transcript;
        }
        // can use transcription msg to send anywhere 
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      console.log('Recognition ended');
      recognition.stop();
    };

    recognition.start();
  };

  useEffect(() => {
    startRecognition();
  }, []);

  const toggleTranscription = useCallback(() => {
    setMeetingState(prev => ({
      ...prev,
      transcription: !prev.transcription,
      transcriptionMsg: prev.transcriptionMsg,
    }));
  }, [setMeetingState]);

  return (
    <>
      <div className={`messenger-container from-left mx-2 my-3 rounded-md`}>
        <div className="border-b-2 pb-3 border-black sticky top-0 bg-white">
          <div className="messenger-header text-2xl">
            <p>Transcription</p>
            <FontAwesomeIcon
              className="icon transition-opa z-10"
              onClick={toggleTranscription}
              icon={faTimes}
            />
          </div>
          <div className="flex justify-center gap-3">
            <div className="">
              <FontAwesomeIcon className="" icon={faUserFriends} />
            </div>
            <p>People (1)</p>
          </div>
        </div>

        <div className="transcript-section pl-7 pr-3 text-left font-medium">
          {transcriptionMsg || (
            <p className="animate-pulse infinite">Talk to display transcription...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Transcription;
