import { Button, Card, Empty, List, Icon } from 'antd';
import React, { useEffect, useState } from 'react';
import { GraphService, MacroService } from 'services';

import './SelectGraph.less';

interface ISelectGraph {
    onGraphSelect: (graph: Graph | Macro) => void;
}

const CardHeader = (icon: string, title: string) => (
    <span className="card-header">
        <Icon type={icon} />
        {title}
    </span>
);

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
        <div className="graph-select">
            <Card
                title={CardHeader('deployment-unit', 'Graphs')}
                loading={isLoading}
                type="inner"
            >
                <List
                    grid={{ gutter: 8, sm: 1, md: 3, lg: 4 }}
                    locale={{ emptyText: 'No Graphs' }}
                    itemLayout="horizontal"
                    dataSource={graphs}
                    renderItem={graph => (
                        <List.Item
                            className="graph-item"
                            onClick={() => onGraphSelect(graph)}
                        >
                            <List.Item.Meta
                                title={graph.name}
                                description={
                                    graph.description || 'No Description'
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>
            <Card
                title={CardHeader('thunderbolt', 'Macros')}
                loading={isLoading}
                type="inner"
            >
                <List
                    grid={{ gutter: 16, sm: 1, md: 3, lg: 4 }}
                    locale={{ emptyText: 'No Macros' }}
                    itemLayout="horizontal"
                    dataSource={macros}
                    renderItem={macro => (
                        <List.Item
                            className="graph-item"
                            onClick={() => onGraphSelect(macro)}
                        >
                            <List.Item.Meta
                                title={macro.name}
                                description={macro.description}
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
};

export default SelectGraph;
