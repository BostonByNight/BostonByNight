// @flow

import {useEffect, useState} from "react";
import {subscribe, useCustomLazyLoadQuery} from "../../_base/relay-utils";
import {getMessageDigestQuery} from "../../services/queries/messages/GetMessageDigestQuery";
import useSubscriptionTokenQuery from "../../services/queries/accounts/SubscriptionTokenQuery";
import type {
    MessageNotificationSubscription$data
} from "../../services/subscriptions/__generated__/MessageNotificationSubscription.graphql";
import MessageNotificationSubscription from "../../services/subscriptions/MessageNotificationSubscription";
import {emptyExactObject} from "../../_base/utils";
import {useCustomSnackbar} from "../../_base/notification-utils";

export const useMessageSubscription = (): number => {
    const {enqueueSnackbar} = useCustomSnackbar()
    const messagesDigest = useCustomLazyLoadQuery(getMessageDigestQuery, emptyExactObject(), {
        fetchPolicy: "network-only"
    });

    const [numberOfMessages, setNumberOfMessages] = useState(messagesDigest?.messagesDigest?.unreadMessages ?? 0);

    // Message notification subscription
    const chatToken = useSubscriptionTokenQuery();

    useEffect(() => {
        const handleNotification = (notification: MessageNotificationSubscription$data) => {
            if (notification?.newMessageNotification?.message != null) {
                const message = notification.newMessageNotification.message;

                if (notification.newMessageNotification.message?.operation !== "set_message_read") {
                    enqueueSnackbar({
                        type: "info",
                        message: message.senderName != null
                            ? `${message.senderName}: ${message.subject}`
                            : message.subject
                    });
                }
            }
        }

        const handleMessageBadgeUpdate = (notification: MessageNotificationSubscription$data) => {
            if (notification?.newMessageNotification?.numberUnread != null) {
                setNumberOfMessages(notification.newMessageNotification.numberUnread);
            }
        }

        if (chatToken != null) {
            const messageSubscription = subscribe(MessageNotificationSubscription(chatToken), notification => {
                handleNotification(notification);
                handleMessageBadgeUpdate(notification);
            });

            return () => {
                console.debug("unsubscribe from message");
                messageSubscription.unsubscribe();
            };
        }
    }, [enqueueSnackbar, chatToken]);

    return numberOfMessages;
}