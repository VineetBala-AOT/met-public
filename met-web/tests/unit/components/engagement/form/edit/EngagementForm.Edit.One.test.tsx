import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../../../../src/components/engagement/form';
import { setupEnv } from '../../../setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as engagementMetadataService from 'services/engagementMetadataService';
import * as engagementSettingService from 'services/engagementSettingService';
import * as engagementSlugService from 'services/engagementSlugService';
import * as notificationModalSlice from 'services/notificationModalService/notificationModalSlice';
import * as widgetService from 'services/widgetService';
import * as teamMemberService from 'services/membershipService';
import { createDefaultSurvey, Survey } from 'models/survey';
import { Box } from '@mui/material';
import { draftEngagement, engagementMetadata, engagementSetting, engagementSlugData } from '../../../factory';
import { USER_ROLES } from 'services/userService/constants';
import assert from 'assert';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { createDefaultEngagementContent } from 'models/engagementContent';

const engagementId = 1;
const survey: Survey = {
    ...createDefaultSurvey(),
    id: 1,
    name: 'Survey 1',
    engagement_id: engagementId,
};

const surveys = [survey];

jest.mock('axios');

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(() => {
        return {
            roles: [USER_ROLES.VIEW_PRIVATE_ENGAGEMENTS, USER_ROLES.EDIT_ENGAGEMENT, USER_ROLES.CREATE_ENGAGEMENT],
            assignedEngagements: [draftEngagement.id],
        };
    }),
}));

jest.mock('components/common/Dragdrop', () => ({
    ...jest.requireActual('components/common/Dragdrop'),
    MetDroppable: ({ children }: { children: React.ReactNode }) => <Box>{children}</Box>,
    MetDraggable: ({ children }: { children: React.ReactNode }) => <Box>{children}</Box>,
}));

jest.mock('@hello-pangea/dnd', () => ({
    ...jest.requireActual('@hello-pangea/dnd'),
    DragDropContext: ({ children }: { children: React.ReactNode }) => <Box>{children}</Box>,
}));

jest.mock('@reduxjs/toolkit/query/react', () => ({
    ...jest.requireActual('@reduxjs/toolkit/query/react'),
    fetchBaseQuery: jest.fn(),
}));

jest.mock('components/map', () => () => {
    return <Box></Box>;
});

jest.mock('apiManager/apiSlices/widgets', () => ({
    ...jest.requireActual('apiManager/apiSlices/widgets'),
    useCreateWidgetMutation: () => [jest.fn(() => Promise.resolve())],
    useDeleteWidgetMutation: () => [jest.fn(() => Promise.resolve())],
    useSortWidgetsMutation: () => [jest.fn(() => Promise.resolve())],
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({ search: '' })),
    useParams: jest.fn(() => {
        return { projectId: '', engagementId: '1' };
    }),
    useNavigate: () => jest.fn(),
    useRouteLoaderData: (routeId: string) => {
        if (routeId === 'single-engagement') {
            return {
                engagement: Promise.resolve({
                    ...draftEngagement,
                    surveys,
                }),
                widgets: Promise.resolve([]),
                metadata: Promise.resolve([]),
                content: Promise.resolve([createDefaultEngagementContent()]),
                taxa: Promise.resolve([]),
            };
        }
    },
}));

const router = createMemoryRouter(
    [
        {
            path: '/engagements/:engagementId/form/',
            element: <EngagementForm />,
        },
    ],
    {
        initialEntries: [`/engagements/${draftEngagement.id}/form/`],
    },
);

// Mocking window.location.pathname in Jest
Object.defineProperty(window, 'location', {
    value: {
        pathname: '/engagements/1/form',
    },
});

