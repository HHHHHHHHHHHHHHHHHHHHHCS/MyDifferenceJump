import Player from "./Player";
import ItemBase, { ItemType } from "./ItemBase";
import MyU from "./My/MyU";
import GameData from "./GameData";
import GameGameManager from "./GameGameManager";
import TileManager from "./TileManager";
import TileBase from "./TileBase";
import ObjectPool from "./ObjectPool";
import GameUIManager from "./GameUIManager";
import { StorageEnum } from "./My/MyStorageManager";
import { EffectAudioEnum } from "./GameAudioManager";

/** 物品管理器 */
export default class ItemManager {

	private uiManager: GameUIManager;
	private tileManager: TileManager;
	private gameData: GameData;

	private nowItemList: ItemBase[];
	private itemPool: ObjectPool<ItemBase>;

	private hatNextIndex: number;
	private rocketNextIndex: number;
	private frozenNextIndex: number;
	private springNextIndex: number;
	private magnifierNextIndex: number;


	public itemEndEvent: Function;//物体完成事件
	public itemTimer: number;//物品倒计时
	public itemMaxTime: number;//物品总时间
	public isFrozen: boolean;//是否在冻结
	public isSpring: boolean;//是否在垂直跳
	public isMagnifier: boolean;//是否在放大道具状态


	/** 构造函数 */
	public constructor() {
		this.gameData = GameData.Instance;
		this.tileManager = GameGameManager.Instance.tileManager;
		this.uiManager = GameGameManager.Instance.mainUIManager;

		let parent = cc.find("World/ItemParent");
		this.nowItemList = [];
		this.itemPool = new ObjectPool(this.gameData.itemPrefab, ItemBase, 0, parent);


		this.hatNextIndex = 0;//this.gameData.hatNext;
		this.rocketNextIndex = 0;//this.gameData.rocketNext;
		this.frozenNextIndex = 0;//this.gameData.frozenNext;
		this.springNextIndex = 0;//this.gameData.springNext;
		this.magnifierNextIndex = 0;//this.gameData.magnifierNext;
	}

	/** 玩家获得物品处理,清理全部的物品 */
	public GetItem(player: Player, other: cc.Collider): void {
		GameGameManager.Instance.audioManager.PlayEffectAudio(EffectAudioEnum.getItemAudio);
		var item = other.node.parent.getComponent(ItemBase);
		for (let i = this.nowItemList.length - 1; i >= 0; i--) {
			this.DoRecoveryItem(this.nowItemList[i]);
		}
		item.DoItem(player);
	}

	/** 更新 */
	public OnUpdate(dt: number) {
		if (this.itemTimer >= 0) {
			this.itemTimer -= dt;
			if (this.itemTimer < 0) {
				this.itemEndEvent();
			}
			this.uiManager.UpdateItemProgress(this.itemTimer / this.itemMaxTime);
		}
		this.nowItemList.forEach(item => {
			item.UpdatePos();
		});
	}

	/** 设置物品时间 */
	public SetItemTime(val: number) {
		this.itemTimer = val;
		this.itemMaxTime = val;
	}


	/** 检查是否可以创建 */
	private NeedCreateItem(): ItemType {
		var rd = MyU.Random(0, this.gameData.allItemWeight);

		if (rd <= this.gameData.itemNoneWeight) {
			return ItemType.None;
		}

		if (rd <= this.gameData.hatWeight) {
			return ItemType.Hat;
		}

		if (rd <= this.gameData.rocketWeight) {
			return ItemType.Rocket;
		}

		if (rd <= this.gameData.frozenWeight) {
			return ItemType.Frozen;
		}

		if (rd <= this.gameData.springWeight) {
			return ItemType.Spring;
		}

		if (rd <= this.gameData.magnifierWeight) {
			return ItemType.Magnifier;
		}

		return ItemType.None;
	}

	/** 检查Item的是否满足间隔,同时会加上间隔 */
	private CheckItemNext(type: ItemType) {
		var currentTileIndex = this.tileManager.currentTileIndex;
		switch (type) {
			case ItemType.Hat: {
				if (currentTileIndex >= this.hatNextIndex) {
					this.hatNextIndex = currentTileIndex + this.gameData.hatNext;
					return type;
				}
				break;
			}

			case ItemType.Rocket: {
				if (currentTileIndex >= this.rocketNextIndex) {
					this.rocketNextIndex = currentTileIndex + this.gameData.rocketNext;
					return type;
				}
				break;
			}

			case ItemType.Frozen: {
				if (currentTileIndex >= this.frozenNextIndex) {
					this.frozenNextIndex = currentTileIndex + this.gameData.frozenNext;
					return type;
				}
				break;
			}

			case ItemType.Spring: {
				if (currentTileIndex >= this.springNextIndex) {
					this.springNextIndex = currentTileIndex + this.gameData.springNext;
					return type;
				}
				break;
			}

			case ItemType.Magnifier: {
				if (currentTileIndex >= this.magnifierNextIndex) {
					this.magnifierNextIndex = currentTileIndex + this.gameData.magnifierNext;
					return type;
				}
				break;
			}
		}
		return ItemType.None;

	}


	/** 判断条件 创建物品 */
	public CreateItem(tile: TileBase) {
		if (!tile.IsBind || this.itemTimer >= 0) {
			return;
		}
		var itemType = this.NeedCreateItem();
		if (itemType != ItemType.None) {
			itemType = this.CheckItemNext(itemType);
			if (itemType != ItemType.None) {
				this.SpawnItem(itemType, tile);
			}
		}
	}

	/** 实际创建物品 */
	private SpawnItem(itemType: ItemType, tile: TileBase) {
		var item = this.itemPool.Get();
		item.OnInit(itemType, tile);
		this.nowItemList.push(item);
	}

	/** 回收物品 */
	public RecoveryItem(tile: TileBase) {
		if (tile.IsBind && tile.bindItem != null) {
			this.DoRecoveryItem(tile.bindItem);
		}
	}

	/** 执行回收物品 */
	private DoRecoveryItem(item: ItemBase) {
		item.Recovery();
		this.nowItemList.Remove(item);
		this.itemPool.Put(item);
	}
}