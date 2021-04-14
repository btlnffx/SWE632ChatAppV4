import React, { useEffect, useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyDQLc5N_qO_mdRPn7S7oEHwqwKAcUntgy4",
    authDomain: "swe632chatv4.firebaseapp.com",
    projectId: "swe632chatv4",
    storageBucket: "swe632chatv4.appspot.com",
    messagingSenderId: "146583442388",
    appId: "1:146583442388:web:8c05d6accfc9d08d77fc41",
    measurementId: "G-PGSDYX66SC"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {

  const [user] = useAuthState(auth);
    
  return (
    <div className="App">
      <header className="App-header">
        <h1>⚛️🔥💬SWE 632 Chat</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
      
    </div>
  );
}


function SignIn() {

  const signInWithGoogle = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      auth.signInWithPopup(provider);
  }

  const signInWithFacebook = () => {
    var provider = new firebase.auth.FacebookAuthProvider();
      provider.setCustomParameters({
        'display': 'popup'
      });
      auth.signInWithPopup(provider);
  };
	
  return (
    <section> <div>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button> <p> </p>
      </div> <div>	  
      <button className="sign-in" onClick={signInWithFacebook}>Sign in with Facebook</button> <p> </p>
      </div> <div> <center>
      <p> Please be respectful to others on this site, or you may be banned by the administrators!</p>
      </center> </div>
    </section>
  )

}


function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt');

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages])
    
  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="...express yourself here..." />

      <button type="submit" disabled={!formValue}>Send</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;
