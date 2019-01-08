import TileBase from "./TileBase";
import ObjectPool from "./ObjectPool";
import GameData from "./GameData";

export default class TileManager {
	private nowTilesList: TileBase[];
	private tilePool: ObjectPool<TileBase>;

	public constructor() {
		this.nowTilesList = [];
		let parent = cc.find("UIRoot/TileParent");
		this.tilePool = new ObjectPool(GameData.Instance.tilePrefab, TileBase, 20, parent);

		for (let i = 0; i < 10; i++) {
			let x = this.tilePool.Get();
			x.node.active=true;
			x.node.setPosition(Math.random()*500,Math.random()*500);
		}
	}
}