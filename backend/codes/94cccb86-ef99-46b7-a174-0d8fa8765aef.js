// ListNode definition
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

// Simple MinHeap implementation
class MinHeap {
  constructor() {
    this.heap = [];
  }

  push(node) {
    this.heap.push(node);
    this._heapifyUp(this.heap.length - 1);
  }

  pop() {
    if (this.size() === 0) return null;
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.size() > 0) {
      this.heap[0] = last;
      this._heapifyDown(0);
    }
    return min;
  }

  size() {
    return this.heap.length;
  }

  _heapifyUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent].val <= this.heap[index].val) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }

  _heapifyDown(index) {
    const length = this.heap.length;
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < length && this.heap[left].val < this.heap[smallest].val) {
        smallest = left;
      }

      if (right < length && this.heap[right].val < this.heap[smallest].val) {
        smallest = right;
      }

      if (smallest === index) break;

      [this.heap[smallest], this.heap[index]] = [this.heap[index], this.heap[smallest]];
      index = smallest;
    }
  }
}

// Merge k sorted lists
function mergeKLists(lists) {
  const heap = new MinHeap();
  for (let node of lists) {
    if (node) heap.push(node);
  }

  const dummy = new ListNode(0);
  let current = dummy;

  while (heap.size() > 0) {
    const smallest = heap.pop();
    current.next = smallest;
    current = current.next;
    if (smallest.next) heap.push(smallest.next);
  }

  return dummy.next;
}

// Helper to convert array to linked list
function buildList(arr) {
  const dummy = new ListNode(0);
  let curr = dummy;
  for (let val of arr) {
    curr.next = new ListNode(val);
    curr = curr.next;
  }
  return dummy.next;
}

// Helper to print linked list
function printList(node) {
  const res = [];
  while (node) {
    res.push(node.val);
    node = node.next;
  }
  console.log(res);
}

// === Test ===
const input = [
  buildList([1, 4, 5]),
  buildList([1, 3, 4]),
  buildList([2, 6])
];

const result = mergeKLists(input);
printList(result); // Output: [1, 1, 2, 3, 4, 4, 5, 6]
