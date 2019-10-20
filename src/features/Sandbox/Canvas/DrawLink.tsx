import { useStore } from 'overstated';
import React from 'react';
import { Link } from '../Link/Link';
import { DrawLinkStore } from '../stores/draw-link-store';

interface IDrawLinkProps {
    drawLinkStore: DrawLinkStore;
}

export const DrawLink: React.FC<IDrawLinkProps> = ({ drawLinkStore }) => {
    const { isDrawing, linkType } = useStore(drawLinkStore, store => ({
        ...store.state,
    }));

    return <Link linkId="drawn-link" visible={isDrawing} type={linkType!} />;
};
