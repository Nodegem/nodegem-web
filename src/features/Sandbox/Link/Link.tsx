import React from 'react';
import './Link.less';

interface ILinkProps {
    visible?: boolean;
    source: Vector2;
    destination: Vector2;
    type: PortType;
}

export const Link: React.FC<ILinkProps> = ({
    visible,
    source,
    destination,
    type,
}) => {
    if (!visible) {
        return null;
    }

    const { x, y } = source;
    let path = '';

    if (type === 'flow') {
        const hx1 = y + Math.abs(destination.y - y) * 0.5;
        const hx2 = destination.y - Math.abs(destination.y - y) * 0.5;
        path = `M ${x} ${y} C ${hx1} ${y} ${hx2} ${destination.y} ${
            destination.x
        } ${destination.y}`;
    } else if (type === 'value') {
        const hx1 = x + Math.abs(destination.x - x) * 0.5;
        const hx2 = destination.x - Math.abs(destination.x - x) * 0.5;
        path = `M ${x} ${y} C ${hx1} ${y} ${hx2} ${destination.y} ${
            destination.x
        } ${destination.y}`;
    }

    return (
        <svg className="link">
            <path d={path} />
        </svg>
    );
};
