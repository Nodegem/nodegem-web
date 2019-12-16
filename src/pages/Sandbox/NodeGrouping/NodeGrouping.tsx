import React, { useCallback, useEffect } from 'react';
import { Typography, Icon, Button } from 'antd';
import './NodeGrouping.less';
import ResizeObserver from '@juggle/resize-observer';
import { ResizeObserverEntry } from '@juggle/resize-observer/lib/ResizeObserverEntry';

const { Paragraph } = Typography;

interface INodeGroupingProps {
    onResize: (id: string, size: Vector2) => void;
    onMouseDown: (id: string, event: MouseEvent) => void;
    onTitleChange: (id: string, value: string) => void;
    onDelete: (id: string) => void;
    id: string;
    title: string;
}

export const NodeGrouping: React.FC<INodeGroupingProps> = ({
    id,
    title,
    onMouseDown,
    onTitleChange,
    onResize,
    onDelete,
}) => {
    useEffect(() => {
        const handleResize = (entry: ResizeObserverEntry[]) => {
            const { contentRect } = entry[0];
            onResize(id, { x: contentRect.width, y: contentRect.height });
        };

        const element = document.getElementById(id)!;
        const resize = new ResizeObserver(handleResize);
        resize.observe(element);

        return () => {
            resize.unobserve(element);
        };
    });

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            onMouseDown(id, e.nativeEvent);
        },
        [id, onMouseDown]
    );

    const handleDelete = useCallback(() => {
        onDelete(id);
    }, [id, onDelete]);

    return (
        <div
            id={id}
            className="node-grouping-container"
            style={{ position: 'absolute' }}
        >
            <div className="node-grouping-title" onMouseDown={handleMouseDown}>
                <Paragraph
                    editable={{ onChange: value => onTitleChange(id, value) }}
                >
                    {title}
                </Paragraph>
                <Button icon="delete" type="link" onClick={handleDelete} />
            </div>
            <div className="node-grouping-body" />
        </div>
    );
};
