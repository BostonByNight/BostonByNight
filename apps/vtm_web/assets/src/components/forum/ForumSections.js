// @flow

import React from "react";
import useForumSections from "../../services/queries/forum/GetForumSectionsQuery";
import List from "@mui/material/List";
import ForumLayout from "./layout/ForumLayout";
import ForumItemSelector from "./layout/ForumListItem";
import {useHistory} from "react-router-dom";
import {Routes} from "../../AppRouter";
import Typography from "@mui/material/Typography";

const ForumSections = (): any => {
    const history = useHistory();
    const forumSections = useForumSections()?.getForumSections;

    const toSection = sectionId => {
        if (sectionId != null) {
            history.push(Routes.forumSection(sectionId));
        }
    }

    const showForumSections = () => forumSections
        ?.map(s => <ForumItemSelector key={s?.id} item={s} onClick={toSection} />);

    return (
        <ForumLayout title="Forum">
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
