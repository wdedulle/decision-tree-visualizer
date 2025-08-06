import styleText from './css/_decision_tree_visualizer.css?inline';
import { createAddButton, createRemoveButton, createSvgPath, createSvgText } from './lib/elements';
import { defaultPrompt, nodeAttributesValid } from './lib/prompts';
class DecisionTreeVisualizer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this._treeData = null;
    this._promptFunction = defaultPrompt;
    this.container = document.createElement('div');
    this.container.className = 'tree-container';

    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.classList.add('connector-lines');
        
    const style = document.createElement('style');
    style.textContent = styleText;

    this.shadowRoot.append(style, this.svg, this.container);
    this.nodeCounter = 1000;
  }

  static observedAttributes = ["treedata"];

  attributeChangedCallback(name, oldValue, newValue) {
    this.treeData  = JSON.parse(newValue);
  }

  connectedCallback() {
    requestAnimationFrame(() => this.buildTree());
    window.addEventListener('resize', () => this.buildTree());
  }

  set promptCallback(promptFunction) {
    this._promptFunction = promptFunction;
  }

  get promptCallback() {
    return this._promptFunction;
  }

  set treedata(tree) {
    this._treeData  = tree;
    this.buildTree();
  }

  get treedata() {
    return this._treeData ;
  }

  generateId() {
    return 'node' + (this.nodeCounter++);
  }

  renderTree(container, node, level = 0, levels = [], parent = null) {
      if (!levels[level]) {
        const levelDiv = document.createElement('div');
        levelDiv.className = 'level';
        levels[level] = levelDiv;
        container.appendChild(levelDiv);
      }

      const wrapper = document.createElement('div');
      wrapper.className = 'node-wrapper';

      const nodeDiv = document.createElement('div');
      nodeDiv.className = 'node';
      nodeDiv.id = node.id;
      nodeDiv.textContent = node.label;

      wrapper.appendChild(nodeDiv);
      
      const btnContainer = document.createElement('div');
      btnContainer.className = 'btn-container';

      if (!node.children) {
        nodeDiv.setAttribute("style", "cursor: pointer;");
      } else {
        btnContainer.appendChild(createAddButton(() => this.addChildPrompt(node)));
      }

      const isLeaf = !node.children || node.children.length === 0;
      if (isLeaf && parent) {
        btnContainer.appendChild(createRemoveButton(() => {
          parent.children = parent.children.filter(c => c.id !== node.id);
          this.buildTree();
        }));
      }

      wrapper.appendChild(btnContainer);
      levels[level].appendChild(wrapper);

      if (node.children && node.children.length > 0) {
          node.children.forEach(child => this.renderTree(container, child, level + 1, levels, node));
      }
  }

  connectNodes(parentId, childId, edgeLabel = '') {
    const svg = this.shadowRoot.querySelector('.connector-lines');
    const parent = this.shadowRoot.getElementById(parentId);
    const child = this.shadowRoot.getElementById(childId);
    const svgRect = svg.getBoundingClientRect();

    const pBox = parent.getBoundingClientRect();
    const cBox = child.getBoundingClientRect();

    const startX = pBox.left + pBox.width / 2 - svgRect.left;
    const startY = pBox.bottom - svgRect.top;
    const endX = cBox.left + cBox.width / 2 - svgRect.left;
    const endY = cBox.top - svgRect.top;
    const deltaY = (endY - startY) / 2;

    const c1x = startX;
    const c1y = startY + deltaY;
    const c2x = endX;
    const c2y = endY - deltaY;

    svg.appendChild(createSvgPath(`M${startX},${startY} C${c1x},${c1y} ${c2x},${c2y} ${endX},${endY}`));

    if (edgeLabel) {
      function cubicBezier(t, p0, p1, p2, p3) {
        return (
          Math.pow(1 - t, 3) * p0 +
          3 * Math.pow(1 - t, 2) * t * p1 +
          3 * (1 - t) * Math.pow(t, 2) * p2 +
          Math.pow(t, 3) * p3
        );
      }

      svg.appendChild(createSvgText(
        cubicBezier(0.5, startX, c1x, c2x, endX), 
        cubicBezier(0.5, startY, c1y, c2y, endY), edgeLabel));
    }
  }

  connectAllNodes(treeNode) {
    if (!treeNode.children) return;
    treeNode.children.forEach(child => {
        this.connectNodes(treeNode.id, child.id, child.edgeLabel);
        this.connectAllNodes(child);
    });
  }

  async addChildPrompt(parentNode) {
    const nodeAttributes = await this.promptCallback(parentNode);
    if(!nodeAttributesValid(nodeAttributes)) return;

    const newNode = {
        id: this.generateId(),
        label: nodeAttributes.label,
        edgeLabel: nodeAttributes.edgeLabel
    };

    if (nodeAttributes.type === 'child') {
        newNode.children = [];
    }

    if(!this._treeData) {
      this._treeData = newNode;
    } else {
      if (!parentNode.children) parentNode.children = [];
      parentNode.children.push(newNode);
    }

    this.buildTree();
  }

  buildTree() {
    const button = this.container.querySelector(".btn-container");
    if(button) button.remove();
    if (!this._treeData) {
      const btnContainer = document.createElement('div');
      btnContainer.className = 'btn-container';
      btnContainer.setAttribute("style", "justify-content: center");
      btnContainer.appendChild(createAddButton(() => this.addChildPrompt(null)));
      this.container.appendChild(btnContainer);
    } else {
      this.svg.innerHTML = '';
      this.container.querySelectorAll('.level').forEach(e => e.remove());
      this.renderTree(this.container, this._treeData);
      this.connectAllNodes(this._treeData);
    }
  }
  

}

customElements.define('decision-tree-visualizer', DecisionTreeVisualizer);
