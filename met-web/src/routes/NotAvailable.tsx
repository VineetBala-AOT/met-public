import React from 'react';
import { Grid } from '@mui/material';
import { MetHeader1Old, MetParagraphOld, MetLabel } from 'components/common';
import { Banner } from 'components/banner/Banner';
import LandingPageBanner from 'assets/images/LandingPageBanner.png';
import { useAppTranslation, useAppSelector } from 'hooks';
import { TenantState } from 'reduxSlices/tenantSlice';

export const NotAvailable = () => {
    const { t: translate } = useAppTranslation();
    const tenant: TenantState = useAppSelector((state) => state.tenant);
    return (
        <Grid container direction="row" justifyContent={'center'} alignItems="center">
            <Grid item xs={12}>
                <Banner height={'330px'} imageUrl={LandingPageBanner}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        height="100%"
                        sx={{
                            position: 'absolute',
                            top: '0px',
                            left: '0px',
                        }}
                    >
                        <Grid
                            item
                            lg={6}
                            sm={12}
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            sx={{
                                backgroundColor: 'rgba(242, 242, 242, 0.95)',
                                padding: '1em',
                                margin: '1em',
                                maxWidth: '90%',
                            }}
                            m={{ lg: '3em 5em 0 3em', md: '3em', sm: '1em' }}
                            rowSpacing={2}
                        >
                            <Grid item xs={12}>
                                <MetHeader1Old>{tenant.title}</MetHeader1Old>
                            </Grid>
                            <Grid item xs={12}>
                                <MetParagraphOld>{tenant.description}</MetParagraphOld>
                            </Grid>
                        </Grid>
                    </Grid>
                </Banner>
            </Grid>
            <Grid
                item
                lg={12}
                sm={12}
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                sx={{
                    padding: '1em',
                    maxWidth: '100%',
                }}
                m={{ lg: '3em 5em 0 3em', md: '3em', sm: '1em' }}
                rowSpacing={2}
            >
                <MetLabel m={{ lg: '.5em 0 0 .5em', md: '3em', sm: '1em' }}>{translate('notAvailable.label')}</MetLabel>
            </Grid>
        </Grid>
    );
};

export default NotAvailable;
