import TileBase, { TileType } from "./TileBase";
import ObjectPool from "./ObjectPool";
import GameData from "./GameData";
import MyU from "./My/MyU";
import MainGameManager from "./MainGameManager";
import TouchBreakChild from "./TouchBreakChild";

export default class TileManager {
	private nowTilesList: TileBase[];
	private tilePool: ObjectPool<TileBase>;
	private touchBreakPool: ObjectPool<TouchBreakChild>;

	private currentTileY: number;

	private platform: cc.Node;

	private currentTileIndex: number = 0;
	private lastNormalVerIndex: number = GameData.Instance.normalVerNext;
	private lastMoveHorIndex: number = GameData.Instance.moveHorNext;
	private lastTouchBreakIndex: number = GameData.Instance.touchBreakNext;
	private lastSpringHorIndex: number = GameData.Instance.springHorNext;
	private lastFrozenHorIndex: number = GameData.Instance.frozenHorNext;

	public constructor() {
		this.nowTilesList = [];
		let parent = cc.find("World/TileParent");
		this.platform = cc.find("World/Platform");
		this.tilePool = new ObjectPool(GameData.Instance.tilePrefab, TileBase, 20, parent);
		this.touchBreakPool = new ObjectPool(GameData.Instance.touchBreakPrefab, TouchBreakChild, 0, parent);
		this.currentTileY = GameData.Instance.startTileY;
	}

	public OnStart() {
		for (let i = 0; i < 10; i++) {
			this.SpawnTile();
		}
	}

	/** 生产跳板 */
	public SpawnTile() {
		this.currentTileIndex++;
		let temp = this.tilePool.Get();
		let type = this.CheckSpawnTileType(this.GetRandomTileType());
		switch (type) {
			case TileType.Normal_Ver: {
				this.currentTileY += GameData.Instance.normalVerNextTileY;
				break;
			}
			default: {
				this.currentTileY += GameData.Instance.defaultNextTileY;
				break;
			}
		}
		let pos = new cc.Vec2(MyU.Random(GameData.Instance.xMinBorder, GameData.Instance.xMaxBorder), this.currentTileY);
		temp.Init(type, pos);
		this.nowTilesList.push(temp);
	}

	/** 获得随机跳板 */
	public GetRandomTileType(): TileType {
		let weight = MyU.Random(0, GameData.Instance.allTileWeight);

		if (weight <= GameData.Instance.normalHorWeight) {
			return TileType.Normal_Hor;
		}

		if (weight <= GameData.Instance.normalVerWeight) {
			return TileType.Normal_Ver;
		}

		if (weight <= GameData.Instance.moveHorWeight) {
			return TileType.Move_Hor;
		}

		if (weight <= GameData.Instance.touchBreakWeight) {
			return TileType.Touch_Break;
		}

		if (weight <= GameData.Instance.springHorWeight) {
			return TileType.Spring_Hor;
		}

		if (weight <= GameData.Instance.frozenHorWeight) {
			return TileType.Frozen_Hor;
		}

		return TileType.Normal_Hor;
	}


	/** 检查生成的跳板是否符合间隔 */
	public CheckSpawnTileType(type: TileType): TileType {
		switch (type) {
			case TileType.Normal_Ver: {
				if (this.currentTileIndex >= this.lastNormalVerIndex) {
					this.lastNormalVerIndex = this.currentTileIndex + GameData.Instance.normalVerNext;
					return type;
				}
				return TileType.Normal_Hor;
			}
			case TileType.Move_Hor: {
				if (this.currentTileIndex >= this.lastMoveHorIndex) {
					this.lastMoveHorIndex = this.currentTileIndex + GameData.Instance.moveHorNext;
					return type;
				}
				return TileType.Normal_Hor;
			}
			case TileType.Touch_Break: {
				if (this.currentTileIndex >= this.lastTouchBreakIndex) {
					this.lastTouchBreakIndex = this.currentTileIndex + GameData.Instance.touchBreakNext;
					return type;
				}
				return TileType.Normal_Hor;
			}
			case TileType.Spring_Hor: {
				if (this.currentTileIndex >= this.lastSpringHorIndex) {
					this.lastSpringHorIndex = this.currentTileIndex + GameData.Instance.springHorNext;
					return type;
				}
				return TileType.Normal_Hor;
			}
			case TileType.Spring_Hor: {
				if (this.currentTileIndex >= this.lastFrozenHorIndex) {
					this.lastFrozenHorIndex = this.currentTileIndex + GameData.Instance.frozenHorNext;
					return type;
				}
				return TileType.Normal_Hor;
			}
		}

		return type;
	}

	/** 回收 */
	public OnRecovery(cameraY: number) {

		let recoveryY = cameraY - GameData.Instance.recoveryTileY;
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
			MainGameManager.Instance.AddHard();
			//生成新的块
			this.SpawnTile();
			//添加道具
		}
	}

	public SpawnTouchBreak(tile: TileBase) {
		let leftTemp = this.touchBreakPool.Get();
		leftTemp.OnInit(tile, true);
		let rightTemp = this.touchBreakPool.Get();
		rightTemp.OnInit(tile, false);
	}

	public RecoveryTouchBreak(touchBreak: TouchBreakChild) {
		this.touchBreakPool.Put(touchBreak);
	}
}