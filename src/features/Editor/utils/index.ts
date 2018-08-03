export const nodeMatchesOrWithinParent = (base: Node, compare: Node) : boolean => {
    let currentNode = compare;
    while(currentNode.parentNode && currentNode !== base) {
        currentNode = currentNode.parentNode;
    }
    return !!currentNode.parentNode && currentNode === base;
}