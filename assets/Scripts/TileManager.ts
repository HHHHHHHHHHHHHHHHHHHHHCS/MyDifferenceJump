import TileBase from "./TileBase";
import ObjectPool from "./ObjectPool";
import GameData from "./GameData";
import MyU from "./My/MyU";
import Player from "./Player";

export default class TileManager {
	private nowTilesList: TileBase[];
	private tilePool: ObjectPool<TileBase>;

	private currentTileY: number;

	private platform: cc.Node;

	public constructor() {
		this.nowTilesList = [];
		let parent = cc.find("World/TileParent");
		this.platform = cc.find("World/Platform");
		this.tilePool = new ObjectPool(GameData.Instance.tilePrefab, TileBase, 20, parent);

		this.currentTileY = GameData.startTileY;

		for (let i = 0; i < 10; i++) {
			this.SpawnTile();
		}
	}

	/** 生产跳板 */
	public SpawnTile() {
		let temp = this.tilePool.Get();
		this.currentTileY += GameData.nextTileY;
		let pos = new cc.Vec2(MyU.Random(GameData.xMinBorder, GameData.xMaxBorder), this.currentTileY);
		temp.Init(0, pos);
		this.nowTilesList.push(temp);
	}

	/** 回收 */
	public OnRecovery(cameraY: number) {

		let recoveryY = cameraY - GameData.recoveryTileY;
		let removeIndex = -1;

		//摧毁底部平台
		if (this.platform != null) {
			if (this.platform.y < recoveryY) {
				this.platform.destroy();
				this.platform = null;
			}
		}

		//标记销毁
		for (let i = 0; i < this.nowTilesList.length; i++) {
			if (this.nowTilesList[i].node.y > recoveryY) {
				removeIndex = i - 1;
				break;
			}
		}
		for (let i = 0; i <= removeIndex; i++) {
			let tile = this.nowTilesList.shift();
			tile.Recovery();
			this.tilePool.Put(tile);
		}

		for (let i = 0; i <= removeIndex; i++) {
			//增加游戏难度
			Player.Instance.AddHard();
			//生成新的块
			this.SpawnTile();
			//添加道具
		}
	}
}