import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    db,
    auth
} from "./firebase-config.js";


function getVisitorId() {

    let visitorId =
        localStorage.getItem("uniqueAcademicVisitorId");

    if (!visitorId) {

        visitorId =
            "visitor_" +
            crypto.randomUUID();

        localStorage.setItem(
            "uniqueAcademicVisitorId",
            visitorId
        );

    }

    return visitorId;
}


async function trackEvent(
    eventName,
    extraData = {}
) {

    try {

        const user = auth.currentUser;

        const visitorId =
            getVisitorId();


        await addDoc(
            collection(
                db,
                "analytics"
            ),
            {

                event: eventName,

                userId:
                    user
                        ? user.uid
                        : null,

                visitorId:
                    visitorId,

                registered:
                    !!user,

                ...extraData,

                timestamp:
                    serverTimestamp()

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
