import React, { useEffect, useRef } from 'react';
import { flowPath, valuePath } from './link-controller';
import './Link.less';

interface IDrawLinkProps {
    visible?: boolean;
    source: Vector2;
    destination: Vector2;
    type: PortType;
}

export const DrawLink: React.FC<IDrawLinkProps> = ({
    visible,
    source,
    destination,
    type,
}) => {
    if (!visible) {
        return null;
    }

    const path =
        type === 'flow'
            ? flowPath(source, destination)
            : valuePath(source, destination);

    return (
        <svg className="link">
            <path d={path} />
        </svg>
    );
};

interface ILinkProps {
    visible: boolean;
    getRef: (element: SVGPathElement) => void;
}

export const Link: React.FC<ILinkProps> = ({ visible, getRef }) => {
    const ref = useRef<SVGPathElement>(null);

    useEffect(() => {
        if (getRef) {
            getRef(ref.current!);
        }
    }, [getRef]);
    return (
        <svg className="link">
            <path ref={ref} />
        </svg>
    );
};
