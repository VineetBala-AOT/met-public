import { Box, Grid, Stack, Link } from '@mui/material';
import * as React from 'react';
import { MetBodyOld } from 'components/common';
import { ReactComponent as BCLogo } from 'assets/images/BritishColumbiaLogoDark.svg';
import { Survey } from 'models/survey';
import dayjs from 'dayjs';
import { useAppSelector } from 'hooks';
import { TenantState } from 'reduxSlices/tenantSlice';
import { EngagementStatus } from 'constants/engagementStatus';

export default function EmailPreview({
    survey,
    children,
    ...rest
}: {
    survey: Survey;
    children: React.ReactNode;
    [prop: string]: unknown;
}) {
    const endDate = survey.engagement?.end_date ? dayjs(survey.engagement.end_date).format('MMM DD, YYYY') : '';
    const tenant: TenantState = useAppSelector((state) => state.tenant);
    const isClosed = survey.engagement?.engagement_status.id === EngagementStatus.Closed;
    const engagementName = survey.engagement?.name || '';
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box style={container}>
                <Stack direction={'row'}>
                    <Box
                        component={BCLogo}
                        sx={{
                            height: '5em',
                            width: { xs: '4em', md: '5em' },
                            marginRight: { xs: '0.5em', md: '0.5em' },
                        }}
                        alt="British Columbia Logo"
                    />
                </Stack>
                <Grid item xs={12}>
                    <MetBodyOld sx={{ mb: 1 }}>
                        Thank you for taking the time to provide your feedback on {engagementName}.
                    </MetBodyOld>
                </Grid>
                {children}
                <Grid item xs={12}>
                    <MetBodyOld sx={{ mb: 2 }}>
                        {!isClosed ? (
                            <>
                                You can edit and re-submit your feedback. The comment period is open until {''}
                                {endDate}. You must re-submit your feedback before the comment period closes.
                            </>
                        ) : (
                            <>
                                We are sorry but the public commenting period for {engagementName} is now closed and
                                your feedback cannot be edited.
                            </>
                        )}
                    </MetBodyOld>
                </Grid>
                <Grid item xs={12}>
                    {!isClosed ? (
                        <MetBodyOld
                            sx={{
                                borderLeft: '4px solid grey',
                                paddingLeft: '8px',
                                color: '#555',
                                mb: 2,
                            }}
                        >
                            <Link>Edit your feedback</Link>
                        </MetBodyOld>
                    ) : null}
                </Grid>
                <Grid item xs={12}>
                    <MetBodyOld sx={{ mb: 1 }}>Thank you,</MetBodyOld>
                </Grid>
                <Grid item xs={12}>
                    <MetBodyOld sx={{ mb: 1 }}>The {tenant.name} Team</MetBodyOld>
                </Grid>
            </Box>
        </Box>
    );
}

const container = {
    backgroundColor: 'var(--bcds-surface-background-white)',
    border: '1px solid #eee',
    borderRadius: '5px',
    boxShadow: '0 5px 10px rgba(20,50,70,.2)',
    width: '80%',
    padding: '30px 20px 40px',
};
