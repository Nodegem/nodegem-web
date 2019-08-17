import React from 'react';
import './Link.less';

interface ILinkProps {
    visible?: boolean;
    source: Vector2;
    destination: Vector2;
}

export const Link: React.FC<ILinkProps> = ({
    visible,
    source,
    destination,
}) => {
    const { x, y } = source;
    const hx1 = x + Math.abs(destination.x - x) * 0.5;
    const hx2 = destination.x - Math.abs(destination.x - x) * 0.5;
    const path = `M ${x} ${y} C ${hx1} ${y} ${hx2} ${destination.y} ${
        destination.x
    } ${destination.y}`;
    return visible ? (
        <svg className="link">
            <path d={path} />
        </svg>
    ) : null;
};
