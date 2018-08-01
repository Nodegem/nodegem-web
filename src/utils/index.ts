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