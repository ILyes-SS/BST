class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}
class Tree {
  constructor(arr) {
    this.root = buildTree(arr);
  }
  insert(value) {
    let preTemp;
    let temp = this.root;

    if (temp == null) {
      this.root = new Node(value);
      return;
    }
    while (temp != null) {
      if (value >= temp.data) {
        preTemp = temp;
        temp = temp.right;
      } else if (value < temp.data) {
        preTemp = temp;
        temp = temp.left;
      }
    }
    temp = new Node(value);
    if (value < preTemp.data) {
      preTemp.left = temp;
    } else {
      preTemp.right = temp;
    }
  }
  deleteItem(value) {
    let stack = [this.root];

    while (stack.length > 0) {
      let popped = stack.pop();

      if (popped.right) {
        stack.push(popped.right);
        if (
          !popped.right.right &&
          !popped.right.left &&
          popped.right.data == value
        ) {
          popped.right = null;
          break;
        }
      }
      if (popped.left) {
        stack.push(popped.left);
        if (
          !popped.left.right &&
          !popped.left.left &&
          popped.left.data == value
        ) {
          popped.left = null;
          break;
        }
      }
    }

    stack = [this.root];

    while (stack.length > 0) {
      let popped = stack.pop();

      if (popped.right) {
        stack.push(popped.right);
        if (
          ((!popped.right.right && popped.right.left) ||
            (popped.right.right && !popped.right.left)) &&
          popped.right.data == value
        ) {
          let direction = popped.right.right ? "right" : "left";
          popped.right = popped.right[direction];
          break;
        }
      }
      if (popped.left) {
        stack.push(popped.left);
        if (
          ((!popped.left.right && popped.left.left) ||
            (popped.left.right && !popped.left.left)) &&
          popped.left.data == value
        ) {
          let direction = popped.left.right ? "right" : "left";
          popped.left = popped.left[direction];
          break;
        }
      }
    }
    stack = [this.root];

    while (stack.length > 0) {
      let popped = stack.pop();

      if (popped.data == value && popped.right && popped.left) {
        let rightTree = popped.right;
        while (rightTree.left != null) {
          rightTree = rightTree.left;
        }
        let data = rightTree.data;
        this.deleteItem(data);
        popped.data = data;
      }
      if (popped.right) {
        stack.push(popped.right);
      }
      if (popped.left) {
        stack.push(popped.left);
      }
    }
  }
  find(value) {
    let stack = [this.root];

    while (stack.length > 0) {
      let popped = stack.pop();
      if (popped.data == value) return popped;

      if (popped.right) {
        stack.push(popped.right);
      }
      if (popped.left) {
        stack.push(popped.left);
      }
    }
  }
  levelOrder(callback) {
    let queue = [this.root];
    let arr = [];

    while (queue.length > 0) {
      let popped = queue.pop();
      if (callback) callback(popped.data);
      else arr.push(popped.data);
      if (popped.left) {
        queue.unshift(popped.left);
      }
      if (popped.right) {
        queue.unshift(popped.right);
      }
    }
    if (!callback) return arr;
  }
  preOrder(root, callback, arr = []) {
    if (root == null) return;
    if (callback) callback(root.data);
    else arr.push(root.data);
    this.preOrder(root.left, callback, arr);
    this.preOrder(root.right, callback, arr);
    if (!callback) return arr;
  }
  inOrder(callback) {
    let stack = [];
    let arr = [];
    let current = this.root;

    while (current !== null || stack.length > 0) {
      while (current !== null) {
        stack.push(current);
        current = current.left;
      }

      current = stack.pop();

      if (callback && typeof callback === "function") {
        callback(current.value);
      } else {
        arr.push(current.data);
      }

      current = current.right;
    }
    if (!callback) return arr;
  }
  postOrder(root, callback, arr = []) {
    if (root == null) return;
    this.preOrder(root.left, callback, arr);
    this.preOrder(root.right, callback, arr);
    if (callback) callback(root.data);
    else arr.push(root.data);
    if (!callback) return arr;
  }

  height(node) {
    let queue = [node];
    let high = -1;
    let i = 1;
    let j = 0;

    while (queue.length > 0) {
      let popped = queue.pop();

      if (popped.left) {
        queue.unshift(popped.left);
      }
      if (popped.right) {
        queue.unshift(popped.right);
      }
      j++;
      if (i == j) {
        high++;
        i *= 2;
      }
    }
    return high;
  }
  depth(node) {
    let queue = [this.root];
    let high = -1;
    let i = 1;
    let j = 0;

    while (queue.length > 0) {
      let popped = queue.pop();

      if (popped.left) {
        queue.unshift(popped.left);
      }
      if (popped.right) {
        queue.unshift(popped.right);
      }

      j++;
      if (i == j) {
        high++;
        i *= 2;
      }
      if (popped.data == node.data) return high;
    }
    return -1;
  }
  isBalanced() {
    let queue = [this.root];

    while (queue.length > 0) {
      let popped = queue.pop();

      if (
        popped.left &&
        popped.right &&
        Math.abs(this.height(popped.left) - this.height(popped.right)) > 1
      )
        return false;
      else if (
        popped.left &&
        !popped.right &&
        Math.abs(this.height(popped.left) - 0) > 1
      ) {
        return false;
      } else if (
        !popped.left &&
        popped.right &&
        Math.abs(this.height(popped.right) - 0) > 1
      ) {
        return false;
      }

      if (popped.left) {
        queue.unshift(popped.left);
      }
      if (popped.right) {
        queue.unshift(popped.right);
      }
    }
    return true;
  }
  rebalance() {
    let stack = [this.root];
    let arr = [];
    while (stack.length > 0) {
      let popped = stack.pop();

      arr.push(popped.data);
      if (popped.right) {
        stack.push(popped.right);
      }
      if (popped.left) {
        stack.push(popped.left);
      }
    }
    this.root = buildTree(arr);
  }
}
function buildTree(arr) {
  arr = [...new Set(arr)];
  if (arr.length == 0) return null;
  let mid = Math.floor((arr.length - 1) / 2);
  let root = new Node(arr[mid]);
  root.left = buildTree(arr.slice(0, mid));
  root.right = buildTree(arr.slice(mid + 1));
  return root;
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

let bst = new Tree([50, 30, 70, 20, 40, 60, 80]);

prettyPrint(bst.root);

console.log(":::", bst.isBalanced());

bst.insert(110);
bst.insert(120);
bst.insert(130);

prettyPrint(bst.root);

console.log(":::", bst.isBalanced());

bst.rebalance();
prettyPrint(bst.root);

console.log(":::", bst.isBalanced());
