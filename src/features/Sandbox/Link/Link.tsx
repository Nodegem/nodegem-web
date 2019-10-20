import classNames from 'classnames';
import React, { useEffect, useMemo, useRef } from 'react';
import './Link.less';

interface ILinkProps {
    linkId: string;
    visible: boolean;
    type: PortType;
}

export const Link: React.FC<ILinkProps> = React.memo(
    ({ visible, type, linkId }) => {
        return (
            <svg
                className={classNames({
                    link: true,
                    value: type === 'value',
                    flow: type === 'flow',
                })}
                style={{ position: 'absolute', opacity: visible ? 1 : 0 }}
            >
                <path id={linkId} />
            </svg>
        );
    }
);
