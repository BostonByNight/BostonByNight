// @flow

import {useContext, useEffect, useState} from "react";
import {subscribe, useCustomLazyLoadQuery} from "../../_base/relay-utils";
import type {GetMessageDigestQuery} from "../../services/queries/messages/__generated__/GetMessageDigestQuery.graphql";
import {getMessageDigestQuery} from "../../services/queries/messages/GetMessageDigestQuery";
import useSubscriptionTokenQuery from "../../services/queries/accounts/SubscriptionTokenQuery";
import type {MessageNotificationSubscriptionResponse} from "../../services/subscriptions/__generated__/MessageNotificationSubscription.graphql";
import MessageNotificationSubscription from "../../services/subscriptions/MessageNotificationSubscription";
import {UtilityContext} from "../../contexts";

export const useMessageSubscription = (): number => {
    const {showUserNotification} = useContext(UtilityContext);
    const messagesDigest = useCustomLazyLoadQuery<GetMessageDigestQuery>(getMessageDigestQuery, {}, {
        fetchPolicy: "store-and-network"
    });

    const [numberOfMessages, setNumberOfMessages] = useState(messagesDigest?.messagesDigest?.unreadMessages ?? 0);

    // Message notification subscription
    const chatToken = useSubscriptionTokenQuery();

    useEffect(() => {
        const handleNotification = (notification: MessageNotificationSubscriptionResponse) => {
            if (notification?.newMessageNotification?.message != null) {
                const message = notification.newMessageNotification.message;

                if (notification.newMessageNotification.message?.operation !== "set_message_read") {
                    showUserNotification({
                        type: "info",
                        message: message.senderName != null
                            ? `${message.senderName}: ${message.subject}`
                            : message.subject
                    });
                }
            }
        }

        const handleMessageBadgeUpdate = (notification: MessageNotificationSubscriptionResponse) => {
            if (notification?.newMessageNotification?.numberUnread != null) {
                setNumberOfMessages(notification.newMessageNotification.numberUnread);
            }
        }

        const messageSubscription = subscribe(MessageNotificationSubscription(chatToken), notification => {
            handleNotification(notification);
            handleMessageBadgeUpdate(notification);
        });

        return () => {
            console.log("unsubscribe from message");
            messageSubscription.unsubscribe();
        };
    }, [showUserNotification, chatToken]);

    return numberOfMessages;
}