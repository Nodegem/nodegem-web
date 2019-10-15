import { useState } from 'react';
import { Container } from 'unstated';

interface ITabManagerState {
    tabs: TabData[];
    activeTab: string;
}

const initial: ITabManagerState = {
    tabs: [],
    activeTab: '',
};

export class TabManager extends Container<ITabManagerState> {
    public state = { ...initial };

    public setActiveTab = (id: string) => {
        if (id === this.state.activeTab) {
            return;
        }

        this.setState({ ...this.state, activeTab: id });
    };

    public setTabs = (tabData: TabData[]) =>
        this.setState({ ...this.state, tabs: tabData });

    public addTab = (tab: TabData) => {
        this.setState({ ...this.state, tabs: this.state.tabs.concat(tab) });
    };

    public deleteTab = (id: string) => {
        this.setState({
            ...this.state,
            tabs: this.state.tabs.filter(t => t.graph.id !== id),
        });
    };

    public clearTabs = () => {
        this.setState({ ...this.state, tabs: [] });
    };
}
