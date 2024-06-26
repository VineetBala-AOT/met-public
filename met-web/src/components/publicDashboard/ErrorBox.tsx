import React from 'react';
import { Grid, IconButton, SxProps, Theme } from '@mui/material';
import { MetBodyOld, MetHeader4, MetPaper } from 'components/common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/pro-regular-svg-icons/faArrowsRotate';
import { DASHBOARD } from './constants';
import { useAppTranslation } from 'hooks';

interface ErrorBoxProps {
    height?: number | string;
    onClick: () => void;
    sx?: SxProps<Theme>;
}
export const ErrorBox = ({
    sx,
    onClick = () => {
        /*empty*/
    },
}: ErrorBoxProps) => {
    const { t: translate } = useAppTranslation();

    return (
        <MetPaper
            sx={{
                width: '100%',
                height: '100%',
                backgroundColor: DASHBOARD.KPI.BACKGROUND_COLOR,
                p: 2,
                ...sx,
            }}
        >
            <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'center'}
                textAlign={'center'}
                height="100%"
            >
                <Grid item>
                    <MetHeader4 color="error">{translate('dashboard.errorBox.header')}</MetHeader4>
                    <MetBodyOld color="error">{translate('dashboard.errorBox.body')}</MetBodyOld>
                    <IconButton onClick={() => onClick()}>
                        <FontAwesomeIcon
                            icon={faArrowsRotate}
                            style={{ color: DASHBOARD.KPI.RADIALBAR.FILL_COLOR, fontSize: '3em' }}
                        />
                    </IconButton>
                </Grid>
            </Grid>
        </MetPaper>
    );
};
