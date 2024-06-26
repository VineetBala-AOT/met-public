import React, { useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Checkbox, FormControlLabel, FormGroup, FormHelperText, Grid, Link } from '@mui/material';
import { MetLabel, MetParagraphOld } from 'components/common';
import { FormContext } from './FormContext';
import { TAB_TWO } from './constants';
import { When } from 'react-if';
import { Editor } from 'react-draft-wysiwyg';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';
import { useAppTranslation } from 'hooks';
import { Button } from 'components/common/Input/Button';

interface FormData {
    understand: boolean;
    termsOfReference: boolean;
}

export const FirstTab: React.FC = () => {
    const { t: translate } = useAppTranslation();
    const { consentMessage, setTabValue, setFormSubmission } = useContext(FormContext);

    // Define the Yup schema for validation
    const schema = yup.object({
        understand: yup.boolean().oneOf([true], translate('formCAC.schema.understand')),
        termsOfReference: yup.boolean().oneOf([true], translate('formCAC.schema.termsOfReference')),
    });

    // Initialize form state and validation using react-hook-form
    const {
        handleSubmit,
        control,
        formState: { errors },
        trigger,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            understand: false,
            termsOfReference: false,
        },
    });

    // Function to handle form submission
    const handleNextClick = async (data: FormData) => {
        trigger();

        setFormSubmission((prev) => ({ ...prev, ...data }));
        setTabValue(TAB_TWO);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <MetLabel>{translate('formCAC.tab1.labels.0')}</MetLabel>
                <MetParagraphOld>{translate('formCAC.tab1.paragraph.0')}</MetParagraphOld>
            </Grid>
            <Grid item xs={12}>
                <MetParagraphOld>{translate('formCAC.tab1.paragraph.1')}</MetParagraphOld>
            </Grid>

            <Grid item xs={12}>
                <MetLabel>{translate('formCAC.tab1.labels.1')}</MetLabel>
                <MetParagraphOld>{translate('formCAC.tab1.paragraph.2')}</MetParagraphOld>
            </Grid>

            <Grid item xs={12}>
                <MetLabel>{translate('formCAC.tab1.labels.2')}</MetLabel>
            </Grid>
            <Grid item xs={12}>
                <Editor editorState={getEditorStateFromRaw(consentMessage)} readOnly={true} toolbarHidden />
            </Grid>

            <Grid item xs={12}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Controller
                                name="understand"
                                control={control}
                                render={({ field }) => <Checkbox {...field} />}
                            />
                        }
                        label={<MetLabel>{translate('formCAC.tab1.labels.3')}</MetLabel>}
                    />
                    <When condition={Boolean(errors.understand)}>
                        <FormHelperText
                            sx={{
                                marginLeft: '2.5em',
                                marginTop: '-1em',
                            }}
                            error
                        >
                            {String(errors.understand?.message)}
                        </FormHelperText>
                    </When>
                    <FormControlLabel
                        control={
                            <Controller
                                name="termsOfReference"
                                control={control}
                                render={({ field }) => <Checkbox {...field} />}
                            />
                        }
                        label={
                            <MetLabel>
                                {translate('formCAC.tab1.labels.4')}
                                <Link href="https://www2.gov.bc.ca/assets/gov/environment/natural-resource-stewardship/environmental-assessments/guidance-documents/2018-act/community_advisory_committee_guideline_v1.pdf">
                                    {translate('formCAC.tab1.link.text')}
                                </Link>
                            </MetLabel>
                        }
                    />
                    <When condition={Boolean(errors.termsOfReference)}>
                        <FormHelperText
                            sx={{
                                marginLeft: '2.5em',
                                marginTop: '-1em',
                            }}
                            error
                        >
                            {String(errors.termsOfReference?.message)}
                        </FormHelperText>
                    </When>
                </FormGroup>
            </Grid>

            <Grid item xs={12}>
                <Button variant="primary" size="small" onClick={handleSubmit(handleNextClick)}>
                    {translate('formCAC.tab1.button.next')}
                </Button>
            </Grid>
        </Grid>
    );
};
