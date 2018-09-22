import * as React from 'react';
import { Terminal as Term, ITerminalOptions } from 'xterm';
import classNames from 'classnames';

import 'xterm/dist/xterm.css';
import './XTerm.scss';

interface ITerminalProps extends React.DOMAttributes<{}> {
    addons?: string[];
    onContextMenu?: (e) => void;
    onInput?: (e) => void;
    onChange?: (e) => void;
    onFocusChange?: Function;
    onScroll?: (e) => void;
    value?: string;
    path?: string;
    options?: ITerminalOptions;
    style?: React.CSSProperties;
}

interface ITerminalState {
    focused: boolean;
}

class XTerm extends React.Component<ITerminalProps, ITerminalState> {
    
    private xterm : Term | null;
    private container: HTMLDivElement;

    state = {
        focused: false
    }

    applyAddon(addon) {
        Term.applyAddon(addon);
    }

    public componentDidMount() {

        if (this.props.addons) {
            this.props.addons.forEach(s => {
                const addon = require(`xterm/dist/addons/${s}/${s}.js`);
                this.applyAddon(addon);
            });
        }

        this.xterm = new Term(this.props.options);
        this.xterm.open(this.container);
        this.xterm.on('focus', () => this.focusChanged(true));
        this.xterm.on('blur', () => this.focusChanged(false));
        if (this.props.onContextMenu) {
            this.xterm.element.addEventListener('contextmenu', this.onContextMenu.bind(this));
        }
        if (this.props.onInput) {
            this.xterm.on('data', this.onInput);
        }
        if (this.props.value) {
            this.xterm.write(this.props.value);
        }

    }

    componentWillUnmount() {
        if(this.xterm) {
            this.xterm.destroy();
            this.xterm = null;
        }
    }

    public getTerminal = () => {
        return this.xterm!;
    }

    public write = (data: any) => {
        this.xterm && this.xterm.write(data);
    }

    public writeln = (data: any) => {
        this.xterm && this.xterm.writeln(data);
    }

    public refresh = () => {
        this.xterm && this.xterm.refresh(0, this.xterm.rows - 1);
    }

    public resize = (cols: number, rows: number) => {
        this.xterm && this.xterm.resize(Math.round(cols), Math.round(rows));
    }

    private focusChanged = (focused: boolean) => {

        this.setState({
            focused: focused
        });

    }

    private onContextMenu = (e) => {
        this.props.onContextMenu && this.props.onContextMenu(e);
    }

    private onInput = (data) => {
        return this.props.onInput && this.props.onInput(data);
    }

    public render() {

        const { style } = this.props;
        const { focused } = this.state;

        const terminalClassName = classNames({
            "editor-terminal": true,
            "focused": focused
        });

        return (
            <div ref={ref => this.container = ref!} className={terminalClassName} style={style} />
        )
    }

}

export { XTerm };