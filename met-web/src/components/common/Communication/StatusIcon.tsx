import React from 'react';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import {
    faInfoCircle,
    faExclamationTriangle,
    faExclamationCircle,
    faCheckCircle,
} from '@fortawesome/pro-solid-svg-icons';
import {
    faInfoCircle as faInfoCircleRegular,
    faExclamationTriangle as faExclamationTriangleRegular,
    faExclamationCircle as faExclamationCircleRegular,
    faCheckCircle as faCheckCircleRegular,
} from '@fortawesome/pro-regular-svg-icons';
import {
    faCheckCircle as faCheckCircleLight,
    faExclamationCircle as faExclamationCircleLight,
    faExclamationTriangle as faExclamationTriangleLight,
    faInfoCircle as faInfoCircleLight,
} from '@fortawesome/pro-light-svg-icons';

import { colors } from 'styles/Theme';

type IconWeight = 'solid' | 'regular' | 'light';

export const StatusIcon = ({
    status,
    color,
    weight = 'solid',
    ...props
}: {
    status: 'success' | 'warning' | 'error' | 'info';
    color?: string;
    weight?: IconWeight;
} & Partial<FontAwesomeIconProps>) => {
    let iconMap = {
        success: faCheckCircle,
        warning: faExclamationTriangle,
        error: faExclamationCircle,
        info: faInfoCircle,
    };
    if (weight === 'regular') {
        iconMap = {
            success: faCheckCircleRegular,
            warning: faExclamationTriangleRegular,
            error: faExclamationCircleRegular,
            info: faInfoCircleRegular,
        };
    }
    if (weight === 'light') {
        iconMap = {
            success: faCheckCircleLight,
            warning: faExclamationTriangleLight,
            error: faExclamationCircleLight,
            info: faInfoCircleLight,
        };
    }

    return <FontAwesomeIcon icon={iconMap[status]} color={color ?? colors.notification[status].icon} {...props} />;
};
