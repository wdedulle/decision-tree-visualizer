export function createAddButton(callback) {
  const btn = document.createElement('button');
  btn.className = 'btn add-btn';
  btn.innerHTML = '➕'; // Plus icoon
  btn.onclick = callback;
  return btn;
}

export function createRemoveButton(callback) {
  const btn = document.createElement('button');
  btn.className = 'btn remove-btn';
  btn.innerHTML = '❌';  // Prullenbak icoon
  btn.onclick = callback;

  return btn;
}

export function createSvgPath(pathData) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', 'black');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', '2');    

    return path;
}

export function createSvgText(midX, midY, edgeLabel) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', midX);
    text.setAttribute('y', midY - 6);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '15');
    text.setAttribute('fill', 'black');
    text.setAttribute('z-index', '10');
    text.setAttribute('font-weight', 'bold');
    text.textContent = edgeLabel;

    return text;
}