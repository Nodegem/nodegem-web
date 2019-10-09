import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import './Link.less';

interface ILinkProps {
    visible: boolean;
    type: PortType;
    getRef: (element: SVGPathElement) => void;
}

export const Link: React.FC<ILinkProps> = ({ visible, type, getRef }) => {
    const ref = useRef<SVGPathElement>(null);

    useEffect(() => {
        if (getRef) {
            getRef(ref.current!);
        }
    }, [getRef]);

    return (
        <svg
            className={classNames({
                link: true,
                value: type === 'value',
                flow: type === 'flow',
            })}
            style={{ position: 'absolute', opacity: visible ? 1 : 0 }}
        >
            <path ref={ref} />
        </svg>
    );
};
