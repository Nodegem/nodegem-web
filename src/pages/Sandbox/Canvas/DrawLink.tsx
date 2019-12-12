import { useStore } from 'overstated';
import React from 'react';
import { drawLinkElementId, DrawLinkStore } from '../../Sandbox';
import { Link } from '../Link/Link';

interface IDrawLinkProps {
    drawLinkStore: DrawLinkStore;
}

export const DrawLink: React.FC<IDrawLinkProps> = ({ drawLinkStore }) => {
    const { isDrawing, linkType } = useStore(drawLinkStore, store => ({
        isDrawing: store.state.isDrawing,
        linkType: store.state.linkType,
    }));

    return (
        <Link
            linkId={drawLinkElementId}
            visible={isDrawing}
            type={linkType!}
            showIcons={false}
        />
    );
};
