import React, { Suspense, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';


const GlobalNews = React.lazy(() => import('./GlobalNews'));
const ConnectionNews = React.lazy(() => import('./ConnectionNews'));

function Home() {
  
  const { isAuthenticated } = useAuth0();
  const [activeTab, setActiveTab] = useState('global');

  return (
    <div className="flex min-h-screen flex-col">
      <div className="w-full bg-white p-4">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab('global')}
            className={`p-3 text-left rounded-lg transition-colors ${
              activeTab === 'global'
                ? 'bg-red-100 text-pulse'
                : 'hover:bg-gray-100'
            }`}
          >
            Global
          </button>

 

          
            {isAuthenticated && 
             
              <button
              onClick={() => setActiveTab('connections')}
              className={`p-3 text-left rounded-lg transition-colors ${
                activeTab === 'connections'
                  ? 'bg-red-100 text-pulse'
                  : 'hover:bg-gray-100'
              }`}
            >
              Connections
            </button>
            }
         
        </div>
      </div>

   
      <div className="">
        <Suspense fallback={
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }>
          {activeTab === 'global' && <GlobalNews />}
          {isAuthenticated && activeTab === 'connections' && <ConnectionNews />}
        </Suspense>
      </div>
    </div>
  );
}

export default Home;