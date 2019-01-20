import TileBase, { TileType } from "./TileBase";
import ObjectPool from "./ObjectPool";
import GameData from "./GameData";
import MyU from "./My/MyU";
import MainGameManager from "./MainGameManager";
import TouchBreakChild from "./TouchBreakChild";

export default class TileManager {
	public createItemEvent: Function[];
	public recoveryItemEvent: Function[];

	private nowTilesList: TileBase[];
	private tilePool: ObjectPool<TileBase>;
	private touchBreakPool: ObjectPool<TouchBreakChild>;

	private currentTileY: number;

	private platform: cc.Node;

	public currentTileIndex: number = 0;
	private lastNormalVerIndex: number;
	private lastMoveHorIndex: number;
	private lastTouchBreakIndex: number;
	private lastSpringHorIndex: number;
	private lastFrozenHorIndex: number;

	private gameData;

	public constructor() {
		this.gameData = GameData.Instance;
		let parent = cc.find("World/TileParent");
		this.platform = cc.find("World/Platform");
		this.createItemEvent = [];
		this.recoveryItemEvent = [];
		this.nowTilesList = [];
		this.tilePool = new ObjectPool(this.gameData.tilePrefab, TileBase, 20, parent);
		this.touchBreakPool = new ObjectPool(this.gameData.touchBreakPrefab, TouchBreakChild, 0, parent);

		this.currentTileY = this.gameData.startTileY;
		this.lastNormalVerIndex = this.gameData.normalVerNext;
		this.lastMoveHorIndex = this.gameData.moveHorNext;
		this.lastTouchBreakIndex = this.gameData.touchBreakNext;
		this.lastSpringHorIndex = this.gameData.springHorNext;
		this.lastFrozenHorIndex = this.gameData.frozenHorNext;
	}

	public OnStart() {
		for (let i = 0; i < 10; i++) {
			this.SpawnTile();
		}
	}

	public OnUpdate(dt: number) {
		this.nowTilesList.forEach(tile => {
			tile.OnUpdate(dt);
		});
	}

	/** 生产跳板 */
	public SpawnTile() {
		this.currentTileIndex++;
		let tile = this.tilePool.Get();
		let type = this.CheckSpawnTileType(this.GetRandomTileType());
		switch (type) {
			case TileType.Normal_Ver: {
				this.currentTileY += this.gameData.normalVerNextTileY;
				break;
			}
			default: {
				this.currentTileY += this.gameData.defaultNextTileY;
				break;
			}
		}
		let pos = new cc.Vec2(0, this.currentTileY);
		tile.Init(type, pos);
		this.nowTilesList.push(tile);
		this.createItemEvent.forEach(func => {
			func(tile);
		});
	}

	/** 获得随机跳板 */
	public GetRandomTileType(): TileType {
		let weight = MyU.Random(0, this.gameData.allTileWeight);

		if (weight <= this.gameData.normalHorWeight) {
			return TileType.Normal_Hor;
		}

		if (weight <= this.gameData.normalVerWeight) {
			return TileType.Normal_Ver;
		}

		if (weight <= this.gameData.moveHorWeight) {
			return TileType.Move_Hor;
		}

		if (weight <= this.gameData.touchBreakWeight) {
			return TileType.Touch_Break;
		}

		if (weight <= this.gameData.springHorWeight) {
			return TileType.Spring_Hor;
		}

		if (weight <= this.gameData.frozenHorWeight) {
			return TileType.Frozen_Hor;
		}

		return TileType.Normal_Hor;
	}


	/** 检查生成的跳板是否符合间隔 */
	public CheckSpawnTileType(type: TileType): TileType {
		switch (type) {
			case TileType.Normal_Ver: {
				if (this.currentTileIndex >= this.lastNormalVerIndex) {
					this.lastNormalVerIndex = this.currentTileIndex + this.gameData.normalVerNext;
					return type;
				}
				return TileType.Normal_Hor;
			}
			case TileType.Move_Hor: {
				if (this.currentTileIndex >= this.lastMoveHorIndex) {
					this.lastMoveHorIndex = this.currentTileIndex + this.gameData.moveHorNext;
					return type;
				}
				return TileType.Normal_Hor;
			}
			case TileType.Touch_Break: {
				if (this.currentTileIndex >= this.lastTouchBreakIndex) {
					this.lastTouchBreakIndex = this.currentTileIndex + this.gameData.touchBreakNext;
					return type;
				}
				return TileType.Normal_Hor;
			}
			case TileType.Spring_Hor: {
				if (this.currentTileIndex >= this.lastSpringHorIndex) {
					this.lastSpringHorIndex = this.currentTileIndex + this.gameData.springHorNext;
					return type;
				}
				return TileType.Normal_Hor;
			}
			case TileType.Spring_Hor: {
				if (this.currentTileIndex >= this.lastFrozenHorIndex) {
					this.lastFrozenHorIndex = this.currentTileIndex + this.gameData.frozenHorNext;
					return type;
				}
				return TileType.Normal_Hor;
			}
		}

		return type;
	}

	/** 回收 */
	public OnRecovery(cameraY: number) {

		let recoveryY = cameraY - this.gameData.recoveryTileY;
		let removeIndex = -1;

		//摧毁底部平台
		if (this.platform != null) {
			if (this.platform.y < recoveryY) {
				this.platform.destroy();
				this.platform = null;
			}
		}

		//标记和销毁
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
			//回收事件
			this.recoveryItemEvent.forEach(func => {
				func(tile);
			});
		}

		for (let i = 0; i <= removeIndex; i++) {
			//增加游戏难度
			MainGameManager.Instance.AddHard();
			//生成新的块
			this.SpawnTile();
			//添加道具
		}
	}

	/** 生成破碎的方块,记得回收道具 */
	public SpawnTouchBreak(tile: TileBase) {
		let leftTemp = this.touchBreakPool.Get();
		leftTemp.OnInit(tile, true);
		let rightTemp = this.touchBreakPool.Get();
		rightTemp.OnInit(tile, false);
		this.recoveryItemEvent.forEach(func => {
			func(tile);
		});
	}

	/** 回收破碎的方块 */
	public RecoveryTouchBreak(touchBreak: TouchBreakChild) {
		this.touchBreakPool.Put(touchBreak);
	}

	public MagnifierTilesScale() {
		this.nowTilesList.forEach(tile => {
			tile.ChangeScale(GameData.Instance.magnifierScale);
		});
	}


	public ResetTilesScale() {
		this.nowTilesList.forEach(tile => {
			tile.ChangeScale(1);
		});
	}
}