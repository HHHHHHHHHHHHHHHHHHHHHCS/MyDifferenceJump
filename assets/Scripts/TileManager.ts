import TileBase from "./TileBase";
import ObjectPool from "./ObjectPool";
import GameData from "./GameData";
import MyU from "./MyU";

export default class TileManager {
	private nowTilesList: TileBase[];
	private tilePool: ObjectPool<TileBase>;

	private currentTileY: number;

	public constructor() {
		this.nowTilesList = [];
		let parent = cc.find("UIRoot/TileParent");
		this.tilePool = new ObjectPool(GameData.Instance.tilePrefab, TileBase, 20, parent);

		this.currentTileY = GameData.startTileY;

		for (let i = 0; i < 10; i++) {
			let temp = this.tilePool.Get();
			this.currentTileY += GameData.nextTileY;
			let pos = new cc.Vec2(MyU.Random(GameData.xMinBorder, GameData.xMaxBorder), this.currentTileY);
			temp.Init(0, pos);
		}
	}
}