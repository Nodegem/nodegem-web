import localforage from 'localforage';

const findLeftWindowBoundry = () => {
    // In Internet Explorer window.screenLeft is the window's left boundry
    if (window.screenLeft) {
        return window.screenLeft;
    }

    // In Firefox window.screenX is the window's left boundry
    if (window.screenX) {
        return window.screenX;
    }

    return 0;
};
// Find Left Boundry of current Window
const findTopWindowBoundry = () => {
    // In Internet Explorer window.screenLeft is the window's left boundry
    if (window.screenTop) {
        return window.screenTop;
    }

    // In Firefox window.screenY is the window's left boundry
    if (window.screenY) {
        return window.screenY;
    }

    return 0;
};

export const popup = (
    url: string,
    title: string,
    size: Vector2 = { x: 360, y: 640 }
) => {
    const x = screen.width / 2 - size.x / 2 + findLeftWindowBoundry();
    const y = screen.height / 2 - size.y / 2 + findTopWindowBoundry();
    return window.open(
        url,
        title,
        `height=${size.y},width=${size.x},left=${x},top=${y}`
    );
};
