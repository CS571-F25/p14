import { auth, db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
} from 'firebase/auth';

export const doCreateUserWithEmailAndPassword = async (email, password, username) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's profile with their username
    await updateProfile(result.user, {
        displayName: username
    });
    
    // Save user data to Firestore
    const user = result.user;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        username: username, // Store username
        displayName: username,
        photoURL: user.photoURL || null,
        providerId: "password",
        createdAt: new Date().toISOString(),
    });
    
    return result;
}

export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
}

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    // Save/update user data to Firestore
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        username: user.displayName || user.email.split('@')[0], // Use displayName or email prefix
        email: user.email,
        photoURL: user.photoURL,
        providerId: user.providerData[0].providerId,
        createdAt: new Date().toISOString(),
    });

    return result;
}

export const doSignOut = () => {
    return auth.signOut();
}