import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext, Loader, handleSendMail, downloadVideo} from '../../AppContext';
import './Summary.css';
import Chatbot from '../../components/Chatbot/Chatbot';

export default function Summary() {
  const { appState, setAppState } = useContext(AppContext);
  const [data, setData] = useState({
    keyPoints: [],
    transcribe: '',
    summary: '',
  });
  const messageRef = useRef(null);
  useEffect(() => {
    const storedKeyPoints = localStorage.getItem('keyPoints');
    if (storedKeyPoints) {
      setData((prevData) => ({
        ...prevData,
        keyPoints: JSON.parse(storedKeyPoints),
      }));
      localStorage.removeItem('keyPoints');
    }

    const storedTranscribe = localStorage.getItem('transcript');
    if (storedTranscribe) {
      setData((prevData) => ({
        ...prevData,
        transcribe: storedTranscribe,
      }));
      localStorage.removeItem('transcript');
    }

    setAppState((prevAppState) => ({
      ...prevAppState,
      loaderShow: true,
    }));

    const loaderTimeout = setTimeout(() => {
      setAppState((prevAppState) => ({
        ...prevAppState,
        loaderShow: false,
      }));
    }, 0);

    return () => {
      clearTimeout(loaderTimeout);
    };
  }, [setAppState]);

  return (
    <>
      {appState.loaderShow ? (
        <Loader message={"Heading to the Summary Page. Hold tight, we're almost there!"} />
      ) : (
        <>
          <div className='summary flex flex-col justify-center items-center h-screen'>
            <div ref={messageRef} className='p-10 rounded-xl bg-white text-black max-w-[400px] overflow-y-auto'>
              <h1 className='text-3xl font-semibold mb-4'>Summary:</h1>
              {data.keyPoints.length !== 0 && (
                <div className='mb-3 border-2 p-3 border-black'>
                  <h1 className="text-lg font-semibold mb-1">Key Points Discussed:</h1>
                  <ul>
                    {data.keyPoints.map((point, index) => (
                      <li className='' key={index}>{point}</li>
                    ))}
                    <li>Addressing potential ambiguities in process implementations.</li>
                    <li>Project lead providing clarity.</li>
                    <li>Discussion on legal considerations for specific project activities.</li>
                    <li>Preventing complications later in the project timeline.</li>
                    <li>Testing a car on city roads as an example.</li>
                    <li>Addressing legal aspects during the kickoff meeting to avoid unplanned delays in project implementation.</li>
                  </ul>
                </div>
              )}
              {data.transcribe && <div className='mb-3 border-2 p-3 border-black'>
                <h1 className="text-lg font-semibold mb-1">Transcribed Data:</h1>
                {data.transcribe}
              </div>}

              <div className='mb-3 border-2 p-3 border-black'>
                <h1 className="text-lg font-semibold mb-1">Brief Description:</h1>
                A key focus of the kickoff meeting is addressing potential ambiguities in process implementations, with the project lead providing clarity. Legal considerations, such as permissions for specific project activities, are discussed to prevent complications later in the project timeline. For instance, issues like testing a car on city roads may arise, and addressing these legal aspects during the kickoff meeting helps avoid unplanned delays in project implementation.
              </div>
            </div>
            <div className='flex gap-5 mt-3'>
              <button className='btn '
                onClick={() => {
                  const emailContent = messageRef.current.innerHTML;
                  handleSendMail(setAppState, "The Meeting Was Ended", emailContent);
                }}>Send Email</button>
              <button className='btn'
                onClick={downloadVideo}>Download Session Video</button>
            </div>
          </div>
          <Chatbot />
        </>
      )}
    </>
  );
}
