import { useState } from 'react';
export * from './tab-manager-container';

export type TCollapsible = ReturnType<typeof useCollapsible>;

export function useCollapsible(isOpen: boolean = false) {
    const [state, setState] = useState(isOpen);
    const toggle = (value?: boolean) => setState(state.toggle(value));
    return { isOpen: state, toggle };
}
