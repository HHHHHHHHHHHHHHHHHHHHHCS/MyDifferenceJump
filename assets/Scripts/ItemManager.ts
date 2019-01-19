import Player from "./Player";
import ItemBase, { ItemType } from "./ItemBase";
import MyU from "./My/MyU";
import GameData from "./GameData";
import MainGameManager from "./MainGameManager";
import TileManager from "./TileManager";
import TileBase from "./TileBase";
import ObjectPool from "./ObjectPool";

/** 物品管理器 */
export default class ItemManager {

	private tileManager: TileManager;
	private gameData: GameData;

	private nowItemList: ItemBase[];
	private itemPool: ObjectPool<ItemBase>;

	private hatNextIndex: number;
	private rocketNextIndex: number;


	/** 构造函数 */
	public constructor() {
		this.gameData = GameData.Instance;
		this.tileManager = MainGameManager.Instance.tileManager;

		let parent = cc.find("World/ItemParent");
		this.nowItemList = [];
		this.itemPool = new ObjectPool(this.gameData.itemPrefab, ItemBase, 0, parent);


		this.hatNextIndex = this.gameData.hatNext;
		this.rocketNextIndex = this.gameData.rocketNext;
	}

	/** 玩家获得物品处理 */
	public GetItem(player: Player, other: cc.Collider): void {
		var item = other.node.parent.getComponent(ItemBase);
		this.DoRecoveryItem(item);
		item.DoItem(player);
	}

	/** 更新 */
	public OnUpdate(dt: number) {
		this.nowItemList.forEach(item => {
			item.UpdatePos();
		});
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
		}
		return ItemType.None;

	}


	/** 判断条件 创建物品 */
	public CreateItem(tile: TileBase) {
		if (!tile.IsBind) {
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