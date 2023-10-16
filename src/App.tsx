import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ClerkProvider, RedirectToSignIn, SignIn, SignUp, SignedIn, SignedOut } from '@clerk/clerk-react';
import Home from './components/Home';
import Protected from './components/Protected';
import SignInForm from './components/clerk/SignInForm';

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  const navigate = useNavigate();

  return (
    <ClerkProvider publishableKey={clerkPubKey} navigate={(to) => navigate(to)}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/sign-up" element={<SignUp routing="path" path="/sign-up" />} />
        <Route path="/template" element={<SignIn />} />
        <Route path="/protected" element={
          <>
            <SignedIn>
              <Protected />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        } />
      </Routes>
    </ClerkProvider>
  );
}

export default App;
