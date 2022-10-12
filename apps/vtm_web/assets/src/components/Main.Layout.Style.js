import {makeStyles} from "@mui/styles";

const drawerWidth = 240;
const chatInputHeight = 100;

export const mainFontFamily = {
    fontFamily: 'DefaultTypewriter',
    color: "primary.main"
};

/*%const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexGrow: 1,
        height: "100vh"
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    defaultParagraph: {
        padding: theme.spacing(1)
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        display: "flex",
        flexDirection: "column",
        height: '100vh',
        overflow: "auto",
        flexGrow: 1
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    centeredContainer: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        margin: '0 auto',
        maxWidth: '90%',
        minWidth: '55%'
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    listRoot: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    chatRootContainer: {
        flexGrow: 1,
        flexDirection: "column",
        overflow: "auto"
    },
    chatEntriesContainer: {
        flexGrow: 1,
        height: `calc(100% - ${chatInputHeight + 10}px)`,
        overflowY: "scroll"
    },
    chatInputControl: {
        height: `${chatInputHeight}px`,
        width: "100%"
    },
    chatInput: {
        fontFamily: 'DefaultTypewriter'
    },
    chatButton: {

    },
    chatEntryContainer: {
        padding: "5px"
    },
    chatShowAvatar: {
        
    },
    chatShowName: {
        fontFamily: 'DefaultTypewriter',
        color: "secondary.light"
    },
    chatShowText: {
        fontFamily: 'DefaultTypewriter'
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(16),
        right: theme.spacing(2)
    },
    smallAvatar: {
        width: theme.spacing(3),
        height: theme.spacing(3)
    },
    largeAvatar: {
        width: theme.spacing(7),
        height: theme.spacing(7)
    },
    responseInnerContainer: {
        paddingLeft: theme.spacing(20),
        paddingRight: theme.spacing(20),
        paddingTop: theme.spacing(3)
    },
    sheetAvatar: {
        width: "200px",
        height: "200px"
    },
    sheetTitle: {
        fontFamily: 'DefaultTypewriter',
        color: "secondary.light",
        fontSize: "24px"
    },
    sheetText: {
        fontFamily: 'DefaultTypewriter'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff"
    },
    formControl: {
        margin: theme.spacing(1),
            minWidth: 150,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    }
}));*/

const useStyles  = makeStyles((theme) => ({}));

export default useStyles;
