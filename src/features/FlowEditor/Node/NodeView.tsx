import React from "react";
import { observer } from "mobx-react";

const NodeView = observer(({ node } : { node: Node }) => {

    return (
        <>Hello World!</>
    );
});

export default NodeView;