describe('Engagement form page tests', () => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    const openNotificationModalMock = jest
        .spyOn(notificationModalSlice, 'openNotificationModal')
        .mockImplementation(jest.fn());
    const useParamsMock = jest.spyOn(reactRouter, 'useParams').mockReturnValue({ engagementId: '1' });
    const getEngagementMetadataMock = jest
        .spyOn(engagementMetadataService, 'getEngagementMetadata')
        .mockReturnValue(Promise.resolve([engagementMetadata]));
    jest.spyOn(engagementSettingService, 'getEngagementSettings').mockReturnValue(Promise.resolve(engagementSetting));
    jest.spyOn(teamMemberService, 'getTeamMembers').mockReturnValue(Promise.resolve([]));
    jest.spyOn(engagementMetadataService, 'patchEngagementMetadata').mockReturnValue(
        Promise.resolve(engagementMetadata),
    );
    const getEngagementSlugMock = jest
        .spyOn(engagementSlugService, 'getSlugByEngagementId')
        .mockReturnValue(Promise.resolve(engagementSlugData));
    const getEngagementMock = jest
        .spyOn(engagementService, 'getEngagement')
        .mockReturnValue(Promise.resolve(draftEngagement));
    const patchEngagementMock = jest
        .spyOn(engagementService, 'patchEngagement')
        .mockReturnValue(Promise.resolve(draftEngagement));
    jest.spyOn(widgetService, 'getWidgets').mockReturnValue(Promise.resolve([]));

    beforeEach(() => {
        setupEnv();
    });

    test('Engagement form tabs and their titles should be populated correctly', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        render(<RouterProvider router={router} />);

        await waitFor(() => {
            expect(screen.getByText('Engagement Content')).toBeInTheDocument();
        });

        expect(screen.getByText('Additional Details')).toBeInTheDocument();
        expect(screen.getByText('User Management')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    test('Engagement form with saved engagement should display saved info', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { getByTestId, getByText, getByDisplayValue } = render(<RouterProvider router={router} />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(getByTestId('save-engagement-button')).toBeVisible();
            expect(getByDisplayValue('2022-09-01')).toBeInTheDocument();
            expect(getByDisplayValue('2022-09-30')).toBeInTheDocument();
            expect(getByText('Survey 1')).toBeInTheDocument();
        });
    });

    test('Save engagement button should trigger patch call', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<RouterProvider router={router} />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
        });
        const updateButton = screen.getByTestId('save-engagement-button');
        await waitFor(() => {
            expect(updateButton).toBeEnabled();
        });

        const nameInput = container.querySelector('input[name="name"]');
        assert(nameInput, 'Unable to find engagement name input');
        fireEvent.input(nameInput, { target: { value: 'Engagement Test updated' } });
        fireEvent.change(nameInput, { target: { value: 'Engagement Test updated' } });
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(patchEngagementMock).toHaveBeenCalledOnce();
            expect(screen.getByText('Save and Continue')).toBeInTheDocument();
        });
    });

    test('Modal with warning appears when removing survey', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { getByTestId, getByDisplayValue } = render(<RouterProvider router={router} />);

        await waitFor(() => {
            expect(getByDisplayValue('Test Engagement')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(getByTestId(`survey-widget/remove-${survey.id}`));
        });

        const removeSurveyButton = getByTestId(`survey-widget/remove-${survey.id}`);
        fireEvent.click(removeSurveyButton);

        expect(openNotificationModalMock).toHaveBeenCalledOnce();
    });

    test('Cannot add more than one survey', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );
        const { getByText, getByDisplayValue } = render(<RouterProvider router={router} />);

        await waitFor(() => {
            expect(getByDisplayValue('Test Engagement')).toBeInTheDocument();
        });
        getEngagementMetadataMock.mockReturnValueOnce(Promise.resolve([engagementMetadata]));

        await waitFor(() => {
            expect(getByText('Add Survey')).toBeDisabled();
        });
    });

    test('Can move to settings tab', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );
        render(<RouterProvider router={router} />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
        });

        const settingsTabButton = screen.getByText('Settings');

        fireEvent.click(settingsTabButton);

        expect(screen.getByText('Internal Engagement')).toBeInTheDocument();
        expect(screen.getByText('Send Report')).toBeInTheDocument();
        expect(screen.getByText('Link to Public Engagement Page')).toBeInTheDocument();
        expect(screen.getByText('Link to Public Dashboard Report')).toBeInTheDocument();
    });

    test('Can move to additional details tab', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );
        render(<RouterProvider router={router} />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
        });

        const settingsTabButton = screen.getByText('Additional Details');

        fireEvent.click(settingsTabButton);

        expect(screen.getByText('Collection Notice/Consent Message')).toBeInTheDocument();
    });
});
