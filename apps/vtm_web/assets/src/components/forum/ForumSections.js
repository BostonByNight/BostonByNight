// @flow

import React from "react";
import useForumSections from "../../services/queries/forum/GetForumSectionsQuery";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ForumLayout from "./layout/ForumLayout";
import {useHistory} from "react-router-dom";
import Typography from "@mui/material/Typography";
import {MainRoutes} from "../MainRouter";
import Box from "@mui/material/Box";
import ForumListItemText from "./layout/ForumListItemText";
import type {GenericReactComponent} from "../../_base/types";

const ForumSections = (): GenericReactComponent => {
    const history = useHistory();

    const forumSections = useForumSections()
        ?.getForumSections;

    const toSection = (sectionId: ?string) => {
        if (sectionId != null) {
            history.push(MainRoutes.forumSection(sectionId));
        }
    };

    const showForumSections = () => forumSections
        ?.map(s => (
            <Box component="div" key={s?.section?.id}>
                <Divider />
                <ListItem alignItems="flex-start"
                          button
                          onClick={_ => toSection(s?.section?.id)}>
                    <ForumListItemText title={s?.section?.title}
                                       hasNewMessages={s?.hasNewPosts}
                                       description={s?.section?.description}
                                       lastThread={s?.lastThread} />
                </ListItem>
                <Divider />
            </Box>
        ));

    return (
        <ForumLayout title="Forum (beta)">
            <Typography sx={{
                color: "#C9C9C9",
                fontSize: "13px"
            }}>
                Questo Forum non ha per ora il gran numero di funzionalit&agrave; che 
                un forum dovrebbe offrire. &Egrave; disponibile una Community su Discord chiamata&nbsp;
                <b>VTM Baires</b> che offre supporto e aiuto ai nuovi arrivati nella land.<br />
                &Egrave; fortemente consigliato richiedere l'iscrizione alla Community Discord
                se necessitate di qualsiasi aiuto, o se avete un problema o un dubbio riguardo
                il sito.
            </Typography>
            <List sx={{width: "100%", color: "background.paper"}}>
                {showForumSections()}
            </List>
        </ForumLayout>
    );
}

export default ForumSections;
