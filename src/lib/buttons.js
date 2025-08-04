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