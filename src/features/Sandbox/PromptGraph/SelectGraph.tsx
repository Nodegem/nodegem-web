import { Button, Card } from 'antd';
import React, { useEffect, useState } from 'react';
import { GraphService, MacroService } from 'services';

import './SelectGraph.less';

interface ISelectGraph {
    onGraphSelect: (graph: Graph | Macro) => void;
}

interface ISelectGraphState {
    graphs: Graph[];
    macros: Macro[];
    loading: boolean;
}

const SelectGraph: React.FC<ISelectGraph> = ({ onGraphSelect }) => {
    const [graphs, setGraphs] = useState<Graph[]>([]);
    const [macros, setMacros] = useState<Macro[]>([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        async function getOptions() {
            setGraphs(await GraphService.getAll());
            setMacros(await MacroService.getAll());
            setLoading(false);
        }

        getOptions();
    }, []);

    return (
        <>
            <Card title="Graphs" loading={isLoading} type="inner">
                {graphs.map((g, i) => (
                    <Card.Grid key={i}>
                        <Button
                            onClick={() => onGraphSelect(g)}
                            type="link"
                            block
                        >
                            {g.name}
                        </Button>
                    </Card.Grid>
                ))}
            </Card>
            <Card title="Macros" loading={isLoading} type="inner">
                {macros.map((m, i) => (
                    <Card.Grid key={i}>
                        <Button
                            onClick={() => onGraphSelect(m)}
                            type="link"
                            block
                        >
                            {m.name}
                        </Button>
                    </Card.Grid>
                ))}
            </Card>
        </>
    );
};

export default SelectGraph;
