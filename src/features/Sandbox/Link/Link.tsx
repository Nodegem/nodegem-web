import { Icon } from 'antd';
import classNames from 'classnames';
import React from 'react';
import './Link.less';

interface ILinkProps {
    linkId: string;
    visible: boolean;
    type: PortType;
    iconData?: { source: Vector2; destination: Vector2 };
}

const areEqual = (prev: ILinkProps, cur: ILinkProps) => {
    return prev.visible === cur.visible;
};

export const Link: React.FC<ILinkProps> = React.memo(
    ({ visible, type, linkId, iconData }) => {
        console.log(iconData);
        return !iconData ? (
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
        ) : (
            <>
                <span>
                    <Icon
                        type="link"
                        style={{
                            position: 'absolute',
                            transform: `translate(${iconData.source.x}px, ${iconData.destination.y}px)`,
                        }}
                    />
                </span>
            </>
        );
    },
    areEqual
);
