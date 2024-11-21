import './App.css'
import { Auth0Provider } from '@auth0/auth0-react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Header from './components/Header'
import MyApolloProvider from './graphql/ApolloProvider'
import PostCreationPage from './pages/PostCreation'
import ProtectedRoute from './components/ProtectedRoute'
import PostView from './pages/PostView'


function App() {
  

  return (
    <Auth0Provider domain={import.meta.env.VITE_AUTH0_DOMAIN} clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}  
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}>
      <MyApolloProvider>
      <BrowserRouter>
      <Header />

      <Routes>
        
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostView />} />
        <Route
          path="/post/new"
          element={
            <ProtectedRoute>
              <PostCreationPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      
      </BrowserRouter>
      </MyApolloProvider>
    </Auth0Provider>
  )
}

export default App
