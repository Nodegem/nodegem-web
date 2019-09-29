import React from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import classNames from 'classnames';
import 'xterm/css/xterm.css';

export interface IXtermProps extends React.DOMAttributes<{}> {
    getRef: (xterm: XTerm) => void;
    onChange?: (e) => void;
    onInput?: (e) => void;
    onFocusChange?: Function;
    onScroll?: (e) => void;
    onContextMenu?: (e) => void;
    options?: any;
    path?: string;
    value?: string;
}

export interface IXtermState {
    isFocused: boolean;
}

export default class XTerm extends React.Component<IXtermProps, IXtermState> {
    public xterm: Terminal;
    public container: React.RefObject<HTMLDivElement>;
    public fitAddon: FitAddon;
    constructor(props: IXtermProps, context?: any) {
        super(props, context);
        this.state = {
            isFocused: false,
        };

        this.fitAddon = new FitAddon();
        this.container = React.createRef();
    }

    public componentDidMount() {
        this.xterm = new Terminal(this.props.options);
        this.xterm.open(this.container.current!);
        if (this.props.onContextMenu) {
            this.xterm.element.addEventListener(
                'contextmenu',
                this.onContextMenu.bind(this)
            );
        }
        if (this.props.onInput) {
            this.xterm.onData(this.onInput);
        }
        if (this.props.value) {
            this.xterm.write(this.props.value);
        }

        this.xterm.loadAddon(this.fitAddon);

        this.props.getRef(this);
    }

    public componentWillUnmount() {
        if (this.xterm) {
            this.xterm.dispose();
        }
    }

    public getTerminal() {
        return this.xterm;
    }

    public write(data: any): void {
        if (this.xterm) {
            this.xterm.write(data);
        }
    }

    public writeln(data: any): void {
        if (this.xterm) {
            this.xterm.writeln(data);
        }
    }

    public focus = () => {
        if (this.xterm) {
            this.xterm.focus();
            this.focusChanged(true);
        }
    };

    public blur = () => {
        if (this.xterm) {
            this.xterm.blur();
            this.focusChanged(false);
        }
    };

    public focusChanged(focused) {
        this.setState({
            isFocused: focused,
        });

        if (this.props.onFocusChange) {
            this.props.onFocusChange(focused);
        }
    }

    public onInput = (data: any) => {
        if (this.props.onInput) {
            this.props.onInput(data);
        }
    };

    public resize(cols: number, rows: number) {
        if (this.xterm) {
            this.xterm.resize(Math.round(cols), Math.round(rows));
        }
    }

    public fit = () => {
        if (this.fitAddon) {
            this.fitAddon.fit();
        }
    };

    public setOption(key: string, value: boolean) {
        if (this.xterm) {
            this.xterm.setOption(key, value);
        }
    }

    public refresh() {
        if (this.xterm) {
            this.xterm.refresh(0, this.xterm.rows - 1);
        }
    }

    public onContextMenu(e) {
        if (this.props.onContextMenu) {
            this.props.onContextMenu(e);
        }
    }

    public render() {
        const terminalClassName = classNames({
            xterm: true,
            'xterm--focused': this.state.isFocused,
        });
        return <div ref={this.container} className={terminalClassName} />;
    }
}
export { Terminal, XTerm };
