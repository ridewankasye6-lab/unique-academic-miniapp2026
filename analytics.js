import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    db,
    auth
} from "./firebase.js";


async function trackEvent(eventName, extraData = {}) {

    try {

        const user = auth.currentUser;

        await addDoc(
            collection(db, "analytics"),
            {

                event: eventName,

                userId: user
                    ? user.uid
                    : null,

                registered: !!user,

                ...extraData,

                timestamp: serverTimestamp()

            }
        );

        console.log(
            "Analytics recorded:",
            eventName
        );

    } catch (error) {

        console.error(
            "Analytics error:",
            error
        );

    }

}


export {
    trackEvent
};
