export const isInput = (target: Element) : boolean => {
    return !!target && target.nodeName === "TEXTAREA" || target.nodeName === "INPUT";
}

export const isMac : boolean = navigator.platform.toUpperCase().indexOf('MAC')>=0;

export const convertCommands = (commands: {[key: string]: string}) => {
    let returnValue = {...commands};
    for(let key in commands) {
        const value = commands[key];
        returnValue[key] = convertCommand(value);
    }
    return returnValue;
}

const convertCommand = (command: string) : string => {

    if(command.includes("ctrl")) {
        return command.replace("ctrl", "command");
    }
    
    return command;
}

export const findReactComponent = <T extends React.Component>(el : Element) : T | null => {
    //Figure out faster & efficient way of retrieving this was with parent / children traversal
    for (const key in el) {
      if (key.startsWith('__reactInternalInstance$')) {
        const fiberNode = el[key];
  
        return (fiberNode && fiberNode.return && fiberNode.return.stateNode) as T;
      }
    }
    return null;
  };