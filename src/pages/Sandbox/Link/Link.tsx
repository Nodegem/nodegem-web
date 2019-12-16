import { Icon } from 'antd';
import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import './Link.less';

interface ILinkProps {
    linkId: string;
    visible: boolean;
    type: PortType;
    showIcons?: boolean;
    onSourceIconClick?: (linkId: string) => void;
    onDestinationIconClick?: (linkId: string) => void;
}

const areEqual = (prev: ILinkProps, cur: ILinkProps) => {
    return prev.visible === cur.visible;
};

export const Link: React.FC<ILinkProps> = React.memo(
    ({
        visible,
        type,
        linkId,
        showIcons = true,
        onSourceIconClick,
        onDestinationIconClick,
    }) => {
        const [isHovering, setIsHovering] = useState(false);

        const mouseEnter = useCallback(() => setIsHovering(true), []);
        const mouseLeave = useCallback(() => setIsHovering(false), []);

        return (
            <>
                <svg
                    id={`${linkId}-svg`}
                    className={classNames({
                        link: true,
                        value: type === 'value',
                        flow: type === 'flow',
                    })}
                    style={{ position: 'absolute', opacity: visible ? 1 : 0 }}
                >
                    <path id={`${linkId}-path`} />
                </svg>
                {showIcons && (
                    <span
                        className={classNames({
                            'link-icons': true,
                            value: type === 'value',
                            flow: type === 'flow',
                            hovering: isHovering,
                        })}
                        id={`${linkId}-span`}
                        style={{
                            position: 'absolute',
                            opacity: visible ? 1 : 0,
                        }}
                    >
                        <span
                            className="link-icon"
                            id={`${linkId}-icon-source`}
                            onMouseDown={event => {
                                event.stopPropagation();
                                onSourceIconClick!(linkId);
                            }}
                            onMouseEnter={mouseEnter}
                            onMouseLeave={mouseLeave}
                            style={{ '--offset-x': 5, '--offset-y': 15 } as any}
                        >
                            <Icon type={isHovering ? 'disconnect' : 'link'} />
                        </span>
                        <span
                            className="link-icon"
                            id={`${linkId}-icon-destination`}
                            onMouseDown={event => {
                                event.stopPropagation();
                                onDestinationIconClick!(linkId);
                            }}
                            onMouseEnter={mouseEnter}
                            onMouseLeave={mouseLeave}
                            style={
                                { '--offset-x': 40, '--offset-y': 15 } as any
                            }
                        >
                            <Icon type={isHovering ? 'disconnect' : 'link'} />
                        </span>
                    </span>
                )}
            </>
        );
    },
    areEqual
);
