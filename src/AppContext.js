import { createContext, useState } from 'react';
import { SyncLoader } from 'react-spinners';
import firepadRef from './server/firebase';

export const AppContext = createContext({
  appState: false,
  setAppState: () => { },
});

export const Loader = ({ message = "Loading..." }) => (
  <>
    <div className="transparent-background flex-col">
      <SyncLoader color="white" />
      <div className='mt-4'>{message}</div>
    </div>
  </>
);

export const downloadVideo = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/download-video?key=ScreenRecord', {
      method: 'GET'
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'output.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      console.error('Failed to download video:', response.statusText);
    }
  } catch (error) {
    console.error('Error downloading video:', error);
  }
};


export const startVideoRecording = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/start-video`, {
      method: 'GET'
    });
    if (response.ok) {
      console.log('Video recording started successfully');
    } else {
      console.error('Failed to start video recording:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error starting video recording:', error);
  }
};


export const stopVideoRecording = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5000/stop-video", {
      method: 'GET'
    });
    if (response.ok) {
      console.log('Video recording stopped successfully');
    } else {
      console.error('Failed to stop video recording:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error stopping video recording:', error);
  }
};

export function handleSendMail(setAppState, title, message) {
  fetch('http://127.0.0.1:5000/send-mail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, message }),
  })
    .then(response => response.text())
    .then(data => {
      setAppState(prevState => ({
        ...prevState,
        loaderShow: false,
        model: {
          ...prevState.model,
          showModel: true,
          modelNeedInput: false,
          modelMsg: data,
        },
      }));
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


export default function AppContextProvider({ children }) {
  const [appState, setAppState] = useState({
    model: {
      showModel: false,
      modelNeedInput: false,
      modelMsg: '',
      modelType: '',
    },
    loaderShow: false,
    calendar: {
      showCalendar: false,
      calendarDate: '',
    },
    showChatbot: false,
  });

  const AppContextValues = {
    appState,
    setAppState,
  };

  return (
    <AppContext.Provider value={AppContextValues}>
      {children}
    </AppContext.Provider>
  );
}
