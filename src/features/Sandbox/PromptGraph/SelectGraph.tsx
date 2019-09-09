import React from 'react';

interface ISelectGraph {
    onGraphSelect: (graph: Graph | Macro) => void;
}

const SelectGraph: React.FC<ISelectGraph> = ({ onGraphSelect }) => {
    return <div />;
};

export default SelectGraph;
