export const defaultPrompt = async (parentNode) => {
    return new Promise((resolve) => {
        let edgeLabel = null;
        let isRoot = true;
        if (parentNode) {
            isRoot = false;
            edgeLabel = prompt('Name of connection (label):');
            if (edgeLabel === null) return null;
        }

        let type = prompt('Type kind: "child" of "leaf":');
        if (type === null) return null;
        type = type.toLowerCase().trim();
        if (type !== 'child' && type !== 'leaf') {
            alert('Unsupported type. Type "child" or "leaf".');
            return null;
        }

        const label = prompt('Name of new node:');
        if (label === null) return null;
        
        resolve({ type, label, edgeLabel, isRoot });
    });
};

export function nodeAttributesValid(nodeAttributes) {
    if(!nodeAttributes) return false;
    if(!nodeAttributes.isRoot && nodeAttributes.edgeLabel === null) return false;
    if(nodeAttributes.type !== 'child' && nodeAttributes.type !== 'leaf') return false;
    if(nodeAttributes.label === null) return false;

    return true;
}