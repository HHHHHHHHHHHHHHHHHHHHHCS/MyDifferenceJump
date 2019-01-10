import MyU from "./My/MyU";

/** 对象池 */
export default class ObjectPool<T extends cc.Component> {
	private type: any;
	private prefab: cc.Prefab;
	private parent: cc.Node;
	private objPool: cc.NodePool;


	public constructor(itemPrefab: cc.Prefab, type: any, init: number = 20, itemParent: cc.Node = null) {
		this.objPool = new cc.NodePool(type);
		this.type = type;
		this.prefab = itemPrefab;
		this.parent = itemParent;
	}

	private Instantiate(): cc.Node {
		if (this.prefab) {
			let temp = cc.instantiate(this.prefab);
			if (this.parent) {
				temp.setParent(this.parent);
			}
			return temp;
		}
		MyU.Log("Prefab is null can't Instantiate");
		return null;
	}

	public Get(): T {
		let temp: cc.Node;
		if (this.objPool.size() > 0) {
			temp = this.objPool.get();
		}
		else {
			temp = this.Instantiate();
		}
		if (this.parent) {
			temp.setParent(this.parent);
		}
		return temp.getComponent(this.type);;
	}

	public Put(item: T) {
		item.node.active = false;
		this.objPool.put(item.node);
	}
}