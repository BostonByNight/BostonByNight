import Typography from "@mui/material/Typography";
import React from 'react';
import {useMediaQuery} from "@mui/material";
import {useTheme} from "@mui/material/styles";

const BbnLogoComponent = ({primaryRem, secondaryRem, addStyle}) => {
    const theme = useTheme()
    const showCompressedTitle = useMediaQuery(theme.breakpoints.down('sm'));

    const mainStyle = {
        flexGrow: "1",
        fontFamily: 'Gothic',
        color: "primary.main",
        fontSize: primaryRem
    };

    const byStyle = {
        fontSize: secondaryRem,
        margin: '0 10px'
    };

    const getMainStyle = () => {
        if(addStyle) {
            return {
                ...mainStyle,
                ...addStyle
            }
        }
        return mainStyle;
    }


    return(
        <Typography variant="h6"
                    noWrap
                    component="h1"
                    color="inherit"
                    sx={getMainStyle()}>
            {showCompressedTitle?'B':'Boston'}
            <span style={byStyle}>
            {showCompressedTitle?'b':'by'}
            </span>
            {showCompressedTitle?'N':'Night'}
        </Typography>
    )
}

export default BbnLogoComponent;