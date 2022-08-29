
import './App.css';
import { auth, db } from "./firebase_config";
import { signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, orderBy, getDocs, serverTimestamp, addDoc, limitToLast, doc, setDoc} from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
const Filter = require("bad-words");

const NUM_MESSAGES = 15;

function App() {
    // console.log(auth.currentUser.metadata.createdAt);
    const [user] = useAuthState(auth);
    return (
        <div className="App">
            {user ? <ChatRoom /> : <SignIn />}
        </div>
    );
}

function SignIn() {
    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithRedirect(
            auth, 
            provider
        ).then((res) => {
            console.log(res);
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <div class="sign-in-page">
            <button class="sign-in" onClick={signInWithGoogle}>Sign In With Google</button>
        </div>
    )
}

function SignOut() {
    return auth.currentUser && (
        <button class="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
    )
}

function useWindowDimensions() {

    const hasWindow = typeof window !== 'undefined';
  
    function getWindowDimensions() {
        const width = hasWindow ? window.innerWidth : null;
        const height = hasWindow ? window.innerHeight : null;
        return {
            width,
            height,
        };
    }
  
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  
    useEffect(() => {
        if (hasWindow) {
            function handleResize() {
            setWindowDimensions(getWindowDimensions());
            }
    
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [hasWindow]);
  
    return windowDimensions;
  }

function ChatRoom() {
    const { width } = useWindowDimensions();
    // console.log(auth.currentUser);
    const messagesRef = collection(db, "messages");
    // const bannedRef = collection(db, "banned");
    const q = query(messagesRef, orderBy("createdAt"), limitToLast(NUM_MESSAGES));
    const dummy = useRef();
    const filter = new Filter();
    
    // const [messages, setMessages] = useState([]);
    const [formValue, setFormValue] = useState("");
    const [messages, loading, error] = useCollectionData(q, { idField: 'id' });

    // const fetchData = () => {
    //     const getMessages = async () => {
    //         const data = await getDocs(q);
    //         setMessages(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
    //     };

    //     getMessages();
    // }

    const sendMessage = async (e) => {
        e.preventDefault();
        const { displayName, uid } = auth.currentUser;
        if (filter.isProfane(formValue)) {
            await addDoc(messagesRef, {
                text: "I was banned for saying horrible things.",
                createdAt: serverTimestamp(),
                uid,
                userCreatedAt: auth.currentUser.metadata.createdAt
            }); 

            await setDoc(doc(db, "banned", uid), {
                uid
            });
        } else {
            if (formValue.trim() === "") {
                return;
            } else {
                await addDoc(messagesRef, {
                    text: formValue,
                    createdAt: serverTimestamp(),
                    uid,
                    displayName,
                    userCreatedAt: auth.currentUser.metadata.createdAt
                });
            }
        }
        

        setFormValue("");

        // fetchData();

        dummy.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        // fetchData();
        dummy.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    return (
        <>
            <header>
                <div class="act">ACT ONE</div>
                <br />
                <div class="location">INT. THE CHAT FOR <a href="https://ronikbhaskar.github.io">RONIKBHASKAR.GITHUB.IO</a></div>
                <div class="characters">&nbsp;&nbsp;(EVERYONE)</div>
                {/* sometimes I forget how many features these JS frameworks have */}
                {width > 300 && <><br />
                <div class="description">AN EMPTY, WHITE VOID. RONIK STANDS PATIENTLY, WAVING HELLO.</div></>}
                <SignOut />
            </header>
            <div class="messages">
                {messages && messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

                <div ref={dummy}></div>
            </div>
            <footer style={{position: "fixed", bottom: 0, width: "100%"}}>
                <form onSubmit={sendMessage}>
                    <input type="text" placeholder="Add to the dialogue... " alt="profile picture" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
                    {/* <button class="submit" type="submit"></button> */}
                </form>
            </footer>
        </>
    )
}

function ChatMessage(props) {
    const { displayName, text, uid, userCreatedAt } = props.message;

    /* for CSS later */
    const messageClass = userCreatedAt < 1661218549466 ? "sent" : "received"; 

    return (
        <div className={messageClass}>
            {/* <img src={photoURL} /> */}
            <div class="speaker">
                {displayName.toUpperCase()}
            </div>
            <div class="dialogue">
                {text}
            </div>
            <br />
        </div>
    )
}



export default App;
