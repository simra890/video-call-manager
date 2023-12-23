import React, { useState } from 'react';
import Home from './pages/Home/Home';
import Meet from './pages/Meet/Meet';
import Login from './pages/Login/Login';

export default function App() {
  const [userName, setUserName] = useState(null);
  const [login, setLogin] = useState(true);

  return (
    <>
      {login ? (
        <Login setLogin={setLogin} />
      ) : (
        <>
          {userName ? (
            <Meet name={userName} />
          ) : (
            <Home setUserName={setUserName} />
          )}
        </>
      )}
    </>
  );
}




// import React, { useState } from 'react';
// import Home from './pages/Home/Home';
// import Meet from './pages/Meet/Meet';

// export default function App() {
//   const [userName, setUserName] = useState(null);
//   return (
//     <>
//       {userName ? (
//         <Meet name={userName} />
//       ) : (
//         <Home setUserName={setUserName}/>
//       )}
//     </>
//   );
// }
