function toTrainCase(str) {
    return str.toLowerCase().replace(/ /g, '-');
}

export function defaultPath(points, curvature) {
    const [x1, y1, x2, y2] = points;
    const hx1 = x1 + Math.abs(x2 - x1) * curvature;
    const hx2 = x2 - Math.abs(x2 - x1) * curvature;

    return `M ${x1} ${y1} C ${hx1} ${y1} ${hx2} ${y2} ${x2} ${y2}`;
}

export function renderPathData(emitter, points, link) {
    const data = { points, link, d: '' };

    emitter.trigger('linkpath', data);

    return data.d || defaultPath(points, 0.4);
}

export function updateLink({ el, d }) {
    const path = el.querySelector('.link path');

    if (!path) throw new Error('Path of link was broken');

    path.setAttribute('d', d);
}

export function renderLink({ el, d, link }) {
    const classed = !link
        ? []
        : [
              'input-' + toTrainCase(link.input.name),
              'output-' + toTrainCase(link.output.name),
              'socket-input-' + toTrainCase(link.input.socket.name),
              'socket-output-' + toTrainCase(link.output.socket.name),
          ];

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    svg.classList.add('link', ...classed);
    path.classList.add('main-path');
    path.setAttribute('d', d);

    svg.appendChild(path);
    el.appendChild(svg);

    updateLink({ el, d });
}
