import React from 'react';
import { useStore } from 'stores/test-store';

export const Header: React.FC = () => {
    const test = useStore();
    console.log({ ...test });
    return <div />;
};